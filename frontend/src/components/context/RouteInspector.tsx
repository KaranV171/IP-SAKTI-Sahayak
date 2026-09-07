import React from "react";
import { Compass, Target, Tag, Globe, CheckCircle2, ChevronRight } from "lucide-react";
import { QueryRoute } from "@/types/api";

interface RouteInspectorProps {
  route: QueryRoute;
  sourceCount: number;
}

export const RouteInspector: React.FC<RouteInspectorProps> = ({ route, sourceCount }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <Compass className="h-4 w-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-serif">
            Query Understanding & Routing
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Automated domain classification prior to vector retrieval
          </p>
        </div>
      </div>

      <div className="space-y-3.5 text-xs">
        
        {/* Intent */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
            <Target className="h-3 w-3 text-slate-400" />
            Detected Intent:
          </span>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200 uppercase font-mono text-[11px]">
            {route.intent || "General Inquire"}
          </span>
        </div>

        {/* Categories */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
            <Tag className="h-3 w-3 text-slate-400" />
            Routed Knowledge Categories:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {route.categories && route.categories.length > 0 ? (
              route.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[11px]"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
                  {cat}
                </span>
              ))
            ) : (
              <span className="text-slate-500 italic">Universal Knowledge Domain</span>
            )}
          </div>
        </div>

        {/* Jurisdiction */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
            <Globe className="h-3 w-3 text-slate-400" />
            Applicable Jurisdiction:
          </span>
          <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <span>🇮🇳</span>
            <span>{route.jurisdiction || "India"}</span>
          </span>
        </div>

        {/* Retrieval metric */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Sources Filtered:</span>
          <strong className="text-slate-700 dark:text-slate-300">{sourceCount} Chunks</strong>
        </div>

      </div>

    </div>
  );
};
