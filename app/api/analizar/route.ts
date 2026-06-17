import { NextRequest, NextResponse } from "next/server";
import { parsearIngredientes } from "@/data/ingredientes";
import { buscarIngredienteSupabase } from "@/lib/supabase-ingredientes";
import { ResultadoIngrediente, ResultadoAnalisis, CategoriaProducto } from "@/types/perfil";

// Aporte de cada ingrediente al cronograma capilar (columna aporte_cronograma de la BD)
type Aporte = "Hidratación" | "Nutrición" | "Sellado" | "Reparación" | "Limpieza" | "Soporte" | "desconocido";

// Extrae solo la sección de ingredientes del texto OCR completo
function extraerSeccionIngredientes(texto: string): string {
  // Encabezados en inglés, español, francés, italiano, alemán, portugués, polaco
  const patronEncabezado = /(?:ingredients?|ingredientes?|ingr[eé]dients?|ingredienti|inhaltsstoffe?|bestandteile|composici[oó]n|composi[çc][aã]o|composition|zusammensetzung|sestavine|sk[lł]ad|inci[\s-]?list|inci|contiene|contains?)\s*:?\s*/gi;

  const match = patronEncabezado.exec(texto);

  if (match) {
    // Las etiquetas multiidioma encadenan encabezados: "Ingredientes/Ingredients/Ingrédients:".
    // El OCR a veces los separa ("Ingredient es /Ingredients:"). Avanzamos hasta el ÚLTIMO
    // encabezado de la cadena (mientras el siguiente empiece a pocos caracteres del anterior).
    let finEncabezado = match.index + match[0].length;
    let siguiente = patronEncabezado.exec(texto);
    while (siguiente && siguiente.index <= finEncabezado + 6) {
      finEncabezado = siguiente.index + siguiente[0].length;
      siguiente = patronEncabezado.exec(texto);
    }
    let seccion = texto.slice(finEncabezado);
    // Cortar cuando empieza texto claramente ajeno a ingredientes:
    // instrucciones, advertencias, fechas, lotes, URLs, datos del fabricante...
    const patronFin = /\n{2,}|\b(?:how\s+to\s+use|modo\s+de\s+uso|modo\s+de\s+empleo|directions|apply|aplicar|warning|advertencia|precauci[oó]n|caution|attention|conservar|keep\s+away|store|lagerung|conserver|lote|batch|best\s+before|exp\.?\b|caducidad|consumir\s+antes|usar\s+antes|fecha|ean|net\s+wt|poids\s+net|peso\s+neto|fl\.?\s*oz|manufactured|fabricado|distribu[ií]do|made\s+in|hecho\s+en|www\.|http)\b|\b\d{1,2}[\/\-]\d{2,4}\b/i;
    const fin = patronFin.exec(seccion);
    if (fin && fin.index > 20) seccion = seccion.slice(0, fin.index);
    return seccion.trim();
  }

  // Sin encabezado: buscar el bloque con más comas y palabras INCI típicas
  const patronINCI = /\b(?:aqua|water|glycerin|sodium|potassium|hydroxy|cetyl|stearyl|cetearyl|dimethicone|parfum|fragrance|acid|oxide|extract|butyl|methyl|ethyl|propyl|lauryl|laureth|cocos|aloe|citric|panthenol|gum|seed\s+oil|alcohol)\b/gi;
  const lineas = texto.split("\n");
  let mejorBloque = "";
  let mayorPuntos = 0;
  let bloqueActual = "";
  let puntosActual = 0;

  for (const linea of lineas) {
    const palabrasINCI = (linea.match(patronINCI) || []).length;
    if (palabrasINCI > 0 || linea.includes(",")) {
      bloqueActual += " " + linea;
      // Cada coma y cada palabra INCI suman: así gana el bloque que de verdad es la lista
      puntosActual += (linea.match(/,/g) || []).length + palabrasINCI;
    } else {
      if (puntosActual > mayorPuntos) {
        mayorPuntos = puntosActual;
        mejorBloque = bloqueActual;
      }
      bloqueActual = "";
      puntosActual = 0;
    }
  }
  if (puntosActual > mayorPuntos) mejorBloque = bloqueActual;

  return (mejorBloque.trim() || texto).trim();
}

