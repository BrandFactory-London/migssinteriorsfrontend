import "server-only";

import { submissionIdLine } from "@/lib/crm/attribution";
import { CRM_DATABASE_ID, CRM_OWNER_PAGE_ID } from "@/lib/crm/config";
import { type Lead, leadProperties } from "@/lib/crm/lead";

/**
 * Writes leads to the Notion Contacts CRM through the Notion REST API, with
 * the internal integration key in NOTION_TOKEN. Server-side only: the key must
 * never reach the browser.
 *
 * Plain fetch rather than the Notion SDK: two endpoints are all this needs.
 */

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const TIMEOUT_MS = 15_000;

export type SaveLeadResult =
  | { ok: true; pageId: string; duplicate: boolean }
  | { ok: false; status: number | null; detail: string };

/** Injected in tests; the defaults are the real environment. */
export type NotionDeps = {
  fetch?: typeof fetch;
  token?: string;
  databaseId?: string;
  ownerPageId?: string;
};

/**
 * Saves one lead as a new CRM row, unless a row with the same submission ID
 * already exists, in which case that row is returned and nothing is written.
 * That is what stops a retry (after an error or an unclear result) or a double
 * click creating a second row. A new submission gets a new ID, so a person who
 * enquires twice still gets two rows, as intended.
 */
export async function saveLead(
  lead: Lead,
  submissionId: string,
  deps: NotionDeps = {},
): Promise<SaveLeadResult> {
  const doFetch = deps.fetch ?? fetch;
  const token = deps.token ?? process.env.NOTION_TOKEN;
  const databaseId = deps.databaseId ?? CRM_DATABASE_ID;
  const ownerPageId = deps.ownerPageId ?? CRM_OWNER_PAGE_ID;

  if (!token) {
    return { ok: false, status: null, detail: "NOTION_TOKEN is not set" };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };

  const existing = await call(doFetch, `${NOTION_API}/databases/${databaseId}/query`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      filter: {
        property: "Notes",
        rich_text: { contains: submissionIdLine(submissionId) },
      },
      page_size: 1,
    }),
  });
  if (!existing.ok) return existing;

  const found = (existing.json as { results?: { id?: string }[] }).results?.[0];
  if (found?.id) return { ok: true, pageId: found.id, duplicate: true };

  const created = await call(doFetch, `${NOTION_API}/pages`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: leadProperties(lead, ownerPageId),
    }),
  });
  if (!created.ok) return created;

  const pageId = (created.json as { id?: string }).id ?? "";
  return { ok: true, pageId, duplicate: false };
}

async function call(
  doFetch: typeof fetch,
  url: string,
  init: RequestInit,
): Promise<
  { ok: true; json: unknown } | { ok: false; status: number | null; detail: string }
> {
  let response: Response;
  try {
    response = await doFetch(url, {
      ...init,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    return { ok: false, status: null, detail: `Request to Notion failed: ${describe(error)}` };
  }

  const body = await response.text();
  if (!response.ok) {
    return { ok: false, status: response.status, detail: body.slice(0, 600) };
  }
  try {
    return { ok: true, json: JSON.parse(body) };
  } catch {
    return { ok: false, status: response.status, detail: "Notion returned a body that is not JSON" };
  }
}

function describe(error: unknown) {
  return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}
