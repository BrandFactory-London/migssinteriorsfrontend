import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { cardMeta, type Article } from "@/lib/resources";

/**
 * The card style shared by both pillar libraries and the blog index.
 * Hover warms the title and eases the cover; on touch the press state carries
 * the feedback instead.
 */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col gap-[13.8px] text-inherit no-underline transition-transform active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent"
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-[4px]">
        <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
          <ImageSlot placeholder={article.coverPlaceholder} captionHidden />
        </div>
        <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700">
          {article.tags[0]}
        </span>
      </div>
      <div>
        <h2 className="mb-[7px] text-[23px] leading-[1.18] font-normal tracking-[-0.01em] text-pretty transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-700">
          {article.title}
        </h2>
        <p className="mb-[9px] text-sm leading-[1.65] text-migss-text/72">
          {article.excerpt}
        </p>
        <p className="text-[12.5px] text-migss-text/55 tabular-nums">
          {cardMeta(article)}
        </p>
      </div>
    </Link>
  );
}
