"use client";

import * as React from "react";

import { submitApplication } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import {
  EMPTY_APPLICATION_STATE,
  type ApplicationState,
} from "@/lib/application";
import { JOB_EXPERIENCE, JOB_START, JOB_WORK_TYPES } from "@/lib/job-form";
import { SITE, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/* Same field styling as the enquiry form, so the two read as one system. */
const inputClass =
  "font-body min-h-[56px] w-full rounded-[4px] border border-[var(--migss-divider)] bg-transparent px-3.5 text-base text-migss-text caret-migss-accent transition-colors focus-visible:border-migss-accent focus-visible:outline-none [@media(hover:hover)]:hover:border-migss-text/45";

const errorInputClass = "border-migss-error";

const labelClass = "mb-1.5 block text-[12.5px] text-migss-text/70";

/**
 * Native selects draw their own arrow hard against the border, and on macOS
 * the closed control is a system widget. `appearance-none` hands both back to
 * us: the chevron below sits 16px in from the edge, and the text keeps clear
 * of it.
 */
const selectClass = "cursor-pointer appearance-none pr-12 pl-3.5";

function SelectChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-migss-text/60"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const choiceClass =
  "font-body flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-[4px] border border-[var(--migss-divider)] px-3.5 text-[15px] transition-colors has-[:checked]:border-migss-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-migss-accent active:bg-migss-text/5 [@media(hover:hover)]:hover:border-migss-text/45";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[12.5px] text-migss-error">
      {message}
    </p>
  );
}

/**
 * Application form for a role, submitted to the Wix "Job Form" through the
 * `submitApplication` server action. Single step: it is short, and a fitter
 * applying from a van on a phone should not have to page through it.
 *
 * On success the form is replaced by a confirmation in place rather than
 * redirecting, because /thank-you is written for renovation customers.
 */