// Deduce el aporte al cronograma cuando la BD no lo trae (esquema antiguo o ingrediente desconocido)
function inferirAporte(funcion: string): Aporte {
  const f = funcion.toLowerCase();
  if (/hidrat|humect/.test(f)) return "Hidratación";
  if (/prote[ií]n|reparaci/.test(f)) return "Reparación";
  if (/sell|emolien|nutri|aceite|oil|manteca|brillo/.test(f)) return "Nutrición";
  if (/surfact|limpia|limpieza/.test(f)) return "Limpieza";
  return "desconocido";
}

function calcularPuntuacion(
  ingredientes: ResultadoIngrediente[],
  aportes: Aporte[],
  cgFriendly: boolean
): number {
  let puntos = 100;
  const rojos = ingredientes.filter((i) => i.clasificacion === "rojo").length;
  const amarillos = ingredientes.filter((i) => i.clasificacion === "amarillo").length;
  const tieneHumectantes = aportes.includes("Hidratación");

  puntos -= rojos * 15;
  puntos -= amarillos * 5;
  if (cgFriendly) puntos += 10;
  if (tieneHumectantes) puntos += 5;

  return Math.max(0, Math.min(100, puntos));
}

function inferirCategoriaProducto(nombreProducto: string): CategoriaProducto {
  const n = nombreProducto.toLowerCase();
  if (n.includes("champú") || n.includes("champu") || n.includes("shampoo") || n.includes("cowash")) return "champú";
  if (n.includes("acondicionador") || n.includes("conditioner") || n.includes("enjuague")) return "acondicionador";
  if (n.includes("leave-in") || n.includes("leave in") || n.includes("sin enjuague")) return "leave-in";
  if (n.includes("gel")) return "gel";
  if (n.includes("mascarilla") || n.includes("mask") || n.includes("tratamiento")) return "mascarilla";
  if (n.includes("aceite") || n.includes("oil") || n.includes("sérum") || n.includes("serum")) return "aceite";
  if (n.includes("crema") || n.includes("cream") || n.includes("butter") || n.includes("manteca")) return "crema";
  return "otro";
}

function calcularVeredicto(
  ingredientes: ResultadoIngrediente[]
): ResultadoAnalisis["veredicto"] {
  const rojos = ingredientes.filter((i) => i.clasificacion === "rojo").length;
  const amarillos = ingredientes.filter((i) => i.clasificacion === "amarillo").length;
  const total = ingredientes.length;

  if (rojos === 0 && amarillos <= 2) return "recomendado";
  if (rojos === 0 && amarillos > 2) return "con-precaución";
  if (rojos === 1 && rojos / total < 0.1) return "con-precaución";
  return "evitar";
}

// Clasificador funcional según el cronograma capilar:
// Hidratante / Nutritivo (sellante) / Proteína / Equilibrado / Mixto
function calcularClasificacion(aportes: Aporte[]): string {
  const hidratacion = aportes.filter((a) => a === "Hidratación").length;
  const nutricion = aportes.filter((a) => a === "Nutrición" || a === "Sellado").length;
  const proteina = aportes.filter((a) => a === "Reparación").length;

  const tieneHidratante = hidratacion > 1;
  const tieneSellante = nutricion > 1;
  const tieneProteina = proteina > 0;

  if (tieneHidratante && tieneSellante && tieneProteina) return "Equilibrado";
  if (tieneHidratante && tieneSellante) return "Mixto";
  if (tieneHidratante) return "Hidratante";
  if (tieneSellante) return "Nutritivo (sellante)";
  if (tieneProteina) return "Proteína";
  return "Mixto";
}

