import Link from "next/link";

import { EnquireBand } from "@/components/projects/enquire-band";
import { ArticleLibrary } from "@/components/resources/article-library";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getPillarPosts,
  getTags,
  getTagLabels,
  PILLAR_TAG_SLUG,
  type Pillar,
} from "@/lib/wix/blog";
import type { EnquiryFocus } from "@/components/home/enquiry-form";
import { Reveal } from "@/components/reveal";

type PillarCopy = {
  kicker: string;
  heading: string;
  intro: string;
  enquire: { heading: string; body: string; points: [string, string] };
  focus: EnquiryFocus;
  /** The other library, cross-linked at the foot of the grid. */
  otherHref: string;
  otherLabel: string;
  moreLine: string;
  emptyLine: string;
  next: { href: string; kicker: string; title: string; body: string }[];
};

export const PILLAR_COPY: Record<Pillar, PillarCopy> = {
  Bathroom: {
    kicker: "Bathroom library",
    heading: "Everything worth knowing before you gut a bathroom.",
    intro:
      "Costs, construction, layouts and the failure points we see most often. Written by the people who fit them, not by a copywriter working from a brief.",
    enquire: {
      heading: "Get a real number for your bathroom",
      body: "A free home visit and a fixed written quote, itemised so you can see exactly what the articles were describing.",
      points: [
        "10-year labour guarantee on every bathroom",
        "Average response time under 20 minutes",
      ],
    },
    focus: "bathroom",
    otherHref: "/resources/kitchen",
    otherLabel: "Switch to the kitchen library →",
    moreLine: "More bathroom writing is added most months.",
    emptyLine:
      "The bathroom library is being written and the first articles are published as they are finished. In the meantime, ask us anything you would have looked up here, we answer the same way we write.",
    next: [
      {
        href: "/renovation-services/bathroom",
        kicker: "Service",
        title: "Bathroom Renovation",
        body: "What is included, the programme and the guarantee.",
      },
      {
        href: "/our-projects",
        kicker: "Portfolio",
        title: "Our Projects",
        body: "See the bathrooms these articles are drawn from.",
      },
      {
        href: "/resources",
        kicker: "Library",
        title: "All resources",
        body: "Back to the hub and the kitchen library.",
      },
    ],
  },
  Kitchen: {
    kicker: "Kitchen library",
    heading: "The kitchen decisions that are hard to undo.",
    intro:
      "Layouts, cabinetry construction, worktops, structural openings and lead times: the things that decide whether you like the room in five years, not just on handover day.",
    enquire: {
      heading: "Get a real number for your kitchen",
      body: "A free home visit, a check on what the structure allows, and a fixed written quote covering the building work as well as the cabinetry.",
      points: [
        "Temporary kitchen included as standard",
        "Average response time under 20 minutes",
      ],
    },
    focus: "kitchen",
    otherHref: "/resources/bathroom",
    otherLabel: "Switch to the bathroom library →",
    moreLine: "More kitchen writing is added most months.",
    emptyLine:
      "The kitchen library is being written and the first articles are published as they are finished. In the meantime, ask us anything you would have looked up here, we answer the same way we write.",
    next: [
      {
        href: "/renovation-services/kitchen",
        kicker: "Service",
        title: "Kitchen Renovation",
        body: "What is included, the programme and the guarantee.",
      },
      {
        href: "/our-projects",
        kicker: "Portfolio",
        title: "Our Projects",
        body: "See the kitchens these articles are drawn from.",
      },
      {
        href: "/resources",
        kicker: "Library",
        title: "All resources",
        body: "Back to the hub and the bathroom library.",
      },
    ],
  },
};

/** Shared layout for /resources/bathroom and /resources/kitchen. */
export async function PillarPage({ pillar }: { pillar: Pillar }) {
  const copy = PILLAR_COPY[pillar];
  const [posts, allTags, tagLabels] = await Promise.all([
    getPillarPosts(pillar),
    getTags(),
    getTagLabels(),
  ]);

  // Chips offer the other tags these posts carry: filtering a bathroom
  // library by "Bathroom Renovation" is every post in it.
  const roomTagSlug = PILLAR_TAG_SLUG[pillar];
  const tags = allTags.filter(
    (tag) =>
      tag.slug !== roomTagSlug &&
      posts.some((post) => post.tagIds.includes(tag.id)),
  );

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[
                { href: "/", label: "Home" },
                { href: "/resources", label: "Resources" },
                { label: pillar },
              ]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            {copy.kicker}
          </p>
          <h1 className="mb-[18.4px] max-w-[22ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            {copy.heading}
          </h1>
          <p className="max-w-[62ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
            {copy.intro}
          </p>
        </section>

        <section
          id="articles"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <ArticleLibrary
            posts={posts}
            tags={tags}
            tagLabels={tagLabels}
            emptyLine={copy.emptyLine}
          />

          <div className="mt-7 flex flex-wrap items-center justify-between gap-2.5 border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-sm text-migss-text/65">
              {posts.length > 0 ? copy.moreLine : "Writing in progress."}
            </p>
            <Link
              href={copy.otherHref}
              className="text-sm font-medium text-migss-accent-ink no-underline"
            >
              {copy.otherLabel}
            </Link>
          </div>
        </section>

        <EnquireBand
          kicker="Done reading"
          heading={copy.enquire.heading}
          body={copy.enquire.body}
          points={copy.enquire.points}
          focus={copy.focus}
        />

        <section
          id="next"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <h2 className="mb-[18.4px] text-[clamp(24px,5.6vw,34px)] leading-[1.1] font-normal tracking-[-0.02em]">
            Where to next
          </h2>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[clamp(12px,2.5vw,24px)]">
            {copy.next.map((item, index) => (
              <Reveal as="li" key={item.href} delay={index * 80}>
                <Link
                  href={item.href}
                  className="flex min-h-[130px] flex-col gap-2 rounded-[4px] border border-[var(--migss-divider)] p-[18.4px] text-inherit no-underline transition-[background-color,border-color] duration-300 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/6"
                >
                  <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                    {item.kicker}
                  </span>
                  <h3 className="text-2xl leading-[1.15] font-normal">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-migss-text/72">
                    {item.body}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
