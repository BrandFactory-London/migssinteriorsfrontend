import type { Metadata } from "next";

import { EnquireBand } from "@/components/projects/enquire-band";
import { FeaturedCarousel } from "@/components/projects/featured-carousel";
import { ProjectFilters } from "@/components/projects/project-filters";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  categoriesPresent,
  getFeaturedProjects,
  getProjects,
} from "@/lib/wix/projects";

/**
 * The portfolio is edited in the Wix dashboard continuously, so the page is
 * rebuilt in the background at most once a minute rather than at deploy time.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "Bathroom, kitchen and whole-home renovations across London and Essex, designed and built by our own team.",
};

const STATS = [
  { label: "Completed", value: "600+" },
  { label: "Years", value: "25" },
  { label: "Google", value: "5.0" },
];

export default async function OurProjectsPage() {
  const [projects, featured] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(20px,4vw,40px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Our Projects" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Portfolio · London &amp; Essex
          </p>
          <h1 className="mb-[18.4px] max-w-[22ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Finished work, photographed the week we handed it over.
          </h1>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-end gap-[clamp(14px,3vw,40px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              Every project below was designed and built by our own team. No
              styling props, no borrowed photography. These are real homes in
              Chigwell, Wanstead, Loughton and across Essex, most of which you
              could visit if the owners are willing.
            </p>
            <dl className="grid grid-cols-3 gap-[13.8px]">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                    {stat.label}
                  </dt>
                  <dd className="font-heading mt-1 text-[clamp(28px,7vw,40px)] leading-none tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <FeaturedCarousel projects={featured} />

        <section
          id="all"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(30px,6vw,68px)]"
        >
          <ProjectFilters
            projects={projects}
            categories={categoriesPresent(projects)}
          />

          <p className="mt-7 border-t border-[var(--migss-divider)] pt-[18.4px] text-[14.5px] leading-[1.75] text-migss-text/72">
            Looking for something specific, a wet room in a loft, a kitchen in a
            listed building?{" "}
            <a href="#enquire" className="text-migss-accent-ink">
              Tell us what you are planning
            </a>{" "}
            and we will send photographs of the closest projects we have done.
          </p>
        </section>

        <EnquireBand
          heading="Like what you have seen? Let's talk about yours."
          body="Two short steps. We reply the same working day, and we are happy to put you in touch with the owners of any project above."
          points={[
            "References from past clients on request",
            "Fixed written quote, no sales pressure",
          ]}
        />
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
