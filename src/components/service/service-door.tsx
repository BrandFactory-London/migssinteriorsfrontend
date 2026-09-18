import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { SERVICES, type ServiceSlug } from "@/lib/services";
import { cn } from "@/lib/utils";

const DOOR_COPY: Record<ServiceSlug, { body: string; tags: string[] }> = {
  bathroom: {
    body: "Wet rooms, master ensuites and family bathrooms taken back to brick and rebuilt: tanking, underfloor heating, concealed brassware and tiling set out so every cut lands where it should.",
    tags: [
      "Wet rooms",
      "Underfloor heating",
      "Marble & stone",
      "3–4 weeks typical",
    ],
  },
  kitchen: {
    body: "Bespoke in-frame and handleless cabinetry, islands, stone worktops and the structural work behind them, including knock-throughs, steels and the electrics and plumbing a serious kitchen needs.",
    tags: [
      "Bespoke cabinetry",
      "Islands",
      "Structural openings",
      "5–8 weeks typical",
    ],
  },
  interior: {
    body: "Whole-home work on one programme: layouts, joinery, flooring, lighting, plastering and decoration across every room, with the bathrooms and kitchen folded into the same schedule and the same guarantee.",
    tags: [
      "Whole home",
      "Bespoke joinery",
      "Lighting design",
      "8–16 weeks typical",
    ],
  },
};

const DOOR_IMAGE: Record<ServiceSlug, string> = {
  bathroom: "Bathroom: book-matched marble wet room",
  kitchen: "Kitchen: in-frame cabinetry with quartz island",
  interior: "Interior: hallway, joinery and full decoration",
};

/**
 * A full-width card linking into one service. The image sits left or right in
 * alternation; on hover the border warms, the photograph eases in and the
 * arrow advances. On touch, none of that fires — so the card carries its own
 * "Explore …" label and responds to the press instead.
 */
export function ServiceDoor({
  slug,
  index,
}: {
  slug: ServiceSlug;
  index: number;
}) {
  const service = SERVICES[slug];
  const copy = DOOR_COPY[slug];
  const imageFirst = index % 2 === 0;

  return (
    <Reveal as="li" delay={index * 90}>
      <Link
        href={`/renovation-services/${slug}`}
        className="group grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] overflow-hidden rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg text-inherit no-underline transition-[border-color,transform,box-shadow] duration-[400ms] ease-[cubic-bezier(.2,.65,.2,1)] active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
      >
        <div
          className={cn(
            "relative aspect-[4/3] overflow-hidden",
            imageFirst ? "order-1" : "order-1 md:order-2",
          )}
        >
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-[1.04]">
            <ImageSlot placeholder={DOOR_IMAGE[slug]} captionHidden />
          </div>
          <span className="absolute top-3 left-3 border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700 tabular-nums">
            {String(index + 1).padStart(2, "0")} · {service.short}
          </span>
        </div>

        <div
          className={cn(
            "flex flex-col gap-[13.8px] p-[clamp(18px,4vw,40px)]",
            imageFirst ? "order-2" : "order-2 md:order-1",
          )}
        >
          <h2 className="text-[clamp(28px,6.6vw,40px)] leading-[1.05] font-normal tracking-[-0.02em]">
            {service.title}
          </h2>
          <p className="text-[15px] leading-[1.75] text-pretty text-migss-text/78">
            {copy.body}
          </p>
          <ul className="flex list-none flex-wrap gap-1.5">
            {copy.tags.map((tag) => (
              <li
                key={tag}
                className="inline-flex items-center rounded-[3px] border border-migss-accent px-2.5 py-[3px] text-[11.5px] tracking-[0.02em] text-migss-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="mt-auto flex items-center gap-3 text-[14.5px] font-medium text-migss-accent-700">
            Explore {service.title.toLowerCase()}
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-migss-accent transition-[transform,background-color,color] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:translate-x-[5px] [@media(hover:hover)]:group-hover:bg-migss-accent-700 [@media(hover:hover)]:group-hover:text-migss-text">
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
