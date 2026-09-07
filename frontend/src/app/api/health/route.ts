import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const isLocalhostBackend = BACKEND_URL.includes("127.0.0.1") || BACKEND_URL.includes("localhost");
    const isVercelProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (isVercelProd && isLocalhostBackend) {
      return NextResponse.json({
        isHealthy: true,
        database: "Statutory Corpus (35 Gazettes & Acts)",
        mode: "standalone_corpus",
        backendUrl: BACKEND_URL,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${BACKEND_URL}/health/database`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        isHealthy: true,
        database: data.database || "PostgreSQL (pgvector)",
        postgresql: data.postgresql || "",
        backendUrl: BACKEND_URL,
        mode: "live_rag",
      });
    }

    return NextResponse.json({
      isHealthy: true,
      database: "Statutory Corpus (35 Gazettes & Acts)",
      mode: "standalone_corpus",
      backendUrl: BACKEND_URL,
    });
  } catch {
    return NextResponse.json({
      isHealthy: true,
      database: "Statutory Corpus (35 Gazettes & Acts)",
      mode: "standalone_corpus",
      backendUrl: BACKEND_URL,
    });
  }
}
