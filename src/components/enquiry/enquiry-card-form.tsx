"use client";

import * as React from "react";

import { submitEnquiry } from "@/app/actions/enquiry";
import { TypedHeading } from "@/components/enquiry/typed-heading";
import { useLeadContext } from "@/components/forms/lead-context";
import { pushLeadEvent } from "@/lib/analytics";
import {
  BUDGETS,
  checkStep,
  EMPTY_ENQUIRY_STATE,
  type EnquiryContext,
  type EnquiryField,
  type EnquiryState,
  type EnquiryStep,
  type EnquiryValues,
  type FieldErrors,
  initialValues,
  PROJECT_TYPES,
  STEP_PROGRESS,
} from "@/lib/enquiry";
import { SITE, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export type EnquiryVariant = "pop-up" | "contact page";

const HEADINGS: Record<EnquiryStep, string> = {
  1: "Nice to meet you.",
  2: "What are we renovating?",
  3: "Anything else we should know?",
};
const SENT_HEADING = "Thank you, we have got it.";

const NEXT_STEPS = [
  {
    title: "A quick call back",
    body: "Under 20 minutes on average, Monday to Saturday, 8am to 6pm.",
  },
  {
    title: "A free home visit",
    body: "Usually within the week. We measure up and talk budget openly.",
  },
  {
    title: "A fixed written quote",
    body: "Itemised, with no obligation and no chasing calls.",
  },
];

const inputClass =
  "mt-1.5 block min-h-[50px] w-full rounded-[4px] border border-[var(--migss-divider)] bg-migss-bg/70 px-3.5 text-base text-migss-text caret-migss-accent transition-colors placeholder:text-migss-text/40 focus-visible:border-migss-accent focus-visible:outline-none aria-[invalid=true]:border-migss-error [@media(hover:hover)]:hover:border-migss-text/45";

function Field({
  label,
  optional,
  error,
  errorId,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-[12.5px] text-migss-text/70">
      {label}
      {optional && <span className="text-migss-text/50"> (optional)</span>}
      {children}
      {error && (
        <span id={errorId} className="mt-1.5 block text-[12.5px] text-migss-error">
          {error}
        </span>
      )}
    </label>
  );
}

/**
 * The three-step enquiry, used in the site-wide card and inline on /contact.
 * Each step's heading types out, then its fields fade in where they already
 * sit, so nothing moves or resizes. Modelled on the BrandFactory Labs card.
 *
 * "Send another" on /contact remounts the form, which also starts a new
 * submission ID, so the next enquiry is a new CRM row.
 */
export function EnquiryCardForm(props: {
  variant: EnquiryVariant;
  context?: EnquiryContext;
  onClose?: () => void;
}) {
  const [round, setRound] = React.useState(0);
  return (
    <EnquiryRound
      key={round}
      {...props}
      onAnother={() => setRound((r) => r + 1)}
    />
  );
}

function EnquiryRound({
  variant,
  context,
  onClose,
  onAnother,
}: {
  variant: EnquiryVariant;
  context?: EnquiryContext;
  onClose?: () => void;
  onAnother: () => void;
}) {
  const uid = React.useId();
  const lead = useLeadContext();
  const [state, dispatch, pending] = React.useActionState<
    EnquiryState,
    FormData
  >(submitEnquiry, EMPTY_ENQUIRY_STATE);

  const [values, setValues] = React.useState<EnquiryValues>(() =>
    initialValues(context),
  );
  const [step, setStep] = React.useState<EnquiryStep>(1);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  // Fields show once the current step's heading has typed out.
  const [readyFor, setReadyFor] = React.useState<string | null>(null);
  const body = React.useRef<HTMLDivElement>(null);

  // A new result from the server: take the visitor to whatever it concerns.
  // Adjusted during render rather than in an effect, so the wrong step is
  // never painted first.
  const [seenState, setSeenState] = React.useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.fieldErrors) setErrors(state.fieldErrors);
    if (state.step) setStep(state.step);
  }

  const sent = state.status === "sent";

  // The conversion fires once per saved enquiry, here and nowhere else.
  const fired = React.useRef<EnquiryState | null>(null);
  React.useEffect(() => {
    if (state.status !== "sent" || fired.current === state) return;
    fired.current = state;
    pushLeadEvent(variant);
  }, [state, variant]);

  const heading = sent ? SENT_HEADING : HEADINGS[step];
  const stepKey = sent ? "sent" : String(step);
  const ready = readyFor === stepKey;
  const onTyped = React.useCallback(() => setReadyFor(stepKey), [stepKey]);

  // Each new step starts at the top of the card.
  React.useEffect(() => {
    body.current?.scrollTo({ top: 0 });
  }, [stepKey]);

  // In the pop-up, focus the first field once it appears; not on touch
  // screens (it would raise the keyboard over the card) and not on /contact
  // (focus should not jump on page load).
  React.useEffect(() => {
    if (variant !== "pop-up" || !ready || sent) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    body.current
      ?.querySelector<HTMLElement>("input:not([type=radio]), select, textarea, input[type=radio]:checked")
      ?.focus();
  }, [ready, sent, variant]);

  const set = <K extends keyof EnquiryValues>(key: K, value: EnquiryValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function submit() {
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.set(key, value);
    for (const [key, value] of Object.entries(lead.snapshot())) data.set(key, value);
    React.startTransition(() => dispatch(data));
  }

  function next() {
    if (sent) {
      if (variant === "pop-up") onClose?.();
      else onAnother();
      return;
    }
    const found = checkStep(step, values);
    const firstField = (Object.keys(found) as EnquiryField[])[0];
    if (firstField) {
      setErrors((e) => ({ ...e, ...found }));
      body.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    if (step < 3) setStep((step + 1) as EnquiryStep);
    else submit();
  }

  const percent = sent ? 100 : STEP_PROGRESS[step];
  const nextLabel = sent
    ? variant === "pop-up"
      ? "Done"
      : "Send another"
    : step < 3
      ? "Continue"
      : pending
        ? "Sending…"
        : "Send my enquiry";
  const reveal = ready ? "enquiry-rise" : "enquiry-hold";
  const err = (k: EnquiryField) => (errors[k] ? `${uid}-${k}-error` : undefined);
  const showProblem = state.status === "error" && state.message && step === 3 && !pending;

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3 px-[clamp(18px,4vw,24px)] pt-[18px] pb-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase tabular-nums">
            Free quote · {sent ? "Done" : `${percent}%`}
          </span>
          {onClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="-my-1.5 -mr-2 flex size-10 items-center justify-center rounded-full text-migss-text/60 transition-colors focus-visible:outline-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:text-migss-text"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
        <div
          role="progressbar"
          aria-label="Enquiry progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          className="h-[3px] overflow-hidden rounded-sm bg-migss-neutral-300"
        >
          <div
            className="h-full rounded-sm bg-migss-accent transition-[width] duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div
        ref={body}
        className="flex-1 overflow-y-auto px-[clamp(18px,4vw,24px)] pt-1.5 pb-3"
      >
        <TypedHeading
          id={`${uid}-heading`}
          text={heading}
          onDone={onTyped}
          startDelay={step === 1 && !sent && variant === "pop-up" ? 380 : 120}
        />

        {!sent && step === 1 && (
          <div className={cn("mt-2 flex flex-col gap-[14px]", reveal)}>
            <p className="text-[15px] leading-[1.6] text-migss-text/75">
              Who should we call back?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" error={errors.firstName} errorId={err("firstName")}>
                <input
                  name="firstName"
                  autoComplete="given-name"
                  value={values.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={err("firstName")}
                  className={inputClass}
                />
              </Field>
              <Field label="Last name" optional>
                <input
                  name="lastName"
                  autoComplete="family-name"
                  value={values.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Phone" error={errors.phone} errorId={err("phone")}>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="07700 000000"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={err("phone")}
                className={inputClass}
              />
            </Field>
            <Field label="Email" error={errors.email} errorId={err("email")}>
              <input
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={err("email")}
                className={inputClass}
              />
            </Field>
            <p className="text-[13px] text-migss-text/60">
              Prefer to talk? Call{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>
            </p>
          </div>
        )}

        {!sent && step === 2 && (
          <div className={cn("mt-2 flex flex-col gap-[14px]", reveal)}>
            <p className="text-[15px] leading-[1.6] text-migss-text/75">
              Pick the closest fit. We will talk through the detail on the call.
            </p>
            <fieldset
              className="m-0 border-0 p-0"
              aria-describedby={err("projectType")}
            >
              <legend className="sr-only">What are we renovating?</legend>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <label
                    key={type}
                    className="flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-[4px] border border-[var(--migss-divider)] bg-migss-bg/70 px-3 text-[15px] transition-colors has-[:checked]:border-migss-accent has-[:checked]:bg-migss-accent/10 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-migss-accent [@media(hover:hover)]:hover:border-migss-text/45"
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={type}
                      checked={values.projectType === type}
                      onChange={() => set("projectType", type)}
                      className="peer sr-only"
                    />
                    <span className="h-4 w-4 flex-none rounded-full border-[1.5px] border-[var(--migss-divider)] transition-colors peer-checked:border-migss-accent peer-checked:bg-migss-accent peer-checked:shadow-[inset_0_0_0_3px_var(--color-migss-bg)]" />
                    {type}
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <span
                  id={err("projectType")}
                  className="mt-1.5 block text-[12.5px] text-migss-error"
                >
                  {errors.projectType}
                </span>
              )}
            </fieldset>
            <Field label="Town or postcode" optional>
              <input
                name="town"
                autoComplete="postal-code"
                placeholder="Chigwell, IG7"
                value={values.town}
                onChange={(e) => set("town", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Indicative budget">
              <select
                name="budget"
                value={values.budget}
                onChange={(e) => set("budget", e.target.value)}
                className={cn(inputClass, "px-2.5")}
              >
                {BUDGETS.map((budget) => (
                  <option key={budget}>{budget}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {!sent && step === 3 && (
          <div className={cn("mt-2 flex flex-col gap-[14px]", reveal)}>
            <p className="text-[15px] leading-[1.6] text-migss-text/75">
              Timings, style references, rooms involved. All optional.
            </p>
            <Field label="Notes" optional>
              <textarea
                name="notes"
                rows={4}
                maxLength={2000}
                value={values.notes}
                onChange={(e) => set("notes", e.target.value)}
                className={cn(inputClass, "min-h-[110px] resize-none py-3")}
              />
            </Field>
            <p className="text-[12.5px] leading-[1.6] text-migss-text/55">
              We use your details only to reply to your enquiry.
            </p>
          </div>
        )}

        {sent && (
          <div role="status" className={cn("mt-2 flex flex-col gap-3 pb-1", reveal)}>
            <p className="text-[15px] leading-[1.6] text-migss-text/75">
              Someone from the team will call you back on the number you gave
              us. Here is what happens next.
            </p>
            <ol className="grid list-none border-t border-[var(--migss-divider)]">
              {NEXT_STEPS.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-3 border-b border-[var(--migss-divider)] py-3"
                >
                  <span className="font-heading w-[2.2ch] flex-none pt-[2px] text-sm text-migss-accent-ink tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[17px] leading-[1.25]">{item.title}</p>
                    <p className="text-[13.5px] leading-[1.6] text-migss-text/68">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-[13.5px] text-migss-text/65">
              Rather speak now? Call{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>
            </p>
          </div>
        )}

        {showProblem && (
          <p
            role="alert"
            className="mt-4 rounded-[4px] border border-migss-error px-3.5 py-3 text-[14px] leading-[1.6] text-migss-text"
          >
            {state.message} Ring{" "}
            <a href={telHref} className="text-migss-accent-ink">
              {SITE.phone}
            </a>
            .
          </p>
        )}
      </div>

      <div className="flex gap-2.5 border-t border-migss-text/8 px-[clamp(18px,4vw,24px)] pt-3 pb-[18px]">
        {!sent && step > 1 && (
          <button
            type="button"
            onClick={() => setStep((step - 1) as EnquiryStep)}
            className="font-heading min-h-[50px] w-24 rounded-[4px] border border-[var(--migss-divider)] text-[15px] font-semibold text-migss-text/75 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-text/7"
          >
            Back
          </button>
        )}
        <button
          type="button"
          disabled={!ready || pending}
          onClick={next}
          className="font-heading min-h-[50px] flex-1 rounded-[4px] border border-migss-accent-700 bg-migss-accent-700 text-[15px] font-semibold text-migss-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent active:bg-migss-accent-800 disabled:opacity-45 [@media(hover:hover)]:hover:bg-migss-accent-600"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
