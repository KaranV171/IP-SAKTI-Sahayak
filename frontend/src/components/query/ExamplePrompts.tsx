"use client";

import React from "react";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const INQUIRY_ARCHETYPES = [
  {
    category: "Section 3(p) / AYUSH Patents",
    badgeColor: "bg-[#edf2ea] text-[#0d3826] border border-[#d5ded2]",
    title: "Can I patent an Ayurvedic formulation?",
    description: "Examines exclusions under traditional knowledge, novel extraction protocols, and synergy proof requirements.",
    citation: "IP Act 1970 · Sec 3(p) & Sec 3(e)",
    icon: "menu_book",
  },
  {
    category: "Patents Act 1970",
    badgeColor: "bg-[#e8f3ee] text-[#0d3826] border border-[#cbe3d5]",
    title: "What are the patentability requirements for an invention in India?",
    description: "Statutory tests of novelty, inventive step (non-obviousness), and industrial applicability under Sections 2(1)(j) and 3.",
    citation: "Indian Patent Manual 2019 · Ch. 03",
    icon: "account_balance",
  },
  {
    category: "Ayurveda Aahara 2022",
    badgeColor: "bg-[#fef3c7] text-[#92400e] border border-[#fde68a]",
    title: "What regulations apply to Ayurvedic food products under FSSAI?",
    description: "Compliance mandates for culinary recipes from authoritative Ayurvedic texts, labeling caveats, and additive prohibitions.",
    citation: "FSS Gazette Reg. 2022 · Sched. A-IV",
    icon: "local_police",
  },
  {
    category: "Traditional Knowledge",
    badgeColor: "bg-[#e6f4ea] text-[#065f46] border border-[#bbf7d0]",
    title: "How does TKDL affect Ayurvedic patent applications?",
    description: "Prior art documentation mechanisms matching global patent applications against 250,000+ classical formulations.",
    citation: "CSIR-TKDL Protocols · Guidelines § 4",
    icon: "library_books",
  },
];

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ onSelectPrompt, disabled }) => {
  return (
    <div className="w-full mt-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0d3826] text-[1.3rem]">
            quick_reference_all
          </span>
          <h2 className="font-serif text-base sm:text-lg font-semibold text-[#0f1f17]">
            Explore Verified Research Inquiries
          </h2>
        </div>
        <span className="font-mono text-xs text-[#6b7280]">
          Select an archetype to populate the inquiry
        </span>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INQUIRY_ARCHETYPES.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.title)}
            className="group text-left bg-white hover:bg-[#f8faf6] rounded-xl p-5 border border-[#e2e8df] hover:border-[#0d3826]/30 transition-all flex flex-col justify-between gap-4 shadow-2xs hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[11px] px-2.5 py-0.5 rounded-full font-medium ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="material-symbols-outlined text-[#9ca3af] group-hover:text-[#0d3826] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[1.2rem]">
                  north_east
                </span>
              </div>

              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#0f1f17] group-hover:text-[#0d3826] transition-colors mt-1 leading-snug">
                {item.title}
              </h3>

              <p className="font-sans text-xs text-[#4b5563] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[#6b7280] font-mono text-[11px] pt-2 border-t border-[#e2e8df]">
              <span className="material-symbols-outlined text-[0.95rem] text-[#d97706]">{item.icon}</span>
              <span>{item.citation}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
