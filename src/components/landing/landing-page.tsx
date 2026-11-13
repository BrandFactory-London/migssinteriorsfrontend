import Link from "next/link";

import { HeroMedia } from "@/components/hero-media";
import { ImageSlot } from "@/components/image-slot";
import { EnquiryPageContext } from "@/components/enquiry/page-context";
import {
  LandingForm,
  ProgressRail,
  ToggleList,
  VideoStrip,
} from "@/components/landing/landing-client";
import { DARK_BEHIND_HEADER } from "@/lib/header-ink";
import {
  FINANCE_TERMS_HREF,
  type LandingPage as LandingPageData,
  landingFaqs,
  PROCESS_STEPS,
  RAIL_SECTIONS,
  WHY_MIGSS,
} from "@/lib/landing-pages";
import { getCluster, clusterTowns } from "@/lib/locations";
import { FINANCE_DISCLAIMER } from "@/lib/site";
import { getProjects, type Project } from "@/lib/wix/projects";

const PROOF = [
  { value: "5.0", label: "Google rating" },
  { value: "2001", label: "Established" },
  { value: "600+", label: "Projects completed" },
  { value: "10 years", label: "Labour guarantee" },
];

const kicker =
  "m-0 text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase";
const h2 =
  "mt-2 mb-0 text-[clamp(30px,7vw,40px)] leading-[1.05] font-normal tracking-[-0.02em]";
const wrap = "mx-auto w-full max-w-[720px] px-4";

/**
 * Projects for the rail: this room in this cluster first, then other rooms
 * in the cluster. Nothing from outside the cluster; with no cluster projects
 * the rail shows labelled placeholders until some are added in Wix. Area
 * names only, never street lines.
 */
async function projectsFor(page: LandingPageData): Promise<Project[]> {
  const cluster = getCluster(page.cluster);
  const towns = cluster ? clusterTowns(cluster) : { core: [], surrounding: [] };
  const names = new Set(
    [...towns.core, ...towns.surrounding].map((town) => town.name.toLowerCase()),
  );
  const all = await getProjects();
  const inCluster = all.filter((project) =>
    names.has(project.location?.trim().toLowerCase() ?? ""),
  );
  const sameRoom = inCluster.filter((project) => project.category === page.room);
  const others = inCluster.filter((project) => project.category !== page.room);
  // Never pad with work from outside the cluster: the heading names the area.
  return [...sameRoom, ...others].slice(0, 6);
}

function Testimonial({
  quote,
  name,
  area,
  dark,
}: {
  quote: string;
  name: string;
  area: string;
  dark?: boolean;
}) {
  return (
    <>
      <p
        className={
          "font-heading m-0 mb-3.5 text-[22px] leading-[1.3] italic" +
          (dark ? " text-migss-neutral-100" : "")
        }
      >
        &ldquo;{quote}&rdquo;
      </p>
      <p
        className={
          "m-0 text-[13px] " + (dark ? "text-migss-neutral-400" : "text-migss-text/70")
        }
      >
        {name}, {area}
      </p>
    </>
  );
}

