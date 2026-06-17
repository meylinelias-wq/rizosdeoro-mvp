"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  PerfilCapilar, TipoRizo, Porosidad, EstadoCabello, Objetivo,
} from "@/types/perfil";

const TIPOS_RIZO: { valor: TipoRizo; desc: string; sub: string }[] = [
  { valor: "2A", desc: "Ondas suaves", sub: "Ligeramente ondulado" },
  { valor: "2B", desc: "Ondas marcadas", sub: "Ondas en forma de S" },
  { valor: "2C", desc: "Ondas definidas", sub: "Tendencia a rizo" },
  { valor: "3A", desc: "Rizos grandes", sub: "Espiral holgada" },
  { valor: "3B", desc: "Rizos medianos", sub: "Espiral definida" },
  { valor: "3C", desc: "Rizos apretados", sub: "Espiral compacta" },
  { valor: "4A", desc: "Coils suaves", sub: "Patrón en S apretado" },
  { valor: "4B", desc: "Coils en zigzag", sub: "Patrón angular" },
  { valor: "4C", desc: "Coils muy apretados", sub: "Shrinkage intenso" },
];

const POROSIDADES: { valor: Porosidad; titulo: string; desc: string }[] = [
  { valor: "baja", titulo: "Baja", desc: "El agua resbala, tarda en absorber" },
  { valor: "media", titulo: "Media", desc: "Absorbe y retiene bien" },
  { valor: "alta", titulo: "Alta", desc: "Absorbe rápido, pierde hidratación pronto" },
  { valor: "no sé", titulo: "No lo sé", desc: "Aún no he hecho el test" },
];

const ESTADOS: { valor: EstadoCabello; titulo: string; desc: string }[] = [
  { valor: "saludable", titulo: "Saludable", desc: "Elástico y brillante" },
  { valor: "seco", titulo: "Seco", desc: "Le falta hidratación" },
  { valor: "dañado", titulo: "Dañado", desc: "Quebradizo o con puntas abiertas" },
  { valor: "mixto", titulo: "Mixto", desc: "Raíces grasas, puntas secas" },
];

const OBJETIVOS: { valor: Objetivo; titulo: string }[] = [
  { valor: "hidratación", titulo: "Hidratación" },
  { valor: "definición", titulo: "Definición" },
  { valor: "crecimiento", titulo: "Crecimiento" },
  { valor: "brillo", titulo: "Brillo" },
  { valor: "anti-frizz", titulo: "Anti-frizz" },
];

const TITULOS = ["", "¿Cómo te llamas?", "Tu tipo de rizo", "Tu porosidad", "Estado actual", "Tus objetivos"];

