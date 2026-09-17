"use client";

import * as React from "react";

import { ArticleCard } from "@/components/resources/article-card";
import { Reveal } from "@/components/reveal";
import { TAGS, type Article, type Tag } from "@/lib/resources";
import { cn } from "@/lib/utils";

type Filter = "All" | Tag;

/**
 * Tag filter over a pillar's articles. The chip row scrolls horizontally —
 * five chips do not fit at 390px, and wrapping pushes the grid down the page.
 */
export function ArticleLibrary({ articles }: { articles: Article[] }) {
  const [filter, setFilter] = React.useState<Filter>("All");

  const shown =
    filter === "All"
      ? articles
      : articles.filter((article) => article.tags.includes(filter));

  const countLabel =
    filter === "All"
      ? `${shown.length} articles`
      : `${shown.length} articles in ${filter}`;

  return (
    <>
      <div
        role="group"
        aria-label="Filter articles"
        className="migss-scroll flex snap-x gap-2 overflow-x-auto overscroll-x-contain border-b border-[var(--migss-divider)] pb-[13.8px]"
      >
        {(["All", ...TAGS] as Filter[]).map((option) => {
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
              {option === "All" ? "All articles" : option}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-[13.8px] text-[13px] text-migss-text/58 tabular-nums"
      >
        {countLabel}
      </p>

      <ul className="mt-[18.4px] grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-[clamp(14px,2.5vw,28px)] gap-y-[clamp(20px,3.5vw,40px)]">
        {shown.map((article, index) => (
          <Reveal
            as="li"
            key={`${filter}-${article.slug}`}
            delay={Math.min(index, 5) * 60}
          >
            <ArticleCard article={article} />
          </Reveal>
        ))}
      </ul>
    </>
  );
}
