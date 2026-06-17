"use client";

import { useState } from "react";
import { ResultadoIngrediente, CategoriaIngrediente } from "@/types/perfil";
import { ChevronDown } from "lucide-react";

const CATEGORIA_LABELS: Record<CategoriaIngrediente, string> = {
  silicona_soluble: "Silicona soluble",
  silicona_no_soluble: "Silicona no soluble",
  sulfato_fuerte: "Sulfato agresivo",
  sulfato_suave: "Sulfato suave",
  alcohol_bueno: "Alcohol graso",
  alcohol_malo: "Alcohol deshidratante",
  proteina: "Proteína hidrolizada",
  humectante: "Humectante",
  acondicionador: "Acondicionador",
  conservante: "Conservante",
  fragancia: "Fragancia",
  aceite: "Aceite / Emoliente",
  otro: "",
};

const CONFIG: Record<ResultadoIngrediente["clasificacion"], {
  borde: string; chip: string; chipClass: string; label: string; dot: string;
}> = {
  verde: {
    borde: "#16a34a",
    chip: "chip-verde",
    chipClass: "chip-verde",
    label: "Beneficioso",
    dot: "#16a34a",
  },
  amarillo: {
    borde: "#d97706",
    chip: "chip-amarillo",
    chipClass: "chip-amarillo",
    label: "Precaución",
    dot: "#d97706",
  },
  rojo: {
    borde: "#dc2626",
    chip: "chip-rojo",
    chipClass: "chip-rojo",
    label: "Evitar",
    dot: "#dc2626",
  },
};

interface IngredienteCardProps {
  ing: ResultadoIngrediente;
  index?: number;
}

export default function IngredienteCard({ ing, index = 0 }: IngredienteCardProps) {
  const [expandido, setExpandido] = useState(false);
  const cfg = CONFIG[ing.clasificacion];
  const categoriaLabel = ing.categoria ? CATEGORIA_LABELS[ing.categoria] : null;
  const mostrarExpand = (ing.clasificacion === "rojo" || ing.clasificacion === "amarillo") && ing.razonClasificacion;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(83,66,116,0.10)",
        borderRadius: 14,
        padding: "1rem 1.1rem",
        borderLeft: `4px solid ${cfg.borde}`,
        boxShadow: "0 2px 8px rgba(83,66,116,0.06)",
        animationDelay: `${index * 70}ms`,
        animationFillMode: "both",
        animation: "fadeSlideUp 0.35s ease-out both",
      }}
    >
      {/* Fila top */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" style={{ color: "#534274", lineHeight: 1.3 }}>
            {ing.nombreComun || ing.nombre}
          </p>
          {ing.nombreComun && (
            <p style={{ fontSize: "0.72rem", color: "var(--texto-suave)", marginTop: "0.1rem" }}>
              {ing.nombre}
            </p>
          )}
        </div>
        <span className={cfg.chipClass} style={{ flexShrink: 0 }}>
          {cfg.label}
        </span>
      </div>

      {/* Función + categoría */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span style={{
          fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
          color: cfg.borde,
        }}>
          {ing.funcion}
        </span>
        {categoriaLabel && (
          <span style={{
            fontSize: "0.64rem", fontWeight: 600, letterSpacing: "0.05em",
            color: "var(--texto-suave)",
            background: "rgba(83,66,116,0.06)",
            borderRadius: 6, padding: "0.1rem 0.45rem",
          }}>
            {categoriaLabel}
          </span>
        )}
      </div>

      {/* Descripción */}
      <p style={{ fontSize: "0.83rem", color: "#6b5a8a", lineHeight: 1.6 }}>
        {ing.explicacion}
      </p>

      {/* Nota de riesgo */}
      {ing.notaRiesgo && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(83,66,116,0.08)" }}>
          <p style={{ fontSize: "0.75rem", color: "#d97706", lineHeight: 1.5 }}>
            ⚠️ {ing.notaRiesgo}
          </p>
        </div>
      )}

      {/* Advertencia de porosidad personalizada */}
      {ing.advertenciaPorosidad && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(83,66,116,0.08)" }}>
          <p style={{ fontSize: "0.75rem", color: "#7c3aed", lineHeight: 1.5 }}>
            💧 {ing.advertenciaPorosidad}
          </p>
        </div>
      )}

      {/* Expandible */}
      {mostrarExpand && (
        <div className="mt-2 pt-2" style={{ borderTop: "1px solid rgba(83,66,116,0.08)" }}>
          <button
            onClick={() => setExpandido(!expandido)}
            className="flex items-center gap-1.5 text-xs font-semibold"
            style={{
              color: cfg.borde, background: "none", border: "none",
              cursor: "pointer", padding: 0, letterSpacing: "0.02em",
            }}
          >
            <ChevronDown
              size={13}
              strokeWidth={2.5}
              style={{ transition: "transform 0.2s", transform: expandido ? "rotate(180deg)" : "rotate(0deg)" }}
            />
            ¿Por qué es problemático?
          </button>
          {expandido && (
            <p style={{ fontSize: "0.78rem", color: "#6b5a8a", lineHeight: 1.55, marginTop: "0.5rem" }}>
              {ing.razonClasificacion}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
