"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { SITE, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = ["Bathroom", "Kitchen", "Whole home", "Something else"];
const BUDGETS = [
  "Not sure yet",
  "£15k – £30k",
  "£30k – £60k",
  "£60k – £100k",
  "£100k +",
];

const inputClass =
  "min-h-[56px] w-full rounded-[4px] border border-[var(--migss-divider)] bg-transparent px-3.5 text-base text-migss-text caret-migss-accent transition-colors focus-visible:border-migss-accent focus-visible:outline-none [@media(hover:hover)]:hover:border-migss-text/45";

const labelClass = "mb-1.5 block text-[12.5px] text-migss-text/70";

type Step = 1 | 2 | 3;

/**
 * Two-step enquiry, then a confirmation. Step state lives here; the design's
 * progress bar and step label are both derived from it.
 *
 * Submission is intentionally local for now — it resolves to the thank-you
 * state without a backend. Wiring it to a Wix Data collection or a form
 * endpoint is a follow-up, and deliberately not bundled into this design pass.
 */
export function EnquiryForm() {
  const [step, setStep] = React.useState<Step>(1);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const previousStep = React.useRef(step);

  // Move focus to the new step so the change is announced. Keyed on the step
  // actually changing rather than a "have I mounted yet" flag: an effect that
  // runs twice (Strict Mode, or any remount) would defeat the flag and yank
  // the page down to this form on first paint.
  React.useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  const stepLabel = step === 3 ? "Complete" : `Step ${step} of 2`;
  const progressWidth = step === 1 ? "50%" : "100%";

  return (
    <div className="rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[clamp(16px,4vw,28px)] shadow-migss-sm">
      <div className="mb-[18.4px] flex items-center gap-3">
        <span className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-accent-700 tabular-nums">
          {stepLabel}
        </span>
        <span
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={2}
          aria-valuenow={Math.min(step, 2)}
          aria-label="Enquiry progress"
          className="block h-[3px] flex-1 overflow-hidden rounded-sm bg-migss-neutral-300"
        >
          <span
            className="block h-full bg-migss-accent transition-[width] duration-[350ms] ease-out"
            style={{ width: progressWidth }}
          />
        </span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setStep(3);
        }}
        className="flex flex-col gap-[13.8px]"
      >
        {step === 1 ? (
          <div className="flex animate-[migss-fade_0.3s_ease-out_both] flex-col gap-[13.8px]">
            <h3
              ref={headingRef}
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
                  className={inputClass}
                />
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
                className={inputClass}
              />
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
        ) : null}

        {step === 2 ? (
          <div className="flex animate-[migss-fade_0.3s_ease-out_both] flex-col gap-[13.8px]">
            <h3
              ref={headingRef}
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
                defaultValue={BUDGETS[0]}
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
                className={cn(inputClass, "min-h-[104px] resize-y py-3")}
              />
            </div>

            <Button type="submit" size="xl" className="font-body mt-1 font-medium">
              Send my enquiry
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
        ) : null}

        {step === 3 ? (
          <div
            className="animate-[migss-fade_0.3s_ease-out_both] rounded-[4px] border border-migss-accent px-[18.4px] py-7 text-center"
            role="status"
          >
            <h3
              ref={headingRef}
              tabIndex={-1}
              className="mb-[9.2px] text-[26px] font-normal outline-none"
            >
              Thank you — enquiry received.
            </h3>
            <p className="mb-[13.8px] text-[15px] leading-[1.7] text-migss-text/75">
              We will call you back the same working day. If it is urgent, ring{" "}
              <a href={telHref} className="text-migss-accent-700">
                {SITE.phone}
              </a>
              .
            </p>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setStep(1)}
              className="font-body"
            >
              Send another enquiry
            </Button>
          </div>
        ) : null}
      </form>
    </div>
  );
}
