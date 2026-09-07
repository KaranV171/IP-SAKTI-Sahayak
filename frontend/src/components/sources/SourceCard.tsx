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
      className={`rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between gap-3.5 ${
        isHighlighted
          ? "border-[#68dba9] bg-[#1a243b] shadow-xl ring-2 ring-[#68dba9]/50 scale-[1.01]"
          : "border-[#22304a] bg-[#171b26] hover:border-[#3d4a42] hover:bg-[#1c1f2a] shadow-sm"
      }`}
    >
      <div className="flex flex-col gap-2.5">
        
        {/* Top Header: Source ID, Page & Relevance Match */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#262a35] text-[#68dba9] border border-[#3d4a42]">
              SOURCE {formattedSourceNumber}
            </span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#262a35] text-[#dfe2f1]">
              Page {source.page_number}
            </span>
          </div>

          <span className="font-mono text-[11px] text-[#68dba9] bg-[#25a475]/15 px-2 py-0.5 rounded border border-[#25a475]/30 flex items-center gap-1">
            <span className="material-symbols-outlined text-[0.85rem]">verified</span>
            <span>Statutory Citation</span>
          </span>
        </div>

        {/* Source Title */}
        <h4 className="font-serif text-sm sm:text-base font-semibold text-[#dfe2f1] leading-snug">
          {source.source_title}
        </h4>

        {/* Authority & Category metadata */}
        <div className="flex flex-col gap-1.5 text-xs text-[#bccac0]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#6bd8cb] shrink-0">
              account_balance
            </span>
            <span className="font-sans">Authority: <strong className="text-[#dfe2f1]">{source.authority || "Government of India"}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#ffb77d] shrink-0">
              tag
            </span>
            <span className="font-mono text-[11px]">Domain: <span className="text-[#68dba9]">{source.category}</span> · {source.jurisdiction}</span>
          </div>
        </div>

      </div>

      {/* Footer: REAL Clickable Source Gazette Link */}
      <div className="pt-3 border-t border-[#22304a] flex items-center justify-between">
        <span className="font-mono text-[10px] text-[#bccac0]/70">Official Gazette</span>
        
        <a
          href={officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25a475]/20 hover:bg-[#25a475]/30 text-[#85f8c4] hover:text-white rounded border border-[#25a475]/40 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          title="Open official statutory document in new tab"
        >
          <span>View Official Source</span>
          <span className="material-symbols-outlined text-[0.85rem]">open_in_new</span>
        </a>
      </div>

    </div>
  );
};
