import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSimilarity(similarity: number): string {
  if (typeof similarity !== "number" || isNaN(similarity)) {
    return "N/A";
  }
  return `${(similarity * 100).toFixed(1)}% match`;
}

export function getConfidenceDetails(confidence: string) {
  const norm = (confidence || "").trim().toLowerCase();
  if (norm === "high") {
    return {
      level: "High",
      label: "High Confidence",
      colorClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      dotClass: "bg-emerald-500",
      description: "Strong evidence match from authoritative legal and regulatory sources."
    };
  }
  if (norm === "medium") {
    return {
      level: "Medium",
      label: "Medium Confidence",
      colorClass: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      dotClass: "bg-amber-500",
      description: "Moderate evidence match. Additional corroboration may be advisable."
    };
  }
  return {
    level: "Low",
    label: "Low Confidence",
    colorClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    dotClass: "bg-rose-500",
    description: "Limited evidence match in the knowledge base. Please refine your query."
  };
}
