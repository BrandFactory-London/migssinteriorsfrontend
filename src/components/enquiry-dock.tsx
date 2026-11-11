"use client";

import * as React from "react";

import { WHATSAPP_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

/** How long the page must go without the dock being touched before the nudge. */
const NUDGE_DELAY_MS = 45_000;
/** Once shown or dismissed, the nudge stays away for the rest of the visit. */
const NUDGE_SEEN_KEY = "migss-dock-nudge-seen";

function nudgeSeen() {
  try {
    return window.sessionStorage.getItem(NUDGE_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markNudgeSeen() {
  try {
    window.sessionStorage.setItem(NUDGE_SEEN_KEY, "1");
  } catch {
    // No storage: the nudge may show once more on the next page. Harmless.
  }
}

/** The enquiry card or the menu is open: nothing should float over them. */
function overlayOpen() {
  return document.querySelector('[aria-modal="true"]') !== null;
}

/**
 * The floating dock, for enquiries only: WhatsApp and the enquiry form.
 *
 * Resting, it shows the WhatsApp mark and a "Free consultation" button. The first tap
 * (or, on a desktop, hovering or tabbing to it) expands it: a "Contact us
 * now" line with the response time appears above, and WhatsApp gains its
 * label. Buttons act on the next tap, so nobody lands in WhatsApp or the form
 * by brushing the dock. It collapses again from its chevron, a tap outside,
 * scrolling, Escape, or the pointer leaving on a desktop.
 *
 * If the dock is left alone for 45 seconds, a small pill slides up above it
 * once per visit, inviting a free consultation. It can be dismissed, and
 * tapping it expands the dock.
 *
 * "Free consultation" carries `data-enquire`, so the site-wide EnquiryDialog opens it with
 * the page's context, exactly as before. Without JavaScript both buttons are
 * plain links (WhatsApp, and /contact).
 */
export function EnquiryDock() {
  const [expanded, setExpanded] = React.useState(false);
  const [nudge, setNudge] = React.useState(false);
  const touched = React.useRef(false);
  const dock = React.useRef<HTMLDivElement>(null);
  const whatsapp = React.useRef<HTMLAnchorElement>(null);
  const panelId = React.useId();

  const expand = React.useCallback((focusFirst = false) => {
    touched.current = true;
    setNudge(false);
    setExpanded(true);
    if (focusFirst) requestAnimationFrame(() => whatsapp.current?.focus());
  }, []);
  const collapse = React.useCallback(() => setExpanded(false), []);

  // Collapse on a tap outside, on scroll, or on Escape.
  React.useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!dock.current?.contains(event.target as Node)) collapse();
    };
    const onScroll = () => collapse();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapse();
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded, collapse]);

  // The idle nudge: once per visit, only if the dock was never touched, and
  // never over the enquiry card or the menu (it waits for them to close).
  React.useEffect(() => {
    if (nudgeSeen()) return;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = () => {
      if (touched.current || nudgeSeen()) return;
      if (overlayOpen()) {
        timer = setTimeout(attempt, 5_000);
        return;
      }
      markNudgeSeen();
      setNudge(true);
    };
    timer = setTimeout(attempt, NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Hide the nudge if an overlay opens while it is showing.
  React.useEffect(() => {
    if (!nudge) return;
    const check = () => {
      if (overlayOpen()) setNudge(false);
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true });
    return () => observer.disconnect();
  }, [nudge]);

  return (
    <div
      ref={dock}
      className="fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-1/2 z-50 flex w-max max-w-[calc(100vw-20px)] animate-[migss-dock-in_0.5s_cubic-bezier(.2,.65,.2,1)_both] flex-col items-center"
      // Hover expands on a desktop only: a finger's tap also fires
      // pointerenter, and must reach the resting dock's own tap handler.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") expand();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") collapse();
      }}
      // Keyboard users tabbing away collapse it. Focus moving to nothing
      // (a tap, or the resting control unmounting) is left to the
      // tap-outside handler instead.
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && !event.currentTarget.contains(next)) collapse();
      }}
    >
      {nudge && (
        <div
          role="status"
          // Full width on phones (16px gutters), capped on wider screens so
          // it still reads as part of the dock rather than a page banner.
          className="dock-nudge mb-2.5 flex w-[min(560px,calc(100vw-32px))] items-center rounded-[16px] bg-migss-neutral-900 text-migss-neutral-100 shadow-[0_10px_28px_-10px_color-mix(in_srgb,#2d2b2b_60%,transparent)]"
        >
          <button
            type="button"
            onClick={(event) => expand(event.detail === 0)}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-[16px] py-3 pr-2 pl-4 text-left text-[13.5px] leading-[1.4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent"
          >
            {/* The same breathing "we are here" dot as the expanded dock, in
                the same place: before the text. */}
            <span aria-hidden="true" className="dock-dot relative size-2.5 flex-none rounded-full bg-[#4caf68]" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-migss-accent-300">Get in touch now</span>
              Free renovation consultations and advice
            </span>
          </button>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => setNudge(false)}
            className="mr-1.5 flex size-9 flex-none items-center justify-center rounded-full text-migss-neutral-400 transition-colors focus-visible:outline-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:text-migss-neutral-100"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={cn(
          "relative overflow-hidden border border-migss-text/10 bg-migss-bg/70 shadow-[0_10px_34px_-12px_color-mix(in_srgb,#2d2b2b_38%,transparent),inset_0_1px_0_color-mix(in_srgb,#fff_55%,transparent)] backdrop-blur-[20px] backdrop-saturate-[180%] transition-[border-radius,padding,width] duration-[380ms] ease-[cubic-bezier(.2,.8,.2,1)]",
          expanded
            ? "w-[min(356px,calc(100vw-20px))] rounded-[22px] p-3"
            : "rounded-[30px] p-1.5",
        )}
      >
        {/* The "Contact us now" line: a grid row that opens from 0 to its
            content's height, so the dock grows upwards smoothly. */}
        <div
          id={panelId}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-[380ms] ease-[cubic-bezier(.2,.8,.2,1)]",
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          {/* w-0 min-w-full: the line takes the dock's width but never sets
              it. Collapsed to zero height it would otherwise still widen the
              resting dock to the length of its text. */}
          <div className="w-0 min-w-full overflow-hidden">
            <div className="flex items-center gap-2.5 px-1 pt-0.5 pb-3">
              <span aria-hidden="true" className="dock-dot relative size-2 flex-none rounded-full bg-[#3b8a4f]" />
              <p className="min-w-0 flex-1 text-[15px] leading-[1.25] text-migss-text">
                Contact us now
                <span className="block text-[12px] text-migss-text/60">
                  Avg. response time 20 minutes
                </span>
              </p>
              <button
                type="button"
                aria-label="Hide contact options"
                tabIndex={expanded ? 0 : -1}
                onClick={collapse}
                className="-mt-1 -mr-1 flex size-9 flex-none items-center justify-center self-start rounded-full text-migss-text/55 transition-colors focus-visible:outline-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:text-migss-text"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className={cn("flex items-center", expanded ? "gap-2" : "gap-1")}>
          {/* The WhatsApp Business click-to-chat link, used verbatim. */}
          <a
            ref={whatsapp}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={expanded ? 0 : -1}
            aria-label="Message us on WhatsApp"
            className={cn(
              "flex h-[46px] items-center justify-center rounded-full text-migss-accent-ink no-underline transition-[background-color,transform] duration-300 active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/12",
              expanded ? "flex-none gap-2 px-3" : "w-[50px] flex-none",
            )}
          >
            {/* The supplied logo, painted through a mask so it takes the
                accent colour. Prefixed as well: Safari before 15.4 ignores the
                unprefixed property and would paint a solid square. */}
            <span
              aria-hidden="true"
              className="block h-[21px] w-[21px] flex-none bg-current [-webkit-mask-image:url(/Brand/whatsapplogo.svg)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-image:url(/Brand/whatsapplogo.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
            {expanded && (
              <span className="text-[14px] font-semibold whitespace-nowrap">WhatsApp</span>
            )}
          </a>

          {/* Opens the site-wide enquiry card (EnquiryDialog) with this
              page's context; without JavaScript, a plain link to /contact. */}
          <a
            href="/contact"
            data-enquire=""
            tabIndex={expanded ? 0 : -1}
            aria-label="Free consultation: open the enquiry form"
            className={cn(
              "flex h-[46px] min-w-0 items-center justify-center whitespace-nowrap rounded-full bg-migss-accent-ink px-5 text-[14.5px] font-semibold tracking-[0.01em] text-white no-underline transition-[background-color,transform] duration-300 active:scale-[0.95] active:bg-migss-accent-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent-800",
              expanded && "flex-1",
            )}
          >
            Free consultation
          </a>
        </div>

        {/* Resting, the whole dock is one control: the first tap only opens
            it. It sits over the buttons until then, and is gone once the
            dock is expanded, so the next tap reaches the button beneath. */}
        {!expanded && (
          <button
            type="button"
            aria-expanded={false}
            aria-controls={panelId}
            aria-label="Contact us: WhatsApp or the enquiry form"
            // detail is 0 for Enter or Space: only then move focus into the
            // dock, so a tap does not leave a focus ring behind.
            onClick={(event) => expand(event.detail === 0)}
            className="absolute inset-0 cursor-pointer rounded-[30px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent"
          />
        )}
      </div>
    </div>
  );
}
