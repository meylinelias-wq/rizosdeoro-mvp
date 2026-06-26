"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Estado = "escaneando" | "procesando-ocr" | "listo" | "error";

interface ProductoOBF {
  nombre: string;
  marca: string;
  ingredientesTexto: string;
}

export default function Escaner() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const zxingRef = useRef<unknown>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [estado, setEstado] = useState<Estado>("escaneando");
  const [textoExtraido, setTextoExtraido] = useState("");
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [productoEncontrado, setProductoEncontrado] = useState<ProductoOBF | null>(null);
  const [cameraLista, setCameraLista] = useState(false);

  // Arrancar escáner de barras automáticamente al montar
  useEffect(() => {
    iniciarEscanerBarras();
    return () => {
      detenerCamara();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function detenerCamara() {
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  const iniciarEscanerBarras = useCallback(async () => {
    setCameraLista(false);
    setError("");
    setEstado("escaneando");

    try {
      const ZXing = await import("@zxing/browser" as never) as {
        BrowserMultiFormatReader: new () => {
          decodeFromCanvas: (c: HTMLCanvasElement) => { getText: () => string };
        };
      };
      zxingRef.current = new ZXing.BrowserMultiFormatReader();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraLista(true);
      }

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current || !zxingRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        try {
          const reader = zxingRef.current as {
            decodeFromCanvas: (c: HTMLCanvasElement) => { getText: () => string };
          };
          const result = reader.decodeFromCanvas(canvas);
          const codigo = result.getText();
          if (codigo) {
            detenerCamara();
            await buscarEnOpenBeautyFacts(codigo);
          }
        } catch {
          // sin código todavía
        }
      }, 500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError("No se pudo acceder a la cámara: " + msg);
      setEstado("error");
    }
  }, []);

  async function buscarEnOpenBeautyFacts(codigo: string) {
    setEstado("procesando-ocr");
    try {
      const res = await fetch("https://world.openbeautyfacts.org/api/v0/product/" + codigo + ".json");
      const data = await res.json();
      if (data.status === 1 && data.product?.ingredients_text) {
        const producto: ProductoOBF = {
          nombre: data.product.product_name || "Producto sin nombre",
          marca: data.product.brands || "",
          ingredientesTexto: data.product.ingredients_text,
        };
        setProductoEncontrado(producto);
        setTextoExtraido(producto.ingredientesTexto);
        setEstado("listo");
      } else {
        setError("Producto (" + codigo + ") no está en la base de datos. Fotografía la etiqueta.");
        setEstado("error");
        iniciarEscanerBarras();
      }
    } catch {
      setError("Error de conexión. Comprueba tu internet.");
      setEstado("error");
      iniciarEscanerBarras();
    }
  }

  const comprimirImagen = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) { URL.revokeObjectURL(url); reject(new Error("Canvas no disponible")); return; }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen. Si es HEIC, sube una captura de pantalla."));
      };
      img.src = url;
    });
  };

  const procesarImagen = useCallback(async (file: File) => {
    detenerCamara();
    setEstado("procesando-ocr");
    setError("");
    setImagenUrl(URL.createObjectURL(file));

    try {
      const base64 = await comprimirImagen(file);
      const res = await fetch("/api/ocr-ingredientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagenBase64: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo leer la imagen.");
      if (!data.texto || data.texto.length < 10) throw new Error("No se detectó texto. Intenta con mejor iluminación.");

      setTextoExtraido(data.texto);
      setEstado("listo");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al leer la imagen.");
      setEstado("error");
      iniciarEscanerBarras();
    }
  }, [iniciarEscanerBarras]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) procesarImagen(file);
  }

  function usarTexto() {
    sessionStorage.setItem("rizos_escaner_texto", textoExtraido);
    router.push("/analizador?desde=escaner");
  }

  function reiniciar() {
    detenerCamara();
    setTextoExtraido("");
    setImagenUrl(null);
    setError("");
    setProductoEncontrado(null);
    iniciarEscanerBarras();
  }

  const estaListo = estado === "listo";
  const estaProcesando = estado === "procesando-ocr";
  const estaEscaneando = estado === "escaneando";

  return (
    <div className="min-h-screen pb-nav" style={{ background: "#000", color: "#fff" }}>

      {/* Vista de cámara — ocupa toda la pantalla hasta los botones */}
      {(estaEscaneando || !estaListo) && !estaProcesando && (
        <div className="relative" style={{ height: "calc(100dvh - 80px)" }}>

          {/* Botón atrás */}
          <button
            onClick={() => { detenerCamara(); router.back(); }}
            className="absolute top-12 left-5 z-20 flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,0,0,0.5)", color: "#fff", backdropFilter: "blur(6px)" }}
          >
            ← Atrás
          </button>

          {/* Video */}
          <video
            ref={videoRef}
            className="w-full h-full"
            style={{ objectFit: "cover", opacity: cameraLista ? 1 : 0, transition: "opacity 0.3s" }}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay oscuro con recuadro de escaneo */}
          {estaEscaneando && cameraLista && (
            <div className="absolute inset-0 pointer-events-none" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* sombra alrededor del recuadro */}
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.45)",
                maskImage: "radial-gradient(ellipse 60% 25% at 50% 50%, transparent 100%, black 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 60% 25% at 50% 50%, transparent 100%, black 100%)",
              }} />
              {/* recuadro dorado */}
              <div style={{
                width: "72%", height: "22%", minHeight: 80, maxHeight: 160,
                border: "2.5px solid var(--oro)",
                borderRadius: 12,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                position: "relative",
              }}>
                {/* esquinas decorativas */}
                {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
                  <span key={i} className={`absolute ${pos}`} style={{
                    width: 18, height: 18,
                    borderTop: i < 2 ? "3px solid var(--oro)" : "none",
                    borderBottom: i >= 2 ? "3px solid var(--oro)" : "none",
                    borderLeft: i % 2 === 0 ? "3px solid var(--oro)" : "none",
                    borderRight: i % 2 === 1 ? "3px solid var(--oro)" : "none",
                    borderRadius: i === 0 ? "4px 0 0 0" : i === 1 ? "0 4px 0 0" : i === 2 ? "0 0 0 4px" : "0 0 4px 0",
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Mensaje de estado bajo el recuadro */}
          {estaEscaneando && cameraLista && (
            <div className="absolute bottom-28 left-0 right-0 text-center px-6">
              <p className="text-sm font-medium" style={{ color: "var(--oro)" }}>
                Centra el código de barras en el recuadro
              </p>
            </div>
          )}

          {/* Spinner si la cámara aún no carga */}
          {estaEscaneando && !cameraLista && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "var(--oro)", display: "inline-block",
                      animation: "pulseDot 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>Iniciando cámara...</p>
              </div>
            </div>
          )}

          {/* Error flotante */}
          {estado === "error" && error && (
            <div className="absolute top-24 left-4 right-4 z-20 p-3 rounded-xl text-sm text-center"
              style={{ background: "rgba(220,38,38,0.85)", color: "#fff", backdropFilter: "blur(6px)" }}>
              {error}
            </div>
          )}

          {/* Barra de acciones inferior — estilo Yuka */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around px-6 py-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>

            {/* Galería */}
            <button
              onClick={() => { fileInputRef.current?.removeAttribute("capture"); fileInputRef.current?.click(); }}
              className="flex flex-col items-center gap-1"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              <span style={{ fontSize: 26 }}>🖼️</span>
              <span className="text-xs">Galería</span>
            </button>

            {/* Botón central grande — Cámara para OCR */}
            <button
              onClick={() => { fileInputRef.current?.setAttribute("capture", "environment"); fileInputRef.current?.click(); }}
              style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "var(--oro)",
                border: "3px solid #fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
                boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              📷
            </button>

            {/* Placeholder para equilibrar layout */}
            <div style={{ width: 48 }} />
          </div>
        </div>
      )}

      {/* Procesando OCR */}
      {estaProcesando && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6">
          {imagenUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imagenUrl} alt="" className="rounded-xl max-h-52 object-contain" />
          )}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 10, height: 10, borderRadius: "50%",
                background: "var(--oro)", display: "inline-block",
                animation: "pulseDot 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>
          <p className="text-base font-medium" style={{ color: "var(--oro)" }}>Leyendo etiqueta...</p>
          <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.55)" }}>
            Estamos extrayendo los ingredientes
          </p>
        </div>
      )}

      {/* Resultado listo */}
      {estaListo && (
        <div className="flex flex-col min-h-screen" style={{ background: "var(--bg)", color: "var(--texto)" }}>
          <div className="px-6 pt-12 pb-4">
            <button
              onClick={reiniciar}
              className="text-sm flex items-center gap-2 mb-6"
              style={{ color: "var(--texto-suave)" }}
            >
              ← Escanear otro
            </button>

            {productoEncontrado && (
              <div className="p-4 rounded-xl mb-4" style={{ background: "var(--verde-bg)", border: "1px solid var(--verde-borde)" }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--verde)" }}>
                  Producto encontrado ✓
                </p>
                <p className="font-semibold text-base" style={{ color: "var(--texto)" }}>{productoEncontrado.nombre}</p>
                {productoEncontrado.marca && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--texto-suave)" }}>{productoEncontrado.marca}</p>
                )}
              </div>
            )}

            {imagenUrl && !productoEncontrado && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenUrl} alt="" className="rounded-xl max-h-36 object-contain mx-auto mb-4" />
            )}

            <div className="card mb-4">
              <div className="flex items-center justify-between mb-3">
                <p className="label">Ingredientes detectados</p>
                <span className="text-xs font-bold px-2 py-1" style={{ background: "var(--verde)", color: "var(--bg)", borderRadius: 4 }}>
                  Listo
                </span>
              </div>
              <textarea
                value={textoExtraido}
                onChange={(e) => setTextoExtraido(e.target.value)}
                rows={6}
                style={{ resize: "vertical", fontSize: "0.8rem" }}
              />
              <p className="text-xs mt-2" style={{ color: "var(--texto-suave)" }}>
                Revisa que los ingredientes estén correctos. Puedes editar si hay errores.
              </p>
            </div>

            <button onClick={usarTexto} className="btn-primary w-full mb-3">
              Analizar estos ingredientes →
            </button>
            <button onClick={reiniciar} className="btn-outline w-full">
              Escanear otro producto
            </button>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <BottomNav />
    </div>
  );
}
