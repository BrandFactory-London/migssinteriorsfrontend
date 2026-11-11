"use server";

import { formatNotes, parseAttribution } from "@/lib/crm/attribution";
import { enquiryFormName } from "@/lib/crm/form-name";
import {
  labelledLines,
  londonDate,
  submissionIdOrNew,
} from "@/lib/crm/lead";
import { saveLead } from "@/lib/crm/notion";
import { normaliseUkPhone } from "@/lib/crm/phone";
import {
  BUDGETS,
  checkAll,
  type EnquiryState,
  type EnquiryValues,
  firstStepWithError,
} from "@/lib/enquiry";

/**
 * Saves an enquiry as a Lead in the Contacts CRM.
 *
 * The card shows its own thank-you and fires the conversion when this
 * returns "sent", so there is no redirect. Validation is the same code the
 * card runs before each step; it is repeated here because the browser can be
 * bypassed.
 */
export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const read = (name: string, max = 2000) =>
    String(formData.get(name) ?? "").trim().slice(0, max);

  const values: EnquiryValues = {
    firstName: read("firstName", 120),
    lastName: read("lastName", 120),
    phone: read("phone", 40),
    email: read("email", 200),
    projectType: read("projectType", 40),
    town: read("town", 120),
    budget: read("budget", 40),
    notes: read("notes"),
  };

  const fieldErrors = checkAll(values);
  const step = firstStepWithError(fieldErrors);
  if (step) return { status: "error", fieldErrors, step };

  const submissionId = submissionIdOrNew(read("submissionId", 60));
  const pagePath = read("pagePath", 300) || "/";
  const budget = (BUDGETS as readonly string[]).includes(values.budget)
    ? values.budget
    : "";

  const result = await saveLead(
    {
      name: [values.firstName, values.lastName].filter(Boolean).join(" "),
      email: values.email,
      phone: normaliseUkPhone(values.phone),
      formName: enquiryFormName(pagePath),
      type: "Lead",
      message: labelledLines([
        ["Renovating", values.projectType],
        ["Town", values.town],
        ["Budget", budget],
        ["Notes", values.notes],
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
    // The detail is for our logs, not the visitor: it can carry raw API text.
    console.error(
      `[enquiry] CRM save failed (status ${result.status ?? "none"}): ${result.detail}`,
    );
    return {
      status: "error",
      message:
        "Something went wrong sending your enquiry. Your answers are still here, so try again, or call us and we will take it over the phone.",
      step: 3,
    };
  }

  return { status: "sent" };
}
