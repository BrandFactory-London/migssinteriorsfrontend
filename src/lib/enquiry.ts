/**
 * The enquiry: its steps, options, validation and page context.
 *
 * Shared by the enquiry card (browser), the inline form on /contact and the
 * server action, so the rules are written once. Kept out of the `"use server"`
 * module on purpose: every export of a server action file becomes a server
 * reference, and a plain constant exported from there breaks the build.
 */

export const PROJECT_TYPES = [
  "Bathroom",
  "Kitchen",
  "Whole home",
  "Something else",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const BUDGETS = [
  "Not sure yet",
  "£20k – £30k",
  "£30k – £60k",
  "£60k – £100k",
  "£100k +",
] as const;

/** Which project type a service page pre-selects. */
export const FOCUS_TO_TYPE = {
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  interior: "Whole home",
} as const satisfies Record<string, ProjectType>;
export type EnquiryFocus = keyof typeof FOCUS_TO_TYPE;

export function isEnquiryFocus(value: unknown): value is EnquiryFocus {
  return typeof value === "string" && value in FOCUS_TO_TYPE;
}

/** What the page (or the button pressed) tells the card before it opens. */
export type EnquiryContext = { focus?: EnquiryFocus; town?: string };

export type EnquiryStep = 1 | 2 | 3;

export type EnquiryField = "firstName" | "phone" | "email" | "projectType";

export type EnquiryValues = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  projectType: string;
  town: string;
  budget: string;
  notes: string;
};

export const EMPTY_VALUES: EnquiryValues = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  projectType: "",
  town: "",
  budget: BUDGETS[0],
  notes: "",
};

/** The card's starting answers for a page context. */
export function initialValues(context: EnquiryContext = {}): EnquiryValues {
  return {
    ...EMPTY_VALUES,
    projectType: context.focus ? FOCUS_TO_TYPE[context.focus] : "",
    town: context.town?.slice(0, 120) ?? "",
  };
}

/** Which step each checked field lives on. */
export const FIELD_STEP: Record<EnquiryField, EnquiryStep> = {
  firstName: 1,
  phone: 1,
  email: 1,
  projectType: 2,
};

/** Progress starts at 40%, as on the Labs card: further along feels closer. */
export const STEP_PROGRESS: Record<EnquiryStep, number> = { 1: 40, 2: 80, 3: 100 };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
/** Digits, spaces and the usual phone punctuation, with 10 to 15 digits. */
const PHONE_CHARS = /^[0-9+()\-.\s]+$/;

export type FieldErrors = Partial<Record<EnquiryField, string>>;

/** Checks the fields that belong to one step. */
export function checkStep(step: EnquiryStep, values: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};
  if (step === 1) {
    if (!values.firstName.trim()) errors.firstName = "Please tell us your name.";

    const phone = values.phone.trim();
    const digits = phone.replace(/\D/g, "").length;
    if (!phone) {
      errors.phone = "We need a number to call you back on.";
    } else if (!PHONE_CHARS.test(phone) || digits < 10 || digits > 15) {
      errors.phone = "That number does not look right.";
    }

    const email = values.email.trim();
    if (!email) {
      errors.email = "We need an email address to reply to.";
    } else if (!EMAIL.test(email)) {
      errors.email = "That email address does not look right.";
    }
  }
  if (step === 2 && !(PROJECT_TYPES as readonly string[]).includes(values.projectType)) {
    errors.projectType = "Please choose what we are renovating.";
  }
  return errors;
}

/** Checks every step, as the server does. */
export function checkAll(values: EnquiryValues): FieldErrors {
  return { ...checkStep(1, values), ...checkStep(2, values) };
}

/** The earliest step holding an error, so the visitor is taken to it. */
export function firstStepWithError(errors: FieldErrors): EnquiryStep | null {
  const steps = (Object.keys(errors) as EnquiryField[])
    .filter((field) => errors[field])
    .map((field) => FIELD_STEP[field]);
  return steps.length ? (Math.min(...steps) as EnquiryStep) : null;
}

/** Shape of the enquiry action's state. */
export type EnquiryState = {
  status: "idle" | "error" | "sent";
  /** A problem sending, shown above the button with the answers kept. */
  message?: string;
  fieldErrors?: FieldErrors;
  /** Which step to show, so an error is never hidden on another one. */
  step?: EnquiryStep;
};

export const EMPTY_ENQUIRY_STATE: EnquiryState = { status: "idle" };
