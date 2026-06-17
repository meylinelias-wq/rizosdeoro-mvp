"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Sparkles, ListChecks, BookOpen, Camera } from "lucide-react";
import { PerfilCapilar } from "@/types/perfil";
import BottomNav from "@/components/ui/BottomNav";

function saludo(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días ✨";
  if (h < 20) return "Buenas tardes ✨";
  return "Buenas noches ✨";
}

export default function Home() {
  const [perfil, setPerfil] = useState<PerfilCapilar | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rizos_perfil");
    if (saved) setPerfil(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header className="px-5 pt-10 pb-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center justify-center px-3 py-2 rounded-xl"
              style={{ background: "#ffffff", border: "1px solid var(--borde)", boxShadow: "0 2px 8px rgba(83,66,116,0.08)" }}>
              <Image src="/logo.png" alt="Rizos de Oro" width={110} height={44} style={{ objectFit: "contain" }} priority />
            </div>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--texto-suave)", marginTop: "0.3rem" }}>
              by Meylin Elías
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium" style={{ color: "var(--texto-mid)" }}>
              {perfil ? `Hola, ${perfil.nombre}` : saludo()}
            </p>
            {perfil ? (
              <span style={{
                fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.06em",
                color: "var(--lila)",
                background: "rgba(185,129,218,0.10)",
                border: "1px solid rgba(185,129,218,0.25)",
                borderRadius: "20px",
                padding: "0.18rem 0.65rem",
                display: "inline-block", marginTop: "0.3rem",
              }}>
                Rizo {perfil.tipoRizo}
              </span>
            ) : (
              <p style={{ fontSize: "0.65rem", color: "var(--oro)", marginTop: "0.2rem", fontWeight: 600 }}>
                {new Date().toLocaleDateString("es-ES", { weekday: "long" })}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="px-5 pb-10 flex flex-col gap-4">

        {/* ── HERO CARD ── */}
        <div style={{
          background: "linear-gradient(135deg, #534274 0%, #7c5aa0 60%, #B981DA 100%)",
          borderRadius: 20,
          padding: "1.75rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decoración fondo */}
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }} />
          <div style={{
            position: "absolute", bottom: -20, right: 20,
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(211,174,55,0.12)",
          }} />

          <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", fontWeight: 600, marginBottom: "0.5rem" }}>
            Tu app capilar
          </p>
          <h1 style={{ fontSize: "1.6rem", fontFamily: "var(--font-bebas), Impact, sans-serif", color: "#ffffff", lineHeight: 1.1, marginBottom: "0.6rem", letterSpacing: "0.03em" }}>
            {perfil ? `¡Hola, ${perfil.nombre}!` : "Descubre qué hay en tus productos"}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "1.25rem", maxWidth: "28ch" }}>
            {perfil
              ? "Analiza ingredientes y encuentra los mejores productos para tus rizos."
              : "Analiza ingredientes y cuida tus rizos con información real."}
          </p>
          <div className="flex gap-3">
            <Link href="/analizador" style={{
              flex: 1,
              background: "linear-gradient(135deg, var(--oro), #c8a430)",
              color: "#fff",
              borderRadius: 12,
              padding: "0.8rem 1rem",
              textAlign: "center",
              fontWeight: 700,
              fontSize: "0.88rem",
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(211,174,55,0.4)",
            }}>
              Analizar Producto
            </Link>
            <Link href="/escaner" style={{
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: 12,
              padding: "0.8rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              <Camera size={20} />
            </Link>
          </div>
        </div>

        {/* ── SECCIÓN TÍTULO ── */}
        <p style={{ fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--texto-suave)", fontWeight: 600, marginTop: "0.25rem" }}>
          Explorar
        </p>

        {/* ── CARD PRODUCTOS ── */}
        <Link href="/productos" style={{ textDecoration: "none" }}>
          <div className="card flex items-center gap-4" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: "rgba(185,129,218,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShoppingBag size={21} color="#B981DA" strokeWidth={1.7} />
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--texto)", fontSize: "0.95rem" }}>Top Productos</p>
              <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)", marginTop: "0.15rem" }}>Los mejor valorados por la comunidad</p>
            </div>
            <span style={{ color: "var(--lila)", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
          </div>
        </Link>

        {/* ── CARD PERFIL ── */}
        <Link href={perfil ? "/perfil" : "/onboarding"} style={{ textDecoration: "none" }}>
          <div className="card flex items-center gap-4" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: "rgba(211,174,55,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={21} color="var(--oro)" strokeWidth={1.7} />
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--texto)", fontSize: "0.95rem" }}>Mi Perfil Capilar</p>
              <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)", marginTop: "0.15rem" }}>
                {perfil ? `Rizo ${perfil.tipoRizo}  ·  Porosidad ${perfil.porosidad}` : "Crea tu perfil personalizado"}
              </p>
            </div>
            <span style={{ color: "var(--lila)", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
          </div>
        </Link>

        {/* ── CARD RUTINA ── */}
        <Link href="/rutina" style={{ textDecoration: "none" }}>
          <div className="card flex items-center gap-4" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: "rgba(22,163,74,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ListChecks size={21} color="var(--verde)" strokeWidth={1.7} />
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--texto)", fontSize: "0.95rem" }}>Mi Rutina</p>
              <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)", marginTop: "0.15rem" }}>
                {perfil ? "Ver tu rutina personalizada" : "Completa tu perfil primero"}
              </p>
            </div>
            <span style={{ color: "var(--lila)", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
          </div>
        </Link>

        {/* ── CARD APRENDE ── */}
        <Link href="/aprende" style={{ textDecoration: "none" }}>
          <div className="card flex items-center gap-4" style={{ padding: "1.1rem 1.25rem" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, flexShrink: 0,
              background: "rgba(217,119,6,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookOpen size={21} color="var(--amarillo)" strokeWidth={1.7} />
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--texto)", fontSize: "0.95rem" }}>Aprende</p>
              <p style={{ fontSize: "0.78rem", color: "var(--texto-suave)", marginTop: "0.15rem" }}>Porosidad, INCI, método LOC/LCO</p>
            </div>
            <span style={{ color: "var(--lila)", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
          </div>
        </Link>

        {/* Footer nota */}
        <p className="text-xs text-center" style={{ color: "var(--texto-suave)", lineHeight: 1.7, marginTop: "0.5rem" }}>
          Herramienta educativa · No sustituye el consejo de un tricólogo
        </p>
      </main>

      <BottomNav />
    </div>
  );
}
