import Link from "next/link";

import { Reveal } from "@/components/reveal";

const SERVICES = [
  {
    href: "/renovation-services/bathroom",
    title: "Bathroom Renovation",
    hub: "Wet rooms, ensuites and family bathrooms, back to brick and rebuilt.",
    detail:
      "Wet rooms and ensuites, back to brick and rebuilt in three to four weeks.",
  },
  {
    href: "/renovation-services/kitchen",
    title: "Kitchen Renovation",
    hub: "Bespoke cabinetry, stone worktops and the structural work behind them.",
    detail:
      "Bespoke cabinetry, stone worktops and the structural work behind them.",
  },
  {
    href: "/renovation-services/interior",
    title: "Interior Renovation",
    hub: "Whole-home work on one programme, one team and one guarantee.",
    detail: "Whole-home work on one programme, one team and one guarantee.",
  },
];

/**
 * The three services, shown on both the hub and each town page. The two
 * artboards word the blurbs slightly differently, so the variant picks.
 */
export function ServiceCards({
  heading,
  variant,
}: {
  heading: React.ReactNode;
  variant: "hub" | "detail";
}) {
  return (
    <>
      <h2 className="mb-[18.4px] text-[clamp(24px,5.6vw,34px)] leading-[1.1] font-normal tracking-[-0.02em]">
        {heading}
      </h2>
      <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[clamp(12px,2.5vw,24px)]">
        {SERVICES.map((service, index) => (
          <Reveal as="li" key={service.href} delay={index * 80}>
            <Link
              href={service.href}
              className="flex min-h-[140px] flex-col gap-2 rounded-[4px] border border-[var(--migss-divider)] p-[18.4px] text-inherit no-underline transition-[background-color,border-color] duration-300 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/6"
            >
              <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                Service
              </span>
              <h3 className="text-2xl leading-[1.15] font-normal">
                {service.title}
              </h3>
              <p className="text-sm leading-[1.6] text-migss-text/72">
                {variant === "hub" ? service.hub : service.detail}
              </p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </>
  );
}
