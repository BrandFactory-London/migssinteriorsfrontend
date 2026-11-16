"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Progress dots for a horizontal scroll carousel, found by id. The active dot
 * follows the scroll position; tapping a dot scrolls to that card. Decorative
 * for screen readers: the list itself is the content.
 */
export function CarouselDots({
  targetId,
  count,
}: {
  targetId: string;
  count: number;
}) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const list = document.getElementById(targetId);
    if (!list) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = list.scrollWidth - list.clientWidth;
        if (max <= 0 || count <= 1) return setActive(0);
        setActive(Math.round((list.scrollLeft / max) * (count - 1)));
      });
    };
    update();
    list.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      list.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetId, count]);

  if (count <= 1) return null;

  const go = (index: number) => {
    const list = document.getElementById(targetId);
    const item = list?.children[index] as HTMLElement | undefined;
    if (!list || !item) return;
    list.scrollTo({
      left:
        item.offsetLeft -
        list.offsetLeft -
        parseFloat(getComputedStyle(list).scrollPaddingLeft || "0"),
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          tabIndex={-1}
          onClick={() => go(index)}
          className={cn(
            "h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out",
            index === active
              ? "w-5 bg-migss-accent-ink"
              : "w-1.5 bg-migss-accent-ink/30",
          )}
        />
      ))}
    </div>
  );
}
