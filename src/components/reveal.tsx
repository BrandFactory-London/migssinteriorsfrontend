"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = React.ComponentProps<"div"> & {
  /** Stagger within a group, in ms. */
  delay?: number;
  /** Render as a different element (section, article, li…). */
  as?: React.ElementType;
};

/**
 * Scroll-triggered entrance. The design applies `migssFade` on load to the
 * hero and the form steps; further down the page there is nothing to key an
 * on-load animation to, so content reveals as it enters the viewport.
 *
 * This is the primary motion channel on touch devices, where the dock's
 * hover expansion is unavailable — scroll is the one input every visitor has.
 *
 * Starts visible and is hidden by the observer only once it has confirmed it
 * can run, so the content is never trapped invisible if JavaScript fails.
 * `prefers-reduced-motion` is honoured globally in globals.css, but is also
 * checked here so we skip hiding the element at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  ...props
}: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(true);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches || !("IntersectionObserver" in window)) return;

    // Already on screen at mount (above the fold): leave it visible rather
    // than flashing it out and back in.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) return;

    setShown(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-revealed={shown ? "" : undefined}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
      style={{ transitionDelay: shown && delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </Tag>
  );
}
