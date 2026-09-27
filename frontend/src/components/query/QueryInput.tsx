"use client";

import React, { useRef, useEffect } from "react";

interface QueryInputProps {
  question: string;
  setQuestion: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
  placeholder?: string;
  submitLabel?: string;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  onClear,
  placeholder,
  submitLabel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" && (e.ctrlKey || e.metaKey)) || (e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      if (!isLoading && question.trim().length > 0) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sm:p-6 border border-[#e2e8df] transition-all duration-200">
      
      {/* Console Top Header */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#e2e8df] mb-3">
        <div className="flex items-center gap-2 text-[#4b5563]">
          <span className="material-symbols-outlined text-[1.15rem] text-[#0d3826]">search</span>
          <span className="font-sans text-xs uppercase tracking-wider text-[#0f1f17] font-semibold">
            Ask Sahayak — IPR &amp; Regulatory Inquirer
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#6b7280]">
          <span className="font-mono text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
            5,842 Statutory Chunks
          </span>
          {question.trim().length > 0 && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="font-sans text-xs text-[#6b7280] hover:text-[#0f1f17] transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Query Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={3}
          aria-label="Ask IP-SAKTI Sahayak a question on IPR or Ayurveda regulations"
          placeholder={placeholder || "Ask any question about Ayurvedic patents, Section 3(p) exclusions, TKDL prior art, FSSAI Ayurveda Aahara, or Biological Diversity Act compliance..."}
          className="w-full bg-[#fafbf8] text-[#0f1f17] font-sans text-sm sm:text-base placeholder:text-[#9ca3af] p-4 rounded-xl border border-[#d5ded2] resize-none outline-none focus:border-[#0d3826] focus:ring-2 focus:ring-[#0d3826]/10 transition-all min-h-[76px]"
        />
      </div>

      {/* Bottom Parameter Controls & Submit Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
        
        {/* Subtle parameter badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4b5563]">
          <span className="inline-flex items-center gap-1.5 bg-[#f4f6f1] px-2.5 py-1 rounded-md text-[#0f1f17] border border-[#e2e8df] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[0.95rem] text-[#0d3826]">policy</span>
            <span>Corpus: Patents Act 1970 · AYUSH · TKDL</span>
          </span>

          <span className="hidden md:inline-flex items-center gap-1 bg-[#f4f6f1] px-2.5 py-1 rounded-md text-[#4b5563] border border-[#e2e8df] font-mono text-[11px]">
            <span>Top-K: 3</span>
          </span>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-3">
          <span className="hidden lg:inline text-[#9ca3af] font-sans text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-[#f4f6f1] border border-[#d5ded2] rounded text-[#0f1f17] font-semibold text-[10px]">Enter ↵</kbd>
          </span>
          
          <button
            type="button"
            disabled={isLoading || !question.trim()}
            onClick={onSubmit}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0d3826] hover:bg-[#154a34] text-white font-sans text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer ${
              isLoading || !question.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[1.15rem]">send</span>
                <span>{submitLabel || "Ask Sahayak"}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
