import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import type { Project } from "@/lib/wix/projects";

/**
 * Full-bleed featured strip. Mandatory snap so a swipe always settles on a
 * card edge rather than halfway; `overscroll-x-contain` keeps the gesture from
 * escaping to the browser's back-navigation at either end.
 */
export function FeaturedCarousel({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section aria-label="Featured projects" className="mx-auto max-w-[1280px]">
      <ul className="migss-scroll flex list-none snap-x snap-mandatory gap-[clamp(10px,2vw,18px)] overflow-x-auto overscroll-x-contain scroll-p-[clamp(16px,4.5vw,48px)] px-[clamp(16px,4.5vw,48px)]">
        {projects.map((project) => (
          <li
            key={project.slug}
            className="w-[min(88vw,620px)] flex-none snap-start"
          >
            <Link
              href={`/our-projects/${project.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[4px] text-migss-neutral-100 no-underline transition-transform active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent"
            >
              <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
                <ImageSlot
                  placeholder={`Featured: ${project.title}, ${project.location ?? "recent work"}`}
                  src={project.heroUrl ?? project.cardUrl ?? undefined}
                  alt={`${project.title}${project.addressLine ? `, ${project.addressLine}` : ""}`}
                  captionHidden
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_82%,transparent)_0%,transparent_62%)]"
              />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-[clamp(16px,3vw,28px)]">
                <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-300">
                  {project.category
                    ? `Featured · ${project.category}`
                    : "Featured"}
                </span>
                <h2 className="font-heading text-[clamp(26px,5.5vw,38px)] leading-[1.05] font-normal tracking-[-0.02em] text-inherit">
                  {project.title}
                </h2>
                {(project.addressLine ?? project.location) ? (
                  <span className="text-[13.5px] text-migss-neutral-100/78">
                    {project.addressLine ?? project.location}
                  </span>
                ) : null}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
