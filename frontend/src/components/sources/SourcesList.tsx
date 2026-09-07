import React from "react";
import { Source } from "@/types/api";
import { SourceCard } from "./SourceCard";

interface SourcesListProps {
  sources: Source[];
  highlightedSourceNumber?: number | null;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  sources,
  highlightedSourceNumber,
}) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#22304a]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#68dba9] text-[1.25rem]">
            library_books
          </span>
          <div>
            <h3 className="font-serif text-base font-semibold text-[#dfe2f1]">
              Authoritative Sources &amp; Evidence
            </h3>
            <p className="font-sans text-xs text-[#bccac0]">
              {sources.length} primary statutory publications matched by BGE-M3
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-3">
        {sources.map((source) => (
          <SourceCard
            key={source.source_number}
            source={source}
            isHighlighted={highlightedSourceNumber === source.source_number}
          />
        ))}
      </div>
    </div>
  );
};
