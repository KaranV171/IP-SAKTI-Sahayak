/**
 * Statutory Database & Corpus Mapping for IP-SAKTI Sahayak
 * Covers all 35 authentic statutory gazettes and acts bundled in public/docs
 */

export const DOC_FILE_MAP: Record<string, string> = {
  "guidelines for examination of ayush related inventions": "Guidelines for Examination of Ayush Related Inventions-2025.pdf",
  "guidelines for examination of ayush": "Guidelines for Examination of Ayush Related Inventions-2025.pdf",
  "ayush related inventions": "Guidelines for Examination of Ayush Related Inventions-2025.pdf",
  "the patents act, 1970": "Patents_Acts.pdf",
  "patents act, 1970": "Patents_Acts.pdf",
  "patents act": "Patents_Acts.pdf",
  "patent act": "Patents_Acts.pdf",
  "food safety and standards (ayurveda aahara) regulations, 2022": "235642.pdf",
  "ayurveda aahara": "235642.pdf",
  "ayurvedic food": "235642.pdf",
  "the biological diversity act, 2002": "a2003-18.pdf",
  "biological diversity act": "a2003-18.pdf",
  "the biological diversity (amendment) act, 2023": "247815.pdf",
  "biological diversity amendment": "247815.pdf",
  "biological diversity rules": "BD_Rules.pdf",
  "biological diversity rules amendment": "AmendmentBD_Rules.pdf",
  "ayurvedic pharmacopoeia of india": "API.pdf",
  "drugs rules, 1945": "Drugs Rules 1945_2024 09.pdf",
  "guidelines for examination of computer related inventions": "Guidelines for Examination of Computer Related Inventions (CRIs)2025.pdf",
  "computer related inventions": "Guidelines for Examination of Computer Related Inventions (CRIs)2025.pdf",
  "guidelines for the use of artificial intelligence in patent examination procedures": "Guidelines for the Use of Artificial Intelligence in Patent Examination Procedures 2026.pdf",
  "artificial intelligence in patent examination": "Guidelines for the Use of Artificial Intelligence in Patent Examination Procedures 2026.pdf",
  "intellectual property india - trade marks journal": "Intellectual Property India.pdf",
  "ayurvedic formulary of india, part i": "1536815128.pdf",
  "ayurvedic formulary of india, part ii": "1536815143.pdf",
  "ayurvedic formulary of india, part iii": "1536815157.pdf",
  "api single drug monographs part i volume i": "1536815480.pdf",
  "api single drug monographs part i volume ii": "1536815559.pdf",
  "api single drug monographs part i volume iii": "1536815619.pdf",
  "api single drug monographs part i volume iv": "1536815772.pdf",
  "api single drug monographs part i volume v": "1536816025.pdf",
  "api single drug monographs part i volume vi": "1536816041.pdf",
  "api single drug monographs part i volume vii": "1536816068.pdf",
  "api single drug monographs part i volume viii": "1536816324.pdf",
  "api single drug monographs part i volume ix": "1536816382.pdf",
  "api single drug monographs part i volume x": "List of single drug monographs published in API vol 10.pdf",
  "api formulation monographs part ii volume i": "1536823254.pdf",
  "api formulation monographs part ii volume ii": "1536823274.pdf",
  "api formulation monographs part ii volume iii": "1536823292.pdf",
  "api formulation monographs part ii volume iv": "1536823311.pdf",
  "wipo treaty on intellectual property, genetic resources and associated traditional knowledge": "Full Official Treaty Text (22 Articles).pdf",
  "wipo treaty executive summary and key disclosure triggers": "Official Executive Summary & Key Disclosure Triggers.pdf",
  "botanical drug development guidance for industry": "Botanical-Drug-Development--Guidance-for-Industry.pdf",
  "small entities compliance guide for renderers - substances prohibited from use in animal food or feed": "CVM-GFI--195-Small-Entities-Compliance-Guide-For-RenderersSubstances-Prohibited-From-Use-In-Animal-Food-Or-Feed.pdf",
  "registration details of geographical indications": "aa9ef4c8-ae0e-4717-9181-52b6a9479b82.pdf",
  "geographical indications registration records": "0dfdca05-ef05-4e45-bf5b-68b5eb5d8507.pdf",
};

/**
 * Resolves title or search term to the authentic PDF filename bundled in public/docs
 */
export function resolveDocumentFilename(title?: string, filename?: string): string {
  if (filename) return filename;
  if (!title) return "Patents_Acts.pdf";

  const clean = title.toLowerCase().trim();

  // Exact or partial match
  for (const [key, fname] of Object.entries(DOC_FILE_MAP)) {
    if (clean.includes(key) || key.includes(clean)) {
      return fname;
    }
  }

  // Domain based fallbacks
  if (clean.includes("ayush") || clean.includes("herbal") || clean.includes("formulation") || clean.includes("traditional")) {
    return "Guidelines for Examination of Ayush Related Inventions-2025.pdf";
  }
  if (clean.includes("food") || clean.includes("aahara") || clean.includes("fssai") || clean.includes("diet")) {
    return "235642.pdf";
  }
  if (clean.includes("biodiversity") || clean.includes("nba") || clean.includes("biological") || clean.includes("abs")) {
    return "a2003-18.pdf";
  }
  if (clean.includes("computer") || clean.includes("software") || clean.includes("cri")) {
    return "Guidelines for Examination of Computer Related Inventions (CRIs)2025.pdf";
  }
  if (clean.includes("ai") || clean.includes("artificial intelligence") || clean.includes("machine learning")) {
    return "Guidelines for the Use of Artificial Intelligence in Patent Examination Procedures 2026.pdf";
  }

  return "Patents_Acts.pdf";
}
