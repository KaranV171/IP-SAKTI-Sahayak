import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Exhaustive mapping of all 35 statutory documents in IP-SAKTI database
const DOC_FILE_MAP: Record<string, string> = {
  "guidelines for examination of ayush related inventions": "Guidelines for Examination of Ayush Related Inventions-2025.pdf",
  "the patents act, 1970": "Patents_Acts.pdf",
  "patents act, 1970": "Patents_Acts.pdf",
  "food safety and standards (ayurveda aahara) regulations, 2022": "235642.pdf",
  "ayurveda aahara": "235642.pdf",
  "the biological diversity act, 2002": "a2003-18.pdf",
  "the biological diversity (amendment) act, 2023": "247815.pdf",
  "biological diversity rules": "BD_Rules.pdf",
  "biological diversity rules amendment": "AmendmentBD_Rules.pdf",
  "ayurvedic pharmacopoeia of india": "API.pdf",
  "drugs rules, 1945": "Drugs Rules 1945_2024 09.pdf",
  "guidelines for examination of computer related inventions": "Guidelines for Examination of Computer Related Inventions (CRIs)2025.pdf",
  "guidelines for the use of artificial intelligence in patent examination procedures": "Guidelines for the Use of Artificial Intelligence in Patent Examination Procedures 2026.pdf",
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")?.toLowerCase() || "";
  const filename = searchParams.get("file") || "";

  // Base PDF directory in the project
  const pdfDir = path.resolve(process.cwd(), "..", "IP-SAKTI-DATA", "Data", "pdf");

  let targetFilename = filename;

  if (!targetFilename && title) {
    for (const [key, fname] of Object.entries(DOC_FILE_MAP)) {
      if (title.includes(key) || key.includes(title)) {
        targetFilename = fname;
        break;
      }
    }
  }

  // Fallback defaults
  if (!targetFilename) {
    if (title.includes("patent") || title.includes("ayush")) {
      targetFilename = "Guidelines for Examination of Ayush Related Inventions-2025.pdf";
    } else if (title.includes("food") || title.includes("aahara")) {
      targetFilename = "235642.pdf";
    } else if (title.includes("biodiversity")) {
      targetFilename = "a2003-18.pdf";
    } else {
      targetFilename = "Patents_Acts.pdf";
    }
  }

  // Check public/docs first (bundled on Vercel), then local IP-SAKTI-DATA folder
  const publicPath = path.join(process.cwd(), "public", "docs", targetFilename);
  const localPath = path.join(pdfDir, targetFilename);

  const filePath = fs.existsSync(publicPath) ? publicPath : localPath;

  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${targetFilename}"`,
      },
    });
  }

  // If local file does not exist, redirect to official portal
  return NextResponse.redirect("https://ipindia.gov.in");
}
