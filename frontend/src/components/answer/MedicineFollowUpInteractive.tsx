"use client";

import React, { useState } from "react";

interface MedicineFollowUpInteractiveProps {
  originalQuery: string;
  followUpQuestions: string[];
  onSubmitFollowUp: (refinedQuery: string) => void;
}

interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

interface DiagnosticQuestionConfig {
  id: number;
  title: string;
  question: string;
  options: QuestionOption[];
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestionConfig[] = [
  {
    id: 1,
    title: "Classical Treatise Precedence",
    question: "Is this formulation or individual herbal use recorded in classical texts (Charaka, Sushruta, AFI/API) or TKDL?",
    options: [
      { id: "q1_novel", label: "✨ Completely Novel (Not in texts)", value: "Not mentioned in classical treatises or TKDL" },
      { id: "q1_classical", label: "📜 Known Classical Recipe", value: "Documented in classical treatises/TKDL" },
      { id: "q1_modified", label: "🔄 Modified Classical Formulation", value: "Modified version of a classical Ayurvedic recipe" },
    ],
  },
  {
    id: 2,
    title: "Synergistic Efficacy (Section 3(e))",
    question: "Do you have comparative lab/clinical assay data showing a synergistic medical effect beyond a simple mixture?",
    options: [
      { id: "q2_synergy_yes", label: "📊 Yes, Lab Assay Proves Synergy", value: "In-vitro/in-vivo assay demonstrates verified synergistic enhancement (>20% over individual herbs)" },
      { id: "q2_synergy_no", label: "⚠️ No Synergy Data Yet", value: "No comparative synergistic data available yet" },
    ],
  },
  {
    id: 3,
    title: "Extraction & Delivery System (Section 3(d))",
    question: "Does your product feature an inventive extraction technique, isolated bio-fraction, or novel drug delivery system?",
    options: [
      { id: "q3_extract", label: "🔬 Standardized Novel Extract", value: "Novel solvent extraction and purified bioactive fraction" },
      { id: "q3_nano", label: "💊 Nano-Formulation / Delivery", value: "Novel targeted drug delivery system (nano-carrier/liposomal)" },
      { id: "q3_raw", label: "🌿 Standard Raw Herb Powder", value: "Standard crude powder / churna formulation" },
    ],
  },
  {
    id: 4,
    title: "Biological Resource Sourcing (NBA)",
    question: "Are the biological ingredients sourced from India, requiring prior National Biodiversity Authority (NBA Form 1) approval?",
    options: [
      { id: "q4_india", label: "🇮🇳 Sourced in India (NBA Needed)", value: "Medicinal plants sourced from India (will require NBA Form 1 approval)" },
      { id: "q4_imported", label: "🌍 Cultivated / Imported Outside India", value: "Ingredients sourced outside India / exempted" },
    ],
  },
];

export const MedicineFollowUpInteractive: React.FC<MedicineFollowUpInteractiveProps> = ({
  originalQuery,
  followUpQuestions,
  onSubmitFollowUp,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [customDetails, setCustomDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (questionId: number, value: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: prev[questionId] === value ? "" : value,
    }));
  };

