"use client";

import React, { useEffect, useState, useRef } from "react";
import { getBackendStatus } from "@/lib/api";
import { SUPPORTED_LANGUAGES } from "@/lib/languages";

interface NavbarProps {
  activeTab: "ask" | "knowledge" | "about";
  setActiveTab: (tab: "ask" | "knowledge" | "about") => void;
  onResetHome?: () => void;
  selectedLanguage?: string;
  onSelectLanguage?: (langCode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onResetHome,
  selectedLanguage = "en",
  onSelectLanguage,
}) => {
  const [backendStatus, setBackendStatus] = useState<{
    isHealthy: boolean;
    database?: string;
    error?: string;
  } | null>(null);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e2e8df] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
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
            <div className="w-9 h-9 rounded-lg bg-[#0d3826] text-white flex items-center justify-center shadow-xs group-hover:bg-[#154a34] transition-colors">
              <span className="material-symbols-outlined text-[1.35rem]">verified_user</span>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-serif text-base sm:text-lg font-semibold text-[#0f1f17] group-hover:text-[#0d3826] tracking-tight leading-none transition-colors">
                  IP-SAKTI Sahayak
                </span>
                <span className="px-1.5 py-0.5 bg-[#edf2ea] text-[#0d3826] font-mono text-[10px] rounded uppercase tracking-wider font-semibold border border-[#d5ded2]">
                  Gov-Alpha
                </span>
              </div>
              <span className="font-sans text-[11px] text-[#4b5563] uppercase tracking-widest leading-none mt-1">
                IPR &amp; Regulatory Intelligence
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f4f6f1] p-1 rounded-lg border border-[#e2e8df]">
          <button
            onClick={() => {
              setActiveTab("ask");
              if (onResetHome) onResetHome();
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ask"
                ? "text-[#0d3826] bg-white shadow-xs font-bold"
                : "text-[#4b5563] hover:text-[#0f1f17] hover:bg-white/60"
            }`}
          >
            Ask Sahayak
          </button>
          <button
            onClick={() => setActiveTab("knowledge")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "knowledge"
                ? "text-[#0d3826] bg-white shadow-xs font-bold"
                : "text-[#4b5563] hover:text-[#0f1f17] hover:bg-white/60"
            }`}
          >
            Knowledge Base
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "about"
                ? "text-[#0d3826] bg-white shadow-xs font-bold"
                : "text-[#4b5563] hover:text-[#0f1f17] hover:bg-white/60"
            }`}
          >
            About Platform
          </button>
        </nav>

        {/* Right side: Live RAG status + IndicTrans2 Language Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Live RAG Online pill */}
          <div className="hidden xl:flex items-center gap-2 bg-white border border-[#e2e8df] px-3 py-1.5 rounded-lg shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              <span className="font-mono text-xs text-[#0f1f17] font-semibold">
                {backendStatus?.isHealthy ? "RAG Online" : "Service Connecting"}
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#6b7280] pl-2 border-l border-[#e2e8df]">
              BGE-M3 · pgvector · Qwen3:8B
            </span>
          </div>

          {/* Real Multilingual Language Selector with IndicTrans2 */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 bg-white hover:bg-[#f4f7f2] border border-[#d5ded2] hover:border-[#0d3826]/40 text-[#0f1f17] px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
              title="Select Query and Response Language"
            >
              <span className="material-symbols-outlined text-[1rem] text-[#0d3826]">
                translate
              </span>
              <span className="font-medium text-xs">
                {currentLang.native_name}
              </span>
              {currentLang.code !== "en" && (
                <span className="text-[10px] text-[#6b7280] hidden sm:inline">
                  ({currentLang.display_name})
                </span>
              )}
              <span className="material-symbols-outlined text-[0.85rem] text-[#6b7280]">
                {isLangOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-[#d5ded2] rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#e2e8df] flex items-center justify-between bg-[#f8faf6]">
                  <span className="font-mono text-[10px] text-[#4b5563] uppercase tracking-wider font-semibold">
                    Select Language (IndicTrans2)
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-[#edf2ea] text-[#0d3826] rounded font-bold border border-[#d5ded2]">
                    12 Active
                  </span>
                </div>

                <div className="py-1">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = lang.code === selectedLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          if (onSelectLanguage) onSelectLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#edf2ea] text-[#0d3826] font-semibold"
                            : "text-[#1f2937] hover:bg-[#f4f6f1] hover:text-[#0f1f17]"
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {lang.native_name}
                          </span>
                          <span className="text-[10px] text-[#6b7280]">
                            {lang.display_name} · {lang.script}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[1rem] text-[#0d3826]">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-[#e2e8df] px-4 py-2 bg-white justify-around text-xs font-semibold">
        <button
          onClick={() => {
            setActiveTab("ask");
            if (onResetHome) onResetHome();
          }}
          className={`py-1 px-2.5 rounded ${
            activeTab === "ask" ? "bg-[#edf2ea] text-[#0d3826]" : "text-[#6b7280]"
          }`}
        >
          Ask Sahayak
        </button>
        <button
          onClick={() => setActiveTab("knowledge")}
          className={`py-1 px-2.5 rounded ${
            activeTab === "knowledge" ? "bg-[#edf2ea] text-[#0d3826]" : "text-[#6b7280]"
          }`}
        >
          Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`py-1 px-2.5 rounded ${
            activeTab === "about" ? "bg-[#edf2ea] text-[#0d3826]" : "text-[#6b7280]"
          }`}
        >
          About Platform
        </button>
      </div>
    </header>
  );
};
