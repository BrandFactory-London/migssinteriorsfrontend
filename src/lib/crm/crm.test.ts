import { describe, expect, it, vi } from "vitest";

import {
  attributionFromSearch,
  formatNotes,
  parseAttribution,
  submissionIdLine,
} from "@/lib/crm/attribution";
import {
  applicationFormName,
  enquiryFormName,
  titleFromSlug,
} from "@/lib/crm/form-name";
import {
  labelledLines,
  type Lead,
  leadProperties,
  londonDate,
  richText,
  submissionIdOrNew,
} from "@/lib/crm/lead";
import { saveLead } from "@/lib/crm/notion";
import { normaliseUkPhone } from "@/lib/crm/phone";

describe("normaliseUkPhone", () => {
  it.each([
    ["07700 900123", "+447700900123"],
    ["07700900123", "+447700900123"],
    ["+44 7700 900123", "+447700900123"],
    ["+44 (0)7700 900123", "+447700900123"],
    ["0044 7700 900123", "+447700900123"],
    ["447700900123", "+447700900123"],
    ["020 8243 2903", "+442082432903"],
    ["0208-243-2903", "+442082432903"],
    ["+33 6 12 34 56 78", "+33612345678"],
  ])("%s -> %s", (input, expected) => {
    expect(normaliseUkPhone(input)).toBe(expected);
  });

  it("keeps something that is not a phone number as typed", () => {
    expect(normaliseUkPhone(" call me after 5 ")).toBe("call me after 5");
    expect(normaliseUkPhone("12345")).toBe("12345");
  });

  it("returns an empty string for an empty input", () => {
    expect(normaliseUkPhone("   ")).toBe("");
  });
});

describe("enquiryFormName", () => {
  it.each([
    ["/", "Homepage enquiry"],
    ["", "Homepage enquiry"],
    ["/renovation-services", "Renovation services enquiry"],
    ["/renovation-services/bathroom", "Bathroom page enquiry"],
    ["/renovation-services/kitchen/", "Kitchen page enquiry"],
    ["/renovation-services/interior?x=1", "Interior page enquiry"],
    ["/contact", "Contact page enquiry"],
    ["/about", "About page enquiry"],
    ["/locations", "Locations enquiry"],
    ["/locations/chigwell", "Location page enquiry: Chigwell"],
    ["/locations/theydon-bois", "Location page enquiry: Theydon Bois"],
    ["/our-projects", "Our projects enquiry"],
    ["/our-projects/wanstead-family-bathroom", "Project page enquiry: Wanstead Family Bathroom"],
    ["/resources/bathroom", "Resources page enquiry: Bathroom"],
    ["/blog", "Blog enquiry"],
    ["/blog/wet-room-costs", "Blog post enquiry: Wet Room Costs"],
    ["/lp/bathrooms-north-london", "Meta LP: Bathrooms, North London"],
    ["/lp/kitchens-chigwell-essex/", "Meta LP: Kitchens, Chigwell & Essex"],
    ["/lp/not-a-page", "Website enquiry: /lp/not-a-page"],
    ["/something-new", "Website enquiry: /something-new"],
  ])("%s -> %s", (path, expected) => {
    expect(enquiryFormName(path)).toBe(expected);
  });

  it("titles slugs", () => {
    expect(titleFromSlug("north-london")).toBe("North London");
  });
});

describe("applicationFormName", () => {
  it("names the role", () => {
    expect(applicationFormName("Lead Bathroom Fitter")).toBe(
      "Job application: Lead Bathroom Fitter",
    );
  });
  it("copes with no role", () => {
    expect(applicationFormName("  ")).toBe("Job application: Unspecified role");
  });
});

describe("attribution", () => {
  it("keeps only known keys and drops junk", () => {
    expect(
      parseAttribution(
        JSON.stringify({ utm_source: " google ", gclid: "abc", evil: "x", utm_medium: 5 }),
      ),
    ).toEqual({ utm_source: "google", gclid: "abc" });
  });

  it("returns nothing for malformed input", () => {
    expect(parseAttribution("not json")).toEqual({});
    expect(parseAttribution("[1,2]")).toEqual({});
    expect(parseAttribution(undefined)).toEqual({});
  });

  it("reads parameters from a landing query string", () => {
    expect(
      attributionFromSearch("?utm_source=google&utm_campaign=bath&gclid=G1&other=1"),
    ).toEqual({ utm_source: "google", utm_campaign: "bath", gclid: "G1" });
  });

  it("formats Notes with the submission ID last", () => {
    const notes = formatNotes({
      submissionId: "id-1",
      pageUrl: "https://www.migssinteriors.com/renovation-services/bathroom",
      attribution: { utm_source: "google", landing_page: "/" },
    });
    expect(notes).toBe(
      [
        "Sent from: https://www.migssinteriors.com/renovation-services/bathroom",
        "utm_source: google",
        "landing_page: /",
        "Submission ID: id-1",
      ].join("\n"),
    );
  });
});

