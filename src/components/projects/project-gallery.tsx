"use client";

import * as React from "react";

import { ImageSlot } from "@/components/image-slot";
import { cn } from "@/lib/utils";
import type { GalleryShot } from "@/lib/wix/projects";

/**
 * The finished-room carousel.
 *
 * Swipe is the native gesture and the primary one — the track is a plain
 * scroll container with mandatory x-snap, so momentum, rubber-banding and
 * interruption all come from the platform rather than from a JS drag
 * implementation that would feel wrong on a phone.
 *
 * Three details matter for how this feels on a device:
 *  - `overscroll-x-contain` stops a horizontal swipe past the last shot from
 *    bubbling out to the browser's back-gesture or bouncing the whole page.
 *  - scroll position is read in a rAF-throttled passive listener, so dragging
 *    never contends with the indicator update.
 *  - snap is centred, matching the design, so a half-swipe settles to whichever
 *    shot is nearest the middle rather than always advancing.
 *
 * Pointer devices have no swipe, so they get prev/next buttons — shown only
 * where there is a pointer to click them with. Keyboard access cannot rely on
 * those buttons, since they are absent at phone widths, so the track is a
 * focusable scroll region that handles the arrow keys itself. It has to: with
 * mandatory snap the browser's own arrow-key scrolling moves a couple of
 * pixels and then snaps straight back to the current shot.
 */
export function ProjectGallery({
  title,
  shots,
}: {
  title: string;
  shots: GalleryShot[];
}) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [current, setCurrent] = React.useState(0);

  // Track which shot is nearest the centre of the viewport.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const middle = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;

      for (const [index, child] of Array.from(track.children).entries()) {
        const element = child as HTMLElement;
        const centre = element.offsetLeft + element.offsetWidth / 2;
        const distance = Math.abs(centre - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      }
      setCurrent(best);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [shots.length]);

  // Where the last nudge was aimed. Repeated presses queue up from here
  // rather than from `current`, which only catches up once the smooth scroll
  // settles — otherwise holding the arrow key advances a single shot.
  const pending = React.useRef<number | null>(null);

  React.useEffect(() => {
    pending.current = null;
  }, [current]);

  const go = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const from = pending.current ?? current;
    const next = Math.min(Math.max(from + direction, 0), shots.length - 1);
    pending.current = next;

    const target = track.children[next] as HTMLElement | undefined;
    target?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const caption = (index: number) =>
    shots[index]?.caption ?? `${title}, shot ${index + 1}`;

  return (
    <section id="gallery" className="mt-[clamp(32px,6.5vw,76px)] scroll-mt-20">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-[9.2px] px-[clamp(16px,4.5vw,48px)]">
        <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
          The finished room
        </h2>
        {/* Announced on change, so the position is available without sight. */}
        <span
          aria-live="polite"
          className="text-[12.5px] text-migss-text/58 tabular-nums"
        >
          {current + 1} / {shots.length}
        </span>
      </div>

      {/* Focusable scroll region: gives the track arrow-key scrolling and a
          name, independently of the pointer-only buttons below. */}
      <div
        ref={trackRef}
        role="group"
        aria-label={`${title}: ${shots.length} photographs`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          go(event.key === "ArrowRight" ? 1 : -1);
        }}
        className="migss-scroll mt-[18.4px] flex snap-x snap-mandatory gap-[clamp(10px,2vw,18px)] overflow-x-auto overscroll-x-contain scroll-p-[clamp(16px,4.5vw,48px)] px-[clamp(16px,4.5vw,48px)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent"
      >
        {shots.map((shot, index) => (
          <figure
            key={shot.url}
            className="m-0 w-[min(88vw,720px)] flex-none snap-center"
            aria-label={`${index + 1} of ${shots.length}`}
          >
            <div className="aspect-[3/2]">
              <ImageSlot
                placeholder={`${String(index + 1).padStart(2, "0")}: ${caption(index)}`}
                src={shot.url}
                alt={shot.alt}
                shape="rounded"
                className="migss-plate"
              />
            </div>
            <figcaption className="mt-2.5 text-[13px] text-migss-text/62">
              {String(index + 1).padStart(2, "0")} · {caption(index)}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-[13.8px] flex max-w-[1280px] items-center gap-[7px] px-[clamp(16px,4.5vw,48px)]">
        <div aria-hidden="true" className="flex items-center gap-[7px]">
          {shots.map((shot, index) => (
            <span
              key={shot.url}
              className={cn(
                "block h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-300",
                index === current
                  ? "scale-150 bg-migss-accent"
                  : "bg-migss-neutral-300",
              )}
            />
          ))}
        </div>

        {/* Swipe is the gesture on touch; this line is the affordance for it. */}
        <span className="ml-2.5 text-xs text-migss-text/50 min-[1000px]:hidden">
          Swipe for more
        </span>

        <div className="ml-auto hidden gap-2 min-[1000px]:flex">
          <GalleryButton
            label="Previous shot"
            onClick={() => go(-1)}
            disabled={current === 0}
            path="M19 12H5M11 6l-6 6 6 6"
          />
          <GalleryButton
            label="Next shot"
            onClick={() => go(1)}
            disabled={current === shots.length - 1}
            path="M5 12h14M13 6l6 6-6 6"
          />
        </div>
      </div>
    </section>
  );
}

function GalleryButton({
  label,
  onClick,
  disabled,
  path,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  path: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-migss-accent text-migss-accent-ink transition-[background-color,color,opacity] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent disabled:cursor-not-allowed disabled:opacity-35 active:scale-95 [@media(hover:hover)]:not-disabled:hover:bg-migss-accent-700 [@media(hover:hover)]:not-disabled:hover:text-migss-text"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </button>
  );
}
