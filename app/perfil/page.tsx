"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PerfilCapilar } from "@/types/perfil";
import BottomNav from "@/components/ui/BottomNav";

const RIZO_EMOJI: Record<string, string> = {
  "2A": "〰️", "2B": "〰️", "2C": "〰️",
  "3A": "🌀", "3B": "🌀", "3C": "🌀",
  "4A": "🔁", "4B": "🔁", "4C": "🔁",
};

const POROSIDAD_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  baja:  { bg: "#eff6ff", text: "#2563eb", label: "Baja" },
  media: { bg: "#faf5ff", text: "#9333ea", label: "Media" },
  alta:  { bg: "#fdf2f8", text: "#db2777", label: "Alta" },
};

export default function Perfil() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilCapilar | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rizos_perfil");
    if (saved) setPerfil(JSON.parse(saved));
    else router.push("/onboarding");
  }, [router]);

  if (!perfil) return null;

  const porosidadCfg = POROSIDAD_COLOR[perfil.porosidad] ?? { bg: "#f5f3ff", text: "#7c3aed", label: perfil.porosidad };
  const rizoEmoji = RIZO_EMOJI[perfil.tipoRizo] ?? "🌀";

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      <div style={{ padding: "2.5rem 1.25rem 1.5rem" }}>
        <Link href="/" style={{ fontSize: "0.8rem", color: "var(--texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginBottom: "1.5rem" }}>
          ← Inicio
        </Link>

        {/* Avatar + nombre */}
        <div className="flex items-center gap-4 mb-1">
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #B981DA, #534274)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", boxShadow: "0 4px 14px rgba(185,129,218,0.35)",
          }}>
            {rizoEmoji}
          </div>
          <div>
            <h1 style={{ fontSize: "1.6rem", fontFamily: "var(--font-bebas), Impact, sans-serif", color: "#534274", letterSpacing: "0.03em" }}>
              {perfil.nombre}
            </h1>
            <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)", marginTop: "0.1rem" }}>
              Perfil capilar personalizado
            </p>
          </div>
        </div>
        <div className="linea-oro mt-4" />
      </div>

      <div style={{ padding: "0 1.25rem 3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Chips de tipo de cabello */}
        <div>
          <p className="label mb-3">Tu cabello</p>
          <div className="flex flex-wrap gap-2">
            {/* Tipo de rizo */}
            <div style={{
              background: "linear-gradient(135deg, rgba(185,129,218,0.12), rgba(83,66,116,0.08))",
              border: "1.5px solid rgba(185,129,218,0.3)",
              borderRadius: 16, padding: "0.6rem 1rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{ fontSize: "1.2rem" }}>{rizoEmoji}</span>
              <div>
                <p style={{ fontSize: "0.62rem", color: "var(--texto-suave)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Tipo de rizo</p>
                <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#534274", letterSpacing: "0.02em" }}>{perfil.tipoRizo}</p>
              </div>
            </div>

            {/* Porosidad */}
            <div style={{
              background: porosidadCfg.bg,
              border: `1.5px solid ${porosidadCfg.text}30`,
              borderRadius: 16, padding: "0.6rem 1rem",
            }}>
              <p style={{ fontSize: "0.62rem", color: "var(--texto-suave)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Porosidad</p>
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: porosidadCfg.text, marginTop: "0.1rem", textTransform: "capitalize" }}>{porosidadCfg.label}</p>
            </div>

            {/* Estado */}
            <div style={{
              background: "#fffbeb",
              border: "1.5px solid #fde68a",
              borderRadius: 16, padding: "0.6rem 1rem",
            }}>
              <p style={{ fontSize: "0.62rem", color: "var(--texto-suave)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Estado</p>
              <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#d97706", marginTop: "0.1rem", textTransform: "capitalize" }}>{perfil.estado}</p>
            </div>
          </div>
        </div>

        {/* Objetivos */}
        <div>
          <p className="label mb-3">Objetivos</p>
          <div className="flex flex-wrap gap-2">
            {perfil.objetivos.map((obj) => (
              <span key={obj} style={{
                padding: "0.45rem 1rem",
                borderRadius: 20,
                fontSize: "0.8rem", fontWeight: 600,
                background: "rgba(185,129,218,0.10)",
                color: "#534274",
                border: "1px solid rgba(185,129,218,0.25)",
                textTransform: "capitalize",
              }}>
                {obj}
              </span>
            ))}
          </div>
        </div>

        <div className="divisor" />

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Link href="/onboarding" className="btn-primary">Editar perfil</Link>
          <Link href="/rutina" className="btn-outline">Ver mi rutina</Link>
        </div>

        <p style={{ fontSize: "0.72rem", textAlign: "center", color: "var(--texto-suave)" }}>
          Creado el {new Date(perfil.creadoEn).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <button onClick={() => {
          if (confirm("¿Borrar tu perfil capilar?")) {
            localStorage.removeItem("rizos_perfil");
            router.push("/onboarding");
          }
        }} style={{ fontSize: "0.75rem", textAlign: "center", color: "var(--rojo)", background: "none", border: "none", cursor: "pointer", padding: "0.25rem" }}>
          Borrar perfil
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
