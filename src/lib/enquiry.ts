/**
 * Shape of the enquiry form's action state.
 *
 * Kept out of the `"use server"` module on purpose: every export of a server
 * action file is turned into a server reference, so exporting a plain constant
 * from there makes the client read it as a function call during the initial
 * render and the build fails.
 */
export type EnquiryState = {
  status: "idle" | "error";
  /** Shown above the submit button, in place of losing the visitor's input. */
  message?: string;
  fieldErrors?: Partial<Record<"firstName" | "email" | "projectType", string>>;
  /** Which step to land on, so an error is never hidden on the other one. */
  step?: 1 | 2;
  /** Echoed back so the inputs can be re-filled after a failed round trip. */
  values?: Record<string, string>;
};

export const EMPTY_ENQUIRY_STATE: EnquiryState = { status: "idle" };
