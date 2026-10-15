"use server";

import type { ApplicationState } from "@/lib/application";
import {
  createJobSubmission,
  JOB_EXPERIENCE,
  JOB_FIELD,
  JOB_START,
  JOB_WORK_TYPES,
  type JobSubmissionValues,
} from "@/lib/wix/forms";

/**
 * Sends an application to the Wix "Job Form".
 *
 * Unlike the enquiry, a successful application does not redirect: /thank-you
 * is written for renovation customers (call back, home visit, quote), and
 * none of that applies to a fitter. The form shows its own confirmation.
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
  // cannot push an oversized string into the dashboard.
  const role = read("role").slice(0, 120);

  // Only the options the Wix form defines: anything else fails the whole
  // submission rather than being dropped.
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

  const submissions: JobSubmissionValues = {
    [JOB_FIELD.firstName]: values.firstName,
    [JOB_FIELD.phone]: values.phone,
    [JOB_FIELD.experience]: values.experience,
    [JOB_FIELD.start]: values.start,
    [JOB_FIELD.rightToWork]: values.rightToWork,
  };
  if (role) submissions[JOB_FIELD.role] = role;
  if (values.lastName) submissions[JOB_FIELD.lastName] = values.lastName;
  if (values.email) submissions[JOB_FIELD.email] = values.email;
  if (workTypes.length > 0) submissions[JOB_FIELD.workTypes] = workTypes;

  const result = await createJobSubmission(submissions);

  if (!result.ok) {
    // The detail is for our logs, not the applicant: it can carry raw API text.
    console.error(
      `[application] submission failed (status ${result.status ?? "none"}): ${result.detail}`,
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
