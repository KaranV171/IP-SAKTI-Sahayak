import { NextRequest, NextResponse } from "next/server";
import { resolveDocumentFilename } from "@/lib/statutory-data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "";
  const file = searchParams.get("file") || "";

  const targetFilename = resolveDocumentFilename(title, file);

  // Redirect to the static public asset directly so browser & Vercel CDN handle streaming & page anchors
  const staticUrl = new URL(`/docs/${encodeURIComponent(targetFilename)}`, req.url);
  return NextResponse.redirect(staticUrl, 307);
}
