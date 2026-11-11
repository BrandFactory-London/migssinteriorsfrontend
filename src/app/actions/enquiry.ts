"use server";

import { redirect } from "next/navigation";

import { createConversionToken } from "@/lib/conversion-token";
import { formatNotes, parseAttribution } from "@/lib/crm/attribution";
import { enquiryFormName } from "@/lib/crm/form-name";
import {
  labelledLines,
  londonDate,
  submissionIdOrNew,
} from "@/lib/crm/lead";
import { saveLead } from "@/lib/crm/notion";
import { normaliseUkPhone } from "@/lib/crm/phone";
import type { EnquiryState } from "@/lib/enquiry";

const PROJECT_TYPES = ["Bathroom", "Kitchen", "Whole home", "Something else"];

/**
 * Saves an enquiry as a Lead in the Contacts CRM, then sends the visitor to
 * /thank-you with a one-time token so the conversion fires once, for a real
 * enquiry only.
 */
export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  const values = {
    firstName: read("firstName"),
    lastName: read("lastName"),
    phone: read("phone"),
    email: read("email"),
    town: read("town"),
    projectType: read("projectType"),
    budget: read("budget"),
    notes: read("notes"),
  };

  const fieldErrors: NonNullable<EnquiryState["fieldErrors"]> = {};
  if (!values.firstName) fieldErrors.firstName = "Please tell us your name.";
  if (!values.email) {
    fieldErrors.email = "We need an email address to reply to.";
  } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
    fieldErrors.email = "That email address does not look right.";
  }
  if (!PROJECT_TYPES.includes(values.projectType)) {
    fieldErrors.projectType = "Please choose what we are renovating.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      fieldErrors,
      // Contact-details errors live on step 1, the project radio on step 2.
      step: fieldErrors.firstName || fieldErrors.email ? 1 : 2,
      values,
    };
  }

  const submissionId = submissionIdOrNew(read("submissionId"));
  const pagePath = read("pagePath") || "/";

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
        ["Budget", values.budget],
        ["Notes", values.notes],
      ]),
      notes: formatNotes({
        submissionId,
        pageUrl: read("pageUrl").slice(0, 500) || pagePath,
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
        "Something went wrong sending your enquiry. Your details are still here, so try again or call us and we will take it over the phone.",
      step: 2,
      values,
    };
  }

  // NOTION_TOKEN is set, or saveLead would have failed above.
  const token = createConversionToken(process.env.NOTION_TOKEN!);
  redirect(`/thank-you?lead=${token}`);
}
