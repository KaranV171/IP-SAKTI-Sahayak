"use client";

import React, { useRef, useEffect } from "react";

interface QueryInputProps {
  question: string;
  setQuestion: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  question,
  setQuestion,
  onSubmit,
  isLoading,
  onClear,
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
    <div className="w-full bg-[#171b26] rounded-xl shadow-lg p-4 sm:p-5 border border-[#22304a] transition-all duration-200">
      
      {/* Console Top Header */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#22304a]/80 mb-3">
        <div className="flex items-center gap-2 text-[#bccac0]">
          <span className="material-symbols-outlined text-[1.15rem] text-[#68dba9]">search</span>
          <span className="font-sans text-xs uppercase tracking-wider text-[#dfe2f1] font-semibold">
            Ask Sahayak — IPR &amp; Regulatory Inquirer
          </span>
        </div>

        <div className="flex items-center gap-3 text-[#bccac0]">
          <span className="font-mono text-[11px] flex items-center gap-1.5 text-[#bccac0]/80">
            <span className="w-2 h-2 rounded-full bg-[#25a475]"></span>
            5,842 Statutory Chunks
          </span>
          {question.trim().length > 0 && (
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="font-sans text-xs text-[#bccac0] hover:text-[#dfe2f1] transition-colors cursor-pointer"
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
          placeholder="Ask any question about Ayurvedic patents, Section 3(p) exclusions, TKDL prior art, FSSAI Ayurveda Aahara, or Biological Diversity Act compliance..."
          className="w-full bg-[#0a0e18] text-[#dfe2f1] font-sans text-sm sm:text-base placeholder:text-[#bccac0]/40 p-4 rounded-lg border border-[#22304a] resize-none outline-none focus:border-[#68dba9] focus:ring-1 focus:ring-[#68dba9]/30 transition-all selection:bg-[#25a475] selection:text-[#00311f] min-h-[76px]"
        />
      </div>

      {/* Bottom Parameter Controls & Submit Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
        
        {/* Subtle parameter badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#bccac0]">
          <span className="inline-flex items-center gap-1.5 bg-[#262a35] px-2.5 py-1 rounded text-[#dfe2f1] border border-[#3d4a42] font-mono text-[11px]">
            <span className="material-symbols-outlined text-[0.95rem] text-[#6bd8cb]">policy</span>
            <span>Corpus: Patents Act 1970 · AYUSH · TKDL</span>
          </span>

          <span className="hidden md:inline-flex items-center gap-1 bg-[#262a35] px-2.5 py-1 rounded text-[#bccac0] border border-[#3d4a42] font-mono text-[11px]">
            <span>Top-K: 3</span>
          </span>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-end gap-3">
          <span className="hidden lg:inline text-[#bccac0]/60 font-sans text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-[#262a35] border border-[#3d4a42] rounded text-[#dfe2f1] font-semibold text-[10px]">Enter ↵</kbd>
          </span>
          
          <button
            type="button"
            disabled={isLoading || !question.trim()}
            onClick={onSubmit}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#68dba9] hover:bg-[#85f8c4] text-[#003825] font-sans text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer ${
              isLoading || !question.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#003825] border-t-transparent" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[1.15rem]">send</span>
                <span>Ask Sahayak</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
