"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  CONSENT_DENIED,
  CONSENT_GRANTED,
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
  type ConsentState,
} from "@/lib/consent";

/**
 * The cookie banner, and the preferences panel behind it.
 *
 * Mounted in the root layout, so it is on every route. Three things decide
 * what it renders:
 *
 *  - `decided`: whether a usable decision is already in the cookie. Read in an
 *    effect rather than during render, because the server has no way to know
 *    it and a first paint that disagreed with the client would hydrate wrong.
 *  - `panelOpen`: the preferences dialog, opened from the banner or from the
 *    footer's "Cookie preferences" link.
 *
 * Accept and Reject are given equal visual weight. A reject that is harder to
 * find than the accept is the specific pattern the ICO has been writing to
 * sites about, so the two share a size and sit side by side; only the hairline
 * border differs.
 */
export function CookieConsent() {
  // Whether this visitor has just chosen, in this page view. A visitor who
  // chose on an earlier visit is handled entirely outside React: the bootstrap
  // script marks `<html>` before paint and CSS hides the banner. So the markup
  // below is rendered for everyone and this state only has to cover the moment
  // between a click and the cookie being written.
  const [decided, setDecided] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<ConsentState>(CONSENT_DENIED);

  const closeRef = React.useRef<HTMLButtonElement>(null);
  const openerRef = React.useRef<Element | null>(null);

  // The footer link lives in a server component and cannot hold this state,
  // so it asks through an event instead of a shared store.
  React.useEffect(() => {
    const onOpen = () => {
      openerRef.current = document.activeElement;
      setDraft(readConsent(document.cookie) ?? CONSENT_DENIED);
      setPanelOpen(true);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  // Escape closes the panel, and focus goes back where it came from — the
  // footer link, if that is what opened it.
  React.useEffect(() => {
    if (!panelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  const commit = React.useCallback((state: ConsentState) => {
    // Writes the cookie, marks `<html>`, and tells Google. The local flag is
    // only so this render hides the banner without waiting to read back what
    // was just written.
    writeConsent(state);
    setDraft(state);
    setDecided(true);
    setPanelOpen(false);

    const opener = openerRef.current;
    openerRef.current = null;
    if (opener instanceof HTMLElement) opener.focus();
  }, []);

  const bannerVisible = !decided && !panelOpen;

  return (
    <>
      {bannerVisible ? (
        <section
          // `region`, not `dialog`: the page behind stays usable and nothing is
          // trapped. A visitor who ignores this is treated as having consented
          // to nothing, which is the correct default — so there is no reason to
          // block them from reading the site first.
          aria-label="Cookie choices"
          // The hook the pre-paint rule in globals.css hides: see
          // CONSENT_DECIDED_ATTR.
          data-consent-banner=""
          // Above the dock (z-50) and below the full-screen menu (z-90): the
          // banner's own surface covers the dock while it is up, and opening
          // the menu covers the banner rather than fighting it.
          className="fixed inset-x-0 bottom-0 z-80 animate-[migss-fade_0.3s_ease-out_both] border-t border-[var(--migss-divider)] bg-migss-bg/95 shadow-migss-md backdrop-blur-[12px]"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-[clamp(16px,4.5vw,48px)] pt-5 pb-[calc(20px+env(safe-area-inset-bottom))] md:flex-row md:items-center md:justify-between md:gap-8">
            <p className="max-w-[62ch] text-[14px] leading-[1.75] text-migss-text">
              We use cookies that are needed to run this site, and — only with
              your permission — cookies that tell us how the site is used and
              help us measure our advertising. You can change your mind at any
              time.{" "}
              <Link
                href="/privacy-policy"
                className="text-migss-accent-ink underline decoration-migss-accent/50 underline-offset-2"
              >
                Privacy policy
              </Link>
            </p>

            <div className="flex flex-none flex-col gap-2 sm:flex-row">
              {/* Accept first on the row, but Reject is the same control at the
                  same size — see the note on the component. */}
              <Button
                variant="solid"
                size="md"
                onClick={() => commit(CONSENT_GRANTED)}
              >
                Accept all
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => commit(CONSENT_DENIED)}
              >
                Reject all
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  openerRef.current = document.activeElement;
                  setPanelOpen(true);
                }}
              >
                Manage
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {panelOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-preferences-heading"
          // Above the menu: this can be opened from the footer, which the menu
          // overlay would otherwise cover.
          className="fixed inset-0 z-100 flex items-end justify-center bg-migss-neutral-900/55 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
        >
          <div className="max-h-[90vh] w-full max-w-[560px] overflow-y-auto rounded-t-[10px] border border-[var(--migss-divider)] bg-migss-bg px-[clamp(18px,4vw,32px)] pt-[clamp(20px,4vw,30px)] pb-[calc(20px+env(safe-area-inset-bottom))] shadow-migss-md sm:rounded-[10px] sm:pb-[clamp(20px,4vw,30px)]">
            <div className="flex items-start justify-between gap-4">
              <h2
                id="cookie-preferences-heading"
                className="font-heading text-[24px] leading-[1.2] text-migss-text"
              >
                Cookie preferences
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Close cookie preferences"
                className="grid h-[40px] w-[40px] flex-none cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent text-migss-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-text/7"
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
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <dl className="mt-5 flex flex-col gap-1">
              {/* Listed but not switchable, because it genuinely is not
                  optional — offering a toggle that cannot be moved is worse
                  than saying so. */}
              <CategoryRow
                title="Strictly necessary"
                description="Needed for the site to work — page delivery, security, and remembering this choice. Always on."
              />
              <CategoryRow
                title="Analytics"
                description="Google Analytics, so we can see which pages are read and where visitors arrive from. Aggregated, never used to contact you."
                checked={draft.analytics}
                onChange={(analytics) => setDraft({ ...draft, analytics })}
              />
              <CategoryRow
                title="Advertising"
                description="Lets us measure which adverts lead to enquiries, and show more relevant ones. Nothing is set unless you allow it."
                checked={draft.advertising}
                onChange={(advertising) => setDraft({ ...draft, advertising })}
              />
            </dl>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button
                variant="solid"
                size="md"
                className="sm:flex-1"
                onClick={() => commit(draft)}
              >
                Save preferences
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="sm:flex-1"
                onClick={() => commit(CONSENT_GRANTED)}
              >
                Accept all
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="sm:flex-1"
                onClick={() => commit(CONSENT_DENIED)}
              >
                Reject all
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * One category. Rendered as a definition list entry with the switch inside the
 * term, so the control and the name it belongs to are associated without an
 * `aria-label` repeating the heading.
 */
function CategoryRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (next: boolean) => void;
}) {
  const locked = onChange === undefined;

  return (
    <div className="border-b border-[var(--migss-divider)] py-3.5 last:border-b-0">
      <dt className="flex items-center justify-between gap-4">
        <span className="font-body text-[15px] font-medium text-migss-text">
          {title}
        </span>

        {locked ? (
          <span className="text-[11px] tracking-[0.18em] text-migss-neutral-600 uppercase">
            Always on
          </span>
        ) : (
          <label className="flex min-h-[44px] flex-none cursor-pointer items-center gap-2.5">
            <span className="text-[13px] text-migss-neutral-700">
              {checked ? "On" : "Off"}
            </span>
            {/* A real checkbox, restyled: it arrives focusable, keyboard
                operable and announced as a checkbox with no ARIA at all. */}
            <input
              type="checkbox"
              checked={checked ?? false}
              onChange={(event) => onChange(event.currentTarget.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative block h-[26px] w-[46px] rounded-full border border-[var(--migss-divider)] bg-migss-neutral-300 transition-colors peer-checked:border-migss-accent-700 peer-checked:bg-migss-accent-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-migss-accent after:absolute after:top-[2px] after:left-[2px] after:h-[20px] after:w-[20px] after:rounded-full after:bg-migss-neutral-100 after:shadow-migss-sm after:transition-transform after:content-[''] peer-checked:after:translate-x-[20px]"
            />
          </label>
        )}
      </dt>
      <dd className="mt-1 max-w-[52ch] text-[13px] leading-[1.7] text-migss-neutral-700">
        {description}
      </dd>
    </div>
  );
}

/**
 * The footer's way in. A client island of one button, so the footer itself
 * stays a server component.
 */
export function CookiePreferencesButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
      className={className}
    >
      Cookie Preferences
    </button>
  );
}
