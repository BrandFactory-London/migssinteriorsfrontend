"use client";

import * as React from "react";

import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/reveal";
import { CATEGORIES, PROJECTS, type ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Filter = "All" | ProjectCategory;

const FILTERS: Filter[] = ["All", ...CATEGORIES];

/**
 * Category filter over the full grid.
 *
 * The chip row is itself a horizontal scroller: at 390px four chips do not fit,
 * and a wrapped second row pushes the grid down the page. Snapping it means a
 * swipe lands on a chip edge rather than mid-word.
 *
 * Filtering is client state rather than a route — it is a view preference, and
 * a round trip per chip would feel worse than it reads.
 */
export function ProjectFilters() {
  const [filter, setFilter] = React.useState<Filter>("All");

  const projects =
    filter === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === filter);

  const countLabel =
    filter === "All"
      ? `${projects.length} projects`
      : `${projects.length} ${filter.toLowerCase()} projects`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-[13.8px] border-b border-[var(--migss-divider)] pb-[13.8px]">
        <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
          All projects
        </h2>
        <span
          aria-live="polite"
          className="text-[13px] text-migss-text/58 tabular-nums"
        >
          {countLabel}
        </span>
      </div>

      <div
        role="group"
        aria-label="Filter by category"
        className="migss-scroll flex snap-x gap-2 overflow-x-auto overscroll-x-contain pt-[13.8px] pb-1"
      >
        {FILTERS.map((option) => {
          const active = filter === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={active}
              className={cn(
                "font-body min-h-[46px] flex-none cursor-pointer snap-start rounded-full border px-[18px] text-sm font-medium transition-[background-color,color,border-color] duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent",
                active
                  ? "border-migss-accent bg-migss-accent/10 text-migss-accent-700"
                  : "border-[var(--migss-divider)] text-migss-text [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:text-migss-accent-700",
              )}
            >
              {option === "All" ? "All work" : option}
            </button>
          );
        })}
      </div>

      <ul className="mt-[18.4px] grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-[clamp(14px,2.5vw,28px)] gap-y-[clamp(20px,3.5vw,40px)]">
        {projects.map((project, index) => (
          <Reveal
            as="li"
            // Keyed by filter so a change re-runs the reveal rather than
            // swapping content inside an already-revealed card.
            key={`${filter}-${project.slug}`}
            delay={Math.min(index, 5) * 60}
          >
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
