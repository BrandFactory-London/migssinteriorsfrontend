import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { HeroParallax } from "@/components/hero-parallax";
import { ImageSlot } from "@/components/image-slot";
import { EnquireBand } from "@/components/projects/enquire-band";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";
import { getProject, getProjects, serviceFor } from "@/lib/wix/projects";
import { DARK_BEHIND_HEADER } from "@/lib/header-ink";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}

/**
 * Deliberately the opposite of /locations/[area] and /blog/[slug], where the
 * data is closed and an unknown slug is a genuine 404. The portfolio grows in
 * the dashboard between deploys, so a project added this morning has to
 * resolve on its first visit rather than 404 until the next build.
 */
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  const place = project.addressLine ?? project.location;
  const room = project.category
    ? `${project.category} renovation`
    : "Renovation";

  return pageMetadata({
    title: place
      ? `${project.title}, ${place} | Migss Interiors`
      : `${project.title} | Migss Interiors`,
    description:
      project.summary ??
      project.description[0] ??
      `${room} by Migss Interiors${place ? ` in ${place}` : ""}.`,
    path: `/our-projects/${project.slug}`,
    image: project.ogUrl,
    imageAlt: place ? `${project.title}, ${place}` : project.title,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  const service = serviceFor(project);
  const place = project.addressLine ?? project.location;

  // Only the facts this project actually carries: the collection has no
  // programme or scope fields, and a blank cell reads as a missing value.
  const facts = [
    project.category ? { label: "Category", value: project.category } : null,
    project.location ? { label: "Location", value: project.location } : null,
  ].filter((fact) => fact !== null);

  // Three others to keep browsing, same category first.
  const more = (await getProjects())
    .filter((other) => other.slug !== project.slug)
    .sort(
      (a, b) =>
        Number(a.category !== project.category) -
        Number(b.category !== project.category),
    )
    .slice(0, 3);

  return (
    <>
      <SiteHeader />

      <main id="top">
        <section
          {...DARK_BEHIND_HEADER}
          className="relative flex min-h-[clamp(480px,76svh,860px)] items-end overflow-hidden"
        >
          {/* This hero is fed by the Projects collection rather than
              HeroMedia, so it reaches for the shared backdrop directly
              instead of through the `parallax` flag. Same treatment either
              way — the effect only ever wrapped whatever fills the box. */}
          <HeroParallax>
            <ImageSlot
              placeholder={`Hero: ${project.title}, wide shot`}
              src={project.heroUrl ?? undefined}
              alt={place ? `${project.title}, ${place}` : project.title}
              captionHidden
            />
          </HeroParallax>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_52%,transparent)_44%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)]"
          />
          <div className="relative z-2 mx-auto w-full max-w-[1280px] animate-[migss-fade_0.6s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(96px,16vh,150px)] pb-[clamp(44px,7vw,80px)] text-migss-neutral-100">
            <div className="mb-[clamp(20px,3vw,32px)]">
              <Breadcrumb
                tone="light"
                items={[
                  { href: "/", label: "Home" },
                  { href: "/our-projects", label: "Projects" },
                  { label: project.location ?? project.title },
                ]}
              />
            </div>
            {project.category ? (
              <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
                <span className="block h-px w-[34px] bg-migss-accent-300" />
                {project.category} renovation
              </p>
            ) : null}
            <h1 className="mb-[13.8px] max-w-[20ch] text-[clamp(36px,8.4vw,74px)] leading-none font-normal tracking-[-0.03em] text-balance">
              {project.title}
            </h1>
            {place ? (
              <p className="text-[clamp(14px,3.6vw,16px)] text-migss-neutral-100/80">
                {place}
              </p>
            ) : null}
          </div>
        </section>

        {facts.length > 0 ? (
          <section className="relative z-3 mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
            <dl className="mt-[clamp(-46px,-3.5vw,-30px)] grid grid-cols-[repeat(auto-fit,minmax(min(50%,180px),1fr))] border-t border-l border-[var(--migss-divider)] bg-migss-bg shadow-migss-md">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-r border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,24px)] py-[18.4px]"
                >
                  <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                    {fact.label}
                  </dt>
                  <dd className="font-heading mt-1.5 text-[21px]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {project.description.length > 0 || project.summary ? (
          <section
            id="story"
            className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
          >
            <Reveal className="max-w-[68ch]">
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                The project
              </p>
              {project.summary ? (
                <h2 className="mb-[18.4px] text-[clamp(24px,5.6vw,34px)] leading-[1.14] font-normal tracking-[-0.02em] text-balance">
                  {project.summary}
                </h2>
              ) : null}
              {project.description.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </section>
        ) : null}

        {/* Before and after, only where the dashboard holds both shots. */}
        {project.beforeUrl && project.heroUrl ? (
          <section
            id="before-after"
            className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
          >
            <Reveal>
              <h2 className="mb-[18.4px] text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Before and after
              </h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(12px,2.5vw,24px)]">
                {[
                  { label: "Before", url: project.beforeUrl },
                  { label: "After", url: project.heroUrl },
                ].map((shot) => (
                  <figure key={shot.label} className="m-0">
                    <div className="aspect-[4/3]">
                      <ImageSlot
                        placeholder={`${shot.label}: ${project.title}`}
                        src={shot.url}
                        alt={`${shot.label}: ${project.title}`}
                        shape="rounded"
                        className="migss-plate"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-[11px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                      {shot.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </section>
        ) : null}

        {project.gallery.length > 0 ? (
          <ProjectGallery title={project.title} shots={project.gallery} />
        ) : null}

        {project.videoUrl ? (
          <section
            id="video"
            className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
          >
            <Reveal>
              <h2 className="mb-[18.4px] text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                In their own words
              </h2>
              <video
                controls
                preload="metadata"
                poster={project.heroUrl ?? undefined}
                className="migss-plate aspect-video w-full rounded-[4px] bg-migss-neutral-900"
              >
                <source src={project.videoUrl} />
                Your browser cannot play this video.
              </video>
            </Reveal>
          </section>
        ) : null}

        <section
          {...DARK_BEHIND_HEADER}
          className="mt-[clamp(32px,6.5vw,76px)] bg-migss-neutral-900 text-migss-neutral-200"
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-[clamp(18px,3vw,40px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(28px,5.5vw,64px)]">
            {project.testimonial ? (
              <blockquote className="border-l-2 border-migss-accent-400 pl-[18.4px]">
                <p className="font-heading mb-[13.8px] text-[clamp(21px,5.2vw,30px)] leading-[1.3] italic text-migss-neutral-100">
                  {project.testimonial}
                </p>
                <footer className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-neutral-400">
                  {[project.clientName, place].filter(Boolean).join(" · ")}
                </footer>
              </blockquote>
            ) : (
              <p className="font-heading text-[clamp(21px,5.2vw,30px)] leading-[1.3] text-migss-neutral-100">
                Designed and built by our own team, start to finish.
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

        {more.length > 0 ? (
          <section
            id="more"
            className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
          >
            <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-[9.2px]">
              <div>
                <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                  More projects
                </p>
                <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                  Keep looking
                </h2>
              </div>
              <Link
                href="/our-projects"
                className="text-sm font-medium text-migss-accent-ink no-underline"
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
                          placeholder={`${other.location ?? "Recent work"}: ${other.title}`}
                          src={other.cardUrl ?? undefined}
                          alt={other.title}
                          captionHidden
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 p-[18.4px]">
                      {other.category ? (
                        <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                          {other.category}
                        </span>
                      ) : null}
                      <h3 className="text-[23px] leading-[1.15] font-normal">
                        {other.title}
                      </h3>
                      {(other.addressLine ?? other.location) ? (
                        <p className="text-[13px] text-migss-text/58">
                          {other.addressLine ?? other.location}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}

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
