import { QueryResponse } from "@/types/api";
import { structureAnswer } from "./answer-formatter";

/**
 * Clean markdown symbols for plain-text / document exports
 */
function stripMarkdown(text: string): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s*/g, "")
    .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
    .trim();
}

/**
 * Generates an official publication-ready Word Document (.doc) with UTF-8 BOM support.
 */
export function exportToDoc(response: QueryResponse): void {
  const isMultilingual =
    Boolean(response.translated_answer) &&
    response.answer_language !== "en" &&
    response.translation_status !== "failed";

  const activeAnswerText = isMultilingual && response.translated_answer
    ? response.translated_answer
    : response.answer;

  const structured = structureAnswer(activeAnswerText, response.query);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const queryTitle = (response.original_question || response.query).substring(0, 40).replace(/[^a-zA-Z0-9\u0900-\u0DFF]/g, "_");
  const filename = `IP-SAKTI-Sahayak-Guidance-${queryTitle || "Report"}.doc`;

  // Build high-compatibility HTML/XML Word document
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>IP-SAKTI Sahayak Statutory Intelligence Report</title>
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #111827;
            line-height: 1.6;
            margin: 40px;
          }
          .header {
            border-bottom: 2px solid #0d3826;
            padding-bottom: 12px;
            margin-bottom: 24px;
          }
          .brand-title {
            font-size: 24px;
            font-weight: bold;
            color: #0d3826;
            margin: 0;
          }
          .brand-sub {
            font-size: 13px;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 4px;
          }
          .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
            background-color: #f9faf8;
            border: 1px solid #e2e8df;
          }
          .meta-table td {
            padding: 8px 12px;
            font-size: 12px;
            border: 1px solid #e2e8df;
          }
          .meta-label {
            font-weight: bold;
            color: #0d3826;
            width: 25%;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #0d3826;
            border-bottom: 1px solid #d5ded2;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 12px;
          }
          .summary-box {
            background-color: #f4f8f4;
            border-left: 4px solid #0d3826;
            padding: 14px 18px;
            font-size: 14px;
            margin-bottom: 20px;
          }
          .point-card {
            border: 1px solid #e2e8df;
            background-color: #ffffff;
            border-radius: 6px;
            padding: 14px 16px;
            margin-bottom: 14px;
          }
          .point-title {
            font-size: 13px;
            font-weight: bold;
            color: #0d3826;
            margin-bottom: 6px;
          }
          .point-content {
            font-size: 13px;
            color: #374151;
          }
          .sources-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            margin-bottom: 24px;
            font-size: 12px;
          }
          .sources-table th {
            background-color: #edf2ea;
            color: #0d3826;
            font-weight: bold;
            text-align: left;
            padding: 8px;
            border: 1px solid #d5ded2;
          }
          .sources-table td {
            padding: 8px;
            border: 1px solid #e2e8df;
          }
          .disclaimer-box {
            background-color: #fef8ee;
            border: 1px solid #faecd5;
            color: #78350f;
            padding: 12px 16px;
            font-size: 11px;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand-title">IP-SAKTI Sahayak</div>
          <div class="brand-sub">Statutory &amp; Regulatory Intelligence Report · Ayurveda &amp; IPR</div>
        </div>

        <table class="meta-table">
          <tr>
            <td class="meta-label">Date Generated:</td>
            <td>${dateStr}</td>
          </tr>
          <tr>
            <td class="meta-label">Inquiry / Question:</td>
            <td><strong>${stripMarkdown(response.original_question || response.query)}</strong></td>
          </tr>
          ${
            response.translated_query && response.translated_query !== (response.original_question || response.query)
              ? `<tr><td class="meta-label">English Translation:</td><td>${stripMarkdown(response.translated_query)}</td></tr>`
              : ""
          }
          <tr>
            <td class="meta-label">Classification Intent:</td>
            <td>${response.route.intent || "patentability_assessment"} (${response.route.categories?.join(" · ") || "Patents Act 1970 · AYUSH"})</td>
          </tr>
          <tr>
            <td class="meta-label">Evidence Grounding:</td>
            <td>${response.confidence.toUpperCase()} CONFIDENCE (BGE-M3 Semantic Match: ${
              response.sources?.[0]?.similarity
                ? Math.round(response.sources[0].similarity * 100) + "%"
                : "Verified"
            })</td>
          </tr>
        </table>

        ${
          structured.summary
            ? `
            <div class="section-title">1. Executive Summary</div>
            <div class="summary-box">
              ${stripMarkdown(structured.summary)}
            </div>
          `
            : ""
        }

        ${
          structured.points && structured.points.length > 0
            ? `
            <div class="section-title">2. Point-by-Point Statutory Guidance</div>
            ${structured.points
              .map(
                (pt, idx) => `
                <div class="point-card">
                  <div class="point-title">${idx + 1}. ${pt.title || "Statutory Consideration"}</div>
                  <div class="point-content">${stripMarkdown(pt.content)}</div>
                </div>
              `
              )
              .join("")}
          `
            : ""
        }

        ${
          response.sources && response.sources.length > 0
            ? `
            <div class="section-title">3. Authoritative Statutory Sources &amp; Citations</div>
            <table class="sources-table">
              <thead>
                <tr>
                  <th style="width: 10%;">Source</th>
                  <th style="width: 50%;">Statutory Publication Title</th>
                  <th style="width: 25%;">Authority / Domain</th>
                  <th style="width: 15%;">Page / Link</th>
                </tr>
              </thead>
              <tbody>
                ${response.sources
                  .map(
                    (s) => `
                    <tr>
                      <td><strong>[Source ${String(s.source_number).padStart(2, "0")}]</strong></td>
                      <td>${s.source_title}</td>
                      <td>${s.authority || "Government of India"}<br><small style="color: #6b7280;">${s.category}</small></td>
                      <td>Page ${s.page_number}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          `
            : ""
        }

        <div class="disclaimer-box">
          <strong>Statutory Jurisdictional Caveat:</strong><br>
          ${response.disclaimer || "This information is for general guidance only and does not constitute legal advice."}
          Information synthesized strictly via retrieval-augmented artificial intelligence from verified statutory gazettes and patent examination guidelines.
        </div>
      </body>
    </html>
  `;

  // Prepend UTF-8 BOM so Indian scripts and special characters open flawlessly
  const blob = new Blob(["\ufeff", htmlContent], {
    type: "application/msword;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Generates an official high-resolution printable PDF window ready to print/save.
 */
export function exportToPdf(response: QueryResponse): void {
  const isMultilingual =
    Boolean(response.translated_answer) &&
    response.answer_language !== "en" &&
    response.translation_status !== "failed";

  const activeAnswerText = isMultilingual && response.translated_answer
    ? response.translated_answer
    : response.answer;

  const structured = structureAnswer(activeAnswerText, response.query);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate your PDF document.");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>IP-SAKTI Sahayak - Statutory Intelligence Report</title>
        <style>
          @page {
            size: A4;
            margin: 15mm 15mm 20mm 15mm;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #0f1f17;
            background-color: #ffffff;
            line-height: 1.55;
            padding: 24px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2px solid #0d3826;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .logo-text {
            font-size: 22px;
            font-weight: 800;
            color: #0d3826;
            font-family: Georgia, serif;
          }
          .logo-sub {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #4b5563;
          }
          .badge {
            display: inline-block;
            background-color: #edf2ea;
            color: #0d3826;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 700;
            border: 1px solid #d5ded2;
          }
          .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            background-color: #f8faf6;
            border: 1px solid #e2e8df;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
            font-size: 12px;
          }
          .meta-item strong {
            color: #0d3826;
          }
          .inquiry-box {
            background-color: #fbfcf9;
            border: 1px solid #d5ded2;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 20px;
          }
          .inquiry-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            font-weight: 700;
          }
          .inquiry-text {
            font-size: 15px;
            font-weight: 700;
            color: #0f1f17;
            margin-top: 4px;
          }
          .section-title {
            font-size: 15px;
            font-weight: 700;
            color: #0d3826;
            border-bottom: 1px solid #e2e8df;
            padding-bottom: 4px;
            margin-top: 24px;
            margin-bottom: 12px;
            font-family: Georgia, serif;
          }
          .summary-card {
            background-color: #f4f8f4;
            border-left: 4px solid #0d3826;
            border-radius: 0 8px 8px 0;
            padding: 14px 16px;
            font-size: 13.5px;
            color: #1f2937;
            margin-bottom: 16px;
          }
          .point-item {
            border: 1px solid #e2e8df;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            page-break-inside: avoid;
          }
          .point-header {
            font-size: 12.5px;
            font-weight: 700;
            color: #0d3826;
            margin-bottom: 4px;
          }
          .point-body {
            font-size: 12.5px;
            color: #374151;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11.5px;
            margin-top: 8px;
          }
          th {
            background-color: #edf2ea;
            color: #0d3826;
            font-weight: 700;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #d5ded2;
          }
          td {
            padding: 8px 10px;
            border: 1px solid #e2e8df;
          }
          .disclaimer {
            background-color: #fef8ee;
            border: 1px solid #faecd5;
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 10.5px;
            color: #78350f;
            margin-top: 24px;
            page-break-inside: avoid;
          }
          .print-bar {
            background-color: #0d3826;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .btn-print {
            background-color: #10b981;
            color: #064e3b;
            font-weight: 700;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="print-bar no-print">
          <span>Ready to save official report as PDF</span>
          <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
        </div>

        <div class="header">
          <div>
            <div class="logo-text">IP-SAKTI Sahayak</div>
            <div class="logo-sub">Intellectual Property &amp; Regulatory Intelligence for Ayurveda</div>
          </div>
          <div>
            <span class="badge">Official Guidance Memo</span>
          </div>
        </div>

        <div class="inquiry-box">
          <div class="inquiry-label">Inquiry Evaluated</div>
          <div class="inquiry-text">${stripMarkdown(response.original_question || response.query)}</div>
          ${
            response.translated_query && response.translated_query !== (response.original_question || response.query)
              ? `<div style="font-size: 11.5px; color: #0d3826; margin-top: 4px;"><strong>English Query:</strong> "${stripMarkdown(response.translated_query)}"</div>`
              : ""
          }
        </div>

        <div class="meta-grid">
          <div class="meta-item"><strong>Date:</strong> ${dateStr}</div>
          <div class="meta-item"><strong>Jurisdiction:</strong> ${response.route.jurisdiction || "India"} (IPO / NBA / AYUSH)</div>
          <div class="meta-item"><strong>Classification:</strong> ${response.route.intent || "patentability_assessment"}</div>
          <div class="meta-item"><strong>Evidence Confidence:</strong> ${response.confidence.toUpperCase()} (${response.sources?.[0]?.similarity ? Math.round(response.sources[0].similarity * 100) + "% match" : "Grounded"})</div>
        </div>

        ${
          structured.summary
            ? `
            <div class="section-title">1. Executive Summary</div>
            <div class="summary-card">
              ${stripMarkdown(structured.summary)}
            </div>
          `
            : ""
        }

        ${
          structured.points && structured.points.length > 0
            ? `
            <div class="section-title">2. Point-by-Point Statutory Guidance</div>
            ${structured.points
              .map(
                (pt, idx) => `
                <div class="point-item">
                  <div class="point-header">${idx + 1}. ${pt.title || "Statutory Consideration"}</div>
                  <div class="point-body">${stripMarkdown(pt.content)}</div>
                </div>
              `
              )
              .join("")}
          `
            : ""
        }

        ${
          response.sources && response.sources.length > 0
            ? `
            <div class="section-title">3. Authoritative Statutory Sources (Retrieved via BGE-M3)</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 12%;">Source ID</th>
                  <th style="width: 48%;">Title</th>
                  <th style="width: 25%;">Authority</th>
                  <th style="width: 15%;">Page</th>
                </tr>
              </thead>
              <tbody>
                ${response.sources
                  .map(
                    (s) => `
                    <tr>
                      <td><strong>[Source ${String(s.source_number).padStart(2, "0")}]</strong></td>
                      <td>${s.source_title}</td>
                      <td>${s.authority || "Government of India"}<br><small style="color: #6b7280;">${s.category}</small></td>
                      <td>Page ${s.page_number}</td>
                    </tr>
                  `
                  )
                  .join("")}
              </tbody>
            </table>
          `
            : ""
        }

        <div class="disclaimer">
          <strong>Statutory Jurisdictional Disclaimer:</strong><br>
          ${response.disclaimer || "This guidance is for informational purposes only and does not constitute formal legal counsel."}
          Determinations of patentability remain under the sole jurisdiction of the Controller General of Patents, Designs and Trade Marks (CGPDTM) under The Patents Act, 1970.
        </div>

        <script>
          // Automatically trigger system print dialog after styles settle
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.print();
            }, 500);
          });
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
