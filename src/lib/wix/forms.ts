import "server-only";

import { getWixClient } from "@/lib/wix/client";

/**
 * The enquiry form as it exists in the Wix dashboard (Forms & Submissions →
 * "New Homepage Form"). The submission keys below are the fields' `target`
 * values, not their IDs or labels: a target is the stable storage key and
 * survives the site owner relabelling or reordering a field.
 *
 * Sending a key that is not a target fails the whole submission rather than
 * dropping that one value, so this map is deliberately closed.
 */
export const ENQUIRY_FORM_ID = "404a78a8-a588-47f9-8207-c5a1868af69a";
export const ENQUIRY_FORM_NAMESPACE = "wix.form_app.form";

export const FIELD = {
  firstName: "first_name_c57a",
  lastName: "last_name_02b5",
  phone: "phone_8d68",
  email: "email_9dfe",
  address: "renovation_address_1",
  /** Checkbox group: an array, and the one field the schema marks required. */
  renovationType: "renovation_type_1",
  budget: "budget_1",
  notes: "notes_1",
} as const;

/**
 * Documented endpoint for Create Submission. Wix also answers the shorter
 * /forms/v4/submissions path, but this is the one the API reference pins.
 */
const SUBMISSIONS_URL =
  "https://www.wixapis.com/form-submission-service/v4/submissions";

export type SubmissionValues = {
  [FIELD.firstName]?: string;
  [FIELD.lastName]?: string;
  [FIELD.phone]?: string;
  [FIELD.email]?: string;
  [FIELD.address]?: string;
  [FIELD.budget]?: string;
  [FIELD.notes]?: string;
  [FIELD.renovationType]: string[];
};

export type SubmissionResult =
  | { ok: true; id?: string }
  | { ok: false; status: number | null; detail: string };

/**
 * The old Wix Studio "Job Form" (Forms & Submissions → "Job Form"), reused
 * for applications from /join-the-team so they land in the same place, and
 * with the same Contacts sync, as they always have. Same rules as above: the
 * keys are targets, and the map is closed.
 */
export const JOB_FORM_ID = "8a236dc4-dd75-44de-8c08-a62e36fda2ba";

export const JOB_FIELD = {
  firstName: "first_name_b745",
  lastName: "last_name_0c29",
  phone: "phone_618f",
  email: "email_f301",
  /** Single choice: "5-10 years", "10-14 years", "14 years +". */
  experience: "years_of_experience",
  /** Checkbox group, an array of the options in JOB_WORK_TYPES. */
  workTypes: "what_work_can_you_do",
  /** Single choice: "Immediately", "Within 1-2 Weeks", "Within 1 Month". */
  start: "when_can_you_start",
  /** "Yes" or "No". */
  rightToWork: "do_you_have_right_to_work_in_the_uk",
} as const;

export { JOB_EXPERIENCE, JOB_START, JOB_WORK_TYPES } from "@/lib/job-form";

export type JobSubmissionValues = Partial<
  Record<(typeof JOB_FIELD)[keyof typeof JOB_FIELD], string | string[]>
>;

/** Creates a submission on the enquiry form. */
export function createEnquirySubmission(
  submissions: SubmissionValues,
): Promise<SubmissionResult> {
  return createSubmission(ENQUIRY_FORM_ID, submissions);
}

/** Creates a submission on the Job Form. */
export function createJobSubmission(
  submissions: JobSubmissionValues,
): Promise<SubmissionResult> {
  return createSubmission(JOB_FORM_ID, submissions);
}

/**
 * Creates a form submission as an anonymous visitor.
 *
 * Auth is the same anonymous-visitor OAuth the rest of the site uses, so no
 * client secret is involved and nothing here can run in the browser.
 */
async function createSubmission(
  formId: string,
  submissions: Record<string, unknown>,
): Promise<SubmissionResult> {
  const client = getWixClient();

  let headers: Record<string, string>;
  try {
    headers = (await client.auth.getAuthHeaders()).headers;
  } catch (error) {
    return {
      ok: false,
      status: null,
      detail: `Could not get a Wix visitor token: ${describe(error)}`,
    };
  }

  let response: Response;
  try {
    response = await fetch(SUBMISSIONS_URL, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        submission: {
          formId,
          namespace: ENQUIRY_FORM_NAMESPACE,
          submissions,
        },
      }),
      // A lead is worth waiting for, but not indefinitely.
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    return {
      ok: false,
      status: null,
      detail: `Request to Wix failed: ${describe(error)}`,
    };
  }

  const body = await response.text();

  if (!response.ok) {
    return { ok: false, status: response.status, detail: body.slice(0, 600) };
  }

  let id: string | undefined;
  try {
    id = (JSON.parse(body) as { submission?: { id?: string } }).submission?.id;
  } catch {
    // A 2xx with an unparseable body still means Wix took the submission.
  }

  return { ok: true, id };
}

function describe(error: unknown) {
  return error instanceof Error
    ? `${error.name}: ${error.message}`
    : String(error);
}
