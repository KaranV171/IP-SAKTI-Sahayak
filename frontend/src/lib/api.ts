import { QueryRequest, QueryResponse } from "@/types/api";

export async function askSahayak(question: string, top_k: number = 3): Promise<QueryResponse> {
  const payload: QueryRequest = {
    question: question.trim(),
    top_k,
  };

  const response = await fetch("/api/query", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();

  if (!response.ok) {
    const errorMsg = responseData.error || responseData.details || `Error ${response.status}: Failed to retrieve guidance.`;
    throw new Error(errorMsg);
  }

  return responseData as QueryResponse;
}

export async function getBackendStatus(): Promise<{ isHealthy: boolean; database?: string; error?: string }> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    if (!res.ok) return { isHealthy: false, error: "Health check failed" };
    return await res.json();
  } catch (err: unknown) {
    const error = err as Error;
    return { isHealthy: false, error: error.message };
  }
}
