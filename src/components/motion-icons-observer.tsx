"use client";

import * as React from "react";

/**
 * On touch devices there is no hover, so each animated icon plays once as it
 * scrolls into view instead. One observer for the whole page: it finds every
 * `.mi` icon (including ones added later, such as the landing page form's
 * steps) and sets `data-play` the first time it is on screen.
 *
 * Does nothing on devices that can hover, or when reduced motion is on.
 */
export function MotionIconsObserver() {
  React.useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-play", "");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.5 },
    );

    const scan = () => {
      document.querySelectorAll(".mi:not([data-play])").forEach((node) => {
        if (seen.has(node)) return;
        seen.add(node);
        io.observe(node);
      });
    };

    scan();
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
