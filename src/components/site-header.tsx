import Link from "next/link";

import { SITE, telHref } from "@/lib/site";
import { Wordmark } from "@/components/wordmark";
import { cn } from "@/lib/utils";

/**
 * Two treatments, both in the handoff: `overlay` sits on top of a photographic
 * hero in light-on-dark, `solid` is the in-page bar used where a page opens on
 * the background colour instead.
 */
export function SiteHeader({
  variant = "overlay",
}: {
  variant?: "overlay" | "solid";
}) {
  const overlay = variant === "overlay";

  return (
    <header
      className={cn(
        "z-30",
        overlay
          ? "absolute inset-x-0 top-0 text-migss-neutral-100"
          : "relative border-b border-[var(--migss-divider)] text-migss-text",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center gap-4 px-[clamp(16px,4.5vw,48px)]",
          overlay ? "py-[18px]" : "py-3.5",
        )}
      >
        <Link href="/" className="mr-auto text-inherit no-underline">
          <Wordmark tone={overlay ? "light" : "dark"} />
          <span className="sr-only">Migss Interiors — home</span>
        </Link>

        <a
          href={telHref}
          className="inline-flex min-h-[44px] items-center gap-2 text-[13.5px] tracking-[0.02em] text-inherit no-underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={overlay ? undefined : "stroke-migss-accent-700"}
          >
            <path d="M7.2 3.5h-3a1.7 1.7 0 0 0-1.7 1.9c.6 5.3 3 9.6 7 12.9 2.1 1.7 4.2 2.7 6.2 3.1a1.7 1.7 0 0 0 1.9-1.7v-2.9a1.7 1.7 0 0 0-1.4-1.7l-2.5-.4a1.7 1.7 0 0 0-1.5.5l-.9.9a14.5 14.5 0 0 1-4.6-4.6l.9-.9a1.7 1.7 0 0 0 .5-1.5l-.4-2.5a1.7 1.7 0 0 0-1.7-1.4z" />
          </svg>
          {SITE.phone}
        </a>
      </div>
    </header>
  );
}
