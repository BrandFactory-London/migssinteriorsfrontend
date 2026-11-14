import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import type { Project } from "@/lib/wix/projects";

/**
 * The project card from the homepage's "Recent renovations" carousel: a 4:5
 * photo with the area badge, a running number, title and summary, linking to
 * the project page. Shared with the Meta ads landing pages (TKT-103) so both
 * show the same cards and lead to the same projects.
 *
 * `areaOnly` shows the town without the street line, for the landing pages,
 * which name areas only.
 */
export function FeaturedProjectCard({
  project,
  index,
  areaOnly = false,
}: {
  project: Project;
  index: number;
  areaOnly?: boolean;
}) {
  const place = areaOnly
    ? project.location
    : (project.addressLine ?? project.location);
  return (
    <Link
      href={`/our-projects/${project.slug}`}
      className="group block text-inherit no-underline transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent"
    >
      <div className="relative aspect-[4/5]">
        <ImageSlot
          placeholder={`Project ${index + 1}: ${project.location ?? project.title}`}
          src={project.cardUrl ?? undefined}
          alt={project.title}
          shape="rounded"
          className="migss-plate h-full w-full transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.02]"
        />
        {place ? (
          <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-ink">
            {place}
          </span>
        ) : null}
      </div>
      <div className="mt-[13.8px] flex gap-3">
        <span className="font-heading pt-1 text-[13px] text-migss-accent-ink tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <h3 className="mb-1.5 text-[23px] font-normal tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-ink">
            {project.title}
          </h3>
          {project.summary ? (
            <p className="text-sm leading-[1.65] text-migss-text/72">
              {project.summary}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
