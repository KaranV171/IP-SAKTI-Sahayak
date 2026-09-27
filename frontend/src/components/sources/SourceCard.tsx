"use client";

import React, { useEffect, useRef } from "react";
import { Source } from "@/types/api";
import { getOfficialSourceUrl } from "@/lib/source-links";

interface SourceCardProps {
  source: Source;
  isHighlighted?: boolean;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, isHighlighted }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  const similarityPercent = (source.similarity * 100).toFixed(1);
  const formattedSourceNumber = String(source.source_number).padStart(2, "0");
  
  // Resolve authentic gazette / portal URL
  const officialUrl = getOfficialSourceUrl(source.source_title, source.page_number, source.source_url);

  return (
    <div
      ref={cardRef}
      id={`source-card-${source.source_number}`}
      className={`rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between gap-3.5 ${
        isHighlighted
          ? "border-[#0d3826] bg-[#f4f8f4] shadow-md ring-2 ring-[#0d3826]/20 scale-[1.01]"
          : "border-[#e2e8df] bg-white hover:border-[#0d3826]/30 hover:bg-[#fafbf8] shadow-2xs"
      }`}
    >
      <div className="flex flex-col gap-2.5">
        
        {/* Top Header: Source ID, Page & Relevance Match */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#edf2ea] text-[#0d3826] border border-[#d5ded2]">
              SOURCE {formattedSourceNumber}
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-[#f4f6f1] text-[#4b5563] border border-[#e2e8df]">
              Page {source.page_number}
            </span>
          </div>

          <span className="font-mono text-[11px] text-[#065f46] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full border border-[#bbf7d0] flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[0.85rem]">verified</span>
            <span>Statutory Citation</span>
          </span>
        </div>

        {/* Source Title */}
        <h4 className="font-serif text-sm sm:text-base font-semibold text-[#0f1f17] leading-snug">
          {source.source_title}
        </h4>

        {/* Authority & Category metadata */}
        <div className="flex flex-col gap-1.5 text-xs text-[#4b5563]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#0d3826] shrink-0">
              account_balance
            </span>
            <span className="font-sans">Authority: <strong className="text-[#0f1f17]">{source.authority || "Government of India"}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#d97706] shrink-0">
              tag
            </span>
            <span className="font-mono text-[11px]">Domain: <span className="text-[#0d3826] font-semibold">{source.category}</span> · {source.jurisdiction}</span>
          </div>
        </div>

      </div>

      {/* Footer: REAL Clickable Source Gazette Link */}
      <div className="pt-3 border-t border-[#e2e8df] flex items-center justify-between">
        <span className="font-mono text-[10px] text-[#6b7280]">Official Gazette</span>
        
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d3826] hover:bg-[#154a34] text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Open official statutory document in new tab"
        >
          <span>View Official Source</span>
          <span className="material-symbols-outlined text-[0.85rem]">open_in_new</span>
        </a>
      </div>

    </div>
  );
};
