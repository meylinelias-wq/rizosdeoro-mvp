"use client";

import { useEffect, useState, useRef } from "react";

interface ScoreRingProps {
  puntuacion: number;
  size?: number;
  animated?: boolean;
  variant?: "ring" | "compact";
}

// Franjas alineadas con el veredicto del análisis: "evitar" llega como máximo
// a 39 y "con precaución" a 84, así el anillo nunca contradice al veredicto
function getColor(p: number) {
  if (p >= 85) return "#16a34a";
  if (p >= 60) return "#d97706";
  if (p >= 40) return "#ea580c";
  return "#dc2626";
}

function getLabel(p: number) {
  if (p >= 85) return "Excelente para tus rizos";
  if (p >= 60) return "Buena opción";
  if (p >= 40) return "Con precaución";
  return "Mejor evitar";
}

function ScoreCompact({ puntuacion }: { puntuacion: number }) {
  const color = getColor(puntuacion);
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.35rem",
      background: `${color}18`,
      border: `1px solid ${color}55`,
      borderRadius: "5px",
      padding: "0.25rem 0.6rem",
      flexShrink: 0,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: color,
        boxShadow: `0 0 5px ${color}80`,
        flexShrink: 0,
        display: "inline-block",
      }} />
      <span style={{
        fontFamily: "var(--font-bebas), Impact, sans-serif",
        fontSize: "1rem",
        lineHeight: 1,
        color,
        letterSpacing: "0.02em",
      }}>
        {puntuacion}
      </span>
    </div>
  );
}

export default function ScoreRing({ puntuacion, size = 140, animated = true, variant = "ring" }: ScoreRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!animated) return;
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedValue(Math.round(eased * puntuacion));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [puntuacion, animated]);

  if (variant === "compact") return <ScoreCompact puntuacion={puntuacion} />;

  const displayed = animated ? animatedValue : puntuacion;
  const stroke = size * 0.08;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getColor(puntuacion);
  const label = getLabel(puntuacion);
  const progress = (displayed / 100) * circumference;
  const center = size / 2;
  const fontSize = size * 0.22;
  const labelSize = size * 0.085;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(83,66,116,0.12)" strokeWidth={stroke} />
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke 0.3s", filter: `drop-shadow(0 0 ${stroke * 0.8}px ${color}60)` }}
        />
        <text x={center} y={center + fontSize * 0.38} textAnchor="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${center}px ${center}px`, fill: color, fontSize: `${fontSize}px`, fontFamily: "var(--font-bebas), Impact, sans-serif", letterSpacing: "0.02em" }}>
          {displayed}
        </text>
        <text x={center} y={center + fontSize * 0.38 + labelSize * 1.3} textAnchor="middle"
          style={{ transform: `rotate(90deg)`, transformOrigin: `${center}px ${center}px`, fill: "rgba(83,66,116,0.45)", fontSize: `${labelSize}px`, fontFamily: "var(--font-inter), system-ui, sans-serif", letterSpacing: "0.06em" }}>
          / 100
        </text>
      </svg>
      <p style={{ color, fontSize: `${labelSize * 1.05}px`, fontFamily: "var(--font-inter), system-ui, sans-serif", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", textAlign: "center" }}>
        {label}
      </p>
    </div>
  );
}
