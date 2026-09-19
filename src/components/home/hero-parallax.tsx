"use client";

import * as React from "react";

/**
 * How far the hero picture travels for each pixel the page scrolls. At 0.3 the
 * image drifts down at 30% of the page's speed, which reads as depth without
 * the detachment you get once the two speeds diverge much further.
 */
const RATE = 0.3;

/**
 * Parallax layer for the homepage hero photograph.
 *
 * The picture is oversized and offset upwards by the same amount it can
 * travel, so it still covers the section at both ends of the range — no
 * background edge is ever exposed. Movement is applied as a `translate3d` on a
 * wrapper rather than on the image, so the image element stays untouched and
 * `HeroMedia` can keep rendering either a photograph or a video into it.
 *
 * Like the header, it reads `scrollY` inside a `requestAnimationFrame` from a
 * passive listener: no layout reads, nothing blocking the scroll. It stops
 * updating once the hero has left the viewport, and does not move at all for
 * anyone who has asked for reduced motion — the extra height is harmless in
 * that case because the layer is `object-cover` and clipped by the section.
 */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const update = () => {
      frame.current = 0;
      const section = node.parentElement;
      if (!section) return;

      const { top, height } = section.getBoundingClientRect();
      // Nothing to do once the section is fully past the viewport.
      if (top > window.innerHeight || top + height < 0) return;

      node.style.transform = `translate3d(0, ${(-top * RATE).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 -top-[18%] h-[136%] will-change-transform"
    >
      {children}
    </div>
  );
}
