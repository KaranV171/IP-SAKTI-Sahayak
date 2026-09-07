"use client";

import React from "react";

interface ExamplePromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const INQUIRY_ARCHETYPES = [
  {
    category: "Section 3(p) / AYUSH Patents",
    badgeColor: "bg-[#313540] text-[#6bd8cb]",
    title: "Can I patent an Ayurvedic formulation?",
    description: "Examines exclusions under traditional knowledge, novel extraction protocols, and synergy proof requirements.",
    citation: "IP Act 1970 · Sec 3(p) & Sec 3(e)",
    icon: "menu_book",
  },
  {
    category: "Patents Act 1970",
    badgeColor: "bg-[#313540] text-[#68dba9]",
    title: "What are the patentability requirements for an invention in India?",
    description: "Statutory tests of novelty, inventive step (non-obviousness), and industrial applicability under Sections 2(1)(j) and 3.",
    citation: "Indian Patent Manual 2019 · Ch. 03",
    icon: "account_balance",
  },
  {
    category: "Ayurveda Aahara 2022",
    badgeColor: "bg-[#313540] text-[#ffb77d]",
    title: "What regulations apply to Ayurvedic food products under FSSAI?",
    description: "Compliance mandates for culinary recipes from authoritative Ayurvedic texts, labeling caveats, and additive prohibitions.",
    citation: "FSS Gazette Reg. 2022 · Sched. A-IV",
    icon: "local_police",
  },
  {
    category: "Traditional Knowledge",
    badgeColor: "bg-[#313540] text-[#89f5e7]",
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
          <span className="material-symbols-outlined text-[#68dba9] text-[1.3rem]">
            quick_reference_all
          </span>
          <h2 className="font-serif text-base sm:text-lg font-semibold text-[#dfe2f1]">
            Explore Verified Research Inquiries
          </h2>
        </div>
        <span className="font-mono text-xs text-[#bccac0]">
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
            className="group text-left bg-[#171b26] hover:bg-[#262a35] rounded-lg p-5 border border-[#22304a] hover:border-[#3d4a42] transition-all flex flex-col justify-between gap-4 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[11px] px-2 py-0.5 rounded font-medium ${item.badgeColor}`}>
                  {item.category}
                </span>
                <span className="material-symbols-outlined text-[#bccac0] group-hover:text-[#68dba9] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-[1.2rem]">
                  north_east
                </span>
              </div>

              <h3 className="font-serif text-sm sm:text-base font-semibold text-[#dfe2f1] group-hover:text-[#85f8c4] transition-colors mt-1 leading-snug">
                {item.title}
              </h3>

              <p className="font-sans text-xs text-[#bccac0] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[#bccac0] font-mono text-[11px] pt-2 border-t border-[#22304a]/70">
              <span className="material-symbols-outlined text-[0.95rem] text-[#ffb77d]">{item.icon}</span>
              <span>{item.citation}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};
