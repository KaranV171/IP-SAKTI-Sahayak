"use client";

import React, { useState } from "react";
import { QueryResponse } from "@/types/api";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { parseAnswerCitations } from "@/lib/citation-parser";
import { structureAnswer } from "@/lib/answer-formatter";
import { MedicineFollowUpInteractive } from "./MedicineFollowUpInteractive";

interface AnswerCardProps {
  response: QueryResponse;
  onCitationClick?: (sourceNumber: number, pageNumber?: number) => void;
  onNewQuestion: () => void;
  onFollowUpSubmit?: (refinedQuery: string) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  response,
  onCitationClick,
  onNewQuestion,
  onFollowUpSubmit,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${response.answer}\n\n[Confidence: ${response.confidence}]\n${response.disclaimer}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Parse answer into structured executive summary + point-wise breakdown + follow-ups
  const structured = structureAnswer(response.answer, response.query);

  // Helper to render text with clickable citation chips
  const renderTextWithCitations = (text: string) => {
    const segments = parseAnswerCitations(text);
    return (
      <>
        {segments.map((seg, sIdx) => {
          if (seg.type === "citation" && seg.sourceNumber) {
            const formatted = `[Source ${String(seg.sourceNumber).padStart(2, "0")}${
              seg.pageNumber ? `, p.${seg.pageNumber}` : ""
            }]`;

            return (
              <button
                key={sIdx}
                type="button"
                onClick={() => onCitationClick && onCitationClick(seg.sourceNumber!, seg.pageNumber)}
                className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-[#1c1f2a] hover:bg-[#262a35] text-[#68dba9] font-mono text-xs rounded border border-[#3d4a42] hover:border-[#68dba9] align-baseline transition-all cursor-pointer font-semibold shadow-2xs"
                title={`Jump to Source ${seg.sourceNumber}${seg.pageNumber ? ` (Page ${seg.pageNumber})` : ""}`}
              >
                <span className="material-symbols-outlined text-[0.85rem]">book</span>
                <span>{formatted}</span>
              </button>
            );
          }
          return <span key={sIdx}>{seg.content}</span>;
        })}
      </>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Top Query Recap & Diagnostic Strip */}
      <section className="w-full bg-[#171b26] rounded-xl p-4 sm:p-5 border border-[#22304a] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-start md:items-center gap-3 min-w-0">
            <span className="p-2 bg-[#1c1f2a] rounded text-[#68dba9] shrink-0 flex items-center justify-center border border-[#22304a]">
              <span className="material-symbols-outlined text-[1.25rem]">psychology_alt</span>
            </span>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-xs uppercase tracking-wider text-[#bccac0]/80">
                Inquiry Analyzed
              </span>
              <span className="font-serif text-sm sm:text-base text-[#dfe2f1] font-semibold truncate">
                {response.query}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={onNewQuestion}
              className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-[#dfe2f1] font-sans text-xs font-semibold rounded border border-[#22304a] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[1rem]">add_circle</span>
              <span>New Question</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#262a35] text-[#dfe2f1] font-sans text-xs font-semibold rounded border border-[#22304a] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <span className="material-symbols-outlined text-[1rem] text-[#68dba9]">check</span>
                  <span className="text-[#68dba9]">Copied</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[1rem]">content_copy</span>
                  <span>Copy Answer</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Multi-attribute Route & Confidence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          
          <div className="bg-[#1c1f2a] px-3 py-2 rounded border border-[#22304a] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#6bd8cb] text-[1.2rem] shrink-0">account_tree</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#bccac0] uppercase tracking-wider">Classification Intent</span>
              <span className="font-mono text-xs text-[#dfe2f1] font-medium truncate">
                {response.route.intent || "patentability_assessment"}
              </span>
            </div>
          </div>

          <div className="bg-[#1c1f2a] px-3 py-2 rounded border border-[#22304a] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#89f5e7] text-[1.2rem] shrink-0">library_books</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#bccac0] uppercase tracking-wider">Statutory Corpus</span>
              <span className="font-mono text-xs text-[#dfe2f1] font-medium truncate">
                {response.route.categories?.join(" · ") || "Patents Act 1970 · AYUSH"}
              </span>
            </div>
          </div>

          <div className="bg-[#1c1f2a] px-3 py-2 rounded border border-[#22304a] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ffb77d] text-[1.2rem] shrink-0">policy</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#bccac0] uppercase tracking-wider">Jurisdiction</span>
              <span className="font-mono text-xs text-[#dfe2f1] font-medium truncate">
                {response.route.jurisdiction || "India"} (IPO / NBA / AYUSH)
              </span>
            </div>
          </div>

          <ConfidenceBadge 
            confidence={response.confidence} 
            similarityScore={response.sources?.[0]?.similarity} 
          />

        </div>
      </section>

      {/* Structured & Point-Wise Guidance Card */}
      <article className="bg-[#171b26] rounded-xl p-6 sm:p-8 border border-[#22304a] shadow-md flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col gap-1 pb-3 border-b border-[#22304a]">
          <div className="flex items-center gap-1.5 text-[#68dba9] font-mono text-xs uppercase tracking-wide">
            <span className="material-symbols-outlined text-[1.1rem]">fact_check</span>
            <span>Grounded Statutory Guidance</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#dfe2f1] tracking-tight">
            Regulatory &amp; IPR Determination
          </h2>
          <p className="font-sans text-xs text-[#bccac0]">
            Point-wise synthesis cross-referenced against authoritative patent acts, gazettes, and guidelines.
          </p>
        </div>

        {/* 1. Core Summary Callout */}
        {structured.summary && (
          <div className="bg-[#1c1f2a] rounded-lg p-5 border-l-4 border-l-[#68dba9] border border-[#22304a] shadow-xs">
            <div className="flex items-center gap-2 text-[#68dba9] font-sans font-semibold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[1.1rem]">tips_and_updates</span>
              <span>In Plain Language · Executive Summary</span>
            </div>
            <div className="font-sans text-sm sm:text-base text-[#dfe2f1] leading-relaxed">
              {renderTextWithCitations(structured.summary)}
            </div>
          </div>
        )}

        {/* 2. Structured Point-Wise Analysis */}
        {structured.points && structured.points.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-[#dfe2f1] flex items-center gap-2">
                <span className="material-symbols-outlined text-[1.2rem] text-[#6bd8cb]">format_list_numbered</span>
                <span>Point-by-Point Statutory Guidance</span>
              </h3>
              <span className="font-mono text-xs text-[#bccac0]/80">
                {structured.points.length} specific considerations
              </span>
            </div>

            <div className="space-y-3">
              {structured.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-[#1c1f2a]/90 rounded-lg p-4 border border-[#22304a] flex items-start gap-3.5 shadow-2xs hover:border-[#3d4a42] transition-colors"
                >
                  {/* Point number indicator */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#262a35] text-[#68dba9] font-mono font-bold text-xs shrink-0 mt-0.5 border border-[#3d4a42]">
                    {idx + 1}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    {pt.title && (
                      <span className="font-sans text-xs font-semibold text-[#85f8c4] uppercase tracking-wide">
                        {pt.title}
                      </span>
                    )}
                    <div className="font-sans text-sm text-[#dfe2f1]/90 leading-relaxed">
                      {renderTextWithCitations(pt.content)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Interactive Medicine & Product Follow-up Assessment Module */}
        {structured.followUpQuestions && structured.followUpQuestions.length > 0 && onFollowUpSubmit && (
          <MedicineFollowUpInteractive
            originalQuery={response.query}
            followUpQuestions={structured.followUpQuestions}
            onSubmitFollowUp={onFollowUpSubmit}
          />
        )}

        {/* 4. Plain English Terms Demystified (Helps everyone understand legal jargon) */}
        {structured.termsExplained && structured.termsExplained.length > 0 && (
          <div className="bg-[#1c1f2a]/70 rounded-lg p-4 border border-[#22304a] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#89f5e7] font-mono text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[1.1rem]">menu_book</span>
              <span>Statutory Terms Demystified (Plain English)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {structured.termsExplained.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#262a35]/60 rounded p-3 border border-[#22304a] flex flex-col gap-1"
                >
                  <span className="font-mono text-[11px] font-bold text-[#85f8c4] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#68dba9]"></span>
                    {t.term}
                  </span>
                  <p className="font-sans text-xs text-[#bccac0] leading-relaxed">
                    {t.simpleMeaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Procedural Roadmap */}
        <div className="bg-[#1c1f2a] rounded-lg p-4 flex flex-col gap-3 border border-[#22304a]">
          <span className="font-mono text-xs text-[#bccac0] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[1rem] text-[#ffb77d]">route</span>
            <span>Recommended Compliance Pathway</span>
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#262a35]/60 p-3 rounded border border-[#22304a] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-[#bccac0]/70">Step 01</span>
              <span className="font-sans text-xs font-semibold text-[#dfe2f1] mt-1">TKDL Prior Art Search</span>
              <span className="font-sans text-[11px] text-[#bccac0] mt-1">Confirm formulation is not anticipated in classical treatises.</span>
            </div>

            <div className="bg-[#262a35]/60 p-3 rounded border border-[#22304a] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-[#bccac0]/70">Step 02</span>
              <span className="font-sans text-xs font-semibold text-[#dfe2f1] mt-1">Novelty &amp; Synergy Assays</span>
              <span className="font-sans text-[11px] text-[#bccac0] mt-1">Demonstrate technical advancement to overcome Section 3(e)/3(p).</span>
            </div>

            <div className="bg-[#262a35]/60 p-3 rounded border border-[#22304a] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-[#bccac0]/70">Step 03</span>
              <span className="font-sans text-xs font-semibold text-[#dfe2f1] mt-1">NBA Form 1 Approval</span>
              <span className="font-sans text-[11px] text-[#bccac0] mt-1">Obtain Biological Diversity Act approval before filing.</span>
            </div>
          </div>
        </div>

        {/* 4. Statutory Disclaimer Banner */}
        <DisclaimerBanner disclaimerText={response.disclaimer} />

      </article>

    </div>
  );
};
