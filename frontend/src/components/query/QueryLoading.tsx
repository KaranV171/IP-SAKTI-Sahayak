"use client";

import React, { useEffect, useState } from "react";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

interface QueryLoadingProps {
  queryText?: string;
  language?: string;
}

export const QueryLoading: React.FC<QueryLoadingProps> = ({ queryText, language = "en" }) => {
  const isMultilingual = language !== "en";
  const [activeStep, setActiveStep] = useState(isMultilingual ? 0 : 1);

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  const langName = langObj ? `${langObj.display_name} (${langObj.native_name})` : language;

  // Cycle through pipeline steps visually for non-English queries
  useEffect(() => {
    if (!isMultilingual) return;

    const timer1 = setTimeout(() => setActiveStep(1), 1200);
    const timer2 = setTimeout(() => setActiveStep(2), 2600);
    const timer3 = setTimeout(() => setActiveStep(3), 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isMultilingual]);

  const steps = [
    {
      id: 0,
      title: `Translating from ${langObj?.display_name || "Indic"} to English`,
      sub: "AI4Bharat IndicTrans2 distilled 200M neural translation",
      icon: "translate",
    },
    {
      id: 1,
      title: "Query Routing & Vector Retrieval",
      sub: "BGE-M3 dense embeddings across 5,842 statutory chunks in pgvector",
      icon: "account_tree",
    },
    {
      id: 2,
      title: "Grounded Legal Synthesis",
      sub: "Qwen3:8B generating cited answers grounded in AYUSH patent guidelines",
      icon: "psychology",
    },
    {
      id: 3,
      title: `Translating Answer to ${langObj?.display_name || "Native Language"}`,
      sub: "IndicTrans2 preserving citations [Source X, Page Y] and legal disclaimers",
      icon: "spellcheck",
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-10 border border-[#e2e8df] shadow-sm flex flex-col items-center justify-center text-center animate-in fade-in duration-200 my-4">
      
      {/* Animated Spinner with Insignia Glyph */}
      <div className="relative mb-5 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-3 border-[#e2e8df] border-t-[#0d3826] animate-spin" />
        <span className="material-symbols-outlined text-[1.4rem] text-[#0d3826] absolute">
          {isMultilingual ? "translate" : "auto_awesome"}
        </span>
      </div>

      {/* Main Headline */}
      <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0f1f17] mb-2 tracking-tight">
        {isMultilingual ? "Multilingual Statutory Pipeline Active" : "Your response is coming..."}
      </h3>

      {/* Secondary Explanation */}
      <p className="font-sans text-xs sm:text-sm text-[#4b5563] max-w-md mx-auto leading-relaxed mb-4">
        {isMultilingual
          ? `Processing your inquiry in ${langName}. The core statutory corpus remains verified and grounded in English.`
          : "Searching 5,842 statutory chunks across official gazettes and synthesizing a grounded answer."}
      </p>

      {/* Echoed User Inquiry */}
      {queryText && (
        <div className="inline-flex items-center gap-2 bg-[#f4f6f1] border border-[#d5ded2] px-4 py-2 rounded-xl text-xs font-medium text-[#0d3826] max-w-xl truncate mb-6">
          <span className="material-symbols-outlined text-[1rem] text-[#0d3826] shrink-0">
            search
          </span>
          <span className="truncate italic">&ldquo;{queryText}&rdquo;</span>
        </div>
      )}

      {/* Multilingual 4-stage pipeline visualization */}
      {isMultilingual && (
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left my-2">
          {steps.map((step) => {
            const isCompleted = activeStep > step.id;
            const isCurrent = activeStep === step.id;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                  isCurrent
                    ? "bg-[#edf2ea] border-[#0d3826] shadow-xs"
                    : isCompleted
                    ? "bg-white border-[#e2e8df]"
                    : "bg-[#fbfcf9] border-[#e2e8df]/70 opacity-50"
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-bold shrink-0 mt-0.5 border ${
                    isCurrent
                      ? "bg-[#0d3826] text-white border-[#0d3826] animate-pulse"
                      : isCompleted
                      ? "bg-[#edf2ea] text-[#0d3826] border-[#d5ded2]"
                      : "bg-[#f4f6f1] text-[#9ca3af] border-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[1rem]">
                    {isCompleted ? "check" : step.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`font-sans text-xs font-semibold truncate ${
                      isCurrent ? "text-[#0d3826]" : "text-[#0f1f17]"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="font-sans text-[11px] text-[#6b7280] line-clamp-1">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtle pulse hint */}
      <div className="mt-6 flex items-center gap-2 text-[11px] font-mono text-[#6b7280]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
        <span>
          {isMultilingual
            ? "Local AI4Bharat IndicTrans2 ONNX & Qwen3:8B active"
            : "Local BGE-M3 & Qwen3:8B inference in progress"}
        </span>
      </div>

    </div>
  );
};
