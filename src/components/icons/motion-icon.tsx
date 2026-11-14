import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The site's icon motions (TKT-106). Each is a short, one-shot animation in
 * the same timing family as the chat icon (about 300 to 700 ms).
 *
 * - draw:  the strokes draw themselves in (check marks, shield-check)
 * - spin:  one full turn (badge-percent)
 * - bob:   a small lift and settle (award)
 * - beat:  a double heartbeat (heart-handshake)
 * - nudge: a push to the right and back (arrows)
 * - ring:  a quick ringing wobble (phone)
 * - shake: a small side-to-side shake (lock)
 * - pop:   a springy scale-up and settle (play button)
 * - star:  pops in from small, for staggered star rows
 * - twirl: a quarter turn held while hovered (close buttons)
 * - menu:  the outer lines of the hamburger shorten while hovered
 * - plus:  a plus that turns into a minus when its button is expanded
 */
export type IconMotion =
  | "draw"
  | "spin"
  | "bob"
  | "beat"
  | "nudge"
  | "ring"
  | "shake"
  | "pop"
  | "star"
  | "twirl"
  | "menu"
  | "plus";

/**
 * Wraps a Lucide icon and gives it one of the motions above.
 *
 * When it plays:
 * - Devices that can hover: when the nearest ancestor with the `group` class
 *   is hovered or keyboard-focused, or the icon itself is hovered.
 * - Touch devices: once, as the icon scrolls into view. `MotionIconsObserver`
 *   (mounted once in the root layout) sets `data-play` for that.
 * - `autoplay`: as soon as it mounts, on any device (e.g. a tick that appears
 *   when an option is chosen).
 * - Reduced motion: never; the icon simply sits still.
 *
 * Plain server-safe markup, so it can be used from server components; the
 * motion itself lives in globals.css under "Icon motion".
 */
export function MotionIcon({
  motion,
  delay,
  autoplay,
  className,
  children,
}: {
  motion: IconMotion;
  /** Extra delay in ms, for staggering a row of icons. */
  delay?: number;
  autoplay?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("mi", `mi-${motion}`, className)}
      data-play={autoplay ? "" : undefined}
      style={delay ? ({ "--mi-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </span>
  );
}
