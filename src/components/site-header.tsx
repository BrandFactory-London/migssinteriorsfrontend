"use client";

import * as React from "react";

import Link from "next/link";

import { SITE, telHref } from "@/lib/site";
import { Logo } from "@/components/logo";
import { useNavMenu } from "@/components/nav-menu";
import { cn } from "@/lib/utils";

/**
 * Pixels of downward scroll tolerated before the header hides, so that the
 * small jitter a touch scroll ends on does not flicker it away.
 */
const HIDE_AFTER = 6;

/**
 * Distance from the top within which the header is always shown. Below this
 * the page has barely moved and a hidden header reads as a bug.
 */
const ALWAYS_SHOWN_ABOVE = 80;

/**
 * Two treatments, both in the handoff: `overlay` sits on top of a photographic
 * hero in light-on-dark, `solid` is the in-page bar used where a page opens on
 * the background colour instead.
 *
 * Both now stay with the visitor rather than scrolling away, and hide on the
 * way down to give the page its full height back. `solid` is `sticky` so it
 * keeps its space in the flow and the content below does not jump up under it;
 * `overlay` is `fixed`, because it is meant to sit on the hero rather than
 * push it down, which is what it did as `absolute`.
 */
export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const overlay = variant === "overlay";
  const hidden = useHideOnScrollDown();
  const menu = useNavMenu();

  return (
    <header
      className={cn(
        "z-40 transition-[translate,opacity] duration-500 ease-[cubic-bezier(.4,0,.2,1)] will-change-[translate,opacity] motion-reduce:transition-none",
        overlay
          ? "fixed inset-x-0 top-0 text-migss-neutral-100"
          : "sticky top-0 border-b border-[var(--migss-divider)] bg-migss-bg text-migss-text",
        hidden && "pointer-events-none -translate-y-full opacity-0",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center gap-4 px-[clamp(16px,4.5vw,48px)]",
          overlay ? "py-[18px]" : "py-3.5",
        )}
      >
        <Link href="/" className="mr-auto text-inherit no-underline">
          <Logo height={27} priority />
        </Link>

        <a
          href={telHref}
          className="inline-flex min-h-[44px] items-center gap-2 text-[13.5px] tracking-[0.02em] text-inherit no-underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={overlay ? undefined : "stroke-migss-accent-700"}
          >
            <path d="M7.2 3.5h-3a1.7 1.7 0 0 0-1.7 1.9c.6 5.3 3 9.6 7 12.9 2.1 1.7 4.2 2.7 6.2 3.1a1.7 1.7 0 0 0 1.9-1.7v-2.9a1.7 1.7 0 0 0-1.4-1.7l-2.5-.4a1.7 1.7 0 0 0-1.5.5l-.9.9a14.5 14.5 0 0 1-4.6-4.6l.9-.9a1.7 1.7 0 0 0 .5-1.5l-.4-2.5a1.7 1.7 0 0 0-1.7-1.4z" />
          </svg>
          {SITE.phone}
        </a>

        {/* The menu moved here from the dock, which now carries only
            destinations and the two calls to action. */}
        {menu ? (
          <button
            type="button"
            onClick={() => menu.setOpen(true)}
            aria-label="Open full menu"
            aria-expanded={menu.open}
            className={cn(
              "-mr-2 grid h-[44px] w-[44px] flex-none cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent text-inherit transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent",
              overlay
                ? "[@media(hover:hover)]:hover:bg-migss-neutral-100/12"
                : "[@media(hover:hover)]:hover:bg-migss-text/7",
            )}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        ) : null}
      </div>
    </header>
  );
}

/**
 * The conventional hide-on-scroll-down, show-on-scroll-up header.
 *
 * It reads `scrollY` inside a `requestAnimationFrame` from a passive listener,
 * so it neither blocks the scroll nor lays out on every event. That matters
 * here because the site's other scroll motion — `components/reveal.tsx` — is
 * driven by IntersectionObserver rather than by scroll position, and the two
 * must not end up fighting over the same frame. They are independent: nothing
 * here moves the elements the observer is watching, and the observer's
 * thresholds are measured against the viewport, which a fixed header does not
 * change.
 */
function useHideOnScrollDown() {
  const [hidden, setHidden] = React.useState(false);
  const lastY = React.useRef(0);
  const frame = React.useRef(0);

  React.useEffect(() => {
    lastY.current = window.scrollY;

    const update = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY.current;

      if (y <= ALWAYS_SHOWN_ABOVE) {
        setHidden(false);
      } else if (delta > HIDE_AFTER) {
        setHidden(true);
      } else if (delta < 0) {
        // Any upward movement at all brings it straight back.
        setHidden(false);
      }

      // Ignore the sub-threshold jitter rather than letting it accumulate into
      // a hide the visitor did not ask for.
      if (Math.abs(delta) > HIDE_AFTER || y <= ALWAYS_SHOWN_ABOVE) {
        lastY.current = y;
      }
      frame.current = 0;
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return hidden;
}
