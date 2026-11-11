"use server";

import type { ApplicationState } from "@/lib/application";
import { formatNotes, parseAttribution } from "@/lib/crm/attribution";
import { applicationFormName } from "@/lib/crm/form-name";
import {
  labelledLines,
  londonDate,
  submissionIdOrNew,
} from "@/lib/crm/lead";
import { saveLead } from "@/lib/crm/notion";
import { normaliseUkPhone } from "@/lib/crm/phone";
import { JOB_EXPERIENCE, JOB_START, JOB_WORK_TYPES } from "@/lib/job-form";

/**
 * Saves a job application as an Applicant in the Contacts CRM.
 *
 * Unlike the enquiry, a successful application does not redirect: /thank-you
 * is written for renovation customers (call back, home visit, quote), and
 * none of that applies to a fitter. The form shows its own confirmation, and
 * no conversion fires: an applicant is not a lead.
 */
export async function submitApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const read = (name: string) => String(formData.get(name) ?? "").trim();

  const values = {
    firstName: read("firstName"),
    lastName: read("lastName"),
    phone: read("phone"),
    email: read("email"),
    experience: read("experience"),
    start: read("start"),
    rightToWork: read("rightToWork"),
  };
  // Set by the role page, not the applicant; capped so a tampered value
  // cannot push an oversized string into the CRM.
  const role = read("role").slice(0, 120);

  const workTypes = formData
    .getAll("workTypes")
    .map(String)
    .filter((type) => JOB_WORK_TYPES.includes(type));

  const fieldErrors: NonNullable<ApplicationState["fieldErrors"]> = {};
  if (!values.firstName) fieldErrors.firstName = "Please tell us your name.";
  // Fitters are hired by phone; the number is what the team actually uses.
  if (!values.phone) fieldErrors.phone = "We need a number to call you on.";
  if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) {
    fieldErrors.email = "That email address does not look right.";
  }
  if (!JOB_EXPERIENCE.includes(values.experience)) {
    fieldErrors.experience = "Please choose your years of experience.";
  }
  if (!JOB_START.includes(values.start)) {
    fieldErrors.start = "Please tell us when you could start.";
  }
  if (values.rightToWork !== "Yes" && values.rightToWork !== "No") {
    fieldErrors.rightToWork = "Please answer this one.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors, values, workTypes };
  }

  const submissionId = submissionIdOrNew(read("submissionId"));
  const pagePath = read("pagePath") || "/join-the-team";

  const result = await saveLead(
    {
      name: [values.firstName, values.lastName].filter(Boolean).join(" "),
      email: values.email,
      phone: normaliseUkPhone(values.phone),
      formName: applicationFormName(role),
      type: "Applicant",
      message: labelledLines([
        ["Role", role],
        ["Experience", values.experience],
        ["Can start", values.start],
        ["Right to work in the UK", values.rightToWork],
        ["Work they can do", workTypes.join(", ")],
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
    // The detail is for our logs, not the applicant: it can carry raw API text.
    console.error(
      `[application] CRM save failed (status ${result.status ?? "none"}): ${result.detail}`,
    );
    return {
      status: "error",
      message:
        "Something went wrong sending your application. Your details are still here, so try again or give us a call.",
      values,
      workTypes,
    };
  }

  return { status: "sent", values: { firstName: values.firstName } };
}
