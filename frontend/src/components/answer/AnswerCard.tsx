"use client";

import React, { useState } from "react";
import { QueryResponse } from "@/types/api";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { DisclaimerBanner } from "./DisclaimerBanner";
import { parseAnswerCitations } from "@/lib/citation-parser";
import { structureAnswer } from "@/lib/answer-formatter";
import { MedicineFollowUpInteractive } from "./MedicineFollowUpInteractive";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";
import { exportToDoc, exportToPdf } from "@/lib/export-report";

interface AnswerCardProps {
  response: QueryResponse;
  onCitationClick?: (sourceNumber: number, pageNumber?: number) => void;
  onNewQuestion: () => void;
  onFollowUpSubmit?: (refinedQuery: string) => void;
  selectedLanguage?: string;
  onSelectLanguage?: (lang: string) => void;
  isTranslating?: boolean;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  response,
  onCitationClick,
  onNewQuestion,
  onFollowUpSubmit,
  selectedLanguage,
  onSelectLanguage,
  isTranslating = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [showEnglishReference, setShowEnglishReference] = useState(false);

  // Active language is either explicitly selected or from response
  const activeLangCode = selectedLanguage || response.answer_language || "en";

  // Check whether we have a non-English translated answer
  const isMultilingual =
    activeLangCode !== "en" &&
    Boolean(response.translated_answer) &&
    response.translation_status !== "failed";

