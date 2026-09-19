import type * as React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The horizontal lockup's natural size, and where the emblem ends and the
 * wordmark begins.
 *
 * The supplied artwork is a single flattened PNG — there is no layered or
 * vector source in the repository — but its alpha channel has a 22px run of
 * fully transparent columns at x=76..97, more than five times wider than any
 * other gap in the file (the next largest, 8px, is letter spacing inside the
 * wordmark). The emblem occupies everything to its left, the wordmark
 * everything to its right, and a cut anywhere inside that run passes through
 * no ink at all. `SPLIT_PERCENT` takes the middle of it.
 */
const ART = { src: "/Brand/logo-horizontal.png", width: 412, height: 86 };
const GUTTER = { from: 76, to: 97 };
const SPLIT_PERCENT = ((GUTTER.from + GUTTER.to + 1) / 2 / ART.width) * 100;

/**
 * The logo, in two pieces that can be shown independently.
 *
 * Nothing is cropped and no second asset is generated. The same file is
 * rendered twice, stacked at identical size and position, and each copy is
 * clipped to one side of the gutter — disjoint halves, never overlapping.
 *
 * They must not overlap. Compositing the artwork over an identical copy of
 * itself is only a no-op where it is fully opaque; along the antialiased
 * edges, where alpha is partial, a second pass thickens the stroke. Measured:
 * stacking two full copies moved 1080 subpixels by up to 32/255, against 13
 * subpixels by up to 7/255 for the disjoint split. So each copy keeps strictly
 * its own side.
 *
 * Because both halves are the same image scaled the same way, their union is
 * the original by construction rather than by alignment: there is no seam to
 * land wrong, and nothing drifts if the header height changes. One `src`, so
 * one fetch and one decode.
 *
 * `wordmarkStyle` is where the caller puts whatever makes the wordmark come
 * and go. A style rather than a class, so the behaviour rides in the markup
 * and cannot be left behind by a stylesheet. The emblem takes nothing,
 * because it never moves.
 */
export function LogoSplit({
  height = 27,
  priority = false,
  className,
  wordmarkStyle,
}: {
  /** Rendered height in CSS pixels; the width follows the aspect ratio. */
  height?: number;
  priority?: boolean;
  className?: string;
  wordmarkStyle?: React.CSSProperties;
}) {
  const width = (height * ART.width) / ART.height;

  const copy = (part: "emblem" | "wordmark") => (
    <span
      key={part}
      className="absolute inset-0"
      style={{
        // Inset from the far side, so each copy keeps its own half and
        // discards the other. Percentages of the same box, so the two edges
        // meet exactly wherever that box lands.
        clipPath:
          part === "emblem"
            ? `inset(0 ${100 - SPLIT_PERCENT}% 0 0)`
            : `inset(0 0 0 ${SPLIT_PERCENT}%)`,
        ...(part === "wordmark" ? wordmarkStyle : null),
      }}
    >
      <Image
        src={ART.src}
        width={ART.width}
        height={ART.height}
        priority={priority}
        // The emblem copy carries the accessible name for the pair — it is
        // the half that is always on screen. The wordmark copy is the same
        // picture again, so it is announced as decoration rather than read
        // out twice.
        alt={part === "emblem" ? "Migss Tiles & Luxury Interiors" : ""}
        aria-hidden={part === "wordmark"}
        className="h-full w-full"
      />
    </span>
  );

  return (
    <span
      className={cn("relative block flex-none", className)}
      style={{ height, width }}
    >
      {copy("emblem")}
      {copy("wordmark")}
    </span>
  );
}
