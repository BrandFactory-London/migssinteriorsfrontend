"use client";

import * as React from "react";

import { submitEnquiry } from "@/app/actions/enquiry";
import { EMPTY_ENQUIRY_STATE, type EnquiryState } from "@/lib/enquiry";
import { Button } from "@/components/ui/button";
import { SITE, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = ["Bathroom", "Kitchen", "Whole home", "Something else"];

/**
 * Which radio a service page pre-selects. `interior` maps to "Whole home":
 * the page is about whole-home work, the option is worded for the visitor.
 */
const FOCUS_TO_TYPE = {
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  interior: "Whole home",
} as const;

export type EnquiryFocus = keyof typeof FOCUS_TO_TYPE;
const BUDGETS = [
  "Not sure yet",
  "£15k – £30k",
  "£30k – £60k",
  "£60k – £100k",
  "£100k +",
];

const inputClass =
  "min-h-[56px] w-full rounded-[4px] border border-[var(--migss-divider)] bg-transparent px-3.5 text-base text-migss-text caret-migss-accent transition-colors focus-visible:border-migss-accent focus-visible:outline-none [@media(hover:hover)]:hover:border-migss-text/45";

const errorInputClass = "border-migss-error";

const labelClass = "mb-1.5 block text-[12.5px] text-migss-text/70";

type Step = 1 | 2;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[12.5px] text-migss-error">
      {message}
    </p>
  );
}

/**
 * Two-step enquiry, submitted to Wix Forms through the `submitEnquiry` server
 * action — the Wix client ID stays on the server and never reaches the
 * browser. A successful submission redirects to /thank-you; a failure comes
 * back as state and is shown inline, with every answer still in place.
 *
 * Both steps stay mounted and the inactive one is hidden with CSS rather than
 * unmounted: the step-1 inputs have to still be in the form element when the
 * visitor submits from step 2, or their contact details never reach the
 * action.
 */
