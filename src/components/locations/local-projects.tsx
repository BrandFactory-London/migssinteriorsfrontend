import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import type { Project } from "@/lib/wix/projects";

/**
 * Horizontal rail of the projects nearest a town.
 *
 * `isLocal` is false when the town has no completed work in the data yet — the
 * heading then says these are projects from elsewhere rather than implying we
 * have worked on the next street.
 */
export function LocalProjects({
  town,
  projects,
  isLocal,
}: {
  town: string;
  projects: Project[];
  isLocal: boolean;
}) {
  return (
    <section
      id="local-projects"
      className="mt-[clamp(32px,6.5vw,76px)] scroll-mt-20"
    >
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-[9.2px] px-[clamp(16px,4.5vw,48px)]">
        <div>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            {isLocal ? "Nearby work" : "Recent work"}
          </p>
          <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
            {isLocal ? (
              <>Recent projects in {town}</>
            ) : (
              <>Recent projects near {town}</>
            )}
          </h2>
          {!isLocal ? (
            <p className="mt-2 max-w-[52ch] text-sm leading-[1.6] text-migss-text/62">
              We have not photographed a {town} project yet. These are recent
              builds elsewhere in the same range. Ask and we will send the
              closest match to your street.
            </p>
          ) : null}
        </div>
        <Link
          href="/our-projects"
          className="text-sm font-medium text-migss-accent-700 no-underline"
        >
          All projects →
        </Link>
      </div>

      <ul
        className="migss-scroll mt-7 flex list-none snap-x snap-proximity items-start gap-[clamp(14px,2.5vw,28px)] overflow-x-auto overscroll-x-contain scroll-p-[clamp(16px,4.5vw,48px)] px-[clamp(16px,4.5vw,48px)] pb-[18.4px]"
        aria-label={`Projects near ${town}`}
      >
        {projects.map((project, index) => (
          <Reveal
            as="li"
            key={project.slug}
            delay={index * 80}
            className="w-[min(82vw,340px)] flex-none snap-start"
          >
            <Link
              href={`/our-projects/${project.slug}`}
              className="group flex flex-col gap-[13.8px] text-inherit no-underline transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
                <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
                  <ImageSlot
                    placeholder={`${project.location ?? "Recent work"}: ${project.title}`}
                    src={project.cardUrl ?? undefined}
                    alt={`${project.title}${project.addressLine ? `, ${project.addressLine}` : ""}`}
                    captionHidden
                  />
                </div>
                {project.category ? (
                  <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700">
                    {project.category}
                  </span>
                ) : null}
              </div>
              <div>
                <h3 className="mb-[5px] text-[23px] leading-[1.15] font-normal tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-700">
                  {project.title}
                </h3>
                {(project.addressLine ?? project.location) ? (
                  <p className="mb-1.5 text-[13px] text-migss-text/58">
                    {project.addressLine ?? project.location}
                  </p>
                ) : null}
                {project.summary ? (
                  <p className="text-sm leading-[1.6] text-migss-text/72">
                    {project.summary}
                  </p>
                ) : null}
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
