"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/*
 * Herringbone texture for the landing pages' open space (TKT-103, approved by
 * Amir on the design canvas, 15 Nov 2026).
 *
 * A soft patch of 45° herringbone planks behind the content, with a gaussian
 * fade at its edges. As its section scrolls into view the planks are laid in
 * sixteen groups, in a sweep across the patch; as it scrolls out they are
 * lifted in the same order, and the pattern drifts a little slower than the
 * page. The motion is CSS (scroll-driven animations, "Herringbone texture" in
 * globals.css); without support, or with reduced motion, the patch simply
 * shows.
 *
 * Desktop only: phones have no open space for it. The planks are generated
 * in the browser after mount, so none of them are in the page's HTML.
 */

const UNIT = 14; // plank width; planks are 2:1
const GROUPS = 16;

const GAUSSIAN =
  "#000 0%, rgba(0,0,0,0.94) 12%, rgba(0,0,0,0.78) 25%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.32) 52%, rgba(0,0,0,0.15) 66%, rgba(0,0,0,0.05) 80%, transparent 100%";
const MASK = `radial-gradient(ellipse 50% 50% at 50% 50%, ${GAUSSIAN})`;

type Plank = { x: number; y: number; w: number; h: number };

/** A small seeded generator so the jitter is the same on every visit. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

/**
 * Planks covering a W×H patch, grouped by laying order. The herringbone is a
 * staircase of 2×1 planks on a 4×4 repeat: horizontal at (k+2m, k−2m) and
 * vertical at (k+2m, k+1−2m), rotated 45° about the patch centre.
 */
function layPlanks(width: number, height: number, seed: number): Plank[][] {
  const random = seeded(seed);
  const groups: Plank[][] = Array.from({ length: GROUPS }, () => []);
  const cx = width / 2;
  const cy = height / 2;
  const cos = Math.SQRT1_2;
  const sin = Math.SQRT1_2;
  const reach = Math.ceil(Math.hypot(width, height) / UNIT / 2) + 4;

  for (let k = -2 * reach; k < 2 * reach; k++) {
    for (let m = -reach; m < reach; m++) {
      for (const [x, y, w, h] of [
        [k + 2 * m, k - 2 * m, 2, 1],
        [k + 2 * m, k + 1 - 2 * m, 1, 2],
      ]) {
        const lx = (x + w / 2) * UNIT;
        const ly = (y + h / 2) * UNIT;
        const sx = cx + lx * cos - ly * sin;
        const sy = cy + lx * sin + ly * cos;
        if (sx < -UNIT || sx > width + UNIT || sy < -UNIT || sy > height + UNIT) continue;
        // Outside the fade's ellipse nothing would show anyway.
        if (Math.hypot((sx - cx) / cx, (sy - cy) / cy) > 1.02) continue;
        // Laying order: a sweep along the diagonal, with a little jitter.
        const order =
          (sx * 0.75 + sy * 0.45) / (width * 0.75 + height * 0.45) +
          (random() - 0.5) * 0.1;
        const group = Math.min(GROUPS - 1, Math.max(0, Math.floor(order * GROUPS)));
        groups[group].push({ x: x * UNIT + 0.5, y: y * UNIT + 0.5, w: w * UNIT, h: h * UNIT });
      }
    }
  }
  return groups;
}

function useDesktop() {
  const [desktop, setDesktop] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function Herringbone({
  width,
  height,
  className,
  seed = 7,
}: {
  /** The patch's drawing size; the SVG covers its box like object-fit: cover. */
  width: number;
  height: number;
  /** Position and size of the patch inside its (relative, isolated) section. */
  className: string;
  seed?: number;
}) {
  const desktop = useDesktop();
  const groups = React.useMemo(
    () => (desktop ? layPlanks(width, height, seed) : null),
    [desktop, width, height, seed],
  );
  if (!groups) return null;

  return (
    <div
      aria-hidden="true"
      className={cn("lp-tx", className)}
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice">
        <g
          transform={`translate(${width / 2} ${height / 2}) rotate(45)`}
          fill="none"
          stroke="#7a5a40"
          strokeWidth="1"
        >
          {groups.map((planks, index) => (
            <g key={index} className={`lp-b lp-b${index}`}>
              {planks.map((plank) => (
                <rect
                  key={`${plank.x},${plank.y}`}
                  x={plank.x}
                  y={plank.y}
                  width={plank.w}
                  height={plank.h}
                />
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
