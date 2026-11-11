"use client";

import * as React from "react";

import Link from "next/link";

import {
  SITE,
  telHref,
  NAV,
  STAFF_LOGIN_URL,
  CLIENT_LOGIN_PATH,
} from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { EnquiryDock } from "@/components/enquiry-dock";
import { useNavMenu } from "@/components/nav-menu";

/**
 * How far a child entry sits in from its parent in the menu, in pixels.
 *
 * Applied inline rather than through a utility class, together with the menu
 * bar's own column template. Both are structural — without them the bar
 * collapses into a single column and the service pages read as siblings of
 * the section above them — and a style attribute travels with the markup, so
 * neither can be left behind by a stylesheet that is a deploy or a cache
 * behind the HTML referencing it.
 */
const SUB_INDENT = 28;

/**
 * Shared interaction shell: the full-screen menu and the floating enquiry
 * dock. They are one component because the dock hides while the menu is
 * open, so a single piece of state drives both.
 */
export function SiteChrome() {
  const menu = useNavMenu();
  const menuOpen = menu?.open ?? false;
  const setMenuOpen = React.useCallback(
    (open: boolean) => menu?.setOpen(open),
    [menu],
  );
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Lock the page behind the overlay, and restore scroll on close.
  React.useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      {menuOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-90 flex animate-[migss-menu-in_0.22s_ease-out_both] flex-col bg-migss-neutral-900 text-migss-neutral-100"
        >
          {/* A three-column grid rather than `justify-between`, because the
              label is meant to be centred on the bar and the two things
              flanking it are different widths — spacing them apart would put
              it wherever the leftover room happened to fall. The outer columns
              take an equal share and their contents sit at the outer edges, so
              the middle one is centred on the bar itself.

              The column template and the two outer alignments are style
              attributes, not classes, for the same reason the sub-indent is:
              they are structural, and a grid item that loses its alignment
              does not fail quietly. It falls back to the start of its column,
              which for the close button is hard against the label in the
              middle of the bar rather than out at the edge. The padding the
              two ends mirror is the bar's own, so one value sets both. */}
          {/* Phones: the logins sit at the left and the close button at the
              right, in a two-column grid whose first column can shrink
              (minmax(0, 1fr)) so the logins can never push the X off-screen.
              From md up: three columns with equal fixed outer tracks, the
              close button's own width, so the logins are centred on the bar
              itself rather than wherever the leftover space falls. */}
          <div className="grid grid-cols-[minmax(0,1fr)_46px] items-center gap-3 border-b border-migss-neutral-100/20 px-[clamp(16px,4.5vw,48px)] py-3 md:grid-cols-[46px_minmax(0,1fr)_46px]">
            <span aria-hidden="true" className="hidden md:block" />

            {/* The two logins, side by side where the "Menu" label used to
                be. Neither is a page of this site, so they stay out of the
                navigation list. Staff is plain text at the bar's type; Client
                is the tan chip with a lock, so the one a customer is looking
                for is the one that stands out. */}
            <div className="flex min-w-0 items-center gap-[clamp(12px,3vw,24px)] justify-self-start md:justify-self-center">
              <a
                href={STAFF_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] tracking-[0.24em] whitespace-nowrap text-migss-neutral-100/75 uppercase no-underline transition-colors [@media(hover:hover)]:hover:text-migss-accent-300"
              >
                Staff Login
              </a>
              <Link
                href={CLIENT_LOGIN_PATH}
                onClick={() => setMenuOpen(false)}
                className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-migss-accent-400 bg-migss-accent-300/12 px-3.5 text-[11px] font-medium tracking-[0.24em] whitespace-nowrap text-migss-accent-300 uppercase no-underline transition-colors active:bg-migss-accent-300/20 [@media(hover:hover)]:hover:bg-migss-accent-300/20"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
                Client Login
              </Link>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              // No border: the X is its own affordance and a box around it
              // only crowded the bar. The hover wash stays, but gated to
              // pointer devices like everything else here — the close button
              // opens up directly under the cursor that just hit the
              // hamburger, and on touch that would leave a highlight sitting
              // there with no pointer to explain it.
              className="grid h-[46px] w-[46px] cursor-pointer place-items-center justify-self-end rounded-[4px] border-0 bg-transparent text-inherit transition-colors active:scale-95 [@media(hover:hover)]:hover:bg-migss-neutral-100/10"
            >
              <svg
                width="20"
                height="20"
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

          <nav className="flex flex-1 flex-col overflow-y-auto px-[clamp(16px,4.5vw,48px)] pt-[18px] pb-7">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="group flex min-h-[64px] items-baseline gap-3.5 border-b border-migss-neutral-100/15 pt-3.5 text-inherit no-underline transition-colors active:text-migss-accent-300 [@media(hover:hover)]:hover:text-migss-accent-300"
                // The indent rides in the markup rather than in a utility
                // class. A fixed step, not a proportional one: the rows are
                // already fluid, and an indent that moved with the viewport
                // would stop reading as a level and start reading as drift.
                style={item.sub ? { paddingLeft: SUB_INDENT } : undefined}
              >
                <span className="w-[22px] text-[11px] text-migss-accent-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-[28px] leading-[1.1]">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="mt-auto flex flex-col gap-2.5 pt-7">
              <ButtonLink href={telHref} variant="outlineAccent" size="lg">
                Book a Free Call Now
              </ButtonLink>
              <ButtonLink
                href="/contact"
                data-enquire=""
                variant="outlineLight"
                size="lg"
                onClick={() => setMenuOpen(false)}
              >
                Request a quote
              </ButtonLink>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-migss-neutral-400">
                {SITE.phone} · {SITE.email}
                <br />
                Mon–Sat, 8am–6pm · North London &amp; Chigwell
              </p>
            </div>
          </nav>
        </div>
      ) : (
        <EnquiryDock />
      )}
    </>
  );
}
