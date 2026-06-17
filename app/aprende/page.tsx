"use client";

import Link from "next/link";
import BottomNav from "@/components/ui/BottomNav";

const GUIAS = [
  {
    numero: "01",
    titulo: "La Porosidad Capilar",
    subtitulo: "Cómo absorbe y retiene la hidratación tu cabello",
    secciones: [
      { titulo: "Porosidad Baja", texto: "La cutícula está cerrada. El agua tarda en entrar pero también en salir. Tu cabello puede sentirse liso y brillante pero le cuesta absorber productos. Usa calor suave para ayudar a que penetren." },
      { titulo: "Porosidad Media", texto: "El estado ideal. La cutícula se abre y cierra con facilidad. Absorbe y retiene bien la hidratación. La mayoría de productos funcionan correctamente." },
      { titulo: "Porosidad Alta", texto: "La cutícula está abierta o dañada. Absorbe rápido pero pierde la hidratación igual de rápido. Necesita productos sellantes — aceites, mantecas — y proteínas con moderación." },
      { titulo: "Test del Agua", texto: "Pon un cabello limpio en un vaso de agua. Si flota: porosidad baja. Si queda en el medio: media. Si se hunde: alta." },
    ],
  },
  {
    numero: "02",
    titulo: "Leer una Etiqueta INCI",
    subtitulo: "Los ingredientes se ordenan de mayor a menor concentración",
    secciones: [
      { titulo: "El Orden Importa", texto: "El primer ingrediente es el más abundante. Si es Water/Aqua, es la base del producto. Si es un aceite, es un producto sin agua, muy nutritivo." },
      { titulo: "Los Primeros 5", texto: "Representan el 80–90% del producto. Céntrate en ellos al evaluar si un producto es bueno para tus rizos." },
      { titulo: "Ingredientes a Buscar", texto: "Glicerina, aloe vera, pantenol (humectantes) · Cetearyl alcohol, aceite de argán, manteca de karité (nutritivos) · Behentrimonium chloride (acondicionador suave)." },
      { titulo: "Ingredientes a Evitar", texto: "SLS / SLES (sulfatos agresivos) · Dimethicone, Cyclopentasiloxane (siliconas no solubles) · Alcohol Denat (desecante)." },
    ],
  },
  {
    numero: "03",
    titulo: "Método LOC y LCO",
    subtitulo: "Capas de hidratación que multiplican los resultados",
    secciones: [
      { titulo: "LOC — Liquid · Oil · Cream", texto: "Primero el agua o leave-in líquido, después un aceite ligero para sellar, y finalmente una crema para definir. Ideal para porosidad alta: el aceite sella la humedad antes de que escape." },
      { titulo: "LCO — Liquid · Cream · Oil", texto: "Primero agua, luego crema (entra mejor en la cutícula abierta), y finalmente aceite para sellar. Ideal para porosidad media." },
      { titulo: "Para Porosidad Baja", texto: "El método LOC puede saturar el cabello. Prueba solo LC (Liquid + Cream) con productos ligeros. Los aceites pesados pueden no penetrar bien." },
    ],
  },
];

export default function Aprende() {
  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      <div className="px-6 pt-12 pb-8">
        <Link href="/" className="text-sm flex items-center gap-2 mb-8" style={{ color: "var(--texto-suave)" }}>← Inicio</Link>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>Aprende</h1>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--oro)" }}>sobre tus rizos</h1>
        <div className="linea-oro mt-3" />
      </div>

      <div className="px-6 pb-12 flex flex-col gap-10">
        {GUIAS.map((guia) => (
          <div key={guia.numero}>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="label-oro">{guia.numero}</span>
              <h2 className="titulo-seccion text-2xl" style={{ color: "var(--texto)" }}>{guia.titulo}</h2>
            </div>
            <p className="text-xs mb-5" style={{ color: "var(--texto-suave)" }}>{guia.subtitulo}</p>

            <div className="flex flex-col gap-2">
              {guia.secciones.map((sec, j) => (
                <div key={j} className="p-4"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--borde)", borderLeft: "2px solid var(--oro)", borderRadius: "6px" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--oro)", letterSpacing: "0.04em" }}>
                    {sec.titulo}
                  </p>
                  <p className="text-sm" style={{ color: "var(--texto-mid)", lineHeight: 1.7 }}>{sec.texto}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="divisor" />

        <div className="text-center flex flex-col gap-4">
          <h2 className="titulo-seccion text-2xl" style={{ color: "var(--texto)" }}>¿Lista para aplicarlo?</h2>
          <p className="text-sm" style={{ color: "var(--texto-suave)" }}>Analiza tus productos y crea tu rutina personalizada.</p>
          <Link href="/analizador" className="btn-primary">Analizar mis productos</Link>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
