import React from "react";
import { ShieldCheck, Cpu, Database, Sparkles, Scale, CheckCircle2, ArrowRight, Layers } from "lucide-react";

export const AboutView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Smart India Hackathon 2024</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">
          About IP-SAKTI Sahayak
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          An evidence-grounded multilingual Retrieval-Augmented Generation assistant designed to demystify Intellectual Property and regulatory hurdles for the Ayurvedic ecosystem.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* The Problem & Solution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-3">
            Why IP-SAKTI Sahayak?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            India is home to profound traditional wisdom in Ayurveda, Siddha, and Unani systems of medicine. However, innovators, university researchers, Ayurvedic drug manufacturers, and startups frequently struggle with:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 mb-4">
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Section 3(p) TKDL exclusions vs patentable process claims</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>FSSAI 2022 Ayurveda Aahara vs AYUSH proprietary medicine distinctions</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>National Biodiversity Authority (NBA) Access and Benefit-Sharing regulations</span>
            </div>
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>Inventive step & synergism evidence protocols for polyherbal mixtures</span>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-emerald-700" />
            <span>Under the Hood: The Grounded RAG Architecture</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="font-bold text-slate-900 dark:text-white mb-1">1. Query Router</div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Classifies user intent (Patents, TKDL, Food, AYUSH) and routes metadata filters before embedding generation.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="font-bold text-slate-900 dark:text-white mb-1">2. BGE-M3 + pgvector</div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Generates 1024-dimensional dense embeddings running on CUDA with cosine similarity search in PostgreSQL.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="font-bold text-slate-900 dark:text-white mb-1">3. Qwen3:8B via Ollama</div>
              <p className="text-slate-500 dark:text-slate-400 leading-normal">
                Strict grounding prompt enforces citations like [Source X, Page Y] and forbids uncorroborated assertions.
              </p>
            </div>
          </div>
        </div>

        {/* Responsible AI Principles */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-serif mb-2 flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-700" />
            <span>Responsible AI & Statutory Demarcation</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            IP-SAKTI Sahayak is engineered specifically to prevent legal hallucination. It provides confidence ratings based on mathematical vector similarity, highlights exact statutory source and page references, and explicitly flags when retrieved evidence is insufficient to answer any query.
          </p>
        </div>

      </div>

    </div>
  );
};
