"use client";

import * as React from "react";

import { usePathname } from "next/navigation";

/**
 * Lands every client-side navigation at the top of the page, immediately.
 *
 * The App Router already scrolls to the top on navigation. The reason it did
 * not look like it was that `html` carried `scroll-behavior: smooth`, which
 * the browser applies to that reset as much as to an anchor jump, so the new
 * page animated down from wherever the visitor had been: about 800ms from
 * 3000px, and still at 2305px 400ms in with the CPU throttled 6x. Tapping a
 * dock link or the logo therefore appeared to land partway down the new page,
 * because for most of a second it had.
 *
 * `scroll-behavior` is now left at its default, so the router's reset is
 * instant on any device, and the smooth scroll is switched on only around an
 * in-page anchor click, where it is wanted. That keeps the `#enquire` and
 * `#work` links animating without letting navigation inherit it.
 *
 * The explicit reset below covers the case the router does not: it runs on
 * every pathname change, and skips
 *
 * - back and forward, where the browser and the router restore the previous
 *   position and jumping to the top would lose the visitor's place;
 * - navigations carrying a fragment, which have their own target.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const restoring = React.useRef(false);

  React.useEffect(() => {
    const onPopState = () => {
      restoring.current = true;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  React.useEffect(() => {
    if (restoring.current) {
      restoring.current = false;
      return;
    }
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useSmoothAnchors();

  return null;
}

/**
 * Turns smooth scrolling on for the duration of an in-page anchor jump.
 *
 * The click is not intercepted: the browser does its own anchor handling,
 * history entry and focus, and this only sets the behaviour it will use, then
 * puts it back. `scroll-padding-top` in globals.css keeps the target clear of
 * the header either way.
 */
function useSmoothAnchors() {
  React.useEffect(() => {
    const root = document.documentElement;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href) return;

      // Same-document only: "#work" here, or "/#enquire" while already home.
      const url = new URL(href, window.location.href);
      if (!url.hash || url.pathname !== window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      root.style.scrollBehavior = "smooth";
      window.setTimeout(() => {
        root.style.scrollBehavior = "";
      }, 1200);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}
