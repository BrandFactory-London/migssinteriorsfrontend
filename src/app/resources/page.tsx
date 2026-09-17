import type { Metadata } from "next";
import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articlesFor, cardMeta, getArticle } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Twenty-five years of bathroom and kitchen answers, written down in plain language — costs, construction, layouts and lead times.",
};

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
    tags: ["Costs & budgets", "Wet rooms"],
    countLabel: countLabel(articlesFor("Bathroom").length),
  },
  {
    href: "/resources/kitchen",
    title: "Kitchen library",
    body: "Layouts, cabinetry construction, worktop materials, structural openings, appliance planning and the lead times that decide your programme. For anyone weighing up a showroom quote against a builder's.",
    cover: "Kitchen library cover image",
    tags: ["Layouts", "Cabinetry"],
    countLabel: countLabel(articlesFor("Kitchen").length),
  },
];

const STAGES = [
  {
    title: "Early inspiration",
    body: "You know the room is coming. You do not yet know what it costs or what is possible.",
    slugs: [
      "what-a-luxury-bathroom-really-costs-in-2026",
      "seven-kitchen-layouts-and-who-each-one-suits",
      "marble-quartz-or-porcelain-an-honest-comparison",
    ],
  },
  {
    title: "Active planning",
    body: "You are comparing quotes, choosing materials and trying to spot what has been left out.",
    slugs: [
      "twelve-things-missing-from-most-bathroom-quotes",
      "can-this-wall-come-down-reading-your-own-house",
      "lead-times-stone-ten-days-cabinetry-six-weeks",
    ],
  },
  {
    title: "Mid-project",
    body: "The work has started. You want to know what is normal and what is not.",
    slugs: [
      "living-through-a-bathroom-build-with-one-wc",
      "how-to-snag-a-bathroom-properly",
      "snagging-a-kitchen-the-forty-point-walk-through",
    ],
  },
];

const FEATURED_SLUG = "what-a-luxury-bathroom-really-costs-in-2026";

export default function ResourcesPage() {
  const featured = getArticle(FEATURED_SLUG);

  // A stage with nothing published yet is a heading over an empty list, so it
  // is dropped rather than shown empty. Restores itself as articles land.
  const stages = STAGES.map((stage) => ({
    ...stage,
    articles: stage.slugs
      .map((slug) => getArticle(slug))
      .filter((article) => article !== undefined),
  })).filter((stage) => stage.articles.length > 0);

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
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
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
                      <ImageSlot placeholder={pillar.cover} captionHidden />
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
                      <li className="inline-flex items-center rounded-[3px] border border-migss-accent px-2.5 py-[3px] text-[11.5px] text-migss-accent">
                        {pillar.countLabel}
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
                    <span className="mt-auto flex items-center gap-3 text-[14.5px] font-medium text-migss-accent-700">
                      Open the {pillar.title.toLowerCase()}
                      <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-migss-accent transition-[transform,background-color,color] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:translate-x-[5px] [@media(hover:hover)]:group-hover:bg-migss-accent-700 [@media(hover:hover)]:group-hover:text-migss-bg">
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

        {stages.length > 0 ? (
          <section
            id="stages"
            className="mx-auto mt-[clamp(34px,7vw,80px)] max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
          >
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
                Browse by stage
              </p>
              <h2 className="mb-7 max-w-[22ch] text-[clamp(28px,6.8vw,44px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Where are you in this, exactly?
              </h2>
            </Reveal>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,44px)]">
              {stages.map((stage, index) => (
                <Reveal key={stage.title} delay={index * 90}>
                  <div className="flex items-baseline gap-2.5 border-b-2 border-migss-accent pb-2.5">
                    <span className="font-heading text-[13px] text-migss-accent-700 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[25px] leading-[1.1] font-normal">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="mt-[13.8px] mb-[9.2px] text-sm leading-[1.7] text-migss-text/70">
                    {stage.body}
                  </p>
                  <ul className="list-none">
                    {stage.articles.map((article) => {
                      const slug = article.slug;
                      return (
                        <li key={slug}>
                          <Link
                            href={`/blog/${slug}`}
                            className="group flex items-baseline gap-3 border-t border-[var(--migss-divider)] py-[13px] text-inherit no-underline transition-[background-color,padding-left] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/7 [@media(hover:hover)]:hover:pl-2.5"
                          >
                            <span className="flex-1 text-[15px] leading-[1.4]">
                              {article.title}
                            </span>
                            <span className="flex-none text-xs text-migss-text/55 tabular-nums transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-700">
                              {article.minutesToRead} min
                            </span>
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
                      placeholder="Featured article image"
                      captionHidden
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 p-[clamp(18px,3vw,32px)]">
                  <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700">
                    Most read · Planning
                  </span>
                  <h2 className="text-[clamp(26px,5.8vw,36px)] leading-[1.08] font-normal tracking-[-0.02em]">
                    {featured.title}
                  </h2>
                  <p className="text-[15px] leading-[1.7] text-pretty text-migss-text/76">
                    A line-by-line breakdown of a real £28,000 ensuite — labour,
                    stone, brassware, making good — and where the same room
                    could have cost twelve thousand less.
                  </p>
                  <span className="text-[12.5px] text-migss-text/55 tabular-nums">
                    {cardMeta(featured)}
                  </span>
                </div>
              </Link>
            </Reveal>
          </section>
        ) : null}

        <EnquireBand
          kicker="Past the reading stage"
          heading="Ask us the question the article did not answer"
          body="No obligation and no sales sequence — if you are still a year away, say so and we will answer anyway."
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
