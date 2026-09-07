"use client";

import React from "react";

interface QueryLoadingProps {
  queryText?: string;
}

export const QueryLoading: React.FC<QueryLoadingProps> = ({ queryText }) => {
  return (
    <div className="w-full bg-[#171b26] rounded-xl p-8 sm:p-12 border border-[#22304a] shadow-lg flex flex-col items-center justify-center text-center animate-in fade-in duration-200 my-4">
      
      {/* Animated Spinner with Insignia Glyph */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-3 border-[#262a35] border-t-[#68dba9] animate-spin" />
        <span className="material-symbols-outlined text-[1.4rem] text-[#68dba9] absolute">
          auto_awesome
        </span>
      </div>

      {/* Main Headline */}
      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#dfe2f1] mb-2 tracking-tight">
        Your response is coming...
      </h3>

      {/* Secondary Explanation */}
      <p className="font-sans text-xs sm:text-sm text-[#bccac0] max-w-md mx-auto leading-relaxed mb-4">
        Searching 5,842 statutory chunks across official gazettes and synthesizing a grounded answer.
      </p>

      {/* Echoed User Inquiry */}
      {queryText && (
        <div className="inline-flex items-center gap-2 bg-[#0a0e18] border border-[#22304a] px-4 py-2 rounded-lg text-xs font-medium text-[#85f8c4] max-w-xl truncate">
          <span className="material-symbols-outlined text-[1rem] text-[#68dba9] shrink-0">
            search
          </span>
          <span className="truncate italic">"{queryText}"</span>
        </div>
      )}

      {/* Subtle pulse hint */}
      <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-[#bccac0]/60">
        <span className="w-1.5 h-1.5 rounded-full bg-[#68dba9] animate-pulse"></span>
        <span>Local BGE-M3 &amp; Qwen3:8B inference in progress</span>
      </div>

    </div>
  );
};
