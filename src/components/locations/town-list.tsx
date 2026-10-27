import Link from "next/link";

import { Reveal } from "@/components/reveal";
import type { Location } from "@/lib/locations";

/**
 * The bordered grid of town links used on the Locations hub and on each
 * cluster page. `startAt` keeps the numbering running when a cluster's
 * surrounding areas follow its core towns in a second list.
 */
export function TownList({
  towns,
  startAt = 1,
}: {
  towns: Location[];
  startAt?: number;
}) {
  return (
    // auto-rows-fr sizes every row to the tallest card, so a long town name
    // wrapping to two lines does not make one row taller than the rest.
    // Gated at 620px because that is where the auto-fit track first yields
    // two columns: below it each card is its own row, and equalising would
    // only add dead space on a phone.
    <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] border-t border-l border-[var(--migss-divider)] min-[620px]:auto-rows-fr">
      {towns.map((location, index) => (
        <Reveal
          as="li"
          key={location.slug}
          delay={Math.min(index, 6) * 50}
          className="border-r border-b border-[var(--migss-divider)]"
        >
          <Link
            href={`/locations/${location.slug}`}
            className="group flex h-full min-h-[104px] items-start gap-3.5 p-[clamp(16px,2.6vw,22px)] text-inherit no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/7"
          >
            <span className="font-heading pt-[5px] text-[13px] text-migss-accent-ink tabular-nums">
              {String(startAt + index).padStart(2, "0")}
            </span>
            <span className="flex-1">
              <span className="font-heading flex flex-wrap items-baseline gap-x-2 text-[27px] leading-[1.1] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-ink">
                {location.name}
                <span className="font-body text-xs tracking-[0.06em] text-migss-text/52">
                  {location.postcode}
                </span>
              </span>
              <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-migss-text/68">
                {location.summary}
              </span>
            </span>
            <span className="mt-1 grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-migss-accent text-migss-accent-ink opacity-100 transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:opacity-45 [@media(hover:hover)]:group-hover:translate-x-1 [@media(hover:hover)]:group-hover:opacity-100">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
