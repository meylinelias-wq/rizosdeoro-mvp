import { NextRequest, NextResponse } from "next/server";

const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
// Clave gratuita de demostración de OCR.space — limitada. Para producción,
// crear clave propia en ocr.space y añadir OCR_SPACE_API_KEY en Vercel.
const OCR_SPACE_API_KEY = process.env.OCR_SPACE_API_KEY || "helloworld";

// Google Vision quiere SOLO los bytes en base64, sin el prefijo "data:image/...;base64,"
function limpiarBase64(imagen: string): string {
  return imagen.replace(/^data:image\/[a-z0-9+.-]+;base64,/i, "").replace(/\s/g, "");
}

function limpiarTexto(texto: string): string {
  return texto
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]{2,}/g, " ")
    .trim();
}

interface ResultadoOCR {
  texto: string | null;
  error?: string;
  status?: number;
}

// ── Plan A: Google Cloud Vision ──────────────────────────────────────────────
async function ocrGoogleVision(base64: string): Promise<ResultadoOCR> {
  if (!GOOGLE_VISION_API_KEY) {
    console.error("[OCR] GOOGLE_VISION_API_KEY no está configurada.");
    return { texto: null, error: "sin-clave" };
  }

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64 },
            features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      }),
    }
  );

  const data = await response.json().catch(() => null);
  // Log completo para debug en los logs de Vercel
  console.log(
    `[OCR] Google Vision HTTP ${response.status}:`,
    JSON.stringify(data)?.slice(0, 2000)
  );

  if (!response.ok) {
    // 400 = base64 mal formado o petición inválida; 403 = clave sin permisos/facturación
    if (response.status === 400) {
      console.error("[OCR] Vision 400: la imagen base64 es inválida o la petición está mal formada.");
      return { texto: null, error: "imagen-invalida", status: 400 };
    }
    if (response.status === 403) {
      console.error("[OCR] Vision 403: clave API inválida, sin permisos o sin facturación habilitada.");
      return { texto: null, error: "clave-invalida", status: 403 };
    }
    return { texto: null, error: `http-${response.status}`, status: response.status };
  }

  if (data?.responses?.[0]?.error) {
    console.error("[OCR] Google Vision devolvio error:", JSON.stringify(data.responses[0].error));
    return { texto: null, error: "vision-error" };
  }

  const texto: string =
    data?.responses?.[0]?.fullTextAnnotation?.text ||
    data?.responses?.[0]?.textAnnotations?.[0]?.description ||
    "";

  return { texto: texto.trim() || null };
}

// Plan B: OCR.space (fallback si Google Vision falla)
async function ocrSpace(base64: string): Promise<ResultadoOCR> {
  try {
    const form = new URLSearchParams();
    form.set("base64Image", `data:image/jpeg;base64,${base64}`);
    form.set("language", "spa");
    form.set("OCREngine", "2");
    form.set("scale", "true");

    const response = await fetch("https://api.ocr.space/parse/image", {
      method: "POST",
      headers: {
        apikey: OCR_SPACE_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });

    const data = await response.json().catch(() => null);
    console.log(
      `[OCR] OCR.space HTTP ${response.status}:`,
      JSON.stringify(data)?.slice(0, 1000)
    );

    if (!response.ok || !data || data.IsErroredOnProcessing) {
      return { texto: null, error: "ocrspace-error" };
    }

    const texto: string = (data.ParsedResults || [])
      .map((p: { ParsedText?: string }) => p.ParsedText || "")
      .join("\n");

    return { texto: texto.trim() || null };
  } catch (e) {
    console.error("[OCR] OCR.space excepcion:", e);
    return { texto: null, error: "ocrspace-error" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { imagenBase64 } = await req.json();

    if (!imagenBase64) {
      return NextResponse.json(
        { error: "No se recibio ninguna imagen." },
        { status: 400 }
      );
    }

    const base64 = limpiarBase64(String(imagenBase64));
    console.log(`[OCR] Imagen recibida: ${base64.length} chars de base64`);

    const vision = await ocrGoogleVision(base64);
    let texto = vision.texto;
    let motor = "google-vision";

    if (!texto) {
      console.warn(`[OCR] Google Vision fallo (${vision.error}). Probando OCR.space...`);
      const fallback = await ocrSpace(base64);
      texto = fallback.texto;
      motor = "ocr-space";
    }

    if (!texto || texto.length < 10) {
      if (vision.error === "clave-invalida") {
        return NextResponse.json(
          { error: "El servicio de lectura no esta disponible ahora mismo. Intentalo mas tarde o escribe los ingredientes a mano." },
          { status: 502 }
        );
      }
      if (vision.error === "imagen-invalida") {
        return NextResponse.json(
          { error: "La imagen no se pudo procesar. Prueba con otra foto (formato JPG) bien iluminada." },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { error: "No se detecto texto. Intenta con una foto mas nitida y bien iluminada." },
        { status: 422 }
      );
    }

    console.log(`[OCR] Texto extraido con ${motor}: ${texto.length} chars`);
    return NextResponse.json({ texto: limpiarTexto(texto), motor });
  } catch (e) {
    console.error("[OCR] Error inesperado en /api/ocr-ingredientes:", e);
    return NextResponse.json(
      { error: "Error inesperado al procesar la imagen." },
      { status: 500 }
    );
  }
}