describe("lead mapping", () => {
  const lead: Lead = {
    name: "Jane Test",
    email: "jane@example.com",
    phone: "+447700900123",
    formName: "Bathroom page enquiry",
    type: "Lead",
    message: "Renovating: Bathroom",
    notes: "Submission ID: abc",
    acquired: "2026-11-11",
  };

  it("maps every CRM property", () => {
    expect(leadProperties(lead, "owner-page")).toEqual({
      Name: { title: [{ type: "text", text: { content: "Jane Test" } }] },
      Email: { email: "jane@example.com" },
      Phone: { phone_number: "+447700900123" },
      Owner: { relation: [{ id: "owner-page" }] },
      Form: { rich_text: [{ type: "text", text: { content: "Bathroom page enquiry" } }] },
      Type: { select: { name: "Lead" } },
      Status: { select: { name: "New" } },
      Source: { select: { name: "Website form" } },
      Acquired: { date: { start: "2026-11-11" } },
      Message: { rich_text: [{ type: "text", text: { content: "Renovating: Bathroom" } }] },
      Notes: { rich_text: [{ type: "text", text: { content: "Submission ID: abc" } }] },
      "Marketing consent": { checkbox: false },
    });
  });

  it("sends null for a missing email or phone", () => {
    const props = leadProperties({ ...lead, email: "", phone: "" }, "o");
    expect(props.Email).toEqual({ email: null });
    expect(props.Phone).toEqual({ phone_number: null });
  });

  it("splits long text into Notion-sized parts", () => {
    const parts = richText("a".repeat(4500));
    expect(parts.map((p) => p.text.content.length)).toEqual([2000, 2000, 500]);
  });

  it("writes labelled lines and skips empty values", () => {
    expect(labelledLines([["Town", "Chigwell"], ["Budget", ""], ["Notes", undefined]])).toBe(
      "Town: Chigwell",
    );
  });

  it("dates in London time", () => {
    // 23:30 UTC on 31 Mar 2026 is 00:30 BST on 1 Apr.
    expect(londonDate(new Date("2026-03-31T23:30:00Z"))).toBe("2026-04-01");
  });

  it("keeps a valid submission ID and replaces an invalid one", () => {
    const id = "3f2a1b4c-5d6e-4f70-8a9b-0c1d2e3f4a5b";
    expect(submissionIdOrNew(id)).toBe(id);
    const fresh = submissionIdOrNew("not-an-id");
    expect(fresh).toMatch(/^[0-9a-f-]{36}$/);
  });
});

describe("saveLead", () => {
  const lead: Lead = {
    name: "Jane Test",
    email: "jane@example.com",
    phone: "+447700900123",
    formName: "Homepage enquiry",
    type: "Lead",
    message: "",
    notes: submissionIdLine("sub-1"),
    acquired: "2026-11-11",
  };

  function json(body: unknown, status = 200) {
    return new Response(JSON.stringify(body), { status });
  }

  it("creates a row when the submission ID is new", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ id: "page-1" }));

    const result = await saveLead(lead, "sub-1", {
      fetch: fetchMock,
      token: "secret",
      databaseId: "db",
      ownerPageId: "owner",
    });

    expect(result).toEqual({ ok: true, pageId: "page-1", duplicate: false });
    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [queryUrl, queryInit] = fetchMock.mock.calls[0];
    expect(queryUrl).toBe("https://api.notion.com/v1/databases/db/query");
    expect(JSON.parse(String(queryInit?.body))).toEqual({
      filter: { property: "Notes", rich_text: { contains: "Submission ID: sub-1" } },
      page_size: 1,
    });
    expect((queryInit?.headers as Record<string, string>).Authorization).toBe(
      "Bearer secret",
    );

    const [createUrl, createInit] = fetchMock.mock.calls[1];
    expect(createUrl).toBe("https://api.notion.com/v1/pages");
    const created = JSON.parse(String(createInit?.body));
    expect(created.parent).toEqual({ database_id: "db" });
    expect(created.properties.Owner).toEqual({ relation: [{ id: "owner" }] });
  });

  it("does not create a second row on a retry", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ results: [{ id: "page-1" }] }));

    const result = await saveLead(lead, "sub-1", { fetch: fetchMock, token: "secret" });

    expect(result).toEqual({ ok: true, pageId: "page-1", duplicate: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails cleanly without a token", async () => {
    const fetchMock = vi.fn<typeof fetch>();
    const result = await saveLead(lead, "sub-1", { fetch: fetchMock, token: "" });
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a Notion error with its status", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ results: [] }))
      .mockResolvedValueOnce(json({ message: "Could not find property" }, 400));

    const result = await saveLead(lead, "sub-1", { fetch: fetchMock, token: "secret" });
    expect(result).toMatchObject({ ok: false, status: 400 });
  });

  it("reports a network failure", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValueOnce(new Error("offline"));
    const result = await saveLead(lead, "sub-1", { fetch: fetchMock, token: "secret" });
    expect(result).toMatchObject({ ok: false, status: null });
  });
});
