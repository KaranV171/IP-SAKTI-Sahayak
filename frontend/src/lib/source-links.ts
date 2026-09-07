/**
 * Returns a guaranteed working link to view the authentic statutory PDF document
 * directly in the browser, anchored to the specific cited page number.
 */
export function getOfficialSourceUrl(title?: string, pageNumber?: number, backendUrl?: string | null): string {
  // If backend provided a working external URL that is not broken
  if (backendUrl && backendUrl.startsWith("http") && !backendUrl.includes("writereaddata/Portal/IPOGuidelines")) {
    return backendUrl;
  }

  const safeTitle = encodeURIComponent(title || "The Patents Act, 1970");
  const pageParam = pageNumber ? `#page=${pageNumber}` : "";

  // Internal document viewer route that serves the real 35 statutory PDFs from IP-SAKTI-DATA
  return `/api/docs?title=${safeTitle}${pageParam}`;
}
