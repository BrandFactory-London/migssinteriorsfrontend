"use client";

import * as React from "react";

import Link from "next/link";

import { SITE, telHref } from "@/lib/site";
import { LogoSplit } from "@/components/logo-split";
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
 * Height of the overlay header row — 18px of padding either side of a 44px
 * control. Used as the line below which the hero still counts as being behind
 * the header, and so as the point where its controls switch ink.
 */
const HEADER_ROW = 80;

/**
 * `overlay` sits on top of a photographic hero in light-on-dark, `solid` is the
 * in-page bar used where a page opens on the background colour instead.
 *
 * The scroll behaviour differs between them, because their backgrounds do.
 *
 * `overlay` is transparent — nothing is painted behind it at all — so the bar
 * itself can stay put and only its contents need to react. The brand group —
 * the logo's wordmark and the phone number — hides on the way down and returns
 * on the way up, and shares a single class string precisely so the two cannot
 * drift apart: one opacity, one translate, one transition. The menu button and
 * the logo's emblem are deliberately outside that group: they ride along at the
 * top of the viewport the whole way down the page, so there is never a stretch
 * with no way into the menu and never one with nothing identifying the site. The
 * bar is `pointer-events-none` with its three controls opting back in, so the
 * transparent strip it occupies does not swallow clicks meant for the hero.
 *
 * Sitting directly on the page means the controls have to carry their own
 * legibility; `ink` below is how they do it.
 *
 * `solid` keeps its own opaque background, and a bar of empty background with
 * a lone hamburger in it is worse than no bar, so there the whole thing hides
 * and shows together as it always has.
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
  const hidden = useHideOnScrollDown();
  const pastHero = usePastHero(overlay);
  const reducedMotion = useReducedMotion();
  const menu = useNavMenu();

  /**
   * The fade, as a style object rather than a class string.
   *
   * Everything structural in this header now travels in the markup, for the
   * reason the menu bar's columns do: a utility class that fails to arrive
   * takes the behaviour with it, and these two — whether the group is shown,
   * and what colour its neighbours are — are the whole point of the header
   * reacting to scroll at all. In the markup they cannot be a stylesheet
   * behind the HTML that references them.
   *
   * Reduced motion is handled here too. The global rule in globals.css
   * shortens transition durations rather than removing them, so this asks the
   * same question directly and hands back a duration of zero: the group still
   * appears and disappears, it just stops sliding while it does.
   */
  const fadeStyle = (alsoTransition?: string): React.CSSProperties => ({
    transitionProperty: ["opacity", "translate", alsoTransition]
      .filter(Boolean)
      .join(", "),
    transitionDuration: reducedMotion ? "0ms" : "500ms",
    transitionTimingFunction: "cubic-bezier(.4,0,.2,1)",
    willChange: "opacity, translate",
    opacity: hidden ? 0 : 1,
    translate: hidden ? "0 -0.5rem" : undefined,
    pointerEvents: hidden ? "none" : undefined,
  });

  /**
   * With no scrim, there are only two things that can be behind the overlay
   * header — the hero, which is dark, and the page below it, which is light —
   * so one value serves every control that has to stay legible against both.
   * The phone number and the menu button share it, which is what keeps them
   * in step: they are side by side, and nothing looks more broken than two
   * neighbours disagreeing about what colour the background is.
   *
   * The token carries a literal fallback, so even a stylesheet that never
   * arrives cannot leave a control with no colour at all.
   *
   * The logo is exempt. It is a single tan (#b08a6c, the brand accent), chosen
   * so one file carries both tones, and it needs no help from either side.
   */
  const ink = overlay
    ? pastHero
      ? "var(--color-migss-text, #201f1d)"
      : "var(--color-migss-neutral-100, #f8f4f4)"
    : undefined;

  // The hover wash is not structural — nothing breaks if it never arrives —
  // so it stays a class.
  const inkHover =
    overlay &&
    (pastHero
      ? "[@media(hover:hover)]:hover:bg-migss-text/7"
      : "[@media(hover:hover)]:hover:bg-migss-neutral-100/12");

  return (
    <header
      className={cn(
        "z-40",
        overlay
          ? "pointer-events-none fixed inset-x-0 top-0 text-migss-neutral-100"
          : "sticky top-0 border-b border-[var(--migss-divider)] bg-migss-bg text-migss-text",
      )}
      // On `solid` the whole bar is what comes and goes, so it wears the fade
      // itself — and travels its own height rather than the group's nudge.
      style={
        overlay
          ? undefined
          : { ...fadeStyle(), translate: hidden ? "0 -100%" : undefined }
      }
    >
      <div
        className={cn(
          "relative flex items-center gap-4 px-[clamp(16px,7.2vw,100px)]",
          overlay ? "py-[18px]" : "py-3.5",
        )}
      >
        {/* The link itself no longer fades. Its emblem is now one of the
            fixtures of the bar, alongside the menu button: something is
            always there to get you home. Only the wordmark travels with the
            phone number, and it is handed the very same style object the
            phone number gets, so the two cannot fall out of step. */}
        <Link
          href="/"
          className="pointer-events-auto mr-auto text-inherit no-underline"
        >
          <LogoSplit
            height={27}
            priority
            wordmarkStyle={overlay ? fadeStyle() : undefined}
          />
        </Link>

        <a
          href={telHref}
          className={cn(
            "pointer-events-auto inline-flex min-h-[44px] items-center gap-2 text-[13.5px] tracking-[0.02em] text-inherit no-underline",
            inkHover,
          )}
          // The phone number does both jobs at once, so its transition has to
          // name colour as well, or the fade's own list would quietly drop it
          // and the colour would jump instead of easing.
          style={overlay ? { ...fadeStyle("color"), color: ink } : undefined}
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
              "pointer-events-auto grid h-[44px] w-[44px] flex-none cursor-pointer place-items-center rounded-[4px] border-0 bg-transparent text-inherit active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent",
              !overlay && "[@media(hover:hover)]:hover:bg-migss-text/7",
              inkHover,
            )}
            style={
              overlay
                ? {
                    color: ink,
                    transitionProperty: "color",
                    transitionDuration: reducedMotion ? "0ms" : "300ms",
                  }
                : undefined
            }
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
 * Drives the appear/disappear: hide on scroll down, show on scroll up or near
 * the top. On `overlay` it moves the brand group, on `solid` the whole bar.
 *
 * It reads `scrollY` inside a `requestAnimationFrame` from a passive listener,
 * so it neither blocks the scroll nor lays out on every event. That matters
 * here because the site's other scroll motion — `components/reveal.tsx` — is
 * driven by IntersectionObserver rather than by scroll position, and the two
 * must not end up fighting over the same frame. They are independent: nothing
 * here moves the elements the observer is watching, and the observer's
 * thresholds are measured against the viewport, which the header sits on top
 * of rather than displacing.
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

