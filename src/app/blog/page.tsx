import Link from "next/link";

import { EnquireBand } from "@/components/projects/enquire-band";
import { ArticleCard } from "@/components/resources/article-card";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";
import { getPosts, getTagLabels } from "@/lib/wix/blog";

/** The automation pipeline publishes continuously, so this refreshes itself. */
export const revalidate = 60;

export async function generateMetadata() {
  const image = await ogImage("resources-bathroom-cover");

  return pageMetadata({
    title: "Blog | Bathroom & Kitchen Renovation Writing",
    description:
      "Every article we have written about bathroom, kitchen and whole-home renovation in London and Essex, newest first.",
    path: "/blog",
    image: image?.url,
    imageAlt: image?.alt,
  });
}
/**
 * Chronological index of everything. The pillar libraries at /resources are
 * the designed browsing entry points; this exists so an article found through
 * search has a sensible parent, and so /blog is a real page rather than a 404.
 */
export default async function BlogIndexPage() {
  const [posts, tagLabels] = await Promise.all([getPosts(), getTagLabels()]);

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[clamp(24px,3.4vw,38px)]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Blog" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Newest first
          </p>
          <h1 className="mb-[18.4px] max-w-[22ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Everything we have written, in order.
          </h1>
          <p className="max-w-[62ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
            If you would rather browse by room, the{" "}
            <Link href="/resources/bathroom" className="text-migss-accent-ink">
              bathroom
            </Link>{" "}
            and{" "}
            <Link href="/resources/kitchen" className="text-migss-accent-ink">
              kitchen
            </Link>{" "}
            libraries group the same articles by subject and by where you are in
            the project.
          </p>
        </section>

        <section className="mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <p className="border-b border-[var(--migss-divider)] pb-[13.8px] text-[13px] text-migss-text/58 tabular-nums">
            {posts.length} articles
          </p>
          <ul className="mt-[18.4px] grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-x-[clamp(14px,2.5vw,28px)] gap-y-[clamp(20px,3.5vw,40px)]">
            {posts.map((post, index) => (
              <Reveal as="li" key={post.slug} delay={Math.min(index, 5) * 60}>
                <ArticleCard post={post} tagLabels={tagLabels} />
              </Reveal>
            ))}
          </ul>
        </section>

        <EnquireBand
          kicker="Past the reading stage"
          heading="Ask us the question the article did not answer"
          body="No obligation and no sales sequence. If you are still a year away, say so and we will answer anyway."
          points={[
            "Average response time under 20 minutes",
            "Free home visit, fixed written quote",
          ]}
        />
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