  const targetLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === activeLangCode
  ) || SUPPORTED_LANGUAGES.find(
    (l) => l.code === (response.answer_language || response.input_language)
  );

  // Text to render as primary guidance
  const activeAnswerText =
    isMultilingual && !showEnglishReference && response.translated_answer
      ? response.translated_answer
      : response.answer;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${activeAnswerText}\n\n[Confidence: ${response.confidence}]\n${response.disclaimer}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Parse primary answer into structured summary + point-wise breakdown + follow-ups
  const structured = structureAnswer(activeAnswerText, response.query);
  // Parse original English answer for reference view if multilingual
  const englishStructured = isMultilingual ? structureAnswer(response.answer, response.query) : null;

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
                className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-[#edf2ea] hover:bg-[#dfeade] text-[#0d3826] font-mono text-xs rounded-md border border-[#c6d7c4] align-baseline transition-all cursor-pointer font-semibold shadow-2xs"
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
      <section className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e8df] shadow-sm flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-start md:items-center gap-3 min-w-0">
            <span className="p-2 bg-[#edf2ea] rounded-xl text-[#0d3826] shrink-0 flex items-center justify-center border border-[#d5ded2]">
              <span className="material-symbols-outlined text-[1.25rem]">psychology_alt</span>
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[#6b7280]">
                  Inquiry Analyzed
                </span>
                {targetLang && targetLang.code !== "en" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#e6f4ea] text-[#0d3826] border border-[#b8dfc4] font-semibold">
                    <span className="material-symbols-outlined text-[0.8rem]">translate</span>
                    {targetLang.display_name} ({targetLang.native_name})
                  </span>
                )}
              </div>
              <span className="font-serif text-sm sm:text-base text-[#0f1f17] font-semibold truncate">
                {response.original_question || response.query}
              </span>
              {/* Show English translated query if query was in Indic */}
              {response.translated_query && response.translated_query !== (response.original_question || response.query) && (
                <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-[#6b7280] truncate">
                  <span className="material-symbols-outlined text-[0.9rem] text-[#10b981]">arrow_right_alt</span>
                  <span className="text-[#0d3826] font-medium">En: &ldquo;{response.translated_query}&rdquo;</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
            {/* Export Document & PDF options */}
            <div className="flex items-center gap-1 bg-[#f4f6f1] p-1 rounded-lg border border-[#e2e8df]">
              <button
                type="button"
                onClick={() => exportToPdf(response)}
                className="px-2.5 py-1 bg-white hover:bg-[#edf2ea] text-[#0d3826] font-sans text-xs font-semibold rounded-md border border-[#d5ded2] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="Save answer as PDF document"
              >
                <span className="material-symbols-outlined text-[1rem] text-[#dc2626]">picture_as_pdf</span>
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={() => exportToDoc(response)}
                className="px-2.5 py-1 bg-white hover:bg-[#edf2ea] text-[#0d3826] font-sans text-xs font-semibold rounded-md border border-[#d5ded2] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="Download answer as Microsoft Word (.doc)"
              >
                <span className="material-symbols-outlined text-[1rem] text-[#2563eb]">description</span>
                <span>DOC</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onNewQuestion}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f8faf6] text-[#0f1f17] font-sans text-xs font-semibold rounded-lg border border-[#d5ded2] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="material-symbols-outlined text-[1rem]">add_circle</span>
              <span>New Question</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-1.5 bg-white hover:bg-[#f8faf6] text-[#0f1f17] font-sans text-xs font-semibold rounded-lg border border-[#d5ded2] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <span className="material-symbols-outlined text-[1rem] text-[#0d3826]">check</span>
                  <span className="text-[#0d3826]">Copied</span>
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

        {/* Translation Alert Banner if translation failed */}
        {response.translation_status === "failed" && (
          <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-3.5 text-xs text-[#991b1b] flex items-center gap-2">
            <span className="material-symbols-outlined text-[1.1rem]">warning</span>
            <span>
              Translation into the requested language encountered a temporary issue. Showing the verified grounded English answer below.
            </span>
          </div>
        )}

        {/* Multi-attribute Route & Confidence Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          
          <div className="bg-[#f8faf6] px-3.5 py-2.5 rounded-xl border border-[#e2e8df] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0d3826] text-[1.2rem] shrink-0">account_tree</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#6b7280] uppercase tracking-wider">Classification Intent</span>
              <span className="font-mono text-xs text-[#0f1f17] font-semibold truncate">
                {response.route.intent || "patentability_assessment"}
              </span>
            </div>
          </div>

          <div className="bg-[#f8faf6] px-3.5 py-2.5 rounded-xl border border-[#e2e8df] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0d3826] text-[1.2rem] shrink-0">library_books</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#6b7280] uppercase tracking-wider">Statutory Corpus</span>
              <span className="font-mono text-xs text-[#0f1f17] font-semibold truncate">
                {response.route.categories?.join(" · ") || "Patents Act 1970 · AYUSH"}
              </span>
            </div>
          </div>

          <div className="bg-[#f8faf6] px-3.5 py-2.5 rounded-xl border border-[#e2e8df] flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#d97706] text-[1.2rem] shrink-0">policy</span>
            <div className="flex flex-col min-w-0">
              <span className="font-sans text-[10px] text-[#6b7280] uppercase tracking-wider">Jurisdiction</span>
              <span className="font-mono text-xs text-[#0f1f17] font-semibold truncate">
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

      {/* Translating active alert */}
      {isTranslating && (
        <div className="bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl p-3 text-xs text-[#1b5e20] flex items-center justify-between gap-3 animate-pulse shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[1.2rem] animate-spin text-[#10b981]">sync</span>
            <span className="font-medium">
              Translating statutory guidance into {targetLang?.display_name || "selected language"} with citation preservation...
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded border border-[#c8e6c9] font-semibold text-[#0d3826]">
            AI4Bharat IndicTrans2
          </span>
        </div>
      )}

      {/* Structured & Point-Wise Guidance Card */}
      <article className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e8df] shadow-sm flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-3 border-b border-[#e2e8df]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[#0d3826] font-mono text-xs uppercase tracking-wide font-semibold">
              <span className="material-symbols-outlined text-[1.1rem]">fact_check</span>
              <span>
                {isMultilingual && !showEnglishReference
                  ? `Grounded Statutory Guidance (${targetLang?.display_name || "Indic"})`
                  : "Grounded Statutory Guidance"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isMultilingual && (
                <button
                  type="button"
                  onClick={() => setShowEnglishReference(!showEnglishReference)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-lg border border-[#c6d7c4] bg-[#f0f7ef] hover:bg-[#e2f0e0] text-[#0d3826] cursor-pointer transition-colors font-medium shadow-2xs"
                  title={showEnglishReference ? "Switch back to translated language" : "View original English text"}
                >
                  <span className="material-symbols-outlined text-[0.95rem]">
                    {showEnglishReference ? "translate" : "language"}
                  </span>
                  <span>{showEnglishReference ? `Show ${targetLang?.native_name || "Indic"}` : "Show English"}</span>
                </button>
              )}

              {isMultilingual && !showEnglishReference && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#0d3826] bg-[#edf2ea] px-2.5 py-0.5 rounded-full border border-[#d5ded2] font-semibold">
                  <span className="material-symbols-outlined text-[0.85rem]">translate</span>
                  AI4Bharat IndicTrans2
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0f1f17] tracking-tight">
                Regulatory &amp; IPR Determination
              </h2>
              <p className="font-sans text-xs text-[#4b5563]">
                Point-wise synthesis cross-referenced against authoritative patent acts, gazettes, and guidelines.
              </p>
            </div>

            {/* Quick Language Switcher Pills */}
            {onSelectLanguage && (
              <div className="flex items-center gap-1 bg-[#f4f6f1] p-1 rounded-lg border border-[#e2e8df] self-start sm:self-center shrink-0">
                <span className="material-symbols-outlined text-[0.9rem] text-[#6b7280] ml-1">translate</span>
                {[
                  { code: "en", label: "EN" },
                  { code: "hi", label: "हिन्दी" },
                  { code: "ta", label: "தமிழ்" },
                  { code: "te", label: "తెలుగు" },
                  { code: "bn", label: "বাংলা" },
                  { code: "mr", label: "मराठी" },
                ].map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      setShowEnglishReference(false);
                      onSelectLanguage(l.code);
                    }}
                    className={`px-2 py-0.5 text-[11px] font-sans rounded font-medium transition-colors cursor-pointer ${
                      activeLangCode === l.code
                        ? "bg-[#0d3826] text-white shadow-2xs"
                        : "text-[#4b5563] hover:text-[#0d3826] hover:bg-[#e6eee4]"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 1. Core Summary Callout */}
        {structured.summary && (
          <div className="bg-[#f5f8f4] rounded-xl p-5 border-l-4 border-l-[#0d3826] border border-[#dce6dc] shadow-2xs">
            <div className="flex items-center gap-2 text-[#0d3826] font-sans font-semibold text-xs uppercase tracking-wider mb-2">
              <span className="material-symbols-outlined text-[1.1rem]">tips_and_updates</span>
              <span>In Plain Language · Executive Summary</span>
            </div>
            <div className="font-sans text-sm sm:text-base text-[#1f2937] leading-relaxed">
              {renderTextWithCitations(structured.summary)}
            </div>
          </div>
        )}

        {/* 2. Structured Point-Wise Analysis */}
        {structured.points && structured.points.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-[#0f1f17] flex items-center gap-2">
                <span className="material-symbols-outlined text-[1.2rem] text-[#0d3826]">format_list_numbered</span>
                <span>Point-by-Point Statutory Guidance</span>
              </h3>
              <span className="font-mono text-xs text-[#6b7280]">
                {structured.points.length} specific considerations
              </span>
            </div>

            <div className="space-y-3">
              {structured.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-[#e2e8df] flex items-start gap-3.5 shadow-2xs hover:border-[#0d3826]/30 transition-colors"
                >
                  {/* Point number indicator */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0d3826] text-white font-mono font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>

                  <div className="flex flex-col gap-1 w-full">
                    {pt.title && (
                      <span className="font-sans text-xs font-semibold text-[#0d3826] uppercase tracking-wide">
                        {pt.title}
                      </span>
                    )}
                    <div className="font-sans text-sm text-[#374151] leading-relaxed">
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
            originalQuery={response.original_question || response.query}
            followUpQuestions={structured.followUpQuestions}
            onSubmitFollowUp={onFollowUpSubmit}
          />
        )}

        {/* 4. Plain English Terms Demystified */}
        {structured.termsExplained && structured.termsExplained.length > 0 && (
          <div className="bg-[#f8faf6] rounded-xl p-5 border border-[#e2e8df] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[#0d3826] font-mono text-xs uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[1.1rem]">menu_book</span>
              <span>Statutory Terms Demystified (Plain Language)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {structured.termsExplained.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-3.5 border border-[#e2e8df] flex flex-col gap-1 shadow-2xs"
                >
                  <span className="font-mono text-[11px] font-bold text-[#0d3826] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                    {t.term}
                  </span>
                  <p className="font-sans text-xs text-[#4b5563] leading-relaxed">
                    {t.simpleMeaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Procedural Roadmap */}
        <div className="bg-[#f8faf6] rounded-xl p-5 flex flex-col gap-3 border border-[#e2e8df]">
          <span className="font-mono text-xs text-[#0d3826] uppercase tracking-wider flex items-center gap-1.5 font-semibold">
            <span className="material-symbols-outlined text-[1rem] text-[#d97706]">route</span>
            <span>Recommended Compliance Pathway</span>
          </span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-lg border border-[#e2e8df] flex flex-col justify-between shadow-2xs">
              <span className="font-mono text-[11px] text-[#0d3826] font-bold">Step 01</span>
              <span className="font-sans text-xs font-semibold text-[#0f1f17] mt-1">TKDL Prior Art Search</span>
              <span className="font-sans text-[11px] text-[#4b5563] mt-1">Confirm formulation is not anticipated in classical treatises.</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-[#e2e8df] flex flex-col justify-between shadow-2xs">
              <span className="font-mono text-[11px] text-[#0d3826] font-bold">Step 02</span>
              <span className="font-sans text-xs font-semibold text-[#0f1f17] mt-1">Novelty &amp; Synergy Assays</span>
              <span className="font-sans text-[11px] text-[#4b5563] mt-1">Demonstrate technical advancement to overcome Section 3(e)/3(p).</span>
            </div>

            <div className="bg-white p-3.5 rounded-lg border border-[#e2e8df] flex flex-col justify-between shadow-2xs">
              <span className="font-mono text-[11px] text-[#0d3826] font-bold">Step 03</span>
              <span className="font-sans text-xs font-semibold text-[#0f1f17] mt-1">NBA Form 1 Approval</span>
              <span className="font-sans text-[11px] text-[#4b5563] mt-1">Obtain Biological Diversity Act approval before filing.</span>
            </div>
          </div>
        </div>

        {/* 6. Expandable Original English Source Answer (Secondary technical reference) */}
        {isMultilingual && (
          <div className="border border-[#1f3b2e] rounded-xl overflow-hidden bg-[#13261f]">
            <button
              type="button"
              onClick={() => setShowEnglishReference(!showEnglishReference)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#183027] transition-colors text-xs font-mono text-[#a3b8af] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[1.1rem] text-[#10b981]">
                  {showEnglishReference ? "expand_less" : "expand_more"}
                </span>
                <span className="font-semibold text-white">
                  View Original English RAG Response
                </span>
                <span className="text-[11px] text-[#a3b8af]">
                  (Technical verification &amp; canonical synthesis)
                </span>
              </div>
              <span className="text-[11px] text-[#85f8c4] underline">
                {showEnglishReference ? "Hide" : "Show"}
              </span>
            </button>

            {showEnglishReference && englishStructured && (
              <div className="p-5 border-t border-[#1f3b2e] bg-[#0e1d17] flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#a3b8af]">
                  <span className="material-symbols-outlined text-[0.95rem] text-[#10b981]">check_circle</span>
                  <span>Canonical output from Qwen3:8B grounded in Indian Patent Guidelines:</span>
                </div>
                <div className="font-sans text-xs sm:text-sm text-[#dfe5e1] leading-relaxed space-y-3 pl-2 border-l-2 border-[#10b981]">
                  <div>{renderTextWithCitations(englishStructured.summary)}</div>
                  {englishStructured.points.map((pt, pIdx) => (
                    <div key={pIdx} className="pt-2">
                      {pt.title && (
                        <div className="font-bold text-[#85f8c4] text-xs mb-1">
                          {pt.title}
                        </div>
                      )}
                      <div>{renderTextWithCitations(pt.content)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 7. Statutory Disclaimer Banner */}
        <DisclaimerBanner disclaimerText={response.disclaimer} />

      </article>

    </div>
  );
};
