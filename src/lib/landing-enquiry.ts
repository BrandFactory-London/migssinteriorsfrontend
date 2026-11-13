/**
 * The inline form on the Meta ads landing pages (TKT-103).
 *
 * Three short steps, cheapest answer first: when they hope to start (a tap),
 * their postcode, then name and phone. Email is optional here; the phone is
 * how Migss calls back. Shared by the form and the server action, so the
 * browser and server apply the same rules. Kept out of the action module on
 * purpose: every export of a "use server" file becomes a server reference.
 */

export const TIMINGS = [
  "Within 3 months",
  "3 to 6 months",
  "6 months or more",
  "Still planning",
] as const;

export type LandingStep = 1 | 2 | 3;

export type LandingField = "timing" | "postcode" | "firstName" | "phone" | "email";

export type LandingValues = {
  timing: string;
  postcode: string;
  firstName: string;
  phone: string;
  email: string;
};

export const EMPTY_LANDING_VALUES: LandingValues = {
  timing: "",
  postcode: "",
  firstName: "",
  phone: "",
  email: "",
};

export const LANDING_FIELD_STEP: Record<LandingField, LandingStep> = {
  timing: 1,
  postcode: 2,
  firstName: 3,
  phone: 3,
  email: 3,
};

export type LandingErrors = Partial<Record<LandingField, string>>;

/** A full or outward-only UK postcode, e.g. "IG7 6AA" or "N6". */
const POSTCODE = /^[A-Z]{1,2}[0-9][A-Z0-9]?(\s*[0-9][A-Z]{2})?$/i;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_CHARS = /^[0-9+()\-.\s]+$/;

export function normalisePostcode(raw: string): string {
  const compact = raw.toUpperCase().replace(/\s+/g, "");
  if (compact.length > 4) return `${compact.slice(0, -3)} ${compact.slice(-3)}`;
  return compact;
}

export function checkLandingStep(
  step: LandingStep,
  values: LandingValues,
): LandingErrors {
  const errors: LandingErrors = {};

  if (step === 1 && !(TIMINGS as readonly string[]).includes(values.timing)) {
    errors.timing = "Please choose when you are hoping to start.";
  }

  if (step === 2) {
    const postcode = values.postcode.trim();
    if (!postcode) errors.postcode = "Please enter your postcode.";
    else if (!POSTCODE.test(postcode)) errors.postcode = "That postcode does not look right.";
  }

  if (step === 3) {
    if (!values.firstName.trim()) errors.firstName = "Please tell us your name.";

    const phone = values.phone.trim();
    const digits = phone.replace(/\D/g, "").length;
    if (!phone) errors.phone = "We need a number to call you back on.";
    else if (!PHONE_CHARS.test(phone) || digits < 10 || digits > 15) {
      errors.phone = "That number does not look right.";
    }

    const email = values.email.trim();
    if (email && !EMAIL.test(email)) errors.email = "That email address does not look right.";
  }

  return errors;
}

export function checkAllLanding(values: LandingValues): LandingErrors {
  return {
    ...checkLandingStep(1, values),
    ...checkLandingStep(2, values),
    ...checkLandingStep(3, values),
  };
}

export function firstLandingStepWithError(errors: LandingErrors): LandingStep | null {
  const steps = (Object.keys(errors) as LandingField[])
    .filter((field) => errors[field])
    .map((field) => LANDING_FIELD_STEP[field]);
  return steps.length ? (Math.min(...steps) as LandingStep) : null;
}

export type LandingState = {
  status: "idle" | "error" | "sent";
  message?: string;
  fieldErrors?: LandingErrors;
  step?: LandingStep;
};

export const EMPTY_LANDING_STATE: LandingState = { status: "idle" };
