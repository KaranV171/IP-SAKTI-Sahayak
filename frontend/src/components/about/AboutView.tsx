"use client";

import React from "react";
import { ShieldCheck, Cpu, Scale, CheckCircle2, Languages, ArrowDown } from "lucide-react";

export const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#edf2ea] px-3.5 py-1 text-xs font-semibold text-[#0d3826] border border-[#d5ded2] mb-3 shadow-2xs">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0d3826]" />
          <span>Smart India Hackathon 2024 · Verified Statutory Assistant</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#0f1f17] font-serif tracking-tight">
          About IP-SAKTI Sahayak
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#4b5563] max-w-xl mx-auto leading-relaxed">
          An evidence-grounded multilingual Retrieval-Augmented Generation assistant designed to demystify Intellectual Property and regulatory hurdles for the Ayurvedic ecosystem.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Multilingual RAG Architecture - High Contrast Feature Block */}
        <div className="rounded-2xl border border-[#e2e8df] bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2.5 bg-[#edf2ea] rounded-xl text-[#0d3826] border border-[#d5ded2]">
              <Languages className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0f1f17] font-serif">
                Multilingual RAG Architecture (IndicTrans2)
              </h3>
              <p className="text-xs text-[#6b7280]">
                Preserving authoritative English statutory indexing while enabling native Indian language access.
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed mt-4 mb-6">
            <strong className="text-[#0f1f17]">IndicTrans2 enables multilingual interaction while the verified knowledge retrieval and generation pipeline remains grounded in the indexed regulatory corpus.</strong> The system never translates the authoritative legal knowledge base itself; translation occurs strictly at the input and output boundaries.
          </p>

          {/* Architectural Flow Diagram - Rich Dark Forest Card */}
          <div className="bg-[#12231b] rounded-2xl p-6 sm:p-7 border border-[#234535] flex flex-col items-center shadow-lg">
            
            {/* Step 1: User */}
            <div className="w-full max-w-md bg-[#183025] rounded-xl p-3.5 border border-[#234535] text-center shadow-xs">
              <span className="font-mono text-[11px] text-[#a3b8af] uppercase tracking-wider block">User Interaction</span>
              <span className="font-sans text-sm font-semibold text-white">
                User Question in Indian Language (Hindi, Tamil, Telugu, etc.)
              </span>
            </div>

            <ArrowDown className="h-5 w-5 text-[#10b981] my-1.5 shrink-0" />

            {/* Step 2: IndicTrans2 Indic -> EN */}
            <div className="w-full max-w-md bg-[#1d3d2f] rounded-xl p-3.5 border border-[#2d5c47] text-center shadow-xs">
              <span className="font-mono text-[11px] text-[#85f8c4] uppercase tracking-wider block font-semibold">Neural Translation Layer</span>
              <span className="font-sans text-sm font-bold text-[#10b981]">
                IndicTrans2 (Indic → English Distilled 200M ONNX)
              </span>
              <span className="text-[11px] text-[#c2d4cb] block mt-0.5">
                Normalizes domain concepts (TKDL, AYUSH, Novelty) to English
              </span>
            </div>

            <ArrowDown className="h-5 w-5 text-[#10b981] my-1.5 shrink-0" />

            {/* Step 3: English RAG Pipeline Box */}
            <div className="w-full max-w-md bg-[#183025] rounded-2xl p-4 border border-[#234535] text-center shadow-sm relative">
              <div className="inline-flex items-center gap-1.5 bg-[#234535] px-3 py-0.5 rounded-full text-[#85f8c4] font-mono text-[10px] uppercase tracking-wider mb-2 border border-[#2d5c47] font-semibold">
                Canonical English RAG Pipeline
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left mt-2">
                <div className="bg-[#12231b] p-2.5 rounded-xl border border-[#234535]">
                  <span className="font-mono text-[10px] text-[#10b981] block font-bold">QueryRouter</span>
                  <span className="text-[11px] text-[#a3b8af] leading-tight block mt-0.5">
                    Intent &amp; Category routing
                  </span>
                </div>
                <div className="bg-[#12231b] p-2.5 rounded-xl border border-[#234535]">
                  <span className="font-mono text-[10px] text-[#85f8c4] block font-bold">BGE-M3 + pgvector</span>
                  <span className="text-[11px] text-[#a3b8af] leading-tight block mt-0.5">
                    Dense vector similarity across 5,842 chunks
                  </span>
                </div>
                <div className="bg-[#12231b] p-2.5 rounded-xl border border-[#234535]">
                  <span className="font-mono text-[10px] text-[#f59e0b] block font-bold">Qwen3:8B (Ollama)</span>
                  <span className="text-[11px] text-[#a3b8af] leading-tight block mt-0.5">
                    Strictly grounded cited answer
                  </span>
                </div>
              </div>
            </div>

            <ArrowDown className="h-5 w-5 text-[#10b981] my-1.5 shrink-0" />

            {/* Step 4: IndicTrans2 EN -> Indic */}
            <div className="w-full max-w-md bg-[#1d3d2f] rounded-xl p-3.5 border border-[#2d5c47] text-center shadow-xs">
              <span className="font-mono text-[11px] text-[#85f8c4] uppercase tracking-wider block font-semibold">Neural Translation Layer</span>
              <span className="font-sans text-sm font-bold text-[#10b981]">
                IndicTrans2 (English → Indic Distilled 200M ONNX)
              </span>
              <span className="text-[11px] text-[#c2d4cb] block mt-0.5">
                Citation Guard: Preserves [Source X, Page Y] and legal disclaimers
              </span>
            </div>

            <ArrowDown className="h-5 w-5 text-[#10b981] my-1.5 shrink-0" />

            {/* Step 5: User Response */}
            <div className="w-full max-w-md bg-[#183025] rounded-xl p-3.5 border border-[#234535] text-center shadow-xs">
              <span className="font-mono text-[11px] text-[#a3b8af] uppercase tracking-wider block">Multilingual Output</span>
              <span className="font-sans text-sm font-semibold text-white">
                Native Language Guidance + Clickable Citations + Verified Sources
              </span>
            </div>

          </div>
        </div>

        {/* The Problem & Solution */}
        <div className="rounded-2xl border border-[#e2e8df] bg-white p-6 sm:p-7 shadow-2xs">
          <h3 className="text-base font-bold text-[#0f1f17] font-serif mb-3">
            Why IP-SAKTI Sahayak?
          </h3>
          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed mb-4">
            India is home to profound traditional wisdom in Ayurveda, Siddha, and Unani systems of medicine. However, innovators, university researchers, Ayurvedic drug manufacturers, and startups frequently struggle with:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#0f1f17] mb-4">
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e2e8df]">
              <CheckCircle2 className="h-4 w-4 text-[#0d3826] mt-0.5 shrink-0" />
              <span>Section 3(p) TKDL exclusions vs patentable process claims</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e2e8df]">
              <CheckCircle2 className="h-4 w-4 text-[#0d3826] mt-0.5 shrink-0" />
              <span>FSSAI 2022 Ayurveda Aahara vs AYUSH proprietary medicine distinctions</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e2e8df]">
              <CheckCircle2 className="h-4 w-4 text-[#0d3826] mt-0.5 shrink-0" />
              <span>National Biodiversity Authority (NBA) Access and Benefit-Sharing regulations</span>
            </div>
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#fafbf8] border border-[#e2e8df]">
              <CheckCircle2 className="h-4 w-4 text-[#0d3826] mt-0.5 shrink-0" />
              <span>Inventive step &amp; synergism evidence protocols for polyherbal mixtures</span>
            </div>
          </div>
        </div>

        {/* Responsible AI Principles */}
        <div className="rounded-2xl border border-[#e2e8df] bg-white p-6 sm:p-7 shadow-2xs">
          <h3 className="text-base font-bold text-[#0f1f17] font-serif mb-2 flex items-center gap-2">
            <Scale className="h-5 w-5 text-[#d97706]" />
            <span>Responsible AI &amp; Statutory Demarcation</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
            IP-SAKTI Sahayak is engineered specifically to prevent legal hallucination. It provides confidence ratings based on mathematical vector similarity, highlights exact statutory source and page references, and explicitly flags when retrieved evidence is insufficient to answer any query.
          </p>
        </div>

      </div>

    </div>
  );
};
