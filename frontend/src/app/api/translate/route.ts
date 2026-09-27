import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, target_language, source_language } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required for translation." },
        { status: 400 }
      );
    }

    const tgt = target_language || "hi";
    const src = source_language || "en";

    if (tgt === src) {
      return NextResponse.json({
        translated_text: text,
        status: "bypassed",
        target_language: tgt,
      });
    }

    // Call FastAPI backend translation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          target_language: tgt,
          source_language: src,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendRes.ok) {
        const data = await backendRes.json();
        return NextResponse.json(data);
      }

      console.warn(`FastAPI /api/translate returned status ${backendRes.status}`);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const error = err as Error;
      console.warn("Backend translation request failed:", error.message);
    }

    // Graceful fallback if backend translator is offline or fails
    return NextResponse.json({
      translated_text: text,
      status: "failed",
      target_language: tgt,
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
