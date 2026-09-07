import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

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
      });
    }

    return NextResponse.json({
      isHealthy: false,
      error: `Backend responded with status ${res.status}`,
      backendUrl: BACKEND_URL,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({
      isHealthy: false,
      error: err.message,
      backendUrl: BACKEND_URL,
    });
  }
}
