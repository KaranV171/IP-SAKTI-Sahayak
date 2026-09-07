"use client";

import React, { useEffect, useState } from "react";
import { getBackendStatus } from "@/lib/api";

interface NavbarProps {
  activeTab: "ask" | "knowledge" | "about";
  setActiveTab: (tab: "ask" | "knowledge" | "about") => void;
  onResetHome?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onResetHome }) => {
  const [backendStatus, setBackendStatus] = useState<{ isHealthy: boolean; database?: string; error?: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      const status = await getBackendStatus();
      if (isMounted) {
        setBackendStatus(status);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#0a0e18]/90 backdrop-blur-md border-b border-[#22304a] shadow-[0_1px_8px_rgba(0,0,0,0.2)]">
      <div className="h-16 w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand / Insignia */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setActiveTab("ask");
              if (onResetHome) onResetHome();
            }}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            title="Return to Home / New Inquiry"
          >
            {/* Insignia emblem */}
            <div className="w-9 h-9 rounded-lg bg-[#171b26] border border-[#22304a] flex items-center justify-center text-[#68dba9] shadow-sm group-hover:border-[#68dba9]/40 group-hover:bg-[#262a35] transition-colors">
              <span className="material-symbols-outlined text-[1.35rem]">verified_user</span>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-semibold text-[#dfe2f1] group-hover:text-white tracking-tight leading-none transition-colors">
                  IP-SAKTI Sahayak
                </span>
                <span className="px-1.5 py-0.5 bg-[#262a35] text-[#68dba9] font-mono text-[10px] rounded uppercase tracking-wider font-semibold">
                  Gov-Alpha
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#bccac0] uppercase tracking-widest leading-none mt-1">
                IPR &amp; Regulatory Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation tabs from Stitch */}
        <nav className="hidden md:flex items-center gap-1 bg-[#171b26] p-1 rounded border border-[#22304a]">
          <button
            onClick={() => {
              setActiveTab("ask");
              if (onResetHome) onResetHome();
            }}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ask"
                ? "text-[#dfe2f1] bg-[#262a35] shadow-xs"
                : "text-[#bccac0] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]"
            }`}
          >
            Ask Sahayak
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "knowledge"
                ? "text-[#dfe2f1] bg-[#262a35] shadow-xs"
                : "text-[#bccac0] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]"
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "about"
                ? "text-[#dfe2f1] bg-[#262a35] shadow-xs"
                : "text-[#bccac0] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]"
            }`}
          >
            About Platform
          </button>
        </nav>

        {/* Right side: Live RAG status + Language indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Live RAG Online pill */}
          <div className="hidden xl:flex items-center gap-2 bg-[#171b26] border border-[#22304a] px-3 py-1 rounded">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#68dba9] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#68dba9]"></span>
              </span>
              <span className="font-mono text-xs text-[#dfe2f1] font-semibold">
                {backendStatus?.isHealthy ? "RAG Online" : "Service Connecting"}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#bccac0]/70 pl-1 border-l border-[#22304a]">
              BGE-M3 · pgvector · Qwen3:8B
            </span>
          </div>

          {/* Language Selector (Honest: English active, Indic coming soon) */}
          <div className="flex items-center gap-1.5 bg-[#171b26] border border-[#22304a] text-[#bccac0] px-2.5 py-1 rounded">
            <span className="font-mono text-xs text-[#dfe2f1]">English</span>
            <span className="px-1.5 py-0.5 bg-[#262a35] text-[#bccac0] font-mono text-[10px] rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[0.8rem]">lock</span>
              <span className="hidden sm:inline">Indic: Coming Soon</span>
              <span className="sm:hidden">Indic</span>
            </span>
          </div>

        </div>

      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-[#22304a] px-4 py-2 bg-[#0a0e18] justify-around text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab("ask");
            if (onResetHome) onResetHome();
          }}
          className={`py-1 px-2.5 rounded ${
            activeTab === "ask" ? "bg-[#262a35] text-[#68dba9]" : "text-[#bccac0]"
          }`}
        >
          Ask Sahayak
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`py-1 px-2.5 rounded ${
            activeTab === "knowledge" ? "bg-[#262a35] text-[#68dba9]" : "text-[#bccac0]"
          }`}
        >
          Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`py-1 px-2.5 rounded ${
            activeTab === "about" ? "bg-[#262a35] text-[#68dba9]" : "text-[#bccac0]"
          }`}
        >
          About Platform
        </button>
      </div>
    </header>
  );
};