export function ApplicationForm({
  roleTitle,
  defaultWorkTypes = [],
}: {
  roleTitle: string;
  /** Pre-ticks the trades this role is about. */
  defaultWorkTypes?: string[];
}) {
  const [state, formAction, pending] = React.useActionState<
    ApplicationState,
    FormData
  >(submitApplication, EMPTY_APPLICATION_STATE);

  const confirmationRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (state.status === "sent") confirmationRef.current?.focus();
  }, [state.status]);

  const values = state.values;
  const errors = state.fieldErrors;
  const ticked = state.workTypes ?? defaultWorkTypes;

  if (state.status === "sent") {
    return (
      <div
        ref={confirmationRef}
        tabIndex={-1}
        role="status"
        className="rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[clamp(16px,4vw,28px)] shadow-migss-sm outline-none"
      >
        <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
          Application sent
        </p>
        <h3 className="mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal">
          Thanks{values?.firstName ? `, ${values.firstName}` : ""}. We have
          your details.
        </h3>
        <p className="text-[15px] leading-[1.75] text-migss-text/78">
          Someone from the team will call you to talk through the{" "}
          {roleTitle.toLowerCase()} role and, if it is a fit, arrange your paid
          trial. If you would rather speak now, ring{" "}
          <a href={telHref} className="text-migss-accent-ink">
            {SITE.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[clamp(16px,4vw,28px)] shadow-migss-sm">
      <form action={formAction} className="flex flex-col gap-[13.8px]">
        <input type="hidden" name="role" value={roleTitle} />
        <h3 className="text-[21px] font-normal">Your details</h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-[13.8px]">
          <div>
            <label htmlFor="apply-first" className={labelClass}>
              First name
            </label>
            <input
              id="apply-first"
              name="firstName"
              type="text"
              autoComplete="given-name"
              defaultValue={values?.firstName}
              aria-invalid={errors?.firstName ? true : undefined}
              aria-describedby={
                errors?.firstName ? "apply-first-error" : undefined
              }
              className={cn(inputClass, errors?.firstName && errorInputClass)}
            />
            <FieldError id="apply-first-error" message={errors?.firstName} />
          </div>
          <div>
            <label htmlFor="apply-last" className={labelClass}>
              Last name
            </label>
            <input
              id="apply-last"
              name="lastName"
              type="text"
              autoComplete="family-name"
              defaultValue={values?.lastName}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-[13.8px]">
          <div>
            <label htmlFor="apply-phone" className={labelClass}>
              Phone
            </label>
            <input
              id="apply-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="07700 000000"
              defaultValue={values?.phone}
              aria-invalid={errors?.phone ? true : undefined}
              aria-describedby={errors?.phone ? "apply-phone-error" : undefined}
              className={cn(inputClass, errors?.phone && errorInputClass)}
            />
            <FieldError id="apply-phone-error" message={errors?.phone} />
          </div>
          <div>
            <label htmlFor="apply-email" className={labelClass}>
              Email (optional)
            </label>
            <input
              id="apply-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              defaultValue={values?.email}
              aria-invalid={errors?.email ? true : undefined}
              aria-describedby={errors?.email ? "apply-email-error" : undefined}
              className={cn(inputClass, errors?.email && errorInputClass)}
            />
            <FieldError id="apply-email-error" message={errors?.email} />
          </div>
        </div>

        <h3 className="mt-2 text-[21px] font-normal">Your experience</h3>

        <div>
          <label htmlFor="apply-experience" className={labelClass}>
            Years of experience as a bathroom fitter
          </label>
          <div className="relative">
          <select
            id="apply-experience"
            name="experience"
            defaultValue={values?.experience ?? ""}
            aria-invalid={errors?.experience ? true : undefined}
            aria-describedby={
              errors?.experience ? "apply-experience-error" : undefined
            }
            className={cn(
              inputClass,
              selectClass,
              errors?.experience && errorInputClass,
            )}
          >
            <option value="" disabled>
              Choose one
            </option>
            {JOB_EXPERIENCE.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <SelectChevron />
          </div>
          <FieldError
            id="apply-experience-error"
            message={errors?.experience}
          />
        </div>

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-[12.5px] text-migss-text/70">
            What work can you do? Tick all that apply.
          </legend>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-2">
            {JOB_WORK_TYPES.map((type) => (
              <label key={type} className={choiceClass}>
                <input
                  type="checkbox"
                  name="workTypes"
                  value={type}
                  defaultChecked={ticked.includes(type)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="grid h-[18px] w-[18px] flex-none place-items-center rounded-[3px] border-[1.5px] border-[var(--migss-divider)] text-transparent transition-colors peer-checked:border-migss-accent peer-checked:bg-migss-accent peer-checked:text-migss-bg"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <h3 className="mt-2 text-[21px] font-normal">Availability</h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,170px),1fr))] gap-[13.8px]">
          <div>
            <label htmlFor="apply-start" className={labelClass}>
              When can you start?
            </label>
            <div className="relative">
            <select
              id="apply-start"
              name="start"
              defaultValue={values?.start ?? JOB_START[0]}
              aria-invalid={errors?.start ? true : undefined}
              aria-describedby={errors?.start ? "apply-start-error" : undefined}
              className={cn(
                inputClass,
                selectClass,
                errors?.start && errorInputClass,
              )}
            >
              {JOB_START.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <SelectChevron />
            </div>
            <FieldError id="apply-start-error" message={errors?.start} />
          </div>

          <fieldset className="m-0 border-0 p-0">
            <legend className={labelClass}>Right to work in the UK?</legend>
            <div className="grid grid-cols-2 gap-2">
              {["Yes", "No"].map((answer) => (
                <label key={answer} className={choiceClass}>
                  <input
                    type="radio"
                    name="rightToWork"
                    value={answer}
                    defaultChecked={values?.rightToWork === answer}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 flex-none rounded-full border-[1.5px] border-[var(--migss-divider)] transition-colors peer-checked:border-migss-accent peer-checked:bg-migss-accent peer-checked:shadow-[inset_0_0_0_4px_var(--color-migss-bg)]"
                  />
                  {answer}
                </label>
              ))}
            </div>
            <FieldError
              id="apply-right-error"
              message={errors?.rightToWork}
            />
          </fieldset>
        </div>

        {state.message ? (
          <p
            role="alert"
            className="rounded-[4px] border border-migss-error px-3.5 py-3 text-[14px] leading-[1.6] text-migss-text"
          >
            {state.message} Ring{" "}
            <a href={telHref} className="text-migss-accent-ink">
              {SITE.phone}
            </a>
            .
          </p>
        ) : null}

        {errors && !state.message ? (
          <p role="alert" className="text-[13px] text-migss-error">
            A few answers need another look before this can be sent.
          </p>
        ) : null}

        <Button
          type="submit"
          variant="solid"
          size="xl"
          disabled={pending}
          aria-busy={pending}
          className="font-body mt-1 font-medium"
        >
          {pending ? "Sending…" : "Send my application"}
        </Button>
      </form>
    </div>
  );
}
