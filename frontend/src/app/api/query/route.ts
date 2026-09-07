import { NextRequest, NextResponse } from "next/server";

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

    const payload = {
      question: body.question.trim(),
      top_k: typeof body.top_k === "number" ? body.top_k : 3,
    };

    // 90 second timeout for GPU/Ollama inference
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

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

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error(`FastAPI returned status ${backendResponse.status}: ${errorText}`);
        return NextResponse.json(
          {
            error: `Backend service responded with status ${backendResponse.status}.`,
            details: errorText,
          },
          { status: backendResponse.status }
        );
      }

      const data = await backendResponse.json();
      return NextResponse.json(data);
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);

      const err = fetchError as Error;
      if (err.name === "AbortError") {
        return NextResponse.json(
          {
            error: "The request timed out. The local AI engine is taking longer than expected. Please try again.",
          },
          { status: 504 }
        );
      }

      console.error("Failed to connect to FastAPI backend:", err.message);
      return NextResponse.json(
        {
          error: "Could not connect to the IP-SAKTI Sahayak backend service. Please verify that the FastAPI backend is running at " + BACKEND_URL + ".",
          details: err.message,
        },
        { status: 503 }
      );
    }
  } catch (parseError: unknown) {
    const err = parseError as Error;
    return NextResponse.json(
      { error: "Invalid request format.", details: err.message },
      { status: 400 }
    );
  }
}
