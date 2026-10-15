import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { formatJobDate } from "@/lib/jobs";
import { pageMetadata } from "@/lib/seo";
import { mailHref, SITE, telHref } from "@/lib/site";
import { getOpenJobs } from "@/lib/wix/jobs";
import { ogImage } from "@/lib/wix/og-image";

/**
 * Roles are opened and closed in the Wix dashboard, so the page is rebuilt in
 * the background at most once a minute, the same as the portfolio.
 */
export const revalidate = 60;

export async function generateMetadata() {
  const image = await ogImage("home-hero");

  return pageMetadata({
    title: "Join the Team | Bathroom Fitter Jobs, London & Essex",
    description:
      "Open roles at Migss Interiors. Experienced bathroom fitters and tradespeople for luxury renovations across East London and Essex, with a steady pipeline of work and a paid trial.",
    path: "/join-the-team",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

/** What every role shares, taken from how Migss actually hires. */
const POINTS = [
  {
    title: "A steady pipeline",
    body: "Work is allocated to you. No chasing leads, no quoting, no gaps between jobs.",
  },
  {
    title: "Materials on us",
    body: "Everything for the job is supplied. You bring the skill, your tools and your van.",
  },
  {
    title: "A paid trial first",
    body: "Two to three paid days so both sides know it is a fit before anyone commits.",
  },
];

export default async function JoinTheTeamPage() {
  const jobs = await getOpenJobs();
  const onIndeed = jobs.filter((job) => job.indeedUrl);

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(20px,4vw,40px)]">
          <div className="mb-[clamp(24px,3.4vw,38px)]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Join the Team" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Careers · London &amp; Essex
          </p>
          <h1 className="mb-[18.4px] max-w-[22ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Build the bathrooms our clients photograph.
          </h1>

          <div className="border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="max-w-[68ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              Every project in our portfolio was built by our own team. We are
              looking for experienced tradespeople who take the same pride in a
              finish: clean lines, true tiling and a site you would be happy
              for the client to walk into at any point.
            </p>
          </div>

          <ul className="mt-[clamp(22px,4vw,40px)] grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(14px,3vw,28px)]">
            {POINTS.map((point) => (
              <li
                key={point.title}
                className="border-l-2 border-migss-accent pl-[18.4px]"
              >
                <h2 className="mb-1.5 text-[23px] leading-[1.15] font-normal">
                  {point.title}
                </h2>
                <p className="text-[14.5px] leading-[1.7] text-migss-text/72">
                  {point.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="roles"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(30px,6vw,68px)]"
        >
          <div className="mb-7">
            <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
              Open roles
            </p>
            <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
              {jobs.length > 0
                ? jobs.length === 1
                  ? "One role open now"
                  : `${jobs.length} roles open now`
                : "No roles open right now"}
            </h2>
          </div>

          {jobs.length > 0 ? (
            <ul className="flex list-none flex-col gap-[clamp(12px,2.5vw,20px)]">
              {jobs.map((job, index) => (
                <Reveal as="li" key={job.slug} delay={index * 90}>
                  <Link
                    href={`/join-the-team/${job.slug}`}
                    className="group grid gap-[13.8px] rounded-[4px] border border-[var(--migss-divider)] p-[clamp(18px,3vw,28px)] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] md:grid-cols-[1fr_auto] md:items-center [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
                  >
                    <div>
                      {job.employmentType ? (
                        <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                          {job.employmentType}
                        </span>
                      ) : null}
                      <h3 className="mt-1.5 text-[clamp(24px,5.4vw,32px)] leading-[1.1] font-normal">
                        {job.title}
                      </h3>
                      {job.summary ? (
                        <p className="mt-2 max-w-[64ch] text-[14.5px] leading-[1.7] text-migss-text/72">
                          {job.summary}
                        </p>
                      ) : null}
                      <dl className="mt-[13.8px] flex flex-wrap gap-x-[clamp(16px,3vw,32px)] gap-y-2 text-[13.5px]">
                        {job.location ? (
                          <div className="flex gap-1.5">
                            <dt className="text-migss-text/55">Location</dt>
                            <dd>{job.location}</dd>
                          </div>
                        ) : null}
                        {job.payDisplay ? (
                          <div className="flex gap-1.5">
                            <dt className="text-migss-text/55">Pay</dt>
                            <dd>{job.payDisplay}</dd>
                          </div>
                        ) : null}
                        {job.datePosted ? (
                          <div className="flex gap-1.5">
                            <dt className="text-migss-text/55">Posted</dt>
                            <dd>{formatJobDate(job.datePosted)}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap text-migss-accent-ink">
                      View role →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="rounded-[4px] border border-[var(--migss-divider)] bg-migss-surface/60 p-[clamp(18px,3vw,28px)]">
              <p className="max-w-[64ch] text-[15px] leading-[1.75] text-migss-text/78">
                We are not advertising a role at the moment, but we are always
                glad to hear from experienced fitters and tilers working across
                East London and Essex. Call{" "}
                <a href={telHref} className="text-migss-accent-ink">
                  {SITE.phone}
                </a>{" "}
                or email{" "}
                <a href={mailHref} className="text-migss-accent-ink">
                  {SITE.email}
                </a>{" "}
                with a little about your experience.
              </p>
            </div>
          )}
        </section>

        {onIndeed.length > 0 ? (
          <section
            id="indeed"
            className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
          >
            <div className="mb-7">
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                Also on Indeed
              </p>
              <h2 className="text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Prefer to apply through Indeed?
              </h2>
              <p className="mt-2 max-w-[64ch] text-[14.5px] leading-[1.7] text-migss-text/72">
                The same roles are advertised there, and an application through
                either route reaches the same team.
              </p>
            </div>

            <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-[clamp(12px,2.5vw,20px)]">
              {onIndeed.map((job, index) => (
                <Reveal as="li" key={job.slug} delay={index * 90}>
                  <a
                    href={job.indeedUrl ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col gap-1.5 rounded-[4px] border border-[var(--migss-divider)] bg-migss-surface/60 p-[18.4px] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
                  >
                    {job.datePosted ? (
                      <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                        Posted {formatJobDate(job.datePosted)}
                      </span>
                    ) : null}
                    <h3 className="text-[23px] leading-[1.15] font-normal">
                      {job.title}
                    </h3>
                    {job.location ? (
                      <p className="text-[13px] text-migss-text/58">
                        {job.location}
                      </p>
                    ) : null}
                    <span className="mt-auto pt-[13.8px] text-sm font-medium text-migss-accent-ink">
                      View on Indeed ↗
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-[clamp(36px,7.5vw,84px)] border-t border-[var(--migss-divider)] bg-migss-surface/60">
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-[clamp(18px,3vw,40px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(28px,5.5vw,64px)]">
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                Not seeing your trade?
              </p>
              <h2 className="mb-[13.8px] text-[clamp(26px,6vw,38px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Good tradespeople are always worth a conversation.
              </h2>
              <p className="text-[15px] leading-[1.75] text-migss-text/78">
                Tell us what you do and the areas you cover, and we will keep
                you in mind as work comes in.
              </p>
            </Reveal>
            <div className="flex flex-wrap gap-2.5">
              <ButtonLink
                href={telHref}
                className="font-body min-h-[54px] flex-[1_1_190px] text-[14.5px] font-medium"
              >
                Call {SITE.phone}
              </ButtonLink>
              <ButtonLink
                href={mailHref}
                variant="secondary"
                className="font-body min-h-[54px] flex-[1_1_190px] text-[14.5px] font-medium"
              >
                Email the team
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
