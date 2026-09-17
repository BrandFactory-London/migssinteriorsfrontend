import { Reveal } from "@/components/reveal";

const POINTS = [
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
  {
    label: "Aftercare Packages Available",
    path: <path d="M12 20.5s-7-4.2-7-9.5a4 4 0 0 1 7-2.6 4 4 0 0 1 7 2.6c0 5.3-7 9.5-7 9.5z" />,
  },
];

/** Overlaps the hero's lower edge, per the design's negative top margin. */
export function AssuranceBar() {
  return (
    <section className="relative z-3 mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
      <div className="mt-[clamp(-52px,-4vw,-34px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] border border-[var(--migss-divider)] bg-migss-bg shadow-migss-md">
        {POINTS.map((point, index) => (
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