function generarResumen(
  nombreProducto: string,
  veredicto: ResultadoAnalisis["veredicto"],
  ingredientes: ResultadoIngrediente[],
  cgFriendly: boolean
): string {
  const nombre = nombreProducto || "Este producto";
  const rojos = ingredientes.filter((i) => i.clasificacion === "rojo");
  const verdes = ingredientes.filter((i) => i.clasificacion === "verde");

  if (veredicto === "recomendado") {
    return `${nombre} tiene una buena lista de ingredientes para el cabello rizado. Cuenta con ${verdes.length} ingredientes beneficiosos${cgFriendly ? " y es CG-friendly" : ""}. ¡Una buena opción para tus rizos!`;
  }
  if (veredicto === "con-precaución") {
    return `${nombre} tiene ingredientes mixtos. Hay algunos elementos a tener en cuenta antes de usarlo de forma habitual en tu rutina.`;
  }
  return `${nombre} contiene ${rojos.length} ingrediente(s) problemático(s) para el cabello rizado (${rojos.map((r) => r.nombreComun || r.nombre).join(", ")}). Mejor buscar una alternativa.`;
}

// Genera advertencia si el ingrediente no encaja con la porosidad del usuario
function advertenciaPorosidad(
  porosidadRecomendada: string,
  porosidadUsuario: string
): string | undefined {
  if (porosidadRecomendada === "todas" || porosidadUsuario === "no sé") return undefined;
  const recomendadas = porosidadRecomendada.split(",");
  if (recomendadas.includes(porosidadUsuario)) return undefined;

  const etiquetas: Record<string, string> = {
    alta: "alta porosidad",
    media: "porosidad media",
    baja: "baja porosidad",
  };
  const para = recomendadas.map((p) => etiquetas[p] ?? p).join(" o ");
  return `Más adecuado para ${para}. Para tu porosidad ${etiquetas[porosidadUsuario] ?? porosidadUsuario} puede no ser la mejor opción.`;
}

