export interface Source {
  source_number: number;
  source_title: string;
  authority: string;
  page_number: number;
  category: string;
  jurisdiction: string;
  source_url: string | null;
  similarity: number;
}

export interface QueryRoute {
  intent: string;
  categories: string[];
  jurisdiction: string;
}

export interface QueryRequest {
  question: string;
  top_k?: number;
}

export interface QueryResponse {
  question_id: number;
  answer_id: number;
  query: string;
  answer: string;
  confidence: "High" | "Medium" | "Low" | string;
  sources: Source[];
  route: QueryRoute;
  disclaimer: string;
}

export interface BackendHealthResponse {
  status: "healthy" | "unhealthy" | string;
  database?: string;
  postgresql?: string;
  error?: string;
}
