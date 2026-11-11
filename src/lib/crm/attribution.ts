/**
 * Attribution clues carried with an enquiry so leads can be attributed by hand
 * in the CRM. Shared by the browser (which captures them) and the server
 * (which writes them into the lead's Notes), so nothing here is server-only.
 */

/** sessionStorage key the capture component writes and the forms read. */
export const ATTRIBUTION_STORAGE_KEY = "migss-attribution";

/** Query parameters worth keeping from the landing URL. */
export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
] as const;

/** Everything the capture component may store, in the order Notes shows it. */
export const ATTRIBUTION_KEYS = [
  ...ATTRIBUTION_PARAMS,
  "landing_page",
  "referrer",
] as const;

export type AttributionKey = (typeof ATTRIBUTION_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

const MAX_VALUE_LENGTH = 300;

/**
 * Reads the attribution JSON a form posted. The browser sends it, so it is
 * untrusted: unknown keys are dropped, values are trimmed and capped, and
 * anything malformed yields an empty object rather than an error.
 */
export function parseAttribution(raw: string | null | undefined): Attribution {
  if (!raw) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

  const result: Attribution = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = (parsed as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim().slice(0, MAX_VALUE_LENGTH);
    }
  }
  return result;
}

/** Picks the attribution parameters out of a landing URL's query string. */
export function attributionFromSearch(search: string): Attribution {
  const params = new URLSearchParams(search);
  const result: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const value = params.get(key);
    if (value && value.trim()) result[key] = value.trim().slice(0, MAX_VALUE_LENGTH);
  }
  return result;
}

/** The line in Notes that the duplicate check searches for. */
export function submissionIdLine(submissionId: string): string {
  return `Submission ID: ${submissionId}`;
}

/**
 * The lead's Notes: where it was sent from, the attribution clues, and the
 * submission ID used to stop a retry creating a second row.
 */
export function formatNotes({
  submissionId,
  pageUrl,
  attribution,
}: {
  submissionId: string;
  pageUrl: string;
  attribution: Attribution;
}): string {
  const lines = [`Sent from: ${pageUrl || "unknown"}`];
  for (const key of ATTRIBUTION_KEYS) {
    const value = attribution[key];
    if (value) lines.push(`${key}: ${value}`);
  }
  lines.push(submissionIdLine(submissionId));
  return lines.join("\n");
}
