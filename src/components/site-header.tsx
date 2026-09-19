"use client";

import * as React from "react";

import Link from "next/link";

import { SITE, telHref } from "@/lib/site";
import { Logo } from "@/components/logo";
import { useNavMenu } from "@/components/nav-menu";
import { cn } from "@/lib/utils";

/**
 * Pixels of downward scroll tolerated before the brand group hides, so that
 * the small jitter a touch scroll ends on does not flicker it away.
 */
const HIDE_AFTER = 6;

/**
 * Distance from the top within which the brand group is always shown. Below
 * this the page has barely moved and a hidden logo reads as a bug.
 */
const ALWAYS_SHOWN_ABOVE = 80;

/**
 * Both treatments now sit in the flow and scroll away with the page: `overlay`
 * is `absolute` over a photographic hero so it lies on the picture rather than
 * pushing it down, `solid` is the ordinary in-page bar. Neither follows the
 * visitor down any more.
 *
 * What does react to scroll is the brand group — the gradient scrim, the logo
 * and the phone number — which fades as one. They share a single wrapper
 * precisely so they cannot drift apart: one opacity, one transform, one
 * transition. The menu button is outside that group and stays legible for as
 * long as the header itself is on screen.
 *
 * Logo and the menu/phone cluster are pinned to the viewport edges rather than
 * to the 1280px content column, at 100px in from each side. The clamp holds
 * that 100px from roughly 1390px up and eases it in on narrower screens, where
 * a literal 100px gutter would leave the row nowhere to go.
 */
export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const overlay = variant === "overlay";
  const brandHidden = useHideOnScrollDown();
  const menu = useNavMenu();

  const brandGroup = cn(
    "transition-[opacity,translate] duration-500 ease-[cubic-bezier(.4,0,.2,1)] will-change-[opacity,translate] motion-reduce:transition-none",
    brandHidden && "pointer-events-none -translate-y-2 opacity-0",
  );

  return (
    <header
      className={cn(
        "z-40",
        overlay
          ? "absolute inset-x-0 top-0 text-migss-neutral-100"
          : "border-b border-[var(--migss-divider)] bg-migss-bg text-migss-text",
      )}
    >
      {/* The scrim: dark at the top, clear by the bottom of the header, so the
          light-on-dark logo and number hold their contrast over whatever the
          hero photograph happens to be doing up there. Overlay only — the
          solid bar has its own background. */}
      {overlay ? (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-[190px] bg-[linear-gradient(to_bottom,color-mix(in_srgb,#2d2b2b_72%,transparent)_0%,color-mix(in_srgb,#2d2b2b_34%,transparent)_52%,transparent_100%)]",
            brandGroup,
          )}
        />
      ) : null}

      <div
        className={cn(
          "relative flex items-center gap-4 px-[clamp(16px,7.2vw,100px)]",
          overlay ? "py-[18px]" : "py-3.5",
        )}
      >
        <Link
          href="/"
          className={cn("mr-auto text-inherit no-underline", brandGroup)}
        >
          <Logo height={27} priority />
        </Link>

        <a
          href={telHref}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-[13.5px] tracking-[0.02em] text-inherit no-underline",
            brandGroup,
          )}
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
              "grid h-[44px] w-[44px] flex-none cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent text-inherit transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent",
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
 * Drives the brand group's appear/disappear: hide on scroll down, show on
 * scroll up or near the top.
 *
 * It reads `scrollY` inside a `requestAnimationFrame` from a passive listener,
 * so it neither blocks the scroll nor lays out on every event. That matters
 * here because the site's other scroll motion — `components/reveal.tsx` — is
 * driven by IntersectionObserver rather than by scroll position, and the two
 * must not end up fighting over the same frame. They are independent: nothing
 * here moves the elements the observer is watching, and the observer's
 * thresholds are measured against the viewport, which the header does not
 * change now that it sits in the flow.
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
