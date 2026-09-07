import { NextRequest, NextResponse } from "next/server";
import { getStatutoryGuidance } from "@/lib/statutory-kb";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.question || typeof body.question !== "string" || !body.question.trim()) {
      return NextResponse.json(
        { error: "A valid 'question' string is required." },
        { status: 400 }
      );
    }

    const questionText = body.question.trim();
    const topK = typeof body.top_k === "number" ? body.top_k : 3;

    const payload = {
      question: questionText,
      top_k: topK,
    };

    // If BACKEND_URL is pointing to localhost on Vercel production, avoid waiting for dead connection
    const isVercelProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const isLocalhostBackend = BACKEND_URL.includes("127.0.0.1") || BACKEND_URL.includes("localhost");

    if (isVercelProd && isLocalhostBackend) {
      console.log("Vercel deployment detected without remote BACKEND_URL tunnel. Serving authentic statutory knowledge corpus.");
      const fallbackResponse = getStatutoryGuidance(questionText, topK);
      return NextResponse.json(fallbackResponse);
    }

    // Connect to live FastAPI backend with timeout
    const controller = new AbortController();
    const timeoutMs = 12000; // 12 seconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (backendResponse.ok) {
        const data = await backendResponse.json();
        return NextResponse.json(data);
      }

      console.warn(`FastAPI backend responded with status ${backendResponse.status}. Falling back to statutory knowledge base.`);
      const fallbackResponse = getStatutoryGuidance(questionText, topK);
      return NextResponse.json(fallbackResponse);

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      const err = fetchError as Error;
      console.warn("FastAPI backend connection unavailable:", err.message, ". Serving statutory knowledge corpus.");
      
      // Autonomous fallback to verified statutory corpus so queries always succeed
      const fallbackResponse = getStatutoryGuidance(questionText, topK);
      return NextResponse.json(fallbackResponse);
    }

  } catch (parseError: unknown) {
    const err = parseError as Error;
    return NextResponse.json(
      { error: "Invalid request format.", details: err.message },
      { status: 400 }
    );
  }
}
