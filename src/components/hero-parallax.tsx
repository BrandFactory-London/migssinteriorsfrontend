"use client";

import * as React from "react";

/**
 * How far a hero picture travels for each pixel the page scrolls. At 0.3 the
 * image drifts down at 30% of the page's speed, which reads as depth without
 * the detachment you get once the two speeds diverge much further.
 */
const RATE = 0.3;

/**
 * How much taller than its box the moving layer is, and how far above the top
 * it starts. The layer can travel by the difference, so the overshoot is split
 * evenly above and below: 36% taller, starting 18% high, keeps it covering the
 * box at both ends of the range and never exposes an edge.
 *
 * A style attribute rather than utility classes, deliberately. This is the
 * one piece of geometry the effect cannot do without — a layer that loses its
 * height does not merely stop moving, it collapses and takes the picture with
 * it — so it travels in the markup rather than depending on a stylesheet
 * being in step with it.
 */
const OVERSHOOT = { top: "-18%", height: "136%" } as const;

/**
 * The parallax backdrop for a hero section.
 *
 * It renders two boxes. The outer one fills the section it is dropped into and
 * is what gets measured — measuring itself rather than reaching for a parent
 * means the effect carries no contract with whatever is rendering it, which is
 * what lets `HeroMedia` hand it a photograph or a video without either side
 * knowing the difference. The inner one is oversized, and is the only thing
 * that moves.
 *
 * Movement is a `translate3d` on that wrapper rather than on the media itself,
 * so the media element is untouched and can be an `img`, a `video` or the
 * placeholder box, each of which already fills its box with `object-cover`.
 *
 * It reads `scrollY` inside a `requestAnimationFrame` from a passive listener:
 * no layout thrash, nothing blocking the scroll. It stops updating once the
 * section has left the viewport, and does not move at all for anyone who has
 * asked for reduced motion — the extra height is harmless in that case,
 * because the layer is clipped by the section either way.
 */
export function HeroParallax({ children }: { children: React.ReactNode }) {
  const box = React.useRef<HTMLDivElement>(null);
  const layer = React.useRef<HTMLDivElement>(null);
  const frame = React.useRef(0);

  React.useEffect(() => {
    const boxNode = box.current;
    const layerNode = layer.current;
    if (!boxNode || !layerNode) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      frame.current = 0;
      if (reduced.matches) {
        layerNode.style.transform = "";
        return;
      }

      const { top, height } = boxNode.getBoundingClientRect();
      // Nothing to do once the section is clear of the viewport.
      if (top > window.innerHeight || top + height < 0) return;

      layerNode.style.transform = `translate3d(0, ${(-top * RATE).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Watched rather than read once, so turning the preference on stops a
    // layer that is already offset, and turning it off starts one moving.
    reduced.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduced.removeEventListener("change", onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div ref={box} className="absolute inset-0 overflow-hidden">
      <div
        ref={layer}
        className="absolute inset-x-0 will-change-transform"
        style={OVERSHOOT}
      >
        {children}
      </div>
    </div>
  );
}
