import type { NextRequest } from "next/server";

import { currentProjectId } from "@/lib/portal/session";
import { fileSourceUrl, getDocument } from "@/lib/wix/portal";

/**
 * Serves one of the signed-in client's documents.
 *
 * The file is fetched from Wix on the server and streamed back from this
 * site's own address, so the client never sees a Wix URL they could forward.
 * The session is checked on every request and the document must belong to
 * the session's project, so guessing another document's ID gets nothing.
 *
 * `?download=1` sends it as an attachment; otherwise it opens in the
 * browser's own PDF viewer.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  let projectId: string | null = null;
  try {
    projectId = await currentProjectId();
  } catch {
    projectId = null;
  }
  if (!projectId) {
    return Response.redirect(new URL("/client-portal", request.url), 303);
  }

  const { id } = await params;
  const document = await getDocument(id).catch(() => null);
  // The same answer for "no such document" and "not yours", for the same
  // reason the sign-in has one error message.
  if (!document || document.projectId !== projectId) {
    return new Response("Not found", { status: 404 });
  }

  let upstream: Response;
  try {
    const source = await fileSourceUrl(document.file);
    upstream = await fetch(source, { cache: "no-store" });
    if (!upstream.ok || !upstream.body) throw new Error(`${upstream.status}`);
  } catch (error) {
    console.error("[client-portal] could not fetch document", id, error);
    return new Response("This document is unavailable right now.", {
      status: 502,
    });
  }

  const download = request.nextUrl.searchParams.get("download") === "1";
  // RFC 6266: an ASCII fallback, and the real name UTF-8 encoded alongside.
  const ascii = document.fileName.replace(/[^\x20-\x7e]/g, "_").replace(/"/g, "");
  const disposition = `${download ? "attachment" : "inline"}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(document.fileName)}`;

  const headers = new Headers({
    // Wix's download links are served as generic binary, which would make
    // the browser download instead of view; a PDF is named as one.
    "Content-Type": /\.pdf$/i.test(document.fileName)
      ? "application/pdf"
      : upstream.headers.get("content-type") || "application/octet-stream",
    "Content-Disposition": disposition,
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(upstream.body, { status: 200, headers });
}
