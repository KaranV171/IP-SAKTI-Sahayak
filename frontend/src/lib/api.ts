import { QueryRequest, QueryResponse, SupportedLanguage } from "@/types/api";

export async function askSahayak(
  question: string,
  top_k: number = 3,
  language: string = "en"
): Promise<QueryResponse> {
  const payload: QueryRequest = {
    question: question.trim(),
    top_k,
    language,
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
    const errorMsg =
      responseData.error ||
      responseData.details ||
      `Error ${response.status}: Failed to retrieve guidance.`;
    throw new Error(errorMsg);
  }

  return responseData as QueryResponse;
}

export async function getBackendStatus(): Promise<{
  isHealthy: boolean;
  database?: string;
  error?: string;
}> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" });
    if (!res.ok) return { isHealthy: false, error: "Health check failed" };
    return await res.json();
  } catch (err: unknown) {
    const error = err as Error;
    return { isHealthy: false, error: error.message };
  }
}

export async function getSupportedLanguages(): Promise<SupportedLanguage[]> {
  try {
    const res = await fetch("/api/languages", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch languages");
    const data = await res.json();
    return data.languages as SupportedLanguage[];
  } catch (err) {
    console.warn("Could not fetch remote languages, using default configuration");
    const { SUPPORTED_LANGUAGES } = await import("@/lib/languages");
    return SUPPORTED_LANGUAGES;
  }
}

export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "en"
): Promise<{
  translated_text: string;
  status: string;
  target_language: string;
}> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      target_language: targetLanguage,
      source_language: sourceLanguage,
    }),
  });

  if (!res.ok) {
    throw new Error(`Translation request failed with status ${res.status}`);
  }

  return await res.json();
}

