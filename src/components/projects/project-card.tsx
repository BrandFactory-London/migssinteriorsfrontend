import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import type { Project } from "@/lib/projects";

/**
 * Listing-grid card. Hover warms the title, eases the photograph and advances
 * the arrow; on touch none of that exists, so the arrow sits at full opacity
 * from the start and the whole card takes a press state instead.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/our-projects/${project.slug}`}
      className="group flex flex-col gap-[13.8px] text-inherit no-underline transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px]">
        <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
          <ImageSlot
            placeholder={`${project.location} — ${project.title}`}
            captionHidden
          />
        </div>
        <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700">
          {project.category}
        </span>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="mb-[5px] text-[23px] leading-[1.15] font-normal tracking-[-0.01em] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-700">
            {project.title}
          </h3>
          <p className="mb-1.5 text-[13px] tracking-[0.02em] text-migss-text/58">
            {project.location}
          </p>
          <p className="text-sm leading-[1.6] text-migss-text/72">
            {project.blurb}
          </p>
        </div>
        <span className="grid h-[34px] w-[34px] flex-none place-items-center rounded-full border border-migss-accent text-migss-accent-700 opacity-100 transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:opacity-50 [@media(hover:hover)]:group-hover:translate-x-1 [@media(hover:hover)]:group-hover:opacity-100">
          <svg
            width="15"
            height="15"
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
    </Link>
  );
}
