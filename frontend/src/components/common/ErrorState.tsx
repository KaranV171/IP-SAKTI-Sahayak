import React from "react";
import { AlertTriangle, RotateCcw, HelpCircle, Terminal } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="w-full rounded-2xl border border-rose-200 bg-rose-50/60 p-6 sm:p-8 dark:border-rose-900/60 dark:bg-rose-950/20 text-center animate-in fade-in duration-200">
      
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-1.5">
        Unable to Complete Guidance Request
      </h3>

      <p className="max-w-lg mx-auto text-xs text-rose-800 dark:text-rose-300 leading-relaxed mb-4">
        {error || "An unexpected error occurred while communicating with the RAG pipeline."}
      </p>

      <div className="inline-flex items-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Inquiry</span>
        </button>
      </div>

      <div className="mt-5 pt-4 border-t border-rose-200/60 dark:border-rose-900/40 text-[11px] text-slate-500 max-w-md mx-auto text-left flex items-start gap-2">
        <HelpCircle className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span>
          If this persists, ensure that the FastAPI backend service is running locally on port 8000 and the PostgreSQL database container is active.
        </span>
      </div>

    </div>
  );
};
