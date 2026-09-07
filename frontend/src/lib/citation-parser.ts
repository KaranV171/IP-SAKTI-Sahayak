export interface CitationSegment {
  type: "text" | "citation";
  content: string;
  sourceNumber?: number;
  pageNumber?: number;
}

export function parseAnswerCitations(text: string): CitationSegment[] {
  if (!text) return [];

  // Match patterns like:
  // [Source 1, Page 9]
  // [Source 1, page 9]
  // [Source 1]
  // [Source 1, Page 9-10]
  const citationRegex = /\[Source\s+(\d+)(?:,\s*[Pp]age\s*(\d+(?:-\d+)?))?\]/g;

  const segments: CitationSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = citationRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = citationRegex.lastIndex;

    // Push preceding text segment if not empty
    if (matchStart > lastIndex) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex, matchStart),
      });
    }

    const sourceNum = parseInt(match[1], 10);
    const pageNum = match[2] ? parseInt(match[2].split("-")[0], 10) : undefined;

    segments.push({
      type: "citation",
      content: match[0],
      sourceNumber: isNaN(sourceNum) ? undefined : sourceNum,
      pageNumber: pageNum,
    });

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return segments;
}
