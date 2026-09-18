"use client";

import * as React from "react";

/**
 * A background clip for a HeroMedia slot marked Video.
 *
 * Playback is driven from JavaScript rather than the `autoplay` attribute, so
 * that `prefers-reduced-motion` decides whether it ever moves. The default is
 * the still: the element renders paused on the server and on first paint, and
 * only starts once the browser has confirmed the visitor has not asked for
 * reduced motion. Under that setting the slot stays a static image — its
 * poster frame if the row has one, otherwise the clip's own first frame.
 *
 * The global reduced-motion rule in globals.css cannot cover this: it zeroes
 * animations and transitions, and a playing video is neither.
 *
 * The preference is watched rather than read once, so toggling it in the OS
 * stops a clip that is already running.
 */
export function HeroVideo({
  src,
  poster,
  label,
  className,
}: {
  src: string;
  poster?: string;
  /** Describes the footage, since the element carries no visible caption. */
  label: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);
  const [mayAnimate, setMayAnimate] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMayAnimate(!query.matches);

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!mayAnimate) {
      node.pause();
      // Back to the first frame, so a clip stopped mid-way does not sit on an
      // arbitrary frame.
      node.currentTime = 0;
      return;
    }

    // Autoplay can still be refused (a data-saver mode, say); the poster
    // stands in for it either way.
    void node.play().catch(() => {});
  }, [mayAnimate]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      // With a poster there is nothing to fetch until the clip is allowed to
      // play; without one, the first frame has to come from somewhere.
      preload={poster ? "none" : "metadata"}
      poster={poster}
      aria-label={label}
      className={className}
    >
      <source src={src} />
    </video>
  );
}
