"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { QueryInput } from "@/components/query/QueryInput";
import { ExamplePrompts } from "@/components/query/ExamplePrompts";
import { QueryLoading } from "@/components/query/QueryLoading";
import { AnswerCard } from "@/components/answer/AnswerCard";
import { SourcesList } from "@/components/sources/SourcesList";
import { ErrorState } from "@/components/common/ErrorState";
import { KnowledgeView } from "@/components/knowledge/KnowledgeView";
import { AboutView } from "@/components/about/AboutView";
import { QueryResponse } from "@/types/api";
import { askSahayak, translateText } from "@/lib/api";
import { getStatutoryGuidance } from "@/lib/statutory-kb";
import { getUiDictionary, SUPPORTED_LANGUAGES } from "@/lib/languages";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"ask" | "knowledge" | "about">("ask");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);

  const ui = getUiDictionary(selectedLanguage);
  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage);

  const handleSelectLanguage = async (newLang: string) => {
    setSelectedLanguage(newLang);

    // If an answer is currently displayed, dynamically update or translate it
    if (response) {
      if (newLang === "en") {
        setResponse((prev) =>
          prev
            ? {
                ...prev,
                answer_language: "en",
              }
            : null
        );
        return;
      }

      // If already in that language with valid translation, no re-translation needed
      if (response.answer_language === newLang && response.translated_answer) {
        return;
      }

      // Check precompiled statutory knowledge for instant translation
      const fallbackLookup = getStatutoryGuidance(
        response.original_question || response.query,
        3,
        newLang
      );
      if (fallbackLookup.translated_answer && fallbackLookup.answer_language === newLang) {
        setResponse((prev) =>
          prev
            ? {
                ...prev,
                answer_language: newLang,
                translated_answer: fallbackLookup.translated_answer,
                translation_status: "success",
              }
            : null
        );
        return;
      }

      // Otherwise dynamically translate via IndicTrans2
      setIsTranslating(true);
      try {
        const transResult = await translateText(response.answer, newLang, "en");
        setResponse((prev) =>
          prev
            ? {
                ...prev,
                answer_language: newLang,
                translated_answer: transResult.translated_text,
                translation_status: transResult.status as "success" | "failed" | "bypassed",
              }
            : null
        );
      } catch (transErr) {
        console.error("Dynamic language translation failed:", transErr);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const handleQuery = async (queryText?: string) => {
    const textToQuery = (queryText || question).trim();
    if (!textToQuery || isLoading) return;

    if (queryText) {
      setQuestion(queryText);
    }

    setIsLoading(true);
    setError(null);
    setHighlightedSource(null);

    try {
      const data = await askSahayak(textToQuery, 3, selectedLanguage);
      setResponse(data);
    } catch (err: unknown) {
      const errorObj = err as Error;
      console.error("Query failed:", errorObj);
      setError(errorObj.message || "Failed to receive response from IP-SAKTI Sahayak.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (sourceNumber: number, _pageNumber?: number) => {
    setHighlightedSource(sourceNumber);
    setTimeout(() => {
      setHighlightedSource((prev) => (prev === sourceNumber ? null : prev));
    }, 4000);
  };

  const handleNewQuestion = () => {
    setResponse(null);
    setQuestion("");
    setError(null);
    setHighlightedSource(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfcf9] text-[#0f1f17] font-sans selection:bg-[#d8e8dc] selection:text-[#0d3826] relative">
      
      {/* Top Navbar with Real Language Selector */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onResetHome={handleNewQuestion}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Main Container with subtle geometric grid background */}
      <main className="flex-1 w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 relative">
        
        {/* TAB 1: ASK SAHAYAK (Main Research Workspace) */}
        {activeTab === "ask" && (
          <div className="flex flex-col gap-8 relative">
            
            {/* Subtle architectural grid pattern in hero background */}
            <div className="absolute -top-12 -inset-x-4 sm:-inset-x-8 h-80 hero-grid-pattern pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_70%,transparent_100%)] opacity-70" />

            {/* If no response and not loading, show the Hero Header */}
            {!response && !isLoading && (
              <div className="flex flex-col gap-4 max-w-4xl pt-2">
                
                {/* Sub-header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#edf2ea] px-3 py-1 rounded-full text-[#0d3826] font-mono text-xs uppercase tracking-wide border border-[#d5ded2] shadow-2xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                    Verified Statutory Corpus
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 bg-white text-[#4b5563] px-3 py-1 rounded-full font-mono text-xs border border-[#e2e8df] shadow-2xs">
                    <span className="material-symbols-outlined text-[0.95rem] text-[#0d3826]">database</span>
                    BGE-M3 Semantic Retrieval
                  </span>

                  <span className="inline-flex items-center gap-1.5 bg-white text-[#4b5563] px-3 py-1 rounded-full font-mono text-xs border border-[#e2e8df] shadow-2xs">
                    <span className="material-symbols-outlined text-[0.95rem] text-[#d97706]">verified_user</span>
                    Section 3(p) &amp; TKDL Aligned
                  </span>

                  {selectedLanguage !== "en" && currentLang && (
                    <span className="inline-flex items-center gap-1.5 bg-[#e6f4ea] text-[#0d3826] px-3 py-1 rounded-full font-mono text-xs border border-[#b8dfc4] shadow-2xs font-semibold">
                      <span className="material-symbols-outlined text-[0.95rem] text-[#10b981]">translate</span>
                      IndicTrans2: {currentLang.display_name} ({currentLang.native_name})
                    </span>
                  )}
                </div>

                {/* Hero Title & Description */}
                <div className="flex flex-col gap-2.5 mt-1">
                  <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#0f1f17] tracking-tight leading-[1.15]">
                    Research IPR &amp; Regulatory Requirements with <span className="underline decoration-[#10b981] decoration-4 underline-offset-4 text-[#0d3826]">Evidence</span>
                  </h1>
                  <p className="font-sans text-sm sm:text-base text-[#4b5563] max-w-3xl leading-relaxed">
                    Ask questions in {currentLang?.display_name || "English"} about patents, AYUSH inventions, traditional knowledge, biodiversity (NBA/ABS), Ayurvedic food regulations (FSSAI), and related statutory frameworks in Indian jurisprudence.
                  </p>
                </div>

              </div>
            )}

            {/* Main Query Console (Always visible unless in pure answer view) */}
            {!response && !isLoading && (
              <div className="flex flex-col gap-6">
                <QueryInput
                  question={question}
                  setQuestion={setQuestion}
                  onSubmit={() => handleQuery()}
                  isLoading={isLoading}
                  onClear={() => setQuestion("")}
                  placeholder={ui.searchPlaceholder}
                  submitLabel={ui.submit}
                />

                <ExamplePrompts
                  disabled={isLoading}
                  onSelectPrompt={(prompt) => {
                    setQuestion(prompt);
                    handleQuery(prompt);
                  }}
                />
              </div>
            )}

            {/* PROCESSING STATE with 4-stage pipeline */}
            {isLoading && (
              <QueryLoading queryText={question} language={selectedLanguage} />
            )}

            {/* ERROR STATE */}
            {error && !isLoading && (
              <ErrorState error={error} onRetry={() => handleQuery()} />
            )}

            {/* SUCCESSFUL ANSWER & EVIDENCE VIEW */}
            {response && !isLoading && (
              <div className="flex flex-col gap-8">
                
                {/* Answer Summary Card + Diagnostic Strip */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Central Synthesis Column (Span 8) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <AnswerCard
                      response={response}
                      onCitationClick={handleCitationClick}
                      onNewQuestion={handleNewQuestion}
                      onFollowUpSubmit={(refined) => handleQuery(refined)}
                      selectedLanguage={selectedLanguage}
                      onSelectLanguage={handleSelectLanguage}
                      isTranslating={isTranslating}
                    />
                  </div>

                  {/* Right Evidence Drawer / Sources Column (Span 4) */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <SourcesList
                      sources={response.sources}
                      highlightedSourceNumber={highlightedSource}
                    />
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE REGISTRY */}
        {activeTab === "knowledge" && <KnowledgeView />}

        {/* TAB 3: ABOUT PLATFORM */}
        {activeTab === "about" && <AboutView />}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
