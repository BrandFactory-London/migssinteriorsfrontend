"use client";

import * as React from "react";

import { submitLandingEnquiry } from "@/app/actions/landing-enquiry";
import { useLeadContext } from "@/components/forms/lead-context";
import { pushLeadEvent } from "@/lib/analytics";
import {
  checkLandingStep,
  EMPTY_LANDING_STATE,
  EMPTY_LANDING_VALUES,
  type LandingErrors,
  type LandingField,
  type LandingState,
  type LandingStep,
  type LandingValues,
  TIMINGS,
} from "@/lib/landing-enquiry";
import { SITE, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Progress rail                                                       */
/* ------------------------------------------------------------------ */

/**
 * A row of dots pinned to the right edge, halfway down the screen, showing
 * where the visitor is on the page. Hidden over the hero; the current
 * section's dot is gold with its name beside it. Tapping a dot scrolls to
 * that section on the same page.
 */
export function ProgressRail({
  sections,
  heroId,
}: {
  sections: readonly { id: string; label: string }[];
  heroId: string;
}) {
  const [active, setActive] = React.useState(0);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById(heroId);
    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => setShown(!entry.isIntersecting),
          { threshold: 0.15 },
        )
      : null;
    if (hero) heroObserver?.observe(hero);

    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let current = 0;
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= middle) current = index;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      heroObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [sections, heroId]);

  return (
    <nav
      aria-label="Page sections"
      className={cn(
        "fixed top-1/2 right-2 z-30 flex -translate-y-1/2 flex-col items-end gap-0.5 transition-opacity duration-300",
        shown ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      {sections.map((section, index) => {
        const isActive = index === active;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-label={section.label}
            aria-current={isActive ? "location" : undefined}
            tabIndex={shown ? 0 : -1}
            className="flex min-h-[28px] items-center justify-end gap-2 no-underline"
          >
            {isActive ? (
              <span className="rounded-full border border-[var(--migss-divider)] bg-migss-neutral-100/95 px-2.5 py-[3px] text-[11px] font-medium tracking-[0.08em] text-migss-text uppercase">
                {section.label}
              </span>
            ) : null}
            <span
              className={cn(
                "block rounded-full",
                isActive
                  ? "size-2 border border-migss-accent bg-migss-accent"
                  : index < active
                    ? "size-1.5 border border-migss-neutral-100/90 bg-migss-accent-ink"
                    : "size-1.5 border border-migss-neutral-500 bg-migss-neutral-100/90",
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Toggles (process steps and FAQs)                                     */
/* ------------------------------------------------------------------ */

/** One-line rows that open to a single line of detail, one at a time. */
export function ToggleList({
  items,
  numbered = false,
}: {
  items: readonly { title: string; body: string }[];
  numbered?: boolean;
}) {
  const [open, setOpen] = React.useState<number | null>(null);
  const uid = React.useId();

  return (
    <ul className="list-none border-t border-[var(--migss-divider)] p-0">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${uid}-panel-${index}`;
        return (
          <li key={item.title} className="border-b border-[var(--migss-divider)]">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex min-h-[56px] w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent p-0 text-left text-[15px] text-migss-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent"
            >
              <span className="flex items-center gap-3.5">
                {numbered ? (
                  <span className="font-heading w-[18px] text-2xl leading-none text-migss-accent-700">
                    {index + 1}
                  </span>
                ) : null}
                <span className={numbered ? "font-medium" : undefined}>{item.title}</span>
              </span>
              <span aria-hidden="true" className="text-xl text-migss-accent-700">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div id={panelId} hidden={!isOpen}>
              <p
                className={cn(
                  "m-0 pb-4 text-sm leading-[1.6] text-migss-text/70",
                  numbered && "pl-8",
                )}
              >
                {item.body}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Video testimonial strip                                             */
/* ------------------------------------------------------------------ */

/**
 * A compact row under the first testimonial: small thumbnail, play mark and
 * "Listen to one of our happy customers". Tapping opens a 16:9 player inside
 * the card, so the video never takes over the screen.
 */
export function VideoStrip({
  url,
  label,
  duration,
}: {
  url: string | null;
  label: string;
  duration: string;
}) {
  const [open, setOpen] = React.useState(false);

  if (open) {
    return (
      <div className="border-t border-[var(--migss-divider)] bg-migss-neutral-900 p-3">
        {url ? (
          <video
            src={url}
            controls
            autoPlay
            playsInline
            className="block aspect-video w-full rounded-[3px] bg-migss-neutral-800"
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center rounded-[3px] bg-migss-neutral-800 text-xs text-migss-neutral-400">
            [Video testimonial plays here]
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-2.5 min-h-[44px] cursor-pointer border-0 bg-transparent p-0 text-[13px] text-migss-neutral-300"
        >
          Close video
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex w-full cursor-pointer items-center gap-3 border-0 border-t border-[var(--migss-divider)] bg-migss-surface px-5 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-migss-accent"
    >
      <span className="grid h-12 w-[76px] flex-none place-items-center rounded-[3px] bg-migss-neutral-700">
        <span className="grid size-[26px] place-items-center rounded-full bg-migss-neutral-100/90">
          <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden="true">
            <path d="M1 1l8 5-8 5z" fill="currentColor" className="text-migss-text" />
          </svg>
        </span>
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium text-migss-text">
          Listen to one of our happy customers
        </span>
        <span className="text-xs text-migss-text/65">
          {label} · {duration}
        </span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Inline form                                                         */
/* ------------------------------------------------------------------ */

const STEP_HEADINGS: Record<LandingStep, string> = {
  1: "When are you hoping to start?",
  2: "What is your postcode?",
  3: "Where can we reach you?",
};

const inputClass =
  "mt-1.5 block min-h-[50px] w-full rounded-[4px] border border-[var(--migss-divider)] bg-migss-bg px-3.5 text-base text-migss-text caret-migss-accent placeholder:text-migss-text/40 focus-visible:border-migss-accent focus-visible:outline-none aria-[invalid=true]:border-migss-error";

/**
 * The landing pages' own three-step form (Locked decision, 13 Nov 2026):
 * timing, postcode, then name and phone. Leads go to the Contacts CRM with a
 * per-page Form name, and the GA4 lead event fires once on success.
 */
export function LandingForm({ roomPlural }: { roomPlural: string }) {
  const uid = React.useId();
  const lead = useLeadContext();
  const [state, dispatch, pending] = React.useActionState<LandingState, FormData>(
    submitLandingEnquiry,
    EMPTY_LANDING_STATE,
  );
  const [values, setValues] = React.useState<LandingValues>(EMPTY_LANDING_VALUES);
  const [step, setStep] = React.useState<LandingStep>(1);
  const [errors, setErrors] = React.useState<LandingErrors>({});
  const body = React.useRef<HTMLDivElement>(null);

  const [seenState, setSeenState] = React.useState(state);
  if (seenState !== state) {
    setSeenState(state);
    if (state.fieldErrors) setErrors(state.fieldErrors);
    if (state.step) setStep(state.step);
  }

  const sent = state.status === "sent";
  const fired = React.useRef<LandingState | null>(null);
  React.useEffect(() => {
    if (state.status !== "sent" || fired.current === state) return;
    fired.current = state;
    pushLeadEvent("landing page");
  }, [state]);

  const set = (key: LandingField, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function next() {
    const found = checkLandingStep(step, values);
    const firstField = (Object.keys(found) as LandingField[])[0];
    if (firstField) {
      setErrors((e) => ({ ...e, ...found }));
      body.current?.querySelector<HTMLElement>(`[name="${firstField}"]`)?.focus();
      return;
    }
    if (step < 3) {
      setStep((step + 1) as LandingStep);
      return;
    }
    const data = new FormData();
    for (const [key, value] of Object.entries(values)) data.set(key, value);
    for (const [key, value] of Object.entries(lead.snapshot())) data.set(key, value);
    React.startTransition(() => dispatch(data));
  }

  if (sent) {
    return (
      <div role="status" className="py-2">
        <h3 className="font-heading m-0 text-[26px] leading-[1.1] font-normal">
          Thank you, we have got it.
        </h3>
        <p className="mt-3 mb-0 text-sm leading-[1.6] text-migss-text/75">
          A member of our team will call you to arrange your design
          consultation. If it is easier, call us on{" "}
          <a href={telHref} className="text-migss-accent-ink">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const errorId = (field: LandingField) => `${uid}-${field}-error`;
  const fieldError = (field: LandingField) =>
    errors[field] ? (
      <span id={errorId(field)} className="mt-1.5 block text-[13px] text-migss-error">
        {errors[field]}
      </span>
    ) : null;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        next();
      }}
    >
      <div
        className="mt-3.5 mb-4.5 grid grid-cols-3 gap-1.5"
        aria-hidden="true"
      >
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={cn(
              "h-[3px]",
              n <= step ? "bg-migss-accent-700" : "bg-migss-neutral-300",
            )}
          />
        ))}
      </div>

      <h3 className="font-heading m-0 mb-1 text-[26px] leading-[1.1] font-normal">
        {STEP_HEADINGS[step]}
      </h3>
      <p className="mt-0 mb-4 text-[13px] text-migss-text/70">
        Step {step} of 3 · {roomPlural}
      </p>

      <div ref={body}>
        {step === 1 ? (
          <fieldset className="m-0 border-0 p-0">
            <legend className="sr-only">{STEP_HEADINGS[1]}</legend>
            <div className="flex flex-col gap-2">
              {TIMINGS.map((timing) => {
                const checked = values.timing === timing;
                return (
                  <label
                    key={timing}
                    className={cn(
                      "flex min-h-[48px] cursor-pointer items-center rounded-[4px] border px-3.5 text-sm",
                      checked
                        ? "border-migss-accent-700 bg-migss-accent-100"
                        : "border-[var(--migss-divider)] bg-migss-bg",
                    )}
                  >
                    <input
                      type="radio"
                      name="timing"
                      value={timing}
                      checked={checked}
                      onChange={() => set("timing", timing)}
                      className="sr-only"
                      aria-describedby={errors.timing ? errorId("timing") : undefined}
                    />
                    {timing}
                  </label>
                );
              })}
            </div>
            {fieldError("timing")}
          </fieldset>
        ) : null}

        {step === 2 ? (
          <label className="block text-[12.5px] text-migss-text/70">
            Postcode
            <input
              name="postcode"
              autoComplete="postal-code"
              inputMode="text"
              autoCapitalize="characters"
              placeholder="IG7 6AA"
              value={values.postcode}
              onChange={(event) => set("postcode", event.target.value)}
              aria-invalid={errors.postcode ? true : undefined}
              aria-describedby={errors.postcode ? errorId("postcode") : undefined}
              className={inputClass}
            />
            {fieldError("postcode")}
          </label>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-3">
            <label className="block text-[12.5px] text-migss-text/70">
              First name
              <input
                name="firstName"
                autoComplete="given-name"
                value={values.firstName}
                onChange={(event) => set("firstName", event.target.value)}
                aria-invalid={errors.firstName ? true : undefined}
                aria-describedby={errors.firstName ? errorId("firstName") : undefined}
                className={inputClass}
              />
              {fieldError("firstName")}
            </label>
            <label className="block text-[12.5px] text-migss-text/70">
              Phone
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) => set("phone", event.target.value)}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? errorId("phone") : undefined}
                className={inputClass}
              />
              {fieldError("phone")}
            </label>
            <label className="block text-[12.5px] text-migss-text/70">
              Email <span className="text-migss-text/50">(optional)</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => set("email", event.target.value)}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? errorId("email") : undefined}
                className={inputClass}
              />
              {fieldError("email")}
            </label>
          </div>
        ) : null}
      </div>

      {state.message ? (
        <p role="alert" className="mt-4 mb-0 text-[13px] text-migss-error">
          {state.message}
        </p>
      ) : null}

      <div className="mt-4.5 flex gap-2">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((step - 1) as LandingStep)}
            className="font-heading min-h-[56px] cursor-pointer rounded-[4px] border border-[var(--migss-divider)] bg-transparent px-4 text-[17px] font-semibold text-migss-text"
          >
            Back
          </button>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="font-heading min-h-[56px] flex-1 cursor-pointer rounded-[4px] border border-migss-accent-700 bg-migss-accent-700 px-4 text-[17px] font-semibold text-migss-text disabled:opacity-60"
        >
          {step < 3 ? "Continue" : pending ? "Sending…" : "Book my design consultation"}
        </button>
      </div>
      <p className="mt-3 mb-0 text-center text-[12.5px] text-migss-text/70">
        Three short steps. No obligation.
      </p>
    </form>
  );
}
