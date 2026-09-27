import React from "react";
import { BookOpen, Landmark, FileText, CheckCircle2, ShieldCheck, Tag, ExternalLink } from "lucide-react";

export const KNOWLEDGE_REGISTRY = [
  {
    category: "Patents & Inventions",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
    docs: [
      {
        title: "The Patents Act, 1970 (Act No. 39 of 1970 as amended)",
        authority: "Parliament of India / Indian Patent Office",
        pages: "128 Pages",
        coverage: "Section 3(p) Traditional Knowledge exclusion, Section 3(d) Enhanced efficacy, Section 2(1)(j) Novelty criteria",
      },
      {
        title: "Guidelines for Examination of Ayush Related Inventions",
        authority: "Office of Controller General of Patents, Designs and Trade Marks (CGPDTM)",
        pages: "46 Pages",
        coverage: "Examination protocols for Ayurvedic extracts, polyherbal formulations, novelty checks, and synergism claims",
      },
      {
        title: "The Patent Rules, 2003 (as amended up to 2024)",
        authority: "Department for Promotion of Industry and Internal Trade (DPIIT)",
        pages: "84 Pages",
        coverage: "Form 1, Form 2 specifications, expedited examination for startups, biological material disclosures",
      },
    ],
  },
  {
    category: "Traditional Knowledge & Biopiracy Prevention",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
    docs: [
      {
        title: "Traditional Knowledge Digital Library (TKDL) Prior Art Guidelines",
        authority: "Council of Scientific & Industrial Research (CSIR) / Ministry of AYUSH",
        pages: "38 Pages",
        coverage: "Prior art classification of classical Ayurvedic treatises (Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya)",
      },
      {
        title: "Guidelines for Search and Examination of Traditional Medicine Prior Art",
        authority: "World Intellectual Property Organization (WIPO) / CSIR",
        pages: "52 Pages",
        coverage: "International search standards preventing illicit patent grants on public-domain indigenous medicine",
      },
    ],
  },
  {
    category: "Food Safety & Ayurveda Aahara",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
    docs: [
      {
        title: "Food Safety and Standards (Ayurveda Aahara) Regulations, 2022",
        authority: "Food Safety and Standards Authority of India (FSSAI) / Ministry of Health",
        pages: "24 Pages",
        coverage: "Mandatory licensing, permissible ingredients list (Schedule A), prohibition of synthetic vitamins, warning labels",
      },
      {
        title: "FSSAI Operational Guidelines for Manufacturing & Marketing of Ayurveda Aahara",
        authority: "FSSAI Regulatory Division",
        pages: "30 Pages",
        coverage: "Labeling standards, health claims verification, and distinction from proprietary Ayurvedic medicines",
      },
    ],
  },
  {
    category: "Biodiversity & Access Benefit Sharing (ABS)",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
    docs: [
      {
        title: "The Biological Diversity Act, 2002 & Amendments 2023",
        authority: "National Biodiversity Authority (NBA) / Ministry of Environment",
        pages: "64 Pages",
        coverage: "Section 6 approval before applying for IPR on bio-resources, benefit-sharing agreements with local communities",
      },
    ],
  },
];

export const KnowledgeView: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2ea] px-3.5 py-1 text-xs font-semibold text-[#0d3826] border border-[#d5ded2] mb-3 shadow-2xs">
          <BookOpen className="h-3.5 w-3.5 text-[#0d3826]" />
          <span>Statutory Grounding Corpus</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0f1f17] font-serif tracking-tight">
          Verified Knowledge Base Registry
        </h2>
        <p className="mt-2 text-sm text-[#4b5563] max-w-2xl mx-auto leading-relaxed">
          The assistant indexes 35 statutory publications, official manuals, and regulatory gazettes across 5,842 vector-embedded chunks in PostgreSQL (pgvector).
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {KNOWLEDGE_REGISTRY.map((cat, idx) => (
          <div key={idx} className="rounded-2xl border border-[#e2e8df] bg-white p-6 sm:p-7 shadow-2xs">
            
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#e2e8df]">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#edf2ea] text-[#0d3826] border border-[#d5ded2]">
                {cat.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.docs.map((doc, dIdx) => (
                <div key={dIdx} className="rounded-xl border border-[#e2e8df] bg-[#fafbf8] p-4 sm:p-5 hover:border-[#0d3826]/30 transition-colors shadow-2xs">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-[#0f1f17] font-serif leading-snug">
                      {doc.title}
                    </h4>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#edf2ea] text-[#0d3826] border border-[#d5ded2] shrink-0">
                      {doc.pages}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#4b5563] mb-2">
                    <Landmark className="h-3.5 w-3.5 text-[#0d3826] shrink-0" />
                    <span>{doc.authority}</span>
                  </div>

                  <p className="text-[11px] text-[#6b7280] leading-relaxed pt-2 border-t border-[#e2e8df]">
                    <strong className="text-[#0f1f17]">Key Scope:</strong> {doc.coverage}
                  </p>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
