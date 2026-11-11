"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { EnquiryCardForm } from "@/components/enquiry/enquiry-card-form";
import { pageEnquiryContext } from "@/components/enquiry/page-context";
import { type EnquiryContext, isEnquiryFocus } from "@/lib/enquiry";

/**
 * The site-wide enquiry card. Opens from the dock's "Free quote" button and
 * from any enquiry link: a link marked `data-enquire`, or one to `#enquire`.
 * Without JavaScript, or with a modifier key held, the link still works as a
 * plain link (to /contact, or down to the page's enquiry section).
 *
 * A link can carry its own context (`data-enquire-focus`, `data-enquire-town`);
 * otherwise the card uses what the page registered with EnquiryPageContext.
 *
 * Modelled on the BrandFactory Labs enquiry pop-up: a sheet from the bottom on
 * phones, centred on larger screens, kept above the on-screen keyboard.
 */
export function EnquiryDialog() {
  const [open, setOpen] = React.useState<{ context: EnquiryContext; id: number } | null>(
    null,
  );
  const [keyboard, setKeyboard] = React.useState({ inset: 0, height: 0 });
  const card = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLElement | null>(null);

  // Catch clicks on enquiry links anywhere on the page.
  React.useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[data-enquire], a[href="#enquire"]',
      );
      if (!link) return;
      event.preventDefault();
      trigger.current = link;

      const page = pageEnquiryContext();
      const focus = link.dataset.enquireFocus;
      const town = link.dataset.enquireTown;
      setOpen({
        id: Date.now(),
        context: {
          focus: isEnquiryFocus(focus) ? focus : page.focus,
          town: town || page.town,
        },
      });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const close = React.useCallback(() => setOpen(null), []);

  // While open: Escape closes, Tab stays inside, the page behind does not
  // scroll, and the card stays above the on-screen keyboard on phones.
  React.useEffect(() => {
    if (!open) return;
    const el = card.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => el?.focus());

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
        return;
      }
      if (event.key !== "Tab" || !el) return;
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([type=radio]), input[type=radio]:checked, select, textarea",
        ),
      ).filter((i) => i.tabIndex !== -1 && i.offsetParent !== null);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const viewport = window.visualViewport;
    function onViewport() {
      if (!viewport) return;
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboard({ inset, height: viewport.height });
    }
    onViewport();
    viewport?.addEventListener("resize", onViewport);
    viewport?.addEventListener("scroll", onViewport);
    document.addEventListener("keydown", onKey);

    const returnTo = trigger.current;
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      viewport?.removeEventListener("resize", onViewport);
      viewport?.removeEventListener("scroll", onViewport);
      returnTo?.focus();
    };
  }, [open]);

  if (!open) return null;

  // Most of the screen, but never taller than the space left above an open
  // keyboard. The Migss steps carry more fields than the Labs card, so the
  // sheet is taller than Labs' half screen; the body scrolls if it must.
  const keyboardOpen = keyboard.inset > 80;
  const height = keyboardOpen
    ? `${Math.min(keyboard.height * 0.92, 460)}px`
    : "min(620px, 76dvh)";

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div
        aria-hidden="true"
        onClick={close}
        className="enquiry-scrim absolute inset-0 bg-[color-mix(in_srgb,#201f1d_32%,transparent)] backdrop-blur-[3px]"
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-end justify-center px-2.5 md:items-center md:px-6"
        style={{ paddingBottom: `calc(12px + env(safe-area-inset-bottom) + ${keyboard.inset}px)` }}
      >
        <div
          ref={card}
          role="dialog"
          aria-modal="true"
          aria-label="Get a free quote"
          tabIndex={-1}
          className="enquiry-pop pointer-events-auto relative w-full max-w-[520px] origin-bottom overflow-hidden rounded-[14px] border border-migss-text/10 bg-migss-bg/85 text-migss-text shadow-[0_24px_60px_-12px_color-mix(in_srgb,#2d2b2b_45%,transparent),inset_0_1px_0_color-mix(in_srgb,#fff_55%,transparent)] backdrop-blur-[22px] backdrop-saturate-[180%] focus:outline-none md:origin-center"
          style={{ height }}
        >
          <EnquiryCardForm
            key={open.id}
            variant="pop-up"
            context={open.context}
            onClose={close}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
