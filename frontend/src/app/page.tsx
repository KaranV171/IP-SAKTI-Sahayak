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
import { askSahayak } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"ask" | "knowledge" | "about">("ask");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [highlightedSource, setHighlightedSource] = useState<number | null>(null);

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
      const data = await askSahayak(textToQuery);
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
    <div className="min-h-screen flex flex-col bg-[#0f131d] text-[#dfe2f1] font-sans selection:bg-[#25a475] selection:text-[#00311f]">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onResetHome={handleNewQuestion}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[84rem] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16">
        
        {/* TAB 1: ASK SAHAYAK (Main Research Workspace) */}
        {activeTab === "ask" && (
          <div className="flex flex-col gap-8 relative">
            
            {/* Ambient subtle emerald glow behind hero from Stitch */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[48rem] h-[18rem] bg-gradient-to-b from-[#25a475]/10 via-[#6bd8cb]/5 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* If no response and not loading, show the Hero Header from Stitch Screen 38e2eb */}
            {!response && !isLoading && (
              <div className="flex flex-col gap-3 max-w-4xl">
                
                {/* Sub-header Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#262a35] px-2.5 py-1 rounded text-[#68dba9] font-mono text-xs uppercase tracking-wide border border-[#3d4a42]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#68dba9] animate-pulse"></span>
                    Verified Statutory Corpus
                  </span>
                  
                  <span className="inline-flex items-center gap-1.5 bg-[#262a35] text-[#bccac0] px-2.5 py-1 rounded font-mono text-xs border border-[#3d4a42]">
                    <span className="material-symbols-outlined text-[0.95rem] text-[#6bd8cb]">database</span>
                    BGE-M3 Semantic Retrieval
                  </span>

                  <span className="inline-flex items-center gap-1.5 bg-[#262a35] text-[#bccac0] px-2.5 py-1 rounded font-mono text-xs border border-[#3d4a42]">
                    <span className="material-symbols-outlined text-[0.95rem] text-[#ffb77d]">verified_user</span>
                    Section 3(p) &amp; TKDL Aligned
                  </span>
                </div>

                {/* Hero Title & Description */}
                <div className="flex flex-col gap-2 mt-1">
                  <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#dfe2f1] tracking-tight">
                    Research IPR &amp; Regulatory Requirements with Evidence
                  </h1>
                  <p className="font-sans text-xs sm:text-base text-[#bccac0] max-w-3xl leading-relaxed">
                    Ask questions about patents, AYUSH inventions, traditional knowledge, biodiversity (NBA/ABS), Ayurvedic food regulations (FSSAI), and related statutory frameworks in Indian jurisprudence.
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

            {/* PROCESSING STATE (Matches Stitch Screen b088faa) */}
            {isLoading && (
              <QueryLoading queryText={question} />
            )}

            {/* ERROR STATE */}
            {error && !isLoading && (
              <ErrorState error={error} onRetry={() => handleQuery()} />
            )}

            {/* SUCCESSFUL ANSWER & EVIDENCE VIEW (Matches Stitch Screen 3596216) */}
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
