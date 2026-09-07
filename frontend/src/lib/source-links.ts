import { resolveDocumentFilename } from "./statutory-data";

/**
 * Returns a guaranteed working direct link to view the authentic statutory PDF document
 * directly in the browser, hosted statically on Vercel CDN, anchored to the specific cited page number.
 */
export function getOfficialSourceUrl(title?: string, pageNumber?: number, backendUrl?: string | null): string {
  // If backend provided a working external URL that is not broken
  if (backendUrl && backendUrl.startsWith("http") && !backendUrl.includes("writereaddata/Portal/IPOGuidelines")) {
    return backendUrl;
  }

  const filename = resolveDocumentFilename(title);
  const pageParam = pageNumber ? `#page=${pageNumber}` : "";

  // Direct static path hosted by Vercel CDN & local Next.js static server
  return `/docs/${encodeURIComponent(filename)}${pageParam}`;
}