function Opcion({
  activa,
  onClick,
  children,
}: {
  activa: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`opcion${activa ? " opcion-activa" : ""}`}
    >
      {children}
    </button>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const [paso, setPaso] = useState(0);
  const [nombre, setNombre] = useState("");
  const [tipoRizo, setTipoRizo] = useState<TipoRizo | null>(null);
  const [porosidad, setPorosidad] = useState<Porosidad | null>(null);
  const [estado, setEstado] = useState<EstadoCabello | null>(null);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const totalPasos = 5;

  function toggleObjetivo(obj: Objetivo) {
    setObjetivos((prev) =>
      prev.includes(obj) ? prev.filter((o) => o !== obj) : [...prev, obj]
    );
  }

  function guardarPerfil() {
    if (!tipoRizo || !porosidad || !estado) return;
    const perfil: PerfilCapilar = {
      nombre: nombre.trim() || "Rizona",
      tipoRizo, porosidad, estado, objetivos,
      creadoEn: new Date().toISOString(),
    };
    localStorage.setItem("rizos_perfil", JSON.stringify(perfil));
    router.push("/");
  }

  const puedeAvanzar =
    (paso === 1 && nombre.trim().length > 0) ||
    (paso === 2 && tipoRizo !== null) ||
    (paso === 3 && porosidad !== null) ||
    (paso === 4 && estado !== null) ||
    (paso === 5 && objetivos.length > 0);

  /* ── Step 0: pantalla de bienvenida ── */
  if (paso === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center"
        style={{ background: "var(--bg)", animation: "fadeSlideUp 0.4s ease-out both" }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(211,174,55,0.12)",
          border: "1px solid var(--borde-oro)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "2rem",
        }}>
          <Sparkles size={36} color="var(--oro)" />
        </div>
        <h1 className="titulo-grande text-4xl mb-4" style={{ color: "var(--texto)", lineHeight: 1.1 }}>
          Tu rutina personalizada<br />
          <span style={{ color: "var(--oro)" }}>empieza aquí</span>
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--texto-suave)", lineHeight: 1.8, maxWidth: "280px" }}>
          Cuéntanos cómo es tu cabello y crearemos una rutina única para ti. Solo tarda 2 minutos.
        </p>
        <button onClick={() => setPaso(1)} className="btn-primary" style={{ maxWidth: "280px" }}>
          Crear mi perfil
        </button>
        <button onClick={() => router.push("/")}
          className="text-sm mt-4" style={{ color: "var(--texto-suave)", background: "none", border: "none", cursor: "pointer" }}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => paso > 1 ? setPaso(paso - 1) : setPaso(0)}
          className="text-sm mb-8 flex items-center gap-2"
          style={{ color: "var(--texto-suave)" }}
        >
          ← Atrás
        </button>

        {/* Barra progreso */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalPasos }).map((_, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-500"
              style={{
                height: "2px",
                background: i < paso ? "var(--oro)" : "var(--borde)",
              }}
            />
          ))}
        </div>

        <p className="label mb-3">{paso} / {totalPasos}</p>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>
          {TITULOS[paso]}
        </h1>
        <div className="linea-oro mt-3" />
      </div>

      {/* Contenido */}
      <div className="flex-1 px-6 pb-4">
        {paso === 1 && (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              Para personalizar tu experiencia en la app.
            </p>
            <input type="text" placeholder="Tu nombre o apodo" value={nombre}
              onChange={(e) => setNombre(e.target.value)} autoFocus />
          </div>
        )}

        {paso === 2 && (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              El sistema va del 2 (ondas) al 4 (coils). Si no estás segura, elige el que más se acerque.
            </p>
            <div className="flex flex-col gap-2">
              {TIPOS_RIZO.map((t) => (
                <Opcion key={t.valor} activa={tipoRizo === t.valor} onClick={() => setTipoRizo(t.valor)}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{t.valor} — {t.desc}</span>
                    <span className="text-xs opacity-60">{t.sub}</span>
                  </div>
                </Opcion>
              ))}
            </div>
          </div>
        )}

        {paso === 3 && (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              La porosidad indica qué tan bien tu cabello absorbe y retiene la hidratación.
            </p>
            <div className="flex flex-col gap-2">
              {POROSIDADES.map((p) => (
                <Opcion key={p.valor} activa={porosidad === p.valor} onClick={() => setPorosidad(p.valor)}>
                  <p className="font-semibold text-sm">{p.titulo}</p>
                  <p className="text-xs mt-0.5 opacity-70">{p.desc}</p>
                </Opcion>
              ))}
            </div>
          </div>
        )}

        {paso === 4 && (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              Sé honesta contigo misma. Es la clave para una rutina que funcione de verdad.
            </p>
            <div className="flex flex-col gap-2">
              {ESTADOS.map((e) => (
                <Opcion key={e.valor} activa={estado === e.valor} onClick={() => setEstado(e.valor)}>
                  <p className="font-semibold text-sm">{e.titulo}</p>
                  <p className="text-xs mt-0.5 opacity-70">{e.desc}</p>
                </Opcion>
              ))}
            </div>
          </div>
        )}

        {paso === 5 && (
          <div>
            <p className="text-sm mb-6" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
              Selecciona uno o varios. Puedes cambiarlos cuando quieras.
            </p>
            <div className="flex flex-col gap-2">
              {OBJETIVOS.map((o) => (
                <Opcion key={o.valor} activa={objetivos.includes(o.valor)} onClick={() => toggleObjetivo(o.valor)}>
                  <span className="font-semibold text-sm">{o.titulo}</span>
                </Opcion>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Botón */}
      <div className="px-6 pb-10 pt-4">
        <div className="divisor mb-5" />
        {paso < totalPasos ? (
          <button onClick={() => setPaso(paso + 1)} disabled={!puedeAvanzar}
            className="btn-primary" style={{ opacity: puedeAvanzar ? 1 : 0.3 }}>
            Continuar
          </button>
        ) : (
          <button onClick={guardarPerfil} disabled={objetivos.length === 0}
            className="btn-primary" style={{ opacity: objetivos.length > 0 ? 1 : 0.3 }}>
            Crear mi perfil
          </button>
        )}
      </div>
    </div>
  );
}
