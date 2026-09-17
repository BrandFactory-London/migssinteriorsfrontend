import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button";

const PROJECTS = [
  {
    location: "Manor Road, Chigwell",
    title: "Marble master ensuite",
    body: "Full strip-out to a book-matched marble wet room with underfloor heating and concealed brassware.",
  },
  {
    location: "Nightingale Lane, Wanstead",
    title: "Open-plan kitchen & dining",
    body: "Structural opening, bespoke in-frame cabinetry and a quartz island seating five.",
  },
  {
    location: "Forest Drive, Loughton",
    title: "Family bathroom & landing",
    body: "Two bathrooms and the landing joinery completed in four weeks, family in residence throughout.",
  },
  {
    location: "Hermitage Walk, S. Woodford",
    title: "Whole-home interior",
    body: "Kitchen, two bathrooms and full decoration delivered on a single programme and one guarantee.",
  },
];

/**
 * Horizontal snap-scroller. Swipe is the native gesture on touch; on desktop
 * the same track scrolls with trackpad, shift-wheel or keyboard, and cards
 * lift slightly under the pointer where hover is available.
 */
export function FeaturedWork() {
  return (
    <section
      id="work"
      className="mx-auto max-w-[1280px] scroll-mt-20 pt-[clamp(36px,7.5vw,84px)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-[13.8px] px-[clamp(16px,4.5vw,48px)]">
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            Featured work
          </p>
          <h2 className="text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
            Recent renovations
          </h2>
        </Reveal>
        <span className="flex items-center gap-2 text-[12.5px] text-migss-text/55">
          Swipe to explore
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
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <ul
        className="migss-scroll mt-7 flex list-none items-start gap-[clamp(14px,2.5vw,28px)] overflow-x-auto scroll-p-[clamp(16px,4.5vw,48px)] snap-x snap-proximity px-[clamp(16px,4.5vw,48px)] pb-[18.4px]"
        aria-label="Recent renovation projects"
      >
        {PROJECTS.map((project, index) => (
          <Reveal
            as="li"
            key={project.location}
            delay={index * 80}
            // Alternate cards drop, giving the track its staggered rhythm.
            className={`w-[min(82vw,360px)] flex-none snap-start ${
              index % 2 === 1 ? "mt-[clamp(0px,4vw,44px)]" : ""
            }`}
          >
            <article className="group">
              <div className="relative aspect-[4/5]">
                <ImageSlot
                  placeholder={`Project ${index + 1} — ${project.location}`}
                  shape="rounded"
                  className="migss-plate h-full w-full transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.02]"
                />
                <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700">
                  {project.location}
                </span>
              </div>
              <div className="mt-[13.8px] flex gap-3">
                <span className="font-heading pt-1 text-[13px] text-migss-accent-700 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-1.5 text-[23px] font-normal tracking-[-0.01em]">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-[1.65] text-migss-text/72">
                    {project.body}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <div className="px-[clamp(16px,4.5vw,48px)]">
        <ButtonLink
          href="/our-projects"
          variant="secondary"
          className="font-body min-h-[54px] w-full max-w-[340px] text-sm font-medium"
        >
          See all projects
        </ButtonLink>
      </div>
    </section>
  );
}
