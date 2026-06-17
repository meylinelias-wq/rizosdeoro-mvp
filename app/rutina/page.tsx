"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PerfilCapilar } from "@/types/perfil";
import BottomNav from "@/components/ui/BottomNav";

interface PasoRutina {
  numero: number;
  nombre: string;
  descripcion: string;
  productos: string;
  frecuencia: string;
  tip?: string;
}

function generarRutina(perfil: PerfilCapilar): PasoRutina[] {
  const { tipoRizo, porosidad, estado, objetivos } = perfil;
  const esMuyRizado = ["3C", "4A", "4B", "4C"].includes(tipoRizo);
  const esSeco = estado === "seco" || estado === "dañado";
  const esDaniado = estado === "dañado";
  const quiereDefinicion = objetivos.includes("definición");
  const tieneAltaPorosidad = porosidad === "alta";
  const tieneBajaPorosidad = porosidad === "baja";

  const rutina: PasoRutina[] = [];

  rutina.push({
    numero: 1, nombre: "Limpieza",
    descripcion: tieneBajaPorosidad
      ? "Usa agua tibia-caliente para abrir la cutícula. Masajea con movimientos circulares suaves en el cuero cabelludo."
      : esSeco ? "Considera el co-wash (lavado con acondicionador) para no agravar la pérdida de hidratación."
      : "Lava con agua tibia. Masajea solo el cuero cabelludo y deja que el champú baje por los largos.",
    productos: esSeco ? "Champú sin sulfatos o co-wash hidratante" : "Champú low-poo suave o sin sulfatos",
    frecuencia: esMuyRizado ? "1–2 veces / semana" : "2–3 veces / semana",
    tip: "Aplica siempre con el cabello empapado.",
  });

  rutina.push({
    numero: 2, nombre: "Acondicionador",
    descripcion: tieneAltaPorosidad
      ? "Tu cabello absorbe rápido pero pierde la hidratación igual de rápido. Deja actuar mínimo 5 minutos."
      : "Aplica desde medios a puntas, evitando la raíz.",
    productos: esSeco ? "Acondicionador hidratante con glicerina, aloe vera o pantenol" : "Acondicionador nutritivo con mantecas o aceites vegetales",
    frecuencia: "Cada lavado",
  });

  if (esSeco) {
    rutina.push({
      numero: 3, nombre: "Mascarilla",
      descripcion: "Un extra de nutrición semanal que marcará una diferencia visible en textura y brillo.",
      productos: esDaniado ? "Mascarilla equilibrada proteína + hidratación" : "Mascarilla hidratante intensiva con aceites o mantecas",
      frecuencia: "1 vez / semana",
      tip: tieneAltaPorosidad ? "Aplica con gorro de ducha 15–20 min." : "Usa calor suave para abrir la cutícula.",
    });
  }

  rutina.push({
    numero: esSeco ? 4 : 3, nombre: "Hidratante sin aclarado",
    descripcion: quiereDefinicion
      ? "La crema es la base de los rizos definidos. Aplica por secciones para cobertura uniforme."
      : "Hidrata sección a sección con el cabello muy húmedo.",
    productos: tieneAltaPorosidad ? "Leave-in rica en humectantes — glicerina, aloe, miel de agave" : "Leave-in ligera o crema en leche",
    frecuencia: "Cada lavado",
    tip: "Método LOC/LCO: Liquid → Oil → Cream sella la hidratación en capas.",
  });

  if (quiereDefinicion || esMuyRizado) {
    rutina.push({
      numero: esSeco ? 5 : 4, nombre: "Definición",
      descripcion: "El gel o mousse define el rizo y lo protege. Aplica con scrunching, escurriendo hacia arriba.",
      productos: tieneBajaPorosidad ? "Gel ligero sin siliconas o mousse volumizadora" : "Gel de fijación fuerte o crema definidora",
      frecuencia: "Cada lavado",
      tip: "Aplica siempre sobre cabello empapado. El gel creará un cast que desaparece al scrunchar en seco.",
    });
  }

  return rutina;
}

export default function Rutina() {
  const [perfil, setPerfil] = useState<PerfilCapilar | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rizos_perfil");
    if (saved) setPerfil(JSON.parse(saved));
  }, []);

  if (!perfil) {
    return (
      <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
        <div className="px-6 pt-12 pb-8">
          <Link href="/" className="text-sm flex items-center gap-2 mb-8" style={{ color: "var(--texto-suave)" }}>← Inicio</Link>
          <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>Mi Rutina</h1>
          <div className="linea-oro mt-3" />
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center gap-6">
          <p className="text-sm" style={{ color: "var(--texto-suave)", lineHeight: 1.7, maxWidth: "260px" }}>
            Tu rutina se genera en base a tu perfil capilar. Primero cuéntanos sobre tu cabello.
          </p>
          <Link href="/onboarding" className="btn-primary" style={{ maxWidth: "240px" }}>Crear mi perfil</Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const rutina = generarRutina(perfil);

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      <div className="px-6 pt-12 pb-8">
        <Link href="/" className="text-sm flex items-center gap-2 mb-8" style={{ color: "var(--texto-suave)" }}>← Inicio</Link>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>Tu Rutina</h1>
        <div className="linea-oro mt-3 mb-4" />
        <p className="text-xs" style={{ color: "var(--texto-suave)" }}>
          Rizo {perfil.tipoRizo} · Porosidad {perfil.porosidad} · {perfil.objetivos.join(", ")}
        </p>
      </div>

      <div className="px-6 pb-12 flex flex-col gap-6">
        {rutina.map((paso, idx) => (
          <div key={paso.numero}>
            <div className="flex items-start gap-4">
              {/* Número */}
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--oro)", color: "var(--bg)", borderRadius: "4px", fontFamily: "var(--font-bebas)", fontSize: "1rem", letterSpacing: "0.04em" }}>
                {String(paso.numero).padStart(2, "0")}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="titulo-seccion text-xl" style={{ color: "var(--texto)" }}>{paso.nombre}</h3>
                  <span className="text-xs" style={{ color: "var(--texto-suave)" }}>{paso.frecuencia}</span>
                </div>

                <p className="text-sm mb-3" style={{ color: "var(--texto-mid)", lineHeight: 1.7 }}>{paso.descripcion}</p>

                <div className="p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--borde)", borderRadius: "6px" }}>
                  <p className="label-oro mb-1">Busca</p>
                  <p className="text-sm" style={{ color: "var(--texto)" }}>{paso.productos}</p>
                </div>

                {paso.tip && (
                  <div className="tip-box mt-2">
                    <p className="label-oro mb-1">Nota</p>
                    <p className="text-sm" style={{ color: "var(--oro-suave)", lineHeight: 1.6 }}>{paso.tip}</p>
                  </div>
                )}
              </div>
            </div>
            {idx < rutina.length - 1 && <div className="divisor mt-6 ml-13" />}
          </div>
        ))}

        <div className="divisor" />

        <div className="text-center flex flex-col gap-4">
          <h2 className="titulo-seccion text-2xl" style={{ color: "var(--texto)" }}>
            ¿Tienes productos en casa?
          </h2>
          <p className="text-sm" style={{ color: "var(--texto-suave)" }}>
            Analiza sus ingredientes para saber si encajan con tu rutina.
          </p>
          <Link href="/analizador" className="btn-primary">Ir al analizador</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
