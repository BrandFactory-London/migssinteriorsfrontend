import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageSlot } from "@/components/image-slot";
import { ArticleCard } from "@/components/resources/article-card";
import { RichContent } from "@/components/resources/rich-content";
import { Reveal } from "@/components/reveal";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { postMeta } from "@/lib/blog-post";
import { pageMetadata } from "@/lib/seo";
import {
  getArticle,
  getPosts,
  getRelatedPosts,
  getTags,
  getTagLabels,
  PILLAR_TAG_SLUG,
} from "@/lib/wix/blog";
import { telHref } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

/**
 * The pipeline publishes between deploys, so a post that went live this
 * morning has to resolve on its first visit rather than 404 until the next
 * build. A slug that is genuinely not a post still 404s.
 */
export const dynamicParams = true;

const AUTHOR = "The Migss Interiors team";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article not found" };

  return pageMetadata({
    title: `${article.title} | Migss Interiors`,
    description:
      article.excerpt ??
      `${article.title}, from the Migss Interiors renovation library.`,
    path: `/blog/${article.slug}`,
    // The post's own cover image; Wix serves these as plain https URLs.
    image: article.coverUrl,
    imageAlt: article.coverAlt,
    type: "article",
    publishedTime: article.publishedDate || undefined,
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const [related, tags, tagLabels] = await Promise.all([
    getRelatedPosts(article),
    getTags(),
    getTagLabels(),
  ]);

  // The pillar this post belongs to, when it carries a room tag at all.
  const pillar = (["Bathroom", "Kitchen"] as const).find((room) => {
    const tagId = tags.find((tag) => tag.slug === PILLAR_TAG_SLUG[room])?.id;
    return tagId ? article.tagIds.includes(tagId) : false;
  });
  const pillarHref = pillar
    ? `/resources/${pillar.toLowerCase()}`
    : "/resources";
  const badge = article.tagIds
    .map((id) => tagLabels[id])
    .find((label): label is string => Boolean(label));

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        {/* Header column is wider than the body column: display type can run
            longer than comfortable reading measure. */}
        <div className="mx-auto max-w-[760px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(18px,6vw,48px)] pt-[clamp(24px,5.5vw,56px)]">
          <nav
            aria-label="Breadcrumb"
            className="mb-[18.4px] flex flex-wrap items-center gap-2 text-xs text-migss-text/55"
          >
            <Link href="/resources" className="text-inherit no-underline">
              Resources
            </Link>
            {pillar ? (
              <>
                <span aria-hidden="true">/</span>
                <Link href={pillarHref} className="text-inherit no-underline">
                  {pillar}
                </Link>
              </>
            ) : null}
            {badge ? (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-migss-accent-ink">{badge}</span>
              </>
            ) : null}
          </nav>

          {badge ? (
            <p className="mb-[13.8px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
              {badge}
            </p>
          ) : null}
          <h1 className="mb-[13.8px] text-[clamp(34px,8.4vw,56px)] leading-[1.05] font-normal tracking-[-0.03em] text-balance">
            {article.title}
          </h1>
          {article.excerpt ? (
            <p className="mb-[18.4px] text-[clamp(17px,4.6vw,20px)] leading-[1.6] text-pretty text-migss-text/70">
              {article.excerpt}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-[var(--migss-divider)] py-[13.8px]">
            <span
              aria-hidden="true"
              className="font-heading grid h-10 w-10 flex-none place-items-center rounded-full border border-migss-accent-400 text-base text-migss-accent-ink"
            >
              M
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{AUTHOR}</span>
              <span className="text-[12.5px] text-migss-text/58 tabular-nums">
                {postMeta(article)}
              </span>
            </span>
          </div>
        </div>

        {article.coverUrl ? (
          <figure className="mx-auto mt-[clamp(20px,4vw,40px)] max-w-[1100px] px-[clamp(16px,4.5vw,48px)]">
            <div className="aspect-[3/2]">
              <ImageSlot
                placeholder={article.coverAlt}
                src={article.coverUrl}
                alt={article.coverAlt}
                shape="rounded"
                className="migss-plate"
              />
            </div>
          </figure>
        ) : null}

        {/*
          Reading column. 680px is the measure the artboard specifies, and the
          type scale in RichContent is its reading spec verbatim. The side
          padding starts at 18px rather than the 16px used elsewhere on the
          site — this is the one page meant for sustained reading at 390px.
        */}
        <article className="mx-auto max-w-[680px] px-[clamp(18px,6vw,48px)] pt-[clamp(26px,6vw,52px)]">
          <RichContent nodes={article.richContent} />

          {article.tagIds.length > 0 ? (
            <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-[var(--migss-divider)] pt-[18.4px]">
              <span className="text-[12.5px] text-migss-text/55">
                Filed under
              </span>
              {article.tagIds.map((id) =>
                tagLabels[id] ? (
                  <span
                    key={id}
                    className="inline-flex items-center rounded-[3px] border border-migss-accent px-2.5 py-[3px] text-[11.5px] text-migss-accent-ink"
                  >
                    {tagLabels[id]}
                  </span>
                ) : null,
              )}
            </div>
          ) : null}
        </article>

        <section
          id="cta"
          className="mx-auto mt-[clamp(30px,6vw,68px)] max-w-[1100px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-[18.4px] rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent p-[clamp(18px,3.5vw,32px)]">
            <div>
              <h2 className="mb-2.5 text-[clamp(26px,6vw,36px)] leading-[1.08] font-normal tracking-[-0.02em]">
                {pillar
                  ? `Get this breakdown for your own ${pillar.toLowerCase()}`
                  : "Get this breakdown for your own project"}
              </h2>
              <p className="text-[15px] leading-[1.75] text-migss-text/78">
                A free home visit, measured and itemised, with a straight answer
                about where we think you should not spend.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <ButtonLink
                href="/contact"
                className="font-body flex-[1_1_180px] font-medium"
              >
                Book a free visit
              </ButtonLink>
              <ButtonLink
                href={telHref}
                variant="secondary"
                className="font-body flex-[1_1_160px] font-medium"
              >
                Call us
              </ButtonLink>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section
            id="related"
            className="mx-auto mt-[clamp(32px,6.5vw,76px)] max-w-[1100px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
          >
            <div className="mb-[18.4px] flex flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-2">
              <h2 className="text-[clamp(24px,5.6vw,34px)] leading-[1.1] font-normal tracking-[-0.02em]">
                Related reading
              </h2>
              <Link
                href={pillarHref}
                className="text-sm font-medium text-migss-accent-ink no-underline"
              >
                {pillar
                  ? `All ${pillar.toLowerCase()} articles →`
                  : "All articles →"}
              </Link>
            </div>
            <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(14px,2.5vw,28px)]">
              {related.map((other, index) => (
                <Reveal as="li" key={other.slug} delay={index * 80}>
                  <ArticleCard post={other} tagLabels={tagLabels} />
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
