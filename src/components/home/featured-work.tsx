import { ArrowRight } from "lucide-react";

import { MotionIcon } from "@/components/icons/motion-icon";
import { FeaturedProjectCard } from "@/components/projects/featured-project-card";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button";
import type { Project } from "@/lib/wix/projects";

/**
 * Horizontal snap-scroller. Swipe is the native gesture on touch; on desktop
 * the same track scrolls with trackpad, shift-wheel or keyboard, and cards
 * lift slightly under the pointer where hover is available.
 */
export function FeaturedWork({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section
      id="work"
      className="mx-auto max-w-[1280px] scroll-mt-20 pt-[clamp(36px,7.5vw,84px)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-[13.8px] px-[clamp(16px,4.5vw,48px)]">
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            Featured work
          </p>
          <h2 className="text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
            Recent renovations
          </h2>
        </Reveal>
        <span className="flex items-center gap-2 text-[12.5px] text-migss-text/55">
          Swipe to explore
          <MotionIcon motion="nudge">
            <ArrowRight size={16} strokeWidth={2} />
          </MotionIcon>
        </span>
      </div>

      <ul
        className="migss-scroll mt-7 flex list-none items-start gap-[clamp(14px,2.5vw,28px)] overflow-x-auto scroll-p-[clamp(16px,4.5vw,48px)] snap-x snap-proximity px-[clamp(16px,4.5vw,48px)] pb-[18.4px]"
        aria-label="Recent renovation projects"
      >
        {projects.map((project, index) => (
          <Reveal
            as="li"
            key={project.slug}
            delay={index * 80}
            // Alternate cards drop, giving the track its staggered rhythm.
            className={`w-[min(82vw,360px)] flex-none snap-start ${
              index % 2 === 1 ? "mt-[clamp(0px,4vw,44px)]" : ""
            }`}
          >
            <FeaturedProjectCard project={project} index={index} />
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