/**
 * Whether the photographic hero has scrolled clear of the header row — which,
 * for a transparent bar, is the same question as whether what is behind the
 * header is still dark.
 *
 * The overlay header is only ever used on a page that opens on a full-height
 * hero, and that hero is the first thing in `main`, so that is what this
 * watches. An IntersectionObserver rather than a scroll position, for the same
 * reason `components/reveal.tsx` uses one: it reports the geometry directly,
 * costs nothing per frame, and does not need to know the hero's height, which
 * is a viewport-relative clamp and changes with the window.
 *
 * The top inset shrinks the observed region by the header row, so the hero
 * stops counting as "behind the header" at the moment its bottom edge passes
 * under it rather than when it leaves the viewport entirely.
 *
 * Defaults to false, which keeps the ink light — the safe reading, since an
 * overlay header starts over a photograph.
 */
function usePastHero(enabled: boolean) {
  const [pastHero, setPastHero] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;

    const hero = document.querySelector("main > *");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: `-${HEADER_ROW}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [enabled]);

  return pastHero;
}

/**
 * Whether the visitor has asked for reduced motion.
 *
 * Read here rather than left to CSS because the transitions this header runs
 * are now inline, and the global rule in globals.css only shortens durations
 * it can see in a stylesheet. Watched rather than read once, so toggling the
 * preference takes effect without a reload, like `HeroVideo` does.
 */
function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return reduced;
}