export function EnquiryForm({
  focus,
  town,
}: {
  focus?: EnquiryFocus;
  /** Pre-fills the town field, so a location page does not ask twice. */
  town?: string;
}) {
  const [state, formAction, pending] = React.useActionState<
    EnquiryState,
    FormData
  >(submitEnquiry, EMPTY_ENQUIRY_STATE);

  const [step, setStep] = React.useState<Step>(1);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const previousStep = React.useRef<Step>(step);

  // Move focus to the new step so the change is announced. Keyed on the step
  // actually changing rather than a "have I mounted yet" flag: an effect that
  // runs twice (Strict Mode, or any remount) would defeat the flag and yank
  // the page down to this form on first paint.
  React.useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  // A validation error may belong to the step the visitor is not looking at,
  // so each new result from the action pulls them to the step it concerns.
  // Adjusted during render rather than in an effect: an effect would paint
  // the wrong step first and then correct it.
  const [seenState, setSeenState] = React.useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.step) setStep(state.step);
  }

  const values = state.values;
  const errors = state.fieldErrors;

  const stepLabel = `Step ${step} of 2`;

  return (
    <div className="rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[clamp(16px,4vw,28px)] shadow-migss-sm">
      <div className="mb-[18.4px] flex items-center gap-3">
        <span className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-accent-ink tabular-nums">
          {stepLabel}
        </span>
        <span
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={step}
          aria-label="Enquiry progress"
          className="block h-[3px] flex-1 overflow-hidden rounded-sm bg-migss-neutral-300"
        >
          <span
            className="block h-full bg-migss-accent transition-[width] duration-[350ms] ease-out"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </span>
      </div>

      <form action={formAction} className="flex flex-col gap-[13.8px]">
        <div
          className={cn(
            step === 1
              ? "flex animate-[migss-fade_0.3s_ease-out_both] flex-col gap-[13.8px]"
              : "hidden",
          )}
        >
          <h3
            ref={step === 1 ? headingRef : undefined}
            tabIndex={-1}
            className="text-[21px] font-normal outline-none"
          >
            Contact details
          </h3>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-[13.8px]">
            <div>
              <label htmlFor="migss-first" className={labelClass}>
                First name
              </label>
              <input
                id="migss-first"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Sarah"
                defaultValue={values?.firstName}
                aria-invalid={errors?.firstName ? true : undefined}
                aria-describedby={
                  errors?.firstName ? "migss-first-error" : undefined
                }
                className={cn(inputClass, errors?.firstName && errorInputClass)}
              />
              <FieldError id="migss-first-error" message={errors?.firstName} />
            </div>
            <div>
              <label htmlFor="migss-last" className={labelClass}>
                Last name
              </label>
              <input
                id="migss-last"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Whitfield"
                defaultValue={values?.lastName}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="migss-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="migss-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="07700 000000"
              defaultValue={values?.phone}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="migss-email" className={labelClass}>
              Email
            </label>
            <input
              id="migss-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              defaultValue={values?.email}
              aria-invalid={errors?.email ? true : undefined}
              aria-describedby={errors?.email ? "migss-email-error" : undefined}
              className={cn(inputClass, errors?.email && errorInputClass)}
            />
            <FieldError id="migss-email-error" message={errors?.email} />
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            size="xl"
            className="font-body mt-1 font-medium"
          >
            Continue to your project →
          </Button>
        </div>

        <div
          className={cn(
            step === 2
              ? "flex animate-[migss-fade_0.3s_ease-out_both] flex-col gap-[13.8px]"
              : "hidden",
          )}
        >
          <h3
            ref={step === 2 ? headingRef : undefined}
            tabIndex={-1}
            className="text-[21px] font-normal outline-none"
          >
            Your project
          </h3>

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 text-[12.5px] text-migss-text/70">
              What are we renovating?
            </legend>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-2">
              {PROJECT_TYPES.map((type) => (
                <label
                  key={type}
                  className="group flex min-h-[56px] cursor-pointer items-center gap-2 rounded-[4px] border border-[var(--migss-divider)] px-3.5 text-[15px] transition-colors has-[:checked]:border-migss-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-migss-accent active:bg-migss-text/5 [@media(hover:hover)]:hover:border-migss-text/45"
                >
                  <input
                    type="radio"
                    name="projectType"
                    value={type}
                    defaultChecked={
                      values?.projectType
                        ? values.projectType === type
                        : focus !== undefined && FOCUS_TO_TYPE[focus] === type
                    }
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "h-4 w-4 flex-none rounded-full border-[1.5px] border-[var(--migss-divider)] transition-colors",
                      "peer-checked:border-migss-accent peer-checked:bg-migss-accent peer-checked:shadow-[inset_0_0_0_4px_var(--color-migss-bg)]",
                    )}
                  />
                  {type}
                </label>
              ))}
            </div>
            <FieldError id="migss-type-error" message={errors?.projectType} />
          </fieldset>

          <div>
            <label htmlFor="migss-town" className={labelClass}>
              Town or postcode
            </label>
            <input
              id="migss-town"
              name="town"
              type="text"
              autoComplete="postal-code"
              placeholder="Chigwell, IG7"
              defaultValue={values?.town ?? town}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="migss-budget" className={labelClass}>
              Indicative budget
            </label>
            <select
              id="migss-budget"
              name="budget"
              className={cn(inputClass, "px-2.5")}
              defaultValue={values?.budget ?? BUDGETS[0]}
            >
              {BUDGETS.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="migss-notes" className={labelClass}>
              Anything we should know? (optional)
            </label>
            <textarea
              id="migss-notes"
              name="notes"
              placeholder="Timings, style references, rooms involved…"
              defaultValue={values?.notes}
              className={cn(inputClass, "min-h-[104px] resize-y py-3")}
            />
          </div>

          {state.message ? (
            <p
              role="alert"
              className="rounded-[4px] border border-migss-error px-3.5 py-3 text-[14px] leading-[1.6] text-migss-text"
            >
              {state.message} Or ring{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>
              .
            </p>
          ) : null}

          <Button
            type="submit"
            size="xl"
            disabled={pending}
            aria-busy={pending}
            className="font-body mt-1 font-medium"
          >
            {pending ? "Sending…" : "Send my enquiry"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setStep(1)}
            className="font-body"
          >
            ← Back to contact details
          </Button>
        </div>
      </form>
    </div>
  );
}
