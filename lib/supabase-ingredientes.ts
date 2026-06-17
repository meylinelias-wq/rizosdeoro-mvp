import { createClient } from "@supabase/supabase-js";
import { ClasificacionIngrediente } from "@/types/perfil";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface IngredienteRow {
  nombre_inci: string;
  nombre_comun: string | null;
  clasificacion: ClasificacionIngrediente;
  funcion: string;
  explicacion: string;
  nota_riesgo: string | null;
  cg_friendly: boolean;
  sinonimos: string | null;
  categoria: string | null;
  aporte_cronograma: string | null;
  porosidad_recomendada: string | null;
}

// Fila + textos normalizados precalculados para no repetir trabajo en cada búsqueda
interface IngredienteIndexado {
  row: IngredienteRow;
  inci: string;
  comun: string | null;
  sinonimos: string[];
}

// Caché en memoria — dura el tiempo de vida del proceso serverless
let cache: IngredienteIndexado[] | null = null;
let cacheTs = 0;
const TTL = 5 * 60 * 1000; // 5 minutos

async function getIngredientes(): Promise<IngredienteIndexado[]> {
  if (cache && Date.now() - cacheTs < TTL) return cache;

  // select("*"): trae las columnas que existan en la tabla. Las que falten
  // (sinonimos, porosidad_recomendada...) simplemente no vienen y el mapeo
  // de abajo les pone su valor por defecto. Así la app nunca se rompe
  // aunque la tabla de Supabase vaya por detrás del código.
  const { data, error } = await supabase.from("ingredientes").select("*");
  if (error || !data) {
    console.error("Supabase error:", error?.message);
    return cache ?? [];
  }

  cache = (data as Partial<IngredienteRow>[]).map((d) => {
    const row: IngredienteRow = {
      nombre_inci: d.nombre_inci ?? "",
      nombre_comun: d.nombre_comun ?? null,
      clasificacion: d.clasificacion ?? "amarillo",
      funcion: d.funcion ?? "Otro",
      explicacion: d.explicacion ?? "",
      nota_riesgo: d.nota_riesgo ?? null,
      cg_friendly: d.cg_friendly ?? true,
      sinonimos: d.sinonimos ?? null,
      categoria: d.categoria ?? null,
      aporte_cronograma: d.aporte_cronograma ?? null,
      porosidad_recomendada: d.porosidad_recomendada ?? "todas",
    };
    return {
      row,
      inci: norm(row.nombre_inci),
      comun: row.nombre_comun ? norm(row.nombre_comun) : null,
      sinonimos: row.sinonimos
        ? row.sinonimos.split("|").map((s) => norm(s)).filter((s) => s.length >= 2)
        : [],
    };
  });
  cacheTs = Date.now();
  return cache;
}

function norm(s: string) {
  return s
    .toLowerCase()
    // Quitar acentos/diacríticos: el OCR los pierde y los sinónimos los traen
    // ("Glicérina" ↔ "glicerina", "Huile d'Argan" ↔ "huile d'argan")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

// Genera variantes de un nombre OCR para buscar: las etiquetas multiidioma
// escriben "Aqua (Water/Eau)" o "Parfum/Fragrance" para el MISMO ingrediente.
function variantesDeBusqueda(n: string): string[] {
  const out = new Set<string>();
  const agregar = (s: string) => {
    const limpio = s.trim().replace(/\s+/g, " ");
    if (limpio.length >= 2) out.add(limpio);
  };

  agregar(n);
  // Sin los grupos entre paréntesis: "butyrospermum parkii (shea) butter" → "butyrospermum parkii butter"
  agregar(n.replace(/\([^)]*\)/g, " "));
  // El contenido de los paréntesis también es candidato: "aqua (water/eau)" → "water/eau"
  for (const m of n.matchAll(/\(([^)]+)\)/g)) agregar(m[1]);
  // Partes separadas por barra: "parfum/fragrance" -> "parfum", "fragrance"
  for (const base of [...out]) {
    if (base.includes("/")) base.split("/").forEach(agregar);
  }
  // Sin prefijos de isómero: "d-limonene" -> "limonene", "l-menthol" -> "menthol"
  for (const base of [...out]) {
    if (/\b(?:d|l|dl)-[a-z]/.test(base)) agregar(base.replace(/\b(?:d|l|dl)-(?=[a-z])/g, ""));
  }
  return [...out];
}

