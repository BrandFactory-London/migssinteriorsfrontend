import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ApplicationForm } from "@/components/jobs/application-form";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { formatJobDate, jobFacts, jobPostingJsonLd } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { SITE, telHref } from "@/lib/site";
import { getAllJobs, getJob } from "@/lib/wix/jobs";
import { ogImage } from "@/lib/wix/og-image";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getAllJobs()).map(({ slug }) => ({ slug }));
}

/**
 * A role added in the dashboard this morning has to resolve on its first
 * visit, the same as a new project, rather than 404 until the next build.
 */
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return { title: "Role not found" };

  const image = await ogImage("home-hero");
  const metadata = pageMetadata({
    title: job.location
      ? `${job.title}, ${job.location} | Migss Interiors`
      : `${job.title} | Migss Interiors`,
    description:
      job.summary ??
      job.description[0] ??
      `${job.title} at Migss Interiors, East London and Essex.`,
    path: `/join-the-team/${job.slug}`,
    image: image?.url,
    imageAlt: image?.alt,
  });

  // A closed role stays reachable so old links explain themselves, but it
  // should drop out of search rather than compete with live roles.
  return job.isOpen
    ? metadata
    : { ...metadata, robots: { index: false, follow: true } };
}

function Tick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-migss-accent)"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="mt-[5px] flex-none"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ListSection({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <Reveal className="mt-[clamp(28px,5vw,48px)]">
      <h2 className="mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
        {heading}
      </h2>
      <ul className="flex list-none flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[15.5px] leading-[1.7] text-migss-text/82"
          >
            <Tick />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);

  if (!job) notFound();

  const facts = jobFacts(job);

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        {job.isOpen ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              // `<` escaped so text from the dashboard can never close the tag.
              __html: JSON.stringify(jobPostingJsonLd(job)).replace(
                /</g,
                "\\u003c",
              ),
            }}
          />
        ) : null}

        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(20px,4vw,40px)]">
          <div className="mb-[clamp(24px,3.4vw,38px)]">
            <Breadcrumb
              items={[
                { href: "/", label: "Home" },
                { href: "/join-the-team", label: "Join the Team" },
                { label: job.title },
              ]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            {job.isOpen ? "Now hiring" : "Role closed"}
            {job.datePosted ? ` · Posted ${formatJobDate(job.datePosted)}` : ""}
          </p>
          <h1 className="mb-[18.4px] max-w-[20ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            {job.title}
          </h1>
          {job.summary ? (
            <p className="max-w-[60ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              {job.summary}
            </p>
          ) : null}

          {job.isOpen ? (
            <div className="mt-[clamp(18px,3vw,28px)] flex flex-wrap gap-2.5">
              <ButtonLink
                href="#apply"
                size="xl"
                className="font-body flex-[0_1_220px] font-medium"
              >
                Apply now
              </ButtonLink>
              {job.indeedUrl ? (
                <ButtonLink
                  href={job.indeedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="xl"
                  className="font-body flex-[0_1_220px] font-medium"
                >
                  Apply on Indeed ↗
                  <span className="sr-only"> (opens in a new tab)</span>
                </ButtonLink>
              ) : null}
            </div>
          ) : (
            <p
              role="status"
              className="mt-[clamp(18px,3vw,28px)] max-w-[64ch] rounded-[4px] border border-[var(--migss-divider)] bg-migss-surface/60 px-[18.4px] py-[13.8px] text-[15px] leading-[1.7]"
            >
              This role has now been filled.{" "}
              <Link href="/join-the-team" className="text-migss-accent-ink">
                See the roles we have open
              </Link>
              , or call{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>{" "}
              if you would like us to keep you in mind.
            </p>
          )}
        </section>

        {facts.length > 0 ? (
          <section className="mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(50%,200px),1fr))] border-t border-l border-[var(--migss-divider)] bg-migss-bg shadow-migss-md">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border-r border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,24px)] py-[18.4px]"
                >
                  <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                    {fact.label}
                  </dt>
                  <dd className="font-heading mt-1.5 text-[19px] leading-[1.3]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]">
          <div className="max-w-[68ch]">
            {job.description.length > 0 ? (
              <Reveal>
                <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                  The role
                </p>
                {job.description.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ) : null}

            <ListSection
              heading="What you will do"
              items={job.responsibilities}
            />
            <ListSection heading="What we need" items={job.requirements} />
            <ListSection heading="What we offer" items={job.benefits} />

            {job.hiringProcess.length > 0 ? (
              <Reveal className="mt-[clamp(28px,5vw,48px)] border-l-2 border-migss-accent pl-[18.4px]">
                <h2 className="mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
                  How we hire
                </h2>
                {job.hiringProcess.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ) : null}
          </div>
        </section>

        {job.isOpen ? (
          <section
            id="apply"
            className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/60"
          >
            <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
              <Reveal>
                <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                  Apply
                </p>
                <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
                  Interested? Tell us about yourself.
                </h2>
                <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
                  It takes a couple of minutes, no CV needed. We will call you
                  to talk it through and, if it is a fit, arrange your paid
                  trial.
                </p>
                {job.indeedUrl ? (
                  <p className="text-[14.5px] leading-[1.75] text-migss-text/72">
                    Prefer Indeed?{" "}
                    <a
                      href={job.indeedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-migss-accent-ink"
                    >
                      Apply through our Indeed advert
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    .
                  </p>
                ) : null}
              </Reveal>
              <ApplicationForm roleTitle={job.title} />
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
