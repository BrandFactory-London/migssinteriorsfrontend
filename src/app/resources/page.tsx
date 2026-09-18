import Link from "next/link";

import { HeroMedia } from "@/components/hero-media";
import { ImageSlot } from "@/components/image-slot";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";
import { postMeta } from "@/lib/blog-post";
import {
  getLeadPost,
  getPillarPosts,
  getPosts,
  getTags,
  PILLAR_TAG_SLUG,
  type BlogPost,
} from "@/lib/wix/blog";

export const revalidate = 60;

export async function generateMetadata() {
  const image = await ogImage("resources-bathroom-cover");

  return pageMetadata({
    title: "Renovation Resources | Bathroom & Kitchen Guides",
    description:
      "Twenty-five years of bathroom and kitchen answers, written down in plain language: what things cost, how they are built, which layouts work and what the lead times really are.",
    path: "/resources",
    image: image?.url,
    imageAlt: image?.alt,
  });
}
/** Reads correctly at nought and one, not just at the plural. */
function countLabel(count: number) {
  if (count === 0) return "In progress";
  return count === 1 ? "1 article" : `${count} articles`;
}

const PILLARS = [
  {
    href: "/resources/bathroom",
    title: "Bathroom library",
    body: "Costs, wet-room construction, tile setting-out, ventilation, underfloor heating and the small-room layouts that actually work. Written for people about to spend twenty to forty thousand pounds on one room.",
    cover: "Bathroom library cover image",
    slotId: "resources-bathroom-cover",
    tags: ["Costs & budgets", "Wet rooms"],
  },
  {
    href: "/resources/kitchen",
    title: "Kitchen library",
    body: "Layouts, cabinetry construction, worktop materials, structural openings, appliance planning and the lead times that decide your programme. For anyone weighing up a showroom quote against a builder's.",
    cover: "Kitchen library cover image",
    slotId: "resources-kitchen-cover",
    tags: ["Layouts", "Cabinetry"],
  },
];

export default async function ResourcesPage() {
  const [posts, bathroom, kitchen, allTags, featured] = await Promise.all([
    getPosts(),
    getPillarPosts("Bathroom"),
    getPillarPosts("Kitchen"),
    getTags(),
    getLeadPost(),
  ]);

  const counts: Record<string, number> = {
    "/resources/bathroom": bathroom.length,
    "/resources/kitchen": kitchen.length,
  };

  // "Browse by subject" is built from the tags the blog actually carries,
  // minus the two room tags, which are the pillar cards above.
  const roomSlugs: string[] = Object.values(PILLAR_TAG_SLUG);
  const subjects = allTags
    .filter((tag) => !roomSlugs.includes(tag.slug))
    .map((tag) => ({
      tag,
      posts: posts
        .filter((post) => post.tagIds.includes(tag.id))
        .slice(0, 3) as BlogPost[],
    }))
    .filter((subject) => subject.posts.length > 0);

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Resources" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            The renovation library
          </p>
          <h1 className="mb-[18.4px] max-w-[22ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Everything we know, written down before you need it.
          </h1>
          <p className="max-w-[62ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
            Twenty-five years of bathrooms and kitchens produces a lot of
            hard-won answers: what a wet room actually costs, when an island is
            a mistake, which corners are worth cutting and which ones cause a
            callback in year three. We have written them down, in plain
            language, with no obligation to use us.
          </p>
        </section>

        <section
          id="pillars"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(16px,3vw,28px)]">
            {PILLARS.map((pillar, index) => (
              <Reveal as="li" key={pillar.href} delay={index * 90}>
                <Link
                  href={pillar.href}
                  className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-[var(--migss-divider)] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-[1.04]">
                      <HeroMedia
                        slotId={pillar.slotId}
                        placeholder={pillar.cover}
                        width={900}
                        height={560}
                        captionHidden
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-[13.8px] p-[clamp(18px,3vw,32px)]">
                    <h2 className="text-[clamp(28px,6.4vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                      {pillar.title}
                    </h2>
                    <p className="text-[15px] leading-[1.75] text-pretty text-migss-text/78">
                      {pillar.body}
                    </p>
                    <ul className="flex list-none flex-wrap gap-1.5">
                      <li className="inline-flex items-center rounded-[3px] border border-migss-accent px-2.5 py-[3px] text-[11.5px] text-migss-accent-ink">
                        {countLabel(counts[pillar.href] ?? 0)}
                      </li>
                      {pillar.tags.map((tag) => (
                        <li
                          key={tag}
                          className="inline-flex items-center rounded-[3px] border border-[var(--migss-divider)] px-2.5 py-[3px] text-[11.5px] text-migss-text/70"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto flex items-center gap-3 text-[14.5px] font-medium text-migss-accent-ink">
                      Open the {pillar.title.toLowerCase()}
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-migss-accent transition-[transform,background-color,color] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:translate-x-[5px] [@media(hover:hover)]:group-hover:bg-migss-accent-700 [@media(hover:hover)]:group-hover:text-migss-text">
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        {subjects.length > 0 ? (
          <section
            id="stages"
            className="mx-auto mt-[clamp(34px,7vw,80px)] max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
          >
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                Browse by subject
              </p>
              <h2 className="mb-7 max-w-[22ch] text-[clamp(28px,6.8vw,44px)] leading-[1.05] font-normal tracking-[-0.02em]">
                What is it you are trying to work out?
              </h2>
            </Reveal>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,44px)]">
              {subjects.map((subject, index) => (
                <Reveal key={subject.tag.id} delay={index * 90}>
                  <div className="flex items-baseline gap-2.5 border-b-2 border-migss-accent pb-2.5">
                    <span className="font-heading text-[13px] text-migss-accent-ink tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[25px] leading-[1.1] font-normal">
                      {subject.tag.label}
                    </h3>
                  </div>
                  <ul className="mt-[13.8px] list-none">
                    {subject.posts.map((post) => {
                      const slug = post.slug;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/blog/${slug}`}
                            className="group flex items-baseline gap-3 border-t border-[var(--migss-divider)] py-[13px] text-inherit no-underline transition-[background-color,padding-left] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/7 [@media(hover:hover)]:hover:pl-2.5"
                          >
                            <span className="flex-1 text-[15px] leading-[1.4]">
                              {post.title}
                            </span>
                            {post.minutesToRead ? (
                              <span className="flex-none text-xs text-migss-text/55 tabular-nums transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-ink">
                                {post.minutesToRead} min
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        {featured ? (
          <section
            id="featured"
            className="mx-auto mt-[clamp(34px,7vw,80px)] max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
          >
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] overflow-hidden rounded-[4px] border border-[var(--migss-divider)] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
              >
                <div className="relative aspect-[16/11] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[800ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-[1.04]">
                    <ImageSlot
                      placeholder={featured.coverAlt}
                      src={featured.coverUrl ?? undefined}
                      alt={featured.coverAlt}
                      captionHidden
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 p-[clamp(18px,3vw,32px)]">
                  <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                    {featured.featured ? "Featured" : "Latest"}
                  </span>
                  <h2 className="text-[clamp(26px,5.8vw,36px)] leading-[1.08] font-normal tracking-[-0.02em]">
                    {featured.title}
                  </h2>
                  {featured.excerpt ? (
                    <p className="text-[15px] leading-[1.7] text-pretty text-migss-text/76">
                      {featured.excerpt}
                    </p>
                  ) : null}
                  <span className="text-[12.5px] text-migss-text/55 tabular-nums">
                    {postMeta(featured)}
                  </span>
                </div>
              </Link>
            </Reveal>
          </section>
        ) : null}

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