// Aguja aparece dentro de pajar como palabra(s) completa(s)?
function contieneComoPalabra(pajar: string, aguja: string): boolean {
  return (" " + pajar + " ").includes(" " + aguja + " ");
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

// Palabras largas (>=8 chars) toleran 2 errores de OCR ("orbygnia" -> "orbignya");
// las cortas solo 1, para no inventar coincidencias.
function similaridadFuzzy(a: string, b: string): number {
  const wordsA = a.split(" ");
  const wordsB = b.split(" ");
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  let coincidencias = 0;
  for (const wa of wordsA) {
    if (wordsB.some((wb) => {
      const tolerancia = wa.length >= 8 && wb.length >= 8 ? 2 : 1;
      return levenshtein(wa, wb) <= tolerancia;
    })) coincidencias++;
  }
  return coincidencias / Math.max(wordsA.length, wordsB.length);
}

function umbralFuzzy(a: string, b: string): number {
  const palabras = Math.max(a.split(" ").length, b.split(" ").length);
  return palabras > 3 ? 0.70 : 0.75;
}

export async function buscarIngredienteSupabase(nombre: string) {
  const lista = await getIngredientes();
  const variantes = variantesDeBusqueda(norm(nombre));
  if (variantes.length === 0) return null;

  // 1. Exacta
  for (const n of variantes) {
    for (const item of lista) {
      if (item.inci === n || item.comun === n || item.sinonimos.includes(n)) {
        return formatear(item.row);
      }
    }
  }

  // 2. Substring (palabras completas). Mínimo 5 chars: con menos ("corn",
  //    "aqua") salen falsos positivos; los nombres cortos legítimos ya
  //    cazan en la búsqueda exacta del paso 1.
  for (const n of variantes) {
    for (const item of lista) {
      const candidatos = [item.inci, ...(item.comun ? [item.comun] : []), ...item.sinonimos];
      for (const c of candidatos) {
        if (c.length >= 5 && contieneComoPalabra(n, c)) return formatear(item.row);
        if (n.length >= 5 && contieneComoPalabra(c, n)) return formatear(item.row);
      }
    }
  }

  // 3. Fuzzy
  let mejorCoincidencia: IngredienteRow | null = null;
  let mejorPuntuacion = 0;
  for (const n of variantes) {
    for (const item of lista) {
      const candidatos = [item.inci, ...(item.comun ? [item.comun] : []), ...item.sinonimos];
      for (const c of candidatos) {
        const sim = similaridadFuzzy(n, c);
        if (sim > mejorPuntuacion && sim >= umbralFuzzy(n, c)) {
          mejorPuntuacion = sim;
          mejorCoincidencia = item.row;
        }
      }
    }
  }

  if (!mejorCoincidencia) return null;
  return formatear(mejorCoincidencia);
}

function formatear(r: IngredienteRow) {
  return {
    nombreINCI: r.nombre_inci,
    nombreComun: r.nombre_comun ?? undefined,
    clasificacion: r.clasificacion,
    funcion: r.funcion,
    explicacion: r.explicacion,
    notaRiesgo: r.nota_riesgo ?? undefined,
    cgFriendly: r.cg_friendly,
    categoria: r.categoria ?? undefined,
    aporteCronograma: r.aporte_cronograma ?? undefined,
    porosidadRecomendada: r.porosidad_recomendada ?? "todas",
  };
}
