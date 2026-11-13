"use server";

import { formatNotes, parseAttribution } from "@/lib/crm/attribution";
import { enquiryFormName } from "@/lib/crm/form-name";
import { labelledLines, londonDate, submissionIdOrNew } from "@/lib/crm/lead";
import { saveLead } from "@/lib/crm/notion";
import { normaliseUkPhone } from "@/lib/crm/phone";
import {
  checkAllLanding,
  firstLandingStepWithError,
  type LandingState,
  type LandingValues,
  normalisePostcode,
} from "@/lib/landing-enquiry";
import { getLandingPage } from "@/lib/landing-pages";

/**
 * Saves a Meta ads landing page enquiry (TKT-103) as a Lead in the Contacts
 * CRM. The Form value comes from the page path ("Meta LP: Bathrooms, North
 * London"), so each page's leads can be told apart. Validation repeats the
 * browser's, because the browser can be bypassed.
 */
export async function submitLandingEnquiry(
  _previous: LandingState,
  formData: FormData,
): Promise<LandingState> {
  const read = (name: string, max = 2000) =>
    String(formData.get(name) ?? "").trim().slice(0, max);

  const values: LandingValues = {
    timing: read("timing", 40),
    postcode: read("postcode", 12),
    firstName: read("firstName", 120),
    phone: read("phone", 40),
    email: read("email", 200),
  };

  const fieldErrors = checkAllLanding(values);
  const step = firstLandingStepWithError(fieldErrors);
  if (step) return { status: "error", fieldErrors, step };

  const pagePath = read("pagePath", 300) || "/";
  const slug = pagePath.replace(/\/+$/, "").split("/").pop() ?? "";
  const page = getLandingPage(slug);
  const submissionId = submissionIdOrNew(read("submissionId", 60));

  const result = await saveLead(
    {
      name: values.firstName,
      email: values.email || undefined,
      phone: normaliseUkPhone(values.phone),
      formName: enquiryFormName(pagePath),
      type: "Lead",
      message: labelledLines([
        ["Renovating", page?.room],
        ["Hoping to start", values.timing],
        ["Postcode", normalisePostcode(values.postcode)],
        ["Landing page", page ? `${page.roomPlural}, ${page.clusterLabel}` : pagePath],
      ]),
      notes: formatNotes({
        submissionId,
        pageUrl: read("pageUrl", 500) || pagePath,
        attribution: parseAttribution(read("attribution")),
      }),
      acquired: londonDate(),
    },
    submissionId,
  );

  if (!result.ok) {
    console.error(
      `[landing-enquiry] CRM save failed (status ${result.status ?? "none"}): ${result.detail}`,
    );
    return {
      status: "error",
      message:
        "Something went wrong sending your details. Your answers are still here, so try again, or call us and we will take it over the phone.",
      step: 3,
    };
  }

  return { status: "sent" };
}
