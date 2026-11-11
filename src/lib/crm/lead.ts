/**
 * Turns a lead into the Notion API property payload for the Contacts CRM.
 *
 * Pure, so the mapping can be unit-tested without Notion. The property names
 * must match the CRM exactly: Notion rejects the whole page on an unknown one.
 */

export type LeadType = "Lead" | "Applicant";

export type Lead = {
  name: string;
  email?: string;
  phone?: string;
  formName: string;
  type: LeadType;
  /** What they told us: renovation details, or application answers. */
  message: string;
  /** Where it came from, attribution clues and the submission ID. */
  notes: string;
  /** YYYY-MM-DD, London time. */
  acquired: string;
};

/** Notion caps a single rich text object at 2,000 characters. */
const NOTION_TEXT_LIMIT = 2000;
/** And a rich text property at 100 objects. */
const NOTION_TEXT_PARTS = 100;

export function richText(content: string) {
  const parts: { type: "text"; text: { content: string } }[] = [];
  for (
    let start = 0;
    start < content.length && parts.length < NOTION_TEXT_PARTS;
    start += NOTION_TEXT_LIMIT
  ) {
    parts.push({
      type: "text",
      text: { content: content.slice(start, start + NOTION_TEXT_LIMIT) },
    });
  }
  return parts;
}

export function leadProperties(lead: Lead, ownerPageId: string) {
  return {
    Name: { title: richText(lead.name.slice(0, 200) || "Unnamed") },
    Email: { email: lead.email || null },
    Phone: { phone_number: lead.phone || null },
    Owner: { relation: [{ id: ownerPageId }] },
    Form: { rich_text: richText(lead.formName) },
    Type: { select: { name: lead.type } },
    Status: { select: { name: "New" } },
    Source: { select: { name: "Website form" } },
    Acquired: { date: { start: lead.acquired } },
    Message: { rich_text: richText(lead.message) },
    Notes: { rich_text: richText(lead.notes) },
    "Marketing consent": { checkbox: false },
  };
}

/** Today's date in London as YYYY-MM-DD. */
export function londonDate(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "Label: value" lines, skipping empty values. */
export function labelledLines(entries: [string, string | undefined][]): string {
  return entries
    .filter(([, value]) => value && value.trim())
    .map(([label, value]) => `${label}: ${value!.trim()}`)
    .join("\n");
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A submission ID from the browser, or a fresh one if it is missing or odd. */
export function submissionIdOrNew(raw: string): string {
  return UUID.test(raw) ? raw.toLowerCase() : crypto.randomUUID();
}
