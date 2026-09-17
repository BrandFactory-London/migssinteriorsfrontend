import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageSlot } from "@/components/image-slot";
import { EnquireBand } from "@/components/projects/enquire-band";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { CATEGORY_SERVICE, PROJECTS, getProject } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

/** Only the projects we know about; anything else is a genuine 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} — ${project.location}`,
    description: project.narrative[0],
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const service = CATEGORY_SERVICE[project.category];
  const facts = [
    { label: "Category", value: project.category },
    { label: "Location", value: project.postcode },
    { label: "Programme", value: project.programme },
    { label: "Scope", value: project.scope },
  ];
  // Three other projects to keep browsing, nearest first by shared category.
  const more = PROJECTS.filter((other) => other.slug !== project.slug)
    .sort((a, b) => {
      const score = (p: typeof project) => (p.category === project.category ? 0 : 1);
      return score(a) - score(b);
    })
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="relative flex min-h-[clamp(480px,76svh,860px)] items-end overflow-hidden">
          <div className="absolute inset-0">
            <ImageSlot
              placeholder={`Hero: ${project.title}, wide shot`}
              captionHidden
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_52%,transparent)_44%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)]"
          />
          <div className="relative z-2 mx-auto w-full max-w-[1280px] animate-[migss-fade_0.6s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(96px,16vh,150px)] pb-[clamp(44px,7vw,80px)] text-migss-neutral-100">
            <div className="mb-[13.8px]">
              <Breadcrumb
                tone="light"
                items={[
                  { href: "/", label: "Home" },
                  { href: "/our-projects", label: "Projects" },
                  { label: project.location },
                ]}
              />
            </div>
            <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
              <span className="block h-px w-[34px] bg-migss-accent-300" />
              {project.category} renovation
            </p>
            <h1 className="mb-[13.8px] max-w-[20ch] text-[clamp(36px,8.4vw,74px)] leading-none font-normal tracking-[-0.03em] text-balance">
              {project.title}
            </h1>
            <p className="text-[clamp(14px,3.6vw,16px)] text-migss-neutral-100/80">
              {project.location} · {project.completed}
            </p>
          </div>
        </section>

        <section className="relative z-3 mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <dl className="mt-[clamp(-46px,-3.5vw,-30px)] grid grid-cols-[repeat(auto-fit,minmax(min(50%,180px),1fr))] gap-px border border-[var(--migss-divider)] bg-[var(--migss-divider)] shadow-migss-md">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="bg-migss-bg px-[clamp(14px,2vw,24px)] py-[18.4px]"
              >
                <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                  {fact.label}
                </dt>
                <dd className="font-heading mt-1.5 text-[21px] tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="story"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)]">
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
                The brief
              </p>
              {project.brief ? (
                <h2 className="mb-[13.8px] text-[clamp(27px,6.4vw,40px)] leading-[1.08] font-normal tracking-[-0.02em]">
                  {project.brief}
                </h2>
              ) : null}
              {project.narrative.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            {/* Both blocks are optional: only the fully specified case study
                carries a before shot and a materials list. */}
            {project.before || project.spec ? (
              <Reveal delay={90} className="flex flex-col gap-[18.4px]">
                {project.before ? (
                  <div className="border border-[var(--migss-divider)] border-l-2 border-l-migss-accent p-[18.4px]">
                    <p className="mb-2 text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700">
                      Before
                    </p>
                    <p className="mb-[13.8px] text-[14.5px] leading-[1.75] text-migss-text/78">
                      {project.before}
                    </p>
                    <div className="aspect-[4/3]">
                      <ImageSlot
                        placeholder={`Before: ${project.location}`}
                        shape="rounded"
                      />
                    </div>
                  </div>
                ) : null}

                {project.spec ? (
                  <ul className="grid list-none">
                    {project.spec.map((row, index) => (
                      <li
                        key={row.label}
                        className={`flex justify-between gap-3 border-t border-[var(--migss-divider)] px-0.5 py-[13px] text-[14.5px] ${
                          index === project.spec!.length - 1
                            ? "border-b border-b-[var(--migss-divider)]"
                            : ""
                        }`}
                      >
                        <span className="text-migss-text/62">{row.label}</span>
                        <span className="text-right">{row.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            ) : null}
          </div>
        </section>

        <ProjectGallery project={project} />

        <section className="mt-[clamp(32px,6.5vw,76px)] bg-migss-neutral-900 text-migss-neutral-200">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-[clamp(18px,3vw,40px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(28px,5.5vw,64px)]">
            {project.quote ? (
              <blockquote className="border-l-2 border-migss-accent-400 pl-[18.4px]">
                <p className="font-heading mb-[13.8px] text-[clamp(21px,5.2vw,30px)] leading-[1.3] italic text-migss-neutral-100">
                  {project.quote.text}
                </p>
                <footer className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-neutral-400">
                  {project.quote.source}
                </footer>
              </blockquote>
            ) : (
              <p className="font-heading text-[clamp(21px,5.2vw,30px)] leading-[1.3] text-migss-neutral-100">
                {project.programme} on site, one team, one guarantee.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <p className="text-[14.5px] leading-[1.8] text-migss-neutral-400">
                Guaranteed for ten years on labour, with 0% interest finance
                available over five.
              </p>
              <div className="flex flex-wrap gap-2.5">
                <ButtonLink
                  href="#enquire"
                  variant="contrast"
                  className="font-body min-h-[54px] flex-[1_1_190px] text-[14.5px] font-medium"
                >
                  Start a similar project
                </ButtonLink>
                <ButtonLink
                  href={`/renovation-services/${service.slug}`}
                  variant="outlineAccent"
                  className="font-body min-h-[54px] flex-[1_1_190px] text-[14.5px] font-medium"
                >
                  About {service.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section
          id="more"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-[9.2px]">
            <div>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
                More projects
              </p>
              <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Keep looking
              </h2>
            </div>
            <Link
              href="/our-projects"
              className="text-sm font-medium text-migss-accent-700 no-underline"
            >
              All projects →
            </Link>
          </div>

          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(14px,3vw,28px)]">
            {more.map((other, index) => (
              <Reveal as="li" key={other.slug} delay={index * 90}>
                <Link
                  href={`/our-projects/${other.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[4px] border border-[var(--migss-divider)] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
                >
                  <div className="relative aspect-[16/11] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
                      <ImageSlot
                        placeholder={`${other.location} — ${other.title}`}
                        captionHidden
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 p-[18.4px]">
                    <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700">
                      {other.category}
                    </span>
                    <h3 className="text-[23px] leading-[1.15] font-normal">
                      {other.title}
                    </h3>
                    <p className="text-[13px] text-migss-text/58">
                      {other.location}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        <EnquireBand
          heading="Book your free consultation"
          body="Two short steps. We reply the same working day, and we can send the full photo set from this project if it helps you picture yours."
          points={[
            "Fixed written quote, no sales pressure",
            "10-year labour guarantee, 0% finance available",
          ]}
          focus={service.slug}
        />
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
