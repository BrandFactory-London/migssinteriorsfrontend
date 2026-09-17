import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageSlot } from "@/components/image-slot";
import { ArticleCard } from "@/components/resources/article-card";
import { Reveal } from "@/components/reveal";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import {
  ARTICLES,
  ARTICLE_AUTHOR,
  bylineMeta,
  getArticle,
  relatedTo,
} from "@/lib/resources";
import { telHref } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map(({ slug }) => ({ slug }));
}

/** Only the articles we know about; anything else is a genuine 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.standfirst ?? article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const pillarHref =
    article.category === "Bathroom"
      ? "/resources/bathroom"
      : "/resources/kitchen";
  const related = relatedTo(article);

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
            <span aria-hidden="true">/</span>
            <Link href={pillarHref} className="text-inherit no-underline">
              {article.category}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-migss-accent-700">{article.tags[0]}</span>
          </nav>

          <p className="mb-[13.8px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            {article.tags[0]}
          </p>
          <h1 className="mb-[13.8px] text-[clamp(34px,8.4vw,56px)] leading-[1.05] font-normal tracking-[-0.03em] text-balance">
            {article.title}
          </h1>
          <p className="mb-[18.4px] text-[clamp(17px,4.6vw,20px)] leading-[1.6] text-pretty text-migss-text/70">
            {article.standfirst ?? article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-[var(--migss-divider)] py-[13.8px]">
            <span
              aria-hidden="true"
              className="font-heading grid h-10 w-10 flex-none place-items-center rounded-full border border-migss-accent-400 text-base text-migss-accent-700"
            >
              M
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{ARTICLE_AUTHOR}</span>
              <span className="text-[12.5px] text-migss-text/58 tabular-nums">
                {bylineMeta(article)}
              </span>
            </span>
          </div>
        </div>

        <figure className="mx-auto mt-[clamp(20px,4vw,40px)] max-w-[1100px] px-[clamp(16px,4.5vw,48px)]">
          <div className="aspect-[3/2]">
            <ImageSlot
              placeholder={`Hero: ${article.coverPlaceholder}`}
              shape="rounded"
              className="migss-plate"
            />
          </div>
          {article.heroCaption ? (
            <figcaption className="mt-2.5 text-[13px] leading-[1.6] text-migss-text/60">
              {article.heroCaption}
            </figcaption>
          ) : null}
        </figure>

        {/*
          Reading column. 680px is the measure the artboard specifies, and the
          type scale below is its reading spec verbatim: 17px rising to 19px,
          1.78 line-height, a slightly tightened tracking and 88% ink. The side
          padding starts at 18px rather than the 16px used elsewhere on the
          site — this is the one page meant for sustained reading at 390px.
        */}
        <article className="mx-auto max-w-[680px] px-[clamp(18px,6vw,48px)] pt-[clamp(26px,6vw,52px)]">
          {article.body ? (
            article.body.map((block, index) => {
              if (block.kind === "h2") {
                return (
                  <h2
                    key={index}
                    className="font-heading mt-[2.1em] mb-[0.55em] text-[clamp(27px,6.6vw,34px)] leading-[1.12] font-normal tracking-[-0.02em] first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.kind === "h3") {
                return (
                  <h3
                    key={index}
                    className="font-heading mt-[1.7em] mb-[0.4em] text-[clamp(21px,5vw,25px)] leading-[1.2] font-normal"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.kind === "ul") {
                return (
                  <ul
                    key={index}
                    className="mb-[1.3em] list-disc pl-[1.15em] marker:text-migss-accent"
                  >
                    {block.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="mb-[0.55em] text-[clamp(16.5px,4.4vw,18px)] leading-[1.72] text-migss-text/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={index}
                  className="mb-[1.15em] text-[clamp(17px,4.6vw,19px)] leading-[1.78] tracking-[-0.003em] text-pretty text-migss-text/88"
                >
                  {block.content}
                </p>
              );
            })
          ) : (
            /* Listing-level entry: the full piece has not been written yet, and
               these disappear entirely when the Wix Blog feed lands. Saying so
               beats padding the page with filler. */
            <div className="rounded-[4px] border border-[var(--migss-divider)] border-l-2 border-l-migss-accent p-[18.4px]">
              <p className="mb-[13.8px] text-[clamp(16.5px,4.4vw,18px)] leading-[1.72] text-migss-text/85">
                This article is on the writing list and is not published in full
                yet. If it is the question you are actually trying to answer,
                ask us directly — we will give you the same answer we would have
                written.
              </p>
              <ButtonLink
                href="/contact"
                size="md"
                className="font-body font-medium"
              >
                Ask us this question →
              </ButtonLink>
            </div>
          )}

          {article.filedUnder ? (
            <div className="mt-7 flex flex-wrap items-center gap-2 border-t border-[var(--migss-divider)] pt-[18.4px]">
              <span className="text-[12.5px] text-migss-text/55">
                Filed under
              </span>
              {article.filedUnder.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-[3px] border border-migss-accent px-2.5 py-[3px] text-[11.5px] text-migss-accent"
                >
                  {tag}
                </span>
              ))}
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
                Get this breakdown for your own {article.category.toLowerCase()}
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
                className="text-sm font-medium text-migss-accent-700 no-underline"
              >
                All {article.category.toLowerCase()} articles →
              </Link>
            </div>
            <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(14px,2.5vw,28px)]">
              {related.map((other, index) => (
                <Reveal as="li" key={other.slug} delay={index * 80}>
                  <ArticleCard article={other} />
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
