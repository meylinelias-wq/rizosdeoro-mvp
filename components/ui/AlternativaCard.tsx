"use client";

import ScoreRing from "./ScoreRing";
import { Alternativa } from "@/data/alternativas";

interface AlternativaCardProps {
  alternativa: Alternativa;
}

export default function AlternativaCard({ alternativa }: AlternativaCardProps) {
  return (
    <div style={{
      background: "var(--bg-card2)",
      border: "1px solid var(--borde-oro)",
      borderRadius: "10px",
      padding: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.875rem",
    }}>
      <div style={{ flexShrink: 0 }}>
        <ScoreRing puntuacion={alternativa.puntuacion} size={60} animated={false} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="text-sm font-semibold" style={{ color: "var(--texto)", lineHeight: 1.35 }}>
          {alternativa.nombre}
        </p>
        <p className="label mt-1">{alternativa.categoria}</p>
        <div className="flex items-center gap-2 mt-2">
          {alternativa.cgFriendly && (
            <span style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--verde)",
              background: "var(--verde-bg)",
              border: "1px solid var(--verde-borde)",
              borderRadius: "3px",
              padding: "0.1rem 0.45rem",
            }}>
              CG-Friendly
            </span>
          )}
          <button
            disabled
            style={{
              fontSize: "0.6rem",
              fontFamily: "var(--font-bebas), sans-serif",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--texto-suave)",
              background: "none",
              border: "1px solid var(--borde)",
              borderRadius: "3px",
              padding: "0.15rem 0.5rem",
              cursor: "not-allowed",
            }}
          >
            Ver producto
          </button>
        </div>
      </div>
    </div>
  );
}
