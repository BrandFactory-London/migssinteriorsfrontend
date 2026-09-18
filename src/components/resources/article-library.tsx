"use client";

import * as React from "react";

import { ArticleCard } from "@/components/resources/article-card";
import { Reveal } from "@/components/reveal";
import type { BlogPost, BlogTag } from "@/lib/blog-post";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Tag filter over a pillar's articles. The chip row scrolls horizontally —
 * five chips do not fit at 390px, and wrapping pushes the grid down the page.
 */
export function ArticleLibrary({
  posts,
  tags,
  tagLabels,
  emptyLine,
}: {
  posts: BlogPost[];
  /** Chips: the tags these posts actually carry, minus the room tag itself. */
  tags: BlogTag[];
  tagLabels: Record<string, string>;
  /** Shown when this library has nothing published yet. */
  emptyLine: string;
}) {
  const [filter, setFilter] = React.useState<string>("All");

  // A single chip filters nothing, so the row only appears once these posts
  // span more than one tag.
  const showFilters = tags.length > 1;

  const shown =
    filter === "All"
      ? posts
      : posts.filter((post) => post.tagIds.includes(filter));

  const label = tags.find((tag) => tag.id === filter)?.label;
  const noun = shown.length === 1 ? "article" : "articles";
  const countLabel =
    filter === "All"
      ? `${shown.length} ${noun}`
      : `${shown.length} ${noun} in ${label}`;

  if (posts.length === 0) {
    return (
      <div className="border-t border-[var(--migss-divider)] py-[clamp(28px,5vw,56px)]">
        <p className="mb-[18.4px] max-w-[52ch] text-[15.5px] leading-[1.75] text-migss-text/78">
          {emptyLine}
        </p>
        <ButtonLink href="/contact" className="font-body font-medium">
          Ask us your question →
        </ButtonLink>
      </div>
    );
  }

  return (
    <>
      {showFilters ? (
        <div
          role="group"
          aria-label="Filter articles"
          className="migss-scroll flex snap-x gap-2 overflow-x-auto overscroll-x-contain border-b border-[var(--migss-divider)] pb-[13.8px]"
        >
          {[{ id: "All", label: "All articles" }, ...tags].map((option) => {
            const active = filter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                aria-pressed={active}
                className={cn(
                  "font-body min-h-[46px] flex-none cursor-pointer snap-start rounded-full border px-[18px] text-sm font-medium transition-[background-color,color,border-color] duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent",
                  active
                    ? "border-migss-accent bg-migss-accent/10 text-migss-accent-ink"
                    : "border-[var(--migss-divider)] text-migss-text [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:text-migss-accent-ink",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <p
        aria-live="polite"
        className="mt-[13.8px] text-[13px] text-migss-text/58 tabular-nums"
      >
        {countLabel}
      </p>

      <ul className="mt-[18.4px] grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-[clamp(14px,2.5vw,28px)] gap-y-[clamp(20px,3.5vw,40px)]">
        {shown.map((post, index) => (
          <Reveal
            as="li"
            key={`${filter}-${post.slug}`}
            delay={Math.min(index, 5) * 60}
          >
            <ArticleCard post={post} tagLabels={tagLabels} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
