import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IP-SAKTI Sahayak | IPR & Regulatory Intelligence for Ayurveda",
  description:
    "Evidence-grounded multilingual RAG assistant for Intellectual Property Rights (IPR) and regulatory guidance in Ayurveda, powered by BGE-M3, pgvector, and Qwen3.",
  keywords: [
    "Ayurveda",
    "IPR",
    "Patents",
    "AYUSH",
    "TKDL",
    "FSSAI Ayurveda Aahara",
    "Smart India Hackathon",
    "Biological Diversity Act",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfcf9] text-[#0f1f17]">
        {children}
      </body>
    </html>
  );
}
