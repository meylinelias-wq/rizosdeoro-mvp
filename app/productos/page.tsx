"use client";

import { useState } from "react";
import Link from "next/link";
import { productosDestacados, ProductoDestacado } from "@/data/productos-destacados";
import BottomNav from "@/components/ui/BottomNav";

type Orden = "mayor" | "menor" | "populares";
type Categoria = "todas" | ProductoDestacado["categoria"];

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "champú", label: "Champú" },
  { value: "acondicionador", label: "Acond." },
  { value: "leave-in", label: "Leave-in" },
  { value: "gel", label: "Gel" },
  { value: "mascarilla", label: "Mascarilla" },
  { value: "aceite", label: "Aceite" },
  { value: "crema", label: "Crema" },
];

const CATEGORIA_COLOR: Record<string, { bg: string; text: string }> = {
  "champú":        { bg: "#eff6ff", text: "#2563eb" },
  "acondicionador":{ bg: "#f0fdf4", text: "#16a34a" },
  "leave-in":      { bg: "#faf5ff", text: "#9333ea" },
  "gel":           { bg: "#fff7ed", text: "#ea580c" },
  "mascarilla":    { bg: "#fdf2f8", text: "#db2777" },
  "aceite":        { bg: "#fefce8", text: "#ca8a04" },
  "crema":         { bg: "#f0f9ff", text: "#0284c7" },
  "otro":          { bg: "#f5f3ff", text: "#7c3aed" },
};

function ScoreBar({ puntuacion }: { puntuacion: number }) {
  const color = puntuacion >= 75 ? "#16a34a" : puntuacion >= 50 ? "#d97706" : "#dc2626";
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div className="flex items-center justify-between mb-1">
        <span style={{ fontSize: "0.67rem", color: "var(--texto-suave)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Puntuación
        </span>
        <span style={{ fontSize: "0.85rem", fontWeight: 800, color, letterSpacing: "0.01em" }}>
          {puntuacion}/100
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 6, background: "rgba(83,66,116,0.08)", overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${puntuacion}%`,
          borderRadius: 6,
          background: color,
          transition: "width 0.6s ease-out",
        }} />
      </div>
    </div>
  );
}

function ProductoCard({ producto, index }: { producto: ProductoDestacado; index: number }) {
  const catColor = CATEGORIA_COLOR[producto.categoria] ?? { bg: "#f5f3ff", text: "#7c3aed" };

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid rgba(83,66,116,0.09)",
        borderRadius: 16,
        padding: "1.1rem 1.25rem",
        boxShadow: "0 2px 10px rgba(83,66,116,0.06)",
        animation: "fadeSlideUp 0.35s ease-out both",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Score circular */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          border: `3px solid ${producto.puntuacion >= 75 ? "#16a34a" : producto.puntuacion >= 50 ? "#d97706" : "#dc2626"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff",
        }}>
          <span style={{
            fontSize: "0.95rem", fontWeight: 800,
            color: producto.puntuacion >= 75 ? "#16a34a" : producto.puntuacion >= 50 ? "#d97706" : "#dc2626",
          }}>
            {producto.puntuacion}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold" style={{ color: "#534274", fontSize: "0.9rem", lineHeight: 1.3 }}>
                {producto.nombre}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--lila)", marginTop: "0.1rem", fontWeight: 600 }}>
                {producto.marca}
              </p>
            </div>
            <span style={{
              fontSize: "0.63rem", fontWeight: 700, padding: "0.2rem 0.55rem",
              borderRadius: 20, background: catColor.bg, color: catColor.text,
              flexShrink: 0, letterSpacing: "0.04em",
            }}>
              {producto.categoria}
            </span>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--texto-mid)", lineHeight: 1.5, marginTop: "0.4rem" }}>
            {producto.descripcion}
          </p>

          <ScoreBar puntuacion={producto.puntuacion} />

          {producto.cgFriendly && (
            <span style={{
              display: "inline-block", marginTop: "0.5rem",
              fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.06em",
              color: "#16a34a", background: "#f0fdf4",
              border: "1px solid #bbf7d0", borderRadius: 20,
              padding: "0.15rem 0.55rem",
            }}>
              ✓ CG-Friendly
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Productos() {
  const [orden, setOrden] = useState<Orden>("mayor");
  const [categoria, setCategoria] = useState<Categoria>("todas");

  const filtrados = productosDestacados
    .filter((p) => categoria === "todas" || p.categoria === categoria)
    .sort((a, b) => {
      if (orden === "mayor") return b.puntuacion - a.puntuacion;
      if (orden === "menor") return a.puntuacion - b.puntuacion;
      return a.id - b.id;
    });

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: "2.5rem 1.25rem 1.25rem" }}>
        <Link href="/" style={{ fontSize: "0.8rem", color: "var(--texto-suave)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginBottom: "1.5rem" }}>
          ← Inicio
        </Link>
        <h1 className="titulo-grande" style={{ fontSize: "2.4rem", color: "#534274" }}>
          Top Productos
        </h1>
        <div className="linea-oro mt-2 mb-3" />
        <p style={{ fontSize: "0.85rem", color: "var(--texto-suave)", lineHeight: 1.6 }}>
          Los más valorados por la comunidad curly
        </p>
      </div>

      <div style={{ padding: "0 1.25rem 3rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Filtros orden */}
        <div>
          <p className="label mb-2">Ordenar por</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { v: "mayor" as Orden, l: "Mayor puntuación" },
              { v: "menor" as Orden, l: "Menor puntuación" },
              { v: "populares" as Orden, l: "Más populares" },
            ].map(({ v, l }) => (
              <button key={v} onClick={() => setOrden(v)} style={{
                fontSize: "0.72rem", fontWeight: 600,
                padding: "0.4rem 0.9rem", borderRadius: 20,
                border: `1.5px solid ${orden === v ? "var(--lila)" : "var(--borde)"}`,
                background: orden === v ? "rgba(185,129,218,0.1)" : "#fff",
                color: orden === v ? "var(--lila)" : "var(--texto-suave)",
                cursor: "pointer", transition: "all 0.18s",
              }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Filtros categoría */}
        <div>
          <p className="label mb-2">Categoría</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map(({ value, label }) => (
              <button key={value} onClick={() => setCategoria(value)} style={{
                fontSize: "0.72rem", fontWeight: 600,
                padding: "0.4rem 0.9rem", borderRadius: 20,
                border: `1.5px solid ${categoria === value ? "var(--oro)" : "var(--borde)"}`,
                background: categoria === value ? "rgba(211,174,55,0.10)" : "#fff",
                color: categoria === value ? "var(--oro)" : "var(--texto-suave)",
                cursor: "pointer", transition: "all 0.18s",
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div>
          <p className="label mb-4">{filtrados.length} producto{filtrados.length !== 1 ? "s" : ""}</p>
          <div className="flex flex-col gap-3">
            {filtrados.map((p, i) => (
              <ProductoCard key={p.id} producto={p} index={i} />
            ))}
          </div>
        </div>

        <div className="divisor" />
        <p style={{ fontSize: "0.75rem", textAlign: "center", color: "var(--texto-suave)", lineHeight: 1.7 }}>
          Puntuaciones basadas en el Método Curly Girl.<br />
          Herramienta educativa — sin afiliados.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
