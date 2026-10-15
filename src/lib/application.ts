/**
 * Shape of the job application form's action state.
 *
 * Kept out of the `"use server"` module for the same reason as
 * `lib/enquiry.ts`: every export of a server action file becomes a server
 * reference, so a plain constant exported from there breaks the build.
 */
export type ApplicationField =
  | "firstName"
  | "phone"
  | "email"
  | "experience"
  | "start"
  | "rightToWork";

export type ApplicationState = {
  status: "idle" | "error" | "sent";
  /** Shown above the submit button, in place of losing the applicant's input. */
  message?: string;
  fieldErrors?: Partial<Record<ApplicationField, string>>;
  /** Echoed back so the inputs can be re-filled after a failed round trip. */
  values?: Record<string, string>;
  workTypes?: string[];
};

export const EMPTY_APPLICATION_STATE: ApplicationState = { status: "idle" };
