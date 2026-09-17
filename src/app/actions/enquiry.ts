"use server";

import { redirect } from "next/navigation";

import type { EnquiryState } from "@/lib/enquiry";
import {
  createEnquirySubmission,
  FIELD,
  type SubmissionValues,
} from "@/lib/wix/forms";

/**
 * How the form's own radio labels map onto the Wix checkbox group's options.
 * "Whole home" is worded for the visitor; the Wix option is "Full Interior".
 * "Something else" has no option, so it goes through as a custom value —
 * the field has `addOther` enabled, which is what permits that.
 */
const TYPE_TO_OPTION: Record<string, string> = {
  Bathroom: "Bathroom",
  Kitchen: "Kitchen",
  "Whole home": "Full Interior",
  "Something else": "Other",
};

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
  // The one field Wix itself marks required.
  if (!values.projectType) {
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

  const submissions: SubmissionValues = {
    [FIELD.firstName]: values.firstName,
    [FIELD.renovationType]: [
      TYPE_TO_OPTION[values.projectType] ?? values.projectType,
    ],
  };
  if (values.lastName) submissions[FIELD.lastName] = values.lastName;
  if (values.phone) submissions[FIELD.phone] = values.phone;
  if (values.email) submissions[FIELD.email] = values.email;
  if (values.town) submissions[FIELD.address] = values.town;

  const result = await createEnquirySubmission(submissions);

  if (!result.ok) {
    // The detail is for our logs, not the visitor: it can carry raw API text.
    console.error(
      `[enquiry] submission failed (status ${result.status ?? "none"}): ${result.detail}`,
    );
    return {
      status: "error",
      message:
        "Something went wrong sending your enquiry. Your details are still here — try again, or call us and we will take it over the phone.",
      step: 2,
      values,
    };
  }

  redirect("/thank-you");
}
