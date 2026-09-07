import React from "react";
import { ShieldCheck, BookOpen, Scale, Sparkles, FileText, CheckCircle } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/70 p-6 sm:p-10 shadow-2xs dark:border-slate-800 dark:bg-slate-900/70 text-center">
      
      {/* Icon & Title */}
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-4 shadow-xs">
        <ShieldCheck className="h-8 w-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-serif mb-2">
        Evidence-Grounded Regulatory Guidance for Ayurveda
      </h3>
      <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
        Ask questions regarding patentability, novelty, traditional knowledge (TKDL), FSSAI Ayurveda Aahara compliance, or biodiversity benefit-sharing. Answers are grounded in 35 authoritative statutory manuals.
      </p>

      {/* Domain Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left max-w-4xl mx-auto">
        
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
            <span className="text-emerald-700">🏛️</span>
            <span>Ayurvedic Patents</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Novelty, inventive step criteria, extraction processes, and non-patentable natural isolates.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
            <span className="text-emerald-700">📚</span>
            <span>TKDL & Prior Art</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Traditional Knowledge Digital Library searches preventing biopiracy and invalid claims.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
            <span className="text-emerald-700">🍃</span>
            <span>Ayurveda Aahara</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            FSSAI 2022 food safety standards, labeling requirements, and permissible additives.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white mb-1.5">
            <span className="text-emerald-700">⚖️</span>
            <span>Biodiversity & ABS</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            National Biodiversity Authority approvals and access-benefit sharing obligations.
          </p>
        </div>

      </div>

    </div>
  );
};