export async function POST(req: NextRequest) {
  try {
    const { nombreProducto, ingredientes: ingredientesTexto, porosidad } = await req.json();
    const porosidadUsuario: string = porosidad ?? "no sé";

    if (!ingredientesTexto?.trim()) {
      return NextResponse.json(
        { error: "La lista de ingredientes es requerida." },
        { status: 400 }
      );
    }

    const textoLimpio = extraerSeccionIngredientes(ingredientesTexto);
    const listaIngredientes = parsearIngredientes(textoLimpio);

    if (listaIngredientes.length === 0) {
      return NextResponse.json(
        { error: "No se detectaron ingredientes. Asegúrate de separarlos con comas." },
        { status: 400 }
      );
    }

    // ── PASO 1: Buscar en Supabase en paralelo (más rápido) ──────────────────
    const resultadosLocales: ResultadoIngrediente[] = [];
    const aportesLocales: Aporte[] = [];
    const cgFlags: boolean[] = [];
    const desconocidos: string[] = [];

    const resultados = await Promise.all(
      listaIngredientes.map((ing) => buscarIngredienteSupabase(ing).then((r) => ({ ing, r })))
    );

    // Deduplicar por nombre INCI resuelto: "Aqua" y "Aqua (Water/Eau)" son el mismo
    const inciVistos = new Set<string>();
    const desconocidosVistos = new Set<string>();

    for (const { ing, r } of resultados) {
      if (r) {
        const claveINCI = r.nombreINCI.toLowerCase();
        if (inciVistos.has(claveINCI)) continue;
        inciVistos.add(claveINCI);
        const porRec = r.porosidadRecomendada ?? "todas";
        resultadosLocales.push({
          nombre: r.nombreINCI,
          nombreComun: r.nombreComun,
          clasificacion: r.clasificacion,
          funcion: r.funcion,
          explicacion: r.explicacion,
          notaRiesgo: r.notaRiesgo,
          porosidadRecomendada: porRec,
          advertenciaPorosidad: advertenciaPorosidad(porRec, porosidadUsuario),
        });
        aportesLocales.push(
          (r.aporteCronograma as Aporte | undefined) ?? inferirAporte(r.funcion)
        );
        cgFlags.push(r.cgFriendly);
      } else {
        const claveDesc = ing.toLowerCase();
        if (desconocidosVistos.has(claveDesc)) continue;
        desconocidosVistos.add(claveDesc);
        desconocidos.push(ing);
      }
    }

    // PASO 2: Marcar desconocidos como no identificados
    const resultadosIA: ResultadoIngrediente[] = desconocidos.map((nombre) => ({
      nombre,
      clasificacion: "amarillo",
      funcion: "Otro",
      explicacion: "Ingrediente no encontrado en nuestra base de datos. No es necesariamente malo, simplemente no lo tenemos registrado aun.",
    }));

    // PASO 3: Combinar y generar resultado final
    const todosIngredientes = [...resultadosLocales, ...resultadosIA];
    const aportes: Aporte[] = [...aportesLocales, ...resultadosIA.map(() => "desconocido" as Aporte)];
    const cgFriendly = cgFlags.every((f) => f) && resultadosLocales.every((i) => i.clasificacion !== "rojo");
    // La puntuación y el veredicto se calculan SOLO con los ingredientes identificados:
    // un desconocido no es malo, solo no está en la base de datos (o el OCR lo leyó mal).
    // Si penalizaran, una foto borrosa hundiría la nota de un producto bueno.
    // Sin ningún identificado no hay datos para puntuar: sin nota y con precaución
    const sinDatos = resultadosLocales.length === 0;
    const veredicto = sinDatos ? "con-precaución" : calcularVeredicto(resultadosLocales);
    const clasificacionFuncional = calcularClasificacion(aportes);
    let resumen = generarResumen(nombreProducto, veredicto, todosIngredientes, cgFriendly);
    // La nota nunca contradice al veredicto: los bonus (+CG, +humectantes)
    // no pueden devolver a 100 un producto con avisos
    let puntuacion = sinDatos ? undefined : calcularPuntuacion(resultadosLocales, aportesLocales, cgFriendly);
    if (puntuacion !== undefined) {
      if (veredicto === "evitar") puntuacion = Math.min(puntuacion, 39);
      else if (veredicto === "con-precaución") puntuacion = Math.min(puntuacion, 84);
    }
    const categoriaProducto = inferirCategoriaProducto(nombreProducto || "");

    // Aviso de cobertura: con pocos identificados el análisis pierde fiabilidad
    if (resultadosLocales.length === 0) {
      resumen = "No pudimos identificar ningún ingrediente. Suele pasar cuando la foto está borrosa: revisa el texto detectado y corrígelo, o pega la lista de ingredientes a mano.";
    } else if (desconocidos.length > 0) {
      const cobertura = resultadosLocales.length / todosIngredientes.length;
      const nota = ` (${desconocidos.length} ingrediente${desconocidos.length === 1 ? "" : "s"} no identificado${desconocidos.length === 1 ? "" : "s"} — no cuentan para la puntuación).`;
      resumen = cobertura < 0.5
        ? `Solo pudimos identificar ${resultadosLocales.length} de ${todosIngredientes.length} ingredientes, así que el resultado es orientativo. Revisa el texto de la foto o pega la lista a mano.`
        : resumen.replace(/\.?$/, "") + nota;
    }

    const problematicos = todosIngredientes
      .filter((i) => i.clasificacion === "rojo")
      .slice(0, 3)
      .map((i) => i.nombreComun || i.nombre);
    const beneficiosos = todosIngredientes
      .filter((i) => i.clasificacion === "verde")
      .slice(0, 3)
      .map((i) => i.nombreComun || i.nombre);

    const resultado: ResultadoAnalisis = {
      nombreProducto: nombreProducto || "Producto sin nombre",
      categoriaProducto,
      puntuacion,
      veredicto,
      resumen,
      ingredientes: todosIngredientes,
      clasificacionFuncional,
      cgFriendly,
      ingredientesDestacados: { problematicos, beneficiosos },
    };

    return NextResponse.json({
      ...resultado,
      _meta: {
        totalIngredientes: listaIngredientes.length,
        analizadosLocalmente: resultadosLocales.length,
        analizadosPorIA: resultadosIA.length,
      },
    });
  } catch (e) {
    console.error("Error en /api/analizar:", e);
    return NextResponse.json(
      { error: "Error al analizar. Intentalo de nuevo." },
      { status: 500 }
    );
  }
}