export async function LandingPage({ page }: { page: LandingPageData }) {
  const projects = await projectsFor(page);
  const [first, second] = page.testimonials;

  return (
    <main className="pb-28">
      <EnquiryPageContext focus={page.room === "Bathroom" ? "bathroom" : "kitchen"} />

      {/* Hero */}
      <section
        id="lp-hero"
        {...DARK_BEHIND_HEADER}
        className="relative flex min-h-[clamp(560px,86svh,860px)] items-end overflow-hidden"
      >
        <HeroMedia
          slotId={page.heroSlot}
          placeholder={page.heroPlaceholder}
          width={2000}
          height={1200}
          captionHidden
          parallax
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_42%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)]"
        />
        <div className={`relative z-2 ${wrap} pt-28 pb-10 text-migss-neutral-100`}>
          <p className="mb-3.5 flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] text-migss-accent-300 uppercase">
            <span className="block h-px w-[34px] bg-migss-accent-300" />
            {page.roomPlural} · {page.clusterLabel}
          </p>
          <h1 className="mb-3.5 max-w-[20ch] text-[clamp(40px,10vw,64px)] leading-none font-normal tracking-[-0.03em] text-balance">
            {page.headline}
          </h1>
          <p className="mb-5 max-w-[46ch] text-[15px] leading-[1.65] text-migss-neutral-100/85">
            {page.subline}
          </p>
          <a
            href="#book"
            className="font-heading flex min-h-[56px] max-w-[420px] items-center justify-center rounded-[4px] border border-migss-accent-700 bg-migss-accent-700 px-5 text-[17px] font-semibold text-migss-text no-underline"
          >
            Book a design consultation
          </a>
          <p className="mt-3.5 mb-0 max-w-[46ch] text-[12.5px] text-migss-neutral-100/65">
            A senior member of our team visits your home to talk through the
            space, the specification and timing.
          </p>
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-b border-[var(--migss-divider)] bg-migss-surface">
        <dl className={`${wrap} m-0 grid grid-cols-2 gap-x-3 gap-y-4 py-5 sm:grid-cols-4`}>
          {PROOF.map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs text-migss-text/70">{item.label}</dt>
              <dd className="font-heading m-0 text-[28px] leading-none">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Testimonial 1 with the video strip */}
      <section className={`${wrap} pt-10`}>
        <div className="overflow-hidden rounded-[4px] border border-[var(--migss-divider)] bg-migss-neutral-100">
          <div className="px-5 pt-5.5 pb-4.5">
            <p className="m-0 mb-3 text-sm tracking-[3px] text-migss-accent-700" aria-label="Five stars">
              ★★★★★
            </p>
            <Testimonial {...first} />
          </div>
          <VideoStrip url={page.video.url} label={page.video.label} duration={page.video.duration} />
        </div>
      </section>

      {/* Local projects */}
      <section id="projects" className="scroll-mt-20 pt-10">
        <div className={wrap}>
          <p className={kicker}>Recently completed nearby</p>
          <h2 className={h2}>{page.projectsHeading}</h2>
        </div>
        <ul
          className="migss-scroll mx-auto mt-5 flex max-w-[720px] list-none snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2"
          aria-label={page.projectsHeading}
        >
          {projects.length === 0
            ? [1, 2, 3].map((n) => (
                <li key={n} className="w-[min(72vw,260px)] flex-none snap-start">
                  <div className="migss-plate relative aspect-[4/5] overflow-hidden">
                    <ImageSlot
                      placeholder={`[${page.clusterLabel} project ${n}: add in Wix Projects]`}
                    />
                  </div>
                </li>
              ))
            : null}
          {projects.map((project) => (
            <li key={project.slug} className="w-[min(72vw,260px)] flex-none snap-start">
              <div className="migss-plate relative aspect-[4/5] overflow-hidden">
                <ImageSlot
                  placeholder={`${project.location ?? "Recent work"}: ${project.title}`}
                  src={project.cardUrl ?? undefined}
                  alt={`${project.title}${project.location ? `, ${project.location}` : ""}`}
                  captionHidden
                />
              </div>
              <p className="mt-2.5 mb-0 text-[13px] text-migss-text/70">
                {project.location ?? project.title}
              </p>
            </li>
          ))}
        </ul>
        <p className={`${wrap} mt-3 mb-0 text-xs tracking-[0.06em] text-migss-accent-ink`}>
          Swipe to explore →
        </p>
      </section>

      {/* Why Migss, with finance as the fifth row */}
      <section id="why-migss" className={`${wrap} scroll-mt-20 pt-12`}>
        <p className={kicker}>Why Migss</p>
        <h2 className={h2}>One team, from first visit to handover</h2>
        <ul className="mt-5 list-none border-t border-[var(--migss-divider)] p-0">
          {WHY_MIGSS.map((row) => (
            <li key={row.title} className="border-b border-[var(--migss-divider)] py-4">
              <p className="m-0 mb-1 text-[15px] font-medium">{row.title}</p>
              <p className="m-0 text-sm leading-[1.6] text-migss-text/70">{row.body}</p>
            </li>
          ))}
          <li className="border-b border-[var(--migss-divider)] py-4">
            <p className="m-0 mb-1 text-[15px] font-medium">0% finance available</p>
            <p className="m-0 text-sm leading-[1.6] text-migss-text/70">
              0% finance available for up to 5 years. See{" "}
              <Link href={FINANCE_TERMS_HREF} className="text-migss-accent-ink">
                terms and conditions
              </Link>
              .
            </p>
          </li>
        </ul>
      </section>

      {/* Process */}
      <section id="process" className={`${wrap} scroll-mt-20 pt-12`}>
        <p className={kicker}>How it works</p>
        <h2 className={`${h2} mb-3`}>How your renovation runs</h2>
        <ToggleList
          numbered
          items={PROCESS_STEPS.map((stepItem) => ({ title: stepItem.title, body: stepItem.body }))}
        />
      </section>

      {/* Reviews */}
      <section id="reviews" className={`${wrap} scroll-mt-20 pt-12`}>
        <div {...DARK_BEHIND_HEADER} className="rounded-[4px] bg-migss-neutral-900 px-5 py-6.5">
          <div className="mb-3.5 flex items-baseline gap-2.5">
            <span className="font-heading text-[44px] leading-none text-migss-neutral-100">5.0</span>
            <span className="text-xs text-migss-neutral-400">Google rating</span>
          </div>
          <Testimonial {...second} dark />
        </div>
      </section>

      {/* Form */}
      <section id="book" className={`${wrap} scroll-mt-20 pt-6`}>
        <div className="rounded-[4px] bg-migss-surface px-4.5 py-6">
          <p className={kicker}>Book a design consultation</p>
          <LandingForm roomPlural={page.roomPlural} />
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className={`${wrap} scroll-mt-20 pt-10`}>
        <p className={kicker}>Questions</p>
        <h2 className={`${h2} mb-4`}>Before you book</h2>
        <ToggleList
          items={landingFaqs(page.room).map((faq) => ({ title: faq.q, body: faq.a }))}
        />
      </section>

      {/* Explore more */}
      <section id="explore" className={`${wrap} scroll-mt-20 pt-10`}>
        <p className={kicker}>Explore more</p>
        <h2 className={`${h2} mb-4`}>Looking for something else?</h2>
        <ul className="list-none border-t border-[var(--migss-divider)] p-0">
          {[
            { label: "Other rooms", text: page.otherRoom.label, href: page.otherRoom.href },
            { label: "Other locations", text: page.otherArea.label, href: page.otherArea.href },
            { label: "General advice", text: "Read our renovation guides", href: "/resources" },
          ].map((row) => (
            <li key={row.label} className="border-b border-[var(--migss-divider)]">
              <Link
                href={row.href}
                className="flex min-h-[64px] items-center gap-3.5 py-3.5 text-migss-text no-underline"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase">
                    {row.label}
                  </span>
                  <span className="font-heading mt-1 block text-[22px] leading-[1.2]">
                    {row.text}
                  </span>
                </span>
                <span aria-hidden="true" className="text-migss-accent-700">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Finance and closing CTA */}
      <section className={`${wrap} pt-10 pb-6`}>
        <div className="mb-6 rounded-[4px] bg-migss-surface px-4.5 py-5">
          <p className="m-0 mb-1.5 text-[15px] font-medium">0% finance available</p>
          <p className="m-0 mb-3 text-sm leading-[1.6] text-migss-text/70">
            0% finance available for up to 5 years. See{" "}
            <Link href={FINANCE_TERMS_HREF} className="text-migss-accent-ink">
              terms and conditions
            </Link>
            .
          </p>
          <Link
            href="/finance"
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-migss-accent-ink no-underline"
          >
            Find out more →
          </Link>
        </div>
        <a
          href="#book"
          className="font-heading flex min-h-[56px] items-center justify-center rounded-[4px] border border-migss-accent-700 bg-migss-accent-700 px-5 text-[17px] font-semibold text-migss-text no-underline"
        >
          Book a design consultation
        </a>
      </section>

      {/* Minimal footer: finance disclaimer and legal links only */}
      <footer {...DARK_BEHIND_HEADER} className="mt-6 bg-migss-neutral-900 text-migss-neutral-400">
        <div className={`${wrap} pt-6 pb-28 text-[11px] leading-[1.6]`}>
          <p className="m-0 mb-3">{FINANCE_DISCLAIMER}</p>
          <p className="m-0 flex gap-3.5">
            <Link href="/privacy-policy" className="text-migss-neutral-300">Privacy</Link>
            <Link href="/terms-of-use" className="text-migss-neutral-300">Terms</Link>
            <Link href="/labour-guarantee" className="text-migss-neutral-300">Labour guarantee</Link>
          </p>
        </div>
      </footer>

      <ProgressRail sections={RAIL_SECTIONS} heroId="lp-hero" />
    </main>
  );
}
