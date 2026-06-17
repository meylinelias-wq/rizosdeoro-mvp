"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Modo = "elegir" | "barras" | "foto";
type Estado = "idle" | "buscando-barras" | "procesando-ocr" | "listo" | "error";

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

  const [modo, setModo] = useState<Modo>("elegir");
  const [estado, setEstado] = useState<Estado>("idle");
  const [textoExtraido, setTextoExtraido] = useState("");
  const [imagenUrl, setImagenUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [productoEncontrado, setProductoEncontrado] = useState<ProductoOBF | null>(null);
  const [mensajeBarras, setMensajeBarras] = useState("Apunta la camara al codigo de barras");
  const [mensajeOCR, setMensajeOCR] = useState("Analizando imagen...");

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const iniciarEscanerBarras = useCallback(async () => {
    setModo("barras");
    setEstado("buscando-barras");
    setError("");
    setMensajeBarras("Iniciando camara...");

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
      }

      setMensajeBarras("Apunta al codigo de barras del producto");

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
          // sin codigo todavia
        }
      }, 500);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setError("No se pudo iniciar la camara: " + msg);
      setEstado("error");
      setModo("elegir");
    }
  }, []);

  function detenerCamara() {
    if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); scanIntervalRef.current = null; }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function buscarEnOpenBeautyFacts(codigo: string) {
    setMensajeBarras("Codigo " + codigo + " detectado, buscando producto...");
    setEstado("buscando-barras");
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
        setModo("barras");
      } else {
        setError("Producto (" + codigo + ") no esta en la base de datos global. Puedes fotografiar la etiqueta manualmente.");
        setEstado("error");
        setModo("elegir");
      }
    } catch {
      setError("Error de conexion al buscar el producto. Comprueba tu internet.");
      setEstado("error");
      setModo("elegir");
    }
  }

  // ── Comprimir imagen antes de enviar ─────────────────────────────────────
  // Devuelve SOLO los bytes en base64 (sin prefijo "data:image/jpeg;base64,"),
  // que es el formato que exige Google Vision.
  const comprimirImagen = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      console.log(`[Escaner] Archivo: ${file.name} | tipo: ${file.type} | ${Math.round(file.size / 1024)} KB`);
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
        const base64 = dataUrl.split(",")[1];
        console.log(`[Escaner] Imagen comprimida: ${width}x${height} | base64: ${base64.length} chars`);
        resolve(base64);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo leer la imagen. Si es una foto de iPhone (HEIC), haz una captura de pantalla de la foto y sube la captura."));
      };
      img.src = url;
    });
  };

  // ── OCR con Google Vision (via API propia) ────────────────────────────────
  const procesarImagen = useCallback(async (file: File) => {
    setEstado("procesando-ocr");
    setError("");
    setImagenUrl(URL.createObjectURL(file));
    setMensajeOCR("Preparando imagen...");

    try {
      // Comprimir imagen para no superar límite de Vercel (4.5MB)
      const base64 = await comprimirImagen(file);
      setMensajeOCR("Leyendo etiqueta...");

      console.log("[Escaner] Enviando imagen a /api/ocr-ingredientes...");
      const res = await fetch("/api/ocr-ingredientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagenBase64: base64 }),
      });

      const data = await res.json();
      console.log(`[Escaner] Respuesta OCR: HTTP ${res.status} | motor: ${data.motor ?? "-"} | texto: ${data.texto?.length ?? 0} chars`);

      if (!res.ok) {
        throw new Error(data.error || "No se pudo leer la imagen.");
      }

      if (!data.texto || data.texto.length < 10) {
        throw new Error("No se detectó texto. Intenta con una foto más nítida y bien iluminada.");
      }

      setTextoExtraido(data.texto);
      setEstado("listo");
    } catch (e) {
      console.error("[Escaner] Error en el flujo OCR:", e);
      setError(e instanceof Error ? e.message : "Error al leer la imagen.");
      setEstado("error");
    }
  }, []);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      setModo("foto");
      procesarImagen(file);
    }
  }

  function usarTexto() {
    sessionStorage.setItem("rizos_escaner_texto", textoExtraido);
    router.push("/analizador?desde=escaner");
  }

  function reiniciar() {
    detenerCamara();
    setModo("elegir"); setEstado("idle");
    setTextoExtraido(""); setImagenUrl(null);
    setError(""); setProductoEncontrado(null);
  }

  const estaListo = estado === "listo";
  const hayError = estado === "error";

  return (
    <div className="min-h-screen pb-nav" style={{ background: "var(--bg)" }}>
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => { reiniciar(); router.back(); }}
          className="text-sm flex items-center gap-2 mb-8"
          style={{ color: "var(--texto-suave)" }}
        >
          Atras
        </button>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--texto)" }}>
          {modo === "barras" ? "Codigo" : "Fotografia"}
        </h1>
        <h1 className="titulo-grande text-5xl" style={{ color: "var(--oro)" }}>
          {modo === "barras" ? "de barras" : "la etiqueta"}
        </h1>
        <div className="linea-oro mt-3" />
      </div>

      <div className="px-6 pb-12 flex flex-col gap-6">

        {modo === "elegir" && !estaListo && (
          <>
            <div className="card" style={{ padding: "1.25rem" }}>
              <p className="label-oro mb-1">Opcion 1 — Mas rapida</p>
              <p className="text-sm mb-4" style={{ color: "var(--texto-suave)" }}>
                Escanea el codigo de barras. La app busca los ingredientes automaticamente
                en la base de datos global de productos de belleza.
              </p>
              <button onClick={iniciarEscanerBarras} className="btn-primary w-full">
                Escanear codigo de barras
              </button>
            </div>

            <div className="card" style={{ padding: "1.25rem" }}>
              <p className="label-oro mb-1">Opcion 2 — Fotografiar etiqueta</p>
              <p className="text-sm mb-4" style={{ color: "var(--texto-suave)" }}>
                Fotografia la lista de ingredientes del envase. Google Vision lee el texto automaticamente.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    fileInputRef.current?.setAttribute("capture", "environment");
                    fileInputRef.current?.click();
                  }}
                  className="btn-outline"
                >
                  📷 Abrir camara
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.removeAttribute("capture");
                    fileInputRef.current?.click();
                  }}
                  className="btn-outline"
                >
                  🖼️ Elegir de la galeria
                </button>
              </div>
            </div>

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </>
        )}

        {/* Error */}
        {hayError && (
          <div className="p-4 text-sm" style={{ background: "var(--rojo-bg)", color: "var(--rojo)", border: "1px solid var(--rojo-borde)", borderRadius: "6px" }}>
            <p className="label mb-1" style={{ color: "var(--rojo)" }}>No se pudo leer</p>
            <p>{error}</p>
            <button onClick={reiniciar} className="btn-outline mt-3 w-full">Intentar de nuevo</button>
          </div>
        )}

        {/* Escaner de barras */}
        {modo === "barras" && !estaListo && (
          <div className="card text-center py-6">
            <div className="relative mx-auto mb-4" style={{ maxWidth: 320, borderRadius: 8, overflow: "hidden", background: "#000" }}>
              <video ref={videoRef} className="w-full" style={{ maxHeight: 240, objectFit: "cover" }} playsInline muted />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: "70%", height: "30%", border: "2px solid var(--oro)", borderRadius: 6, boxShadow: "0 0 0 9999px rgba(0,0,0,0.35)" }} />
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <p className="label mb-2" style={{ color: "var(--oro)" }}>{mensajeBarras}</p>
            <p className="text-xs mb-4" style={{ color: "var(--texto-suave)" }}>Centra el codigo dentro del recuadro dorado</p>
            <button onClick={reiniciar} className="btn-outline">Cancelar</button>
          </div>
        )}

        {/* Procesando OCR */}
        {estado === "procesando-ocr" && (
          <div className="card text-center py-10">
            {imagenUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenUrl} alt="" className="mx-auto mb-6 rounded max-h-40 object-contain" />
            )}
            <div className="flex justify-center gap-2 mb-4">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "var(--oro)",
                  display: "inline-block",
                  animation: "pulseDot 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
            <p className="label mb-2" style={{ color: "var(--oro)" }}>{mensajeOCR}</p>
            <p className="text-xs" style={{ color: "var(--texto-suave)" }}>Estamos leyendo la etiqueta, un momento...</p>
          </div>
        )}

        {/* Resultado listo */}
        {estaListo && (
          <div className="flex flex-col gap-4">
            {productoEncontrado && (
              <div className="card" style={{ padding: "1rem", background: "var(--verde-bg)", border: "1px solid var(--verde-borde)" }}>
                <p className="label-oro mb-1" style={{ color: "var(--verde)" }}>Producto encontrado</p>
                <p className="font-semibold" style={{ color: "var(--texto)" }}>{productoEncontrado.nombre}</p>
                {productoEncontrado.marca && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--texto-suave)" }}>{productoEncontrado.marca}</p>
                )}
              </div>
            )}

            {imagenUrl && !productoEncontrado && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenUrl} alt="" className="rounded max-h-36 object-contain mx-auto" />
            )}

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="label">Texto detectado</p>
                <span className="text-xs font-bold px-2 py-1" style={{ background: "var(--verde)", color: "var(--bg)", borderRadius: "3px" }}>
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
                Revisa que los ingredientes esten correctos. Puedes editar si hay errores.
              </p>
            </div>

            <button onClick={usarTexto} className="btn-primary">Analizar estos ingredientes →</button>
            <button onClick={reiniciar} className="btn-outline">Escanear otro producto</button>
          </div>
        )}

        <div className="divisor" />
        <p className="text-xs text-center" style={{ color: "var(--texto-suave)", lineHeight: 1.7 }}>
          El codigo de barras consulta Open Beauty Facts.<br />
          La foto usa Google Vision para leer la etiqueta.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