  const buildRefinedQuery = (): string => {
    const details: string[] = [];

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const ans = selectedAnswers[q.id];
      if (ans) {
        details.push(`${q.title}: ${ans}`);
      }
    });

    if (customDetails.trim()) {
      details.push(`Additional Notes: ${customDetails.trim()}`);
    }

    if (details.length === 0) {
      return originalQuery;
    }

    return `${originalQuery} (Product Specifications: ${details.join("; ")})`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refined = buildRefinedQuery();
    setIsSubmitting(true);
    onSubmitFollowUp(refined);
  };

  const handleQuickAsk = (questionText: string) => {
    const refined = `Regarding ${originalQuery}: ${questionText}`;
    onSubmitFollowUp(refined);
  };

  const hasSelections = Object.values(selectedAnswers).some(Boolean) || customDetails.trim().length > 0;

  return (
    <div className="bg-[#12231b] rounded-2xl p-6 sm:p-7 border border-[#234535] shadow-xl flex flex-col gap-5 text-white animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#234535]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1b382b] text-[#10b981] border border-[#2d5c47] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[1.35rem]">medication</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-base sm:text-lg font-semibold text-white">
                Medicine &amp; Formulation Follow-Up Assessment
              </h3>
              <span className="px-2.5 py-0.5 bg-[#1b382b] text-[#85f8c4] text-[10px] font-mono rounded-full font-semibold uppercase tracking-wider border border-[#2d5c47]">
                Interactive Diagnostic
              </span>
            </div>
            <p className="font-sans text-xs text-[#a3b8af] mt-0.5">
              To determine if your product can overcome Section 3(p) and 3(e) exclusions, select or provide your product details below:
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Diagnostic Question Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {DIAGNOSTIC_QUESTIONS.map((q) => {
          const currentAnswer = selectedAnswers[q.id];

          return (
            <div
              key={q.id}
              className="bg-[#183025] rounded-xl p-4 border border-[#234535] flex flex-col justify-between gap-3 hover:border-[#2d5c47] transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#85f8c4] flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="flex h-4 w-4 rounded-full bg-[#234535] text-[#85f8c4] items-center justify-center text-[10px]">
                      {q.id}
                    </span>
                    {q.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuickAsk(q.question)}
                    className="text-[10px] font-mono text-[#a3b8af] hover:text-[#85f8c4] flex items-center gap-0.5 transition-colors cursor-pointer"
                    title="Ask Sahayak specifically about this statutory requirement"
                  >
                    <span>Inquire this</span>
                    <span className="material-symbols-outlined text-[0.8rem]">arrow_forward</span>
                  </button>
                </div>
                <p className="font-sans text-xs text-[#dfe5e1] leading-relaxed">
                  {q.question}
                </p>
              </div>

              {/* Clickable Answer Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {q.options.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(q.id, opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-sans transition-all text-left cursor-pointer border ${
                        isSelected
                          ? "bg-[#10b981] text-[#064e3b] font-bold border-[#10b981] shadow-xs scale-[1.02]"
                          : "bg-[#101f18] text-[#a3b8af] hover:text-white hover:bg-[#1f3d30] border-[#234535]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Specifics Input & Refined Submission */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2 border-t border-[#234535]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="custom-med-input" className="font-mono text-xs text-[#a3b8af] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[0.95rem] text-[#10b981]">edit</span>
            <span>Optional: Specific formulation or clinical assay notes</span>
          </label>
          <input
            id="custom-med-input"
            type="text"
            value={customDetails}
            onChange={(e) => setCustomDetails(e.target.value)}
            placeholder="e.g. 50:50 standardized hydro-alcoholic extract with in-vitro COX-2 inhibition assays"
            className="w-full bg-[#0d1a14] border border-[#234535] focus:border-[#10b981] rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-[#6a8779] focus:outline-none transition-colors"
          />
        </div>

        {/* Dynamic Refined Query Preview Box */}
        {hasSelections && (
          <div className="bg-[#183025] rounded-xl p-3.5 border border-[#2d5c47] flex flex-col gap-1">
            <span className="font-mono text-[10px] text-[#85f8c4] uppercase tracking-wider font-semibold">
              Refined Inquiry Preview:
            </span>
            <p className="font-mono text-xs text-[#dfe5e1] leading-snug">
              {buildRefinedQuery()}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <span className="text-[11px] font-mono text-[#a3b8af] flex items-center gap-1">
            <span className="material-symbols-outlined text-[0.85rem] text-[#10b981]">verified</span>
            <span>Grounds new evaluation against Sections 3(p), 3(e), 3(d), &amp; NBA Form 1</span>
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-[#064e3b] font-sans font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[1.1rem]">search_check</span>
            <span>Re-evaluate with My Product Details</span>
          </button>
        </div>
      </form>

    </div>
  );
};
