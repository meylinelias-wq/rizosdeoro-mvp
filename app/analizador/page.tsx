"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { ResultadoAnalisis } from "@/types/perfil";
import ScoreRing from "@/components/ui/ScoreRing";
import IngredienteCard from "@/components/ui/IngredienteCard";
import AlternativaCard from "@/components/ui/AlternativaCard";
import BottomNav from "@/components/ui/BottomNav";
import { alternativas } from "@/data/alternativas";

// ── Pantalla de carga premium ──────────────────────────────────────────────
const MENSAJES_CARGA = [
  "Leyendo ingredientes…",
  "Clasificando componentes…",
  "Calculando puntuación…",
  "Preparando tu resultado…",
];

function PantallaCarga() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MENSAJES_CARGA.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: i === 0 ? "var(--lila)" : i === 1 ? "var(--oro)" : "var(--verde)",
            animationDelay: `${i * 0.2}s`,
            animation: "pulseDot 1.2s ease-in-out infinite",
            display: "inline-block",
          }} />
        ))}
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--lila)", letterSpacing: "0.02em", transition: "all 0.4s", minHeight: "1.5em" }}>
        {MENSAJES_CARGA[idx]}
      </p>
    </div>
  );
}

// ── Veredicto resumido ──────────────────────────────────────────────────────
function VeredictoResumen({ resultado }: { resultado: ResultadoAnalisis }) {
  const config = {
    recomendado: { color: "var(--verde)", bg: "var(--verde-bg)", borde: "var(--verde-borde)", label: "Recomendado" },
    "con-precaución": { color: "var(--amarillo)", bg: "var(--amarillo-bg)", borde: "var(--amarillo-borde)", label: "Con precaución" },
    evitar: { color: "var(--rojo)", bg: "var(--rojo-bg)", borde: "var(--rojo-borde)", label: "Evitar" },
  };
  const c = config[resultado.veredicto];

  return (
    <div className="p-5" style={{ background: c.bg, border: `1px solid ${c.borde}`, borderRadius: "8px" }}>
      <div className="flex items-center justify-between mb-3">
        <p className="label" style={{ color: c.color }}>Veredicto</p>
        <span className="text-xs font-bold px-3 py-1"
          style={{ background: c.color, color: "var(--bg)", borderRadius: "3px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
          {c.label}
        </span>
      </div>
      <p className="text-sm" style={{ color: c.color, lineHeight: 1.7 }}>{resultado.resumen}</p>
      <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: `1px solid ${c.borde}` }}>
        <div>
          <p className="label" style={{ color: c.color, opacity: 0.6 }}>Tipo</p>
          <p className="text-xs font-semibold mt-0.5" style={{ color: c.color }}>{resultado.clasificacionFuncional}</p>
        </div>
        {resultado.cgFriendly && (
          <span className="text-xs font-bold px-2 py-1"
            style={{ background: "var(--verde)", color: "var(--bg)", borderRadius: "3px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            CG-Friendly
          </span>
        )}
      </div>
    </div>
  );
}

// ── Sección alternativas ───────────────────────────────────────────────────
function AlternativasSection({ categoriaProducto }: { categoriaProducto: string }) {
  const lista = alternativas[categoriaProducto] ?? alternativas["otro"];
  return (
    <div className="resultado-enter" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-3 mb-4">
        <div>
          <p className="label-oro mb-0.5">Mejores alternativas</p>
          <h3 className="titulo-seccion text-xl" style={{ color: "var(--texto)" }}>
            Productos similares bien valorados
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {lista.map((alt, i) => (
          <AlternativaCard key={i} alternativa={alt} />
        ))}
      </div>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────
function AnalizadorContenido() {
  const searchParams = useSearchParams();
  const [nombreProducto, setNombreProducto] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAnalisis | null>(null);
  const [error, setError] = useState("");
  const [desdeEscaner, setDesdeEscaner] = useState(false);
  const [porosidadUsuario, setPorosidadUsuario] = useState<string>("no sé");
  const resultadoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Leer porosidad del perfil guardado
    try {
      const perfilGuardado = localStorage.getItem("rizos_perfil");
      if (perfilGuardado) {
        const perfil = JSON.parse(perfilGuardado);
        if (perfil?.porosidad) setPorosidadUsuario(perfil.porosidad);
      }
    } catch { /* perfil no disponible */ }

    if (searchParams.get("desde") === "escaner") {
      const texto = sessionStorage.getItem("rizos_escaner_texto");
      if (texto) { setIngredientes(texto); setDesdeEscaner(true); sessionStorage.removeItem("rizos_escaner_texto"); }
    }
  }, [searchParams]);

  async function analizar() {
    if (!ingredientes.trim()) return;
    setAnalizando(true); setError(""); setResultado(null);
    try {
      const res = await fetch("/api/analizar", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreProducto, ingredientes, porosidad: porosidadUsuario }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setResultado(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally { setAnalizando(false); }
  }

  function resetear() {
    setResultado(null);
    setError("");
    setNombreProducto("");
    setIngredientes("");
    setDesdeEscaner(false);
  }

  // Scroll al top cuando llega el resultado
  useEffect(() => {
    if (resultado) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [resultado]);

  const mostrarAlternativas =
    resultado && resultado.puntuacion !== undefined && resultado.puntuacion < 60;

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <Link href="/" className="text-sm flex items-center gap-2 mb-8" style={{ color: "var(--texto-suave)" }}>
          ← Inicio
        </Link>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>
          Analizador de
        </h1>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--oro)" }}>
          Ingredientes
        </h1>
        <div className="linea-oro mt-3" />
      </div>

      <div className="px-6 pb-12 flex flex-col gap-5">

        {/* ── FORMULARIO — se oculta cuando hay resultado ── */}
        {!resultado && (
          <>
            {/* CTA escáner */}
            {!desdeEscaner && (
              <Link href="/escaner">
                <div className="flex items-center justify-between p-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--borde-oro)", borderRadius: "6px" }}>
                  <div>
                    <p className="label-oro mb-1">Alternativa rápida</p>
                    <p className="text-sm font-medium" style={{ color: "var(--texto)" }}>
                      Escanear etiqueta con la cámara
                    </p>
                  </div>
                  <span style={{ color: "var(--oro)" }}>→</span>
                </div>
              </Link>
            )}

            {desdeEscaner && (
              <div className="p-3 text-xs" style={{ background: "var(--verde-bg)", color: "var(--verde)", border: "1px solid var(--verde-borde)", borderRadius: "6px" }}>
                Ingredientes importados desde el escáner. Revísalos antes de analizar.
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <p className="label mb-2">Nombre del producto</p>
                <input type="text" placeholder="Ej: Crema de rizos Shea Moisture"
                  value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} />
              </div>
              <div>
                <p className="label mb-2">Lista de ingredientes *</p>
                <textarea rows={7}
                  placeholder={"Pega aquí los ingredientes separados por comas.\nEj: Water, Cetearyl Alcohol, Glycerin..."}
                  value={ingredientes} onChange={(e) => setIngredientes(e.target.value)}
                  style={{ resize: "vertical" }} />
                <p className="text-xs mt-2" style={{ color: "var(--texto-suave)" }}>
                  Cópialo de la etiqueta del envase o de la tienda online.
                </p>
              </div>
              <button onClick={analizar} disabled={!ingredientes.trim() || analizando}
                className="btn-primary" style={{ opacity: ingredientes.trim() && !analizando ? 1 : 0.35 }}>
                {analizando ? "Analizando..." : "Analizar ingredientes"}
              </button>
            </div>

            {/* Pantalla de carga */}
            {analizando && <PantallaCarga />}

            {error && (
              <div className="p-4 text-sm" style={{ background: "var(--rojo-bg)", color: "var(--rojo)", border: "1px solid var(--rojo-borde)", borderRadius: "6px" }}>
                {error}
              </div>
            )}
          </>
        )}

        {/* ── RESULTADO — reemplaza el formulario con fadeIn ── */}
        {resultado && (
          <div ref={resultadoRef} className="flex flex-col gap-5" style={{ animation: "fadeSlideUp 0.4s ease-out both" }}>

            {/* Nombre */}
            <div>
              <p className="label mb-1">Resultado</p>
              <h2 className="titulo-seccion text-3xl" style={{ color: "var(--texto)" }}>
                {resultado.nombreProducto}
              </h2>
            </div>

            {/* ScoreRing */}
            {resultado.puntuacion !== undefined && (
              <div className="flex justify-center py-4">
                <ScoreRing puntuacion={resultado.puntuacion} size={140} animated />
              </div>
            )}

            {/* Veredicto */}
            <div style={{ animationDelay: "0.1s" }}>
              <VeredictoResumen resultado={resultado} />
            </div>

            {/* Ingredientes */}
            <div style={{ animationDelay: "0.15s" }}>
              <p className="label mb-4">{resultado.ingredientes.length} ingredientes analizados</p>
              <div className="flex flex-col gap-3">
                {resultado.ingredientes.map((ing, i) => (
                  <IngredienteCard key={i} ing={ing} index={i} />
                ))}
              </div>
            </div>

            {/* Alternativas si puntuación < 60 */}
            {mostrarAlternativas && resultado.categoriaProducto && (
              <>
                <div className="divisor" />
                <AlternativasSection categoriaProducto={resultado.categoriaProducto} />
              </>
            )}

            <div className="divisor" />

            {/* Botón resetear */}
            <button onClick={resetear} className="btn-outline"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <RotateCcw size={15} />
              Analizar otro producto
            </button>

            <p className="text-xs text-center" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              Análisis orientativo y educativo.<br />No sustituye la consulta con un tricólogo.
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function Analizador() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="text-sm" style={{ color: "var(--texto-suave)" }}>Cargando...</p>
      </div>
    }>
      <AnalizadorContenido />
    </Suspense>
  );
}
