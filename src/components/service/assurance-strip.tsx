import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const BASE = [
  {
    label: "10 Year Labour Guarantee",
    path: (
      <>
        <path d="M12 21s7-3.6 7-9V5.4L12 3 5 5.4V12c0 5.4 7 9 7 9z" />
        <path d="m9 11.8 2.1 2.1L15 10" />
      </>
    ),
  },
  {
    label: "0% Interest Finance Available",
    path: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 16 16 8" />
        <circle cx="9.2" cy="9.2" r="1.6" />
        <circle cx="14.8" cy="14.8" r="1.6" />
      </>
    ),
  },
  {
    label: "Over 25 Years of Experience",
    path: (
      <>
        <circle cx="12" cy="9" r="5" />
        <path d="M8.6 13.6 7.5 21l4.5-2.4 4.5 2.4-1.1-7.4" />
      </>
    ),
  },
];

const FOURTH_ICON = (
  <>
    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
    <path d="M7 12V6a2.5 2.5 0 0 1 5 0" />
  </>
);

/**
 * The four-cell assurance strip. Service pages swap the fourth claim for one
 * specific to the room, and the hub page sits it flat rather than overlapping
 * a hero.
 */
export function AssuranceStrip({
  fourth,
  overlap = true,
}: {
  fourth: string;
  overlap?: boolean;
}) {
  const points = [...BASE, { label: fourth, path: FOURTH_ICON }];

  return (
    <section
      className={cn(
        "mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]",
        overlap && "relative z-3",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] border border-[var(--migss-divider)]",
          overlap && "mt-[clamp(-52px,-4vw,-34px)] bg-migss-bg shadow-migss-md",
        )}
      >
        {points.map((point, index) => (
          <Reveal
            key={point.label}
            delay={index * 70}
            className="flex items-center gap-3 border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,24px)] py-[18.4px]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-migss-accent)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="flex-none"
            >
              {point.path}
            </svg>
            <span className="text-[14.5px] leading-tight font-medium">
              {point.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
