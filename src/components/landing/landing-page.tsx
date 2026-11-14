import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

import { HeroMedia } from "@/components/hero-media";
import { MotionIcon } from "@/components/icons/motion-icon";
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

/** The site's container: 1280px max, the same fluid gutters as every page. */
const wrap = "mx-auto w-full max-w-[1280px] px-[clamp(16px,4.5vw,48px)]";
const gap = "pt-[clamp(40px,7.5vw,96px)]";
const kicker =
  "m-0 text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase";
const h2 =
  "mt-2 mb-0 text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance";
const cta =
  "font-heading flex min-h-[56px] items-center justify-center rounded-[4px] border border-migss-accent-700 bg-migss-accent-700 px-6 text-[17px] font-semibold text-migss-text no-underline transition-[color,background-color,border-color,transform] duration-200 active:scale-[0.98] [@media(hover:hover)]:hover:bg-migss-accent-800 [@media(hover:hover)]:hover:border-migss-accent-800";

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

  const firstCard = (
    <div className="overflow-hidden rounded-[4px] border border-[var(--migss-divider)] bg-migss-neutral-100 text-migss-text">
      <div className="px-5 pt-5.5 pb-4.5 lg:px-7 lg:pt-7 lg:pb-6">
        <p className="group m-0 mb-3 flex gap-1 text-migss-accent-700" aria-label="Five stars">
          {[0, 1, 2, 3, 4].map((index) => (
            <MotionIcon key={index} motion="star" delay={index * 70}>
              <Star size={15} strokeWidth={2} fill="currentColor" />
            </MotionIcon>
          ))}
        </p>
        <Testimonial {...first} />
      </div>
      <VideoStrip
        url={page.video.url}
        poster={page.video.poster}
        label={page.video.label}
        duration={page.video.duration}
      />
    </div>
  );

  return (
    <main>
      <EnquiryPageContext focus={page.room === "Bathroom" ? "bathroom" : "kitchen"} />

      {/* Hero: copy on the left; on desktop the first testimonial sits on
          the right so the proof is visible without scrolling. */}
      <section
        id="lp-hero"
        {...DARK_BEHIND_HEADER}
        className="relative flex min-h-[clamp(560px,88svh,880px)] items-end overflow-hidden"
      >
        <HeroMedia
          slotId={page.heroSlot}
          placeholder={page.heroPlaceholder}
          width={2400}
          height={1400}
          captionHidden
          parallax
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_42%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)] lg:bg-[linear-gradient(to_right,color-mix(in_srgb,#2d2b2b_82%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_55%,color-mix(in_srgb,#2d2b2b_30%,transparent)_100%)]"
        />
        <div
          className={`relative z-2 ${wrap} grid items-end gap-12 pt-[clamp(112px,16vh,160px)] pb-[clamp(40px,7vw,88px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`}
        >
          <div className="text-migss-neutral-100">
            <p className="mb-4 flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] text-migss-accent-300 uppercase">
              <span className="block h-px w-[34px] bg-migss-accent-300" />
              {page.roomPlural} · {page.clusterLabel}
            </p>
            <h1 className="mb-4 max-w-[16ch] text-[clamp(38px,8.4vw,78px)] leading-[0.98] font-normal tracking-[-0.03em] text-balance">
              {page.headline}
            </h1>
            <p className="mb-6 max-w-[46ch] text-[clamp(15px,4vw,17px)] leading-[1.65] text-migss-neutral-100/85">
              {page.subline}
            </p>
            <a href="#book" className={`${cta} w-full sm:w-auto sm:inline-flex sm:min-w-[300px]`}>
              Book a design consultation
            </a>
            <p className="mt-4 mb-0 max-w-[46ch] text-[12.5px] leading-[1.6] text-migss-neutral-100/65">
              A senior member of our team visits your home to talk through the
              space, the specification and timing.
            </p>
          </div>
          <div className="hidden lg:block">{firstCard}</div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="border-b border-[var(--migss-divider)] bg-migss-surface">
        <dl className={`${wrap} m-0 grid grid-cols-2 gap-x-3 gap-y-4 py-5 sm:grid-cols-4 lg:py-7`}>
          {PROOF.map((item) => (
            <div key={item.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-xs text-migss-text/70 lg:text-[13px]">{item.label}</dt>
              <dd className="font-heading m-0 text-[clamp(28px,3.4vw,40px)] leading-none">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Testimonial 1 on phones and tablets (in the hero on desktop) */}
      <section className={`${wrap} pt-10 lg:hidden`}>
        <div className="max-w-[640px]">{firstCard}</div>
      </section>

      {/* Local projects: a swipe rail on phones, a grid on desktop */}
      <section id="projects" className={`scroll-mt-24 ${gap}`}>
        <div className={wrap}>
          <p className={kicker}>Recently completed nearby</p>
          <h2 className={h2}>{page.projectsHeading}</h2>
        </div>
        <ul
          className={`${wrap} migss-scroll mt-6 flex list-none snap-x snap-proximity gap-3 overflow-x-auto overscroll-x-contain pb-2 lg:mt-8 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0`}
          aria-label={page.projectsHeading}
        >
          {projects.length === 0
            ? [1, 2, 3].map((n) => (
                <li key={n} className="w-[min(72vw,260px)] flex-none snap-start lg:w-auto">
                  <div className="migss-plate relative aspect-[4/5] overflow-hidden lg:aspect-[4/3]">
                    <ImageSlot
                      placeholder={`[${page.clusterLabel} project ${n}: add in Wix Projects]`}
                    />
                  </div>
                </li>
              ))
            : null}
          {projects.map((project) => (
            <li key={project.slug} className="w-[min(72vw,260px)] flex-none snap-start lg:w-auto">
              <div className="migss-plate relative aspect-[4/5] overflow-hidden lg:aspect-[4/3]">
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
        <p className={`${wrap} mt-3 mb-0 flex items-center gap-1.5 text-xs tracking-[0.06em] text-migss-accent-ink lg:hidden`}>
          Swipe to explore
          <MotionIcon motion="nudge">
            <ArrowRight size={14} strokeWidth={2} />
          </MotionIcon>
        </p>
      </section>

      {/* Why Migss and the process, side by side on desktop */}
      <div className={`${wrap} ${gap} grid gap-x-[clamp(40px,6vw,96px)] gap-y-[clamp(40px,7.5vw,96px)] lg:grid-cols-2`}>
        <section id="why-migss" className="scroll-mt-24">
          <p className={kicker}>Why Migss</p>
          <h2 className={h2}>One team, from first visit to handover</h2>
          <ul className="mt-6 list-none border-t border-[var(--migss-divider)] p-0">
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

        <section id="process" className="scroll-mt-24">
          <p className={kicker}>How it works</p>
          <h2 className={`${h2} mb-6`}>How your renovation runs</h2>
          <ToggleList
            numbered
            items={PROCESS_STEPS.map((stepItem) => ({ title: stepItem.title, body: stepItem.body }))}
          />
        </section>
      </div>

      {/* Reviews beside the form on desktop: proof at the decision point */}
      <div className={`${wrap} ${gap} grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8`}>
        <section id="reviews" className="scroll-mt-24 lg:sticky lg:top-28">
          <div {...DARK_BEHIND_HEADER} className="rounded-[4px] bg-migss-neutral-900 px-5 py-6.5 lg:px-8 lg:py-9">
            <div className="mb-4 flex items-baseline gap-2.5">
              <span className="font-heading text-[clamp(44px,4.4vw,60px)] leading-none text-migss-neutral-100">5.0</span>
              <span className="text-xs text-migss-neutral-400">Google rating</span>
            </div>
            <Testimonial {...second} dark />
          </div>
        </section>

        <section id="book" className="scroll-mt-24">
          <div className="rounded-[4px] bg-migss-surface px-4.5 py-6 lg:px-9 lg:py-9">
            <p className={kicker}>Book a design consultation</p>
            <LandingForm roomPlural={page.roomPlural} />
          </div>
        </section>
      </div>

      {/* FAQs and the explore strip, side by side on desktop */}
      <div className={`${wrap} ${gap} grid gap-x-[clamp(40px,6vw,96px)] gap-y-[clamp(40px,7.5vw,96px)] lg:grid-cols-2`}>
        <section id="faqs" className="scroll-mt-24">
          <p className={kicker}>Questions</p>
          <h2 className={`${h2} mb-6`}>Before you book</h2>
          <ToggleList
            items={landingFaqs(page.room).map((faq) => ({ title: faq.q, body: faq.a }))}
          />
        </section>

        <section id="explore" className="scroll-mt-24">
          <p className={kicker}>Explore more</p>
          <h2 className={`${h2} mb-6`}>Looking for something else?</h2>
          <ul className="list-none border-t border-[var(--migss-divider)] p-0">
            {[
              { label: "Other rooms", text: page.otherRoom.label, href: page.otherRoom.href },
              { label: "Other locations", text: page.otherArea.label, href: page.otherArea.href },
              { label: "General advice", text: "Read our renovation guides", href: "/resources" },
            ].map((row) => (
              <li key={row.label} className="border-b border-[var(--migss-divider)]">
                <Link
                  href={row.href}
                  className="group flex min-h-[64px] items-center gap-3.5 py-3.5 text-migss-text no-underline"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium tracking-[0.18em] text-migss-accent-ink uppercase">
                      {row.label}
                    </span>
                    <span className="font-heading mt-1 block text-[22px] leading-[1.2]">
                      {row.text}
                    </span>
                  </span>
                  <MotionIcon motion="nudge" className="text-migss-accent-700">
                    <ArrowRight size={20} strokeWidth={2} />
                  </MotionIcon>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Finance and the closing call to action */}
      <section className={`${wrap} ${gap} pb-6`}>
        <div className="grid items-center gap-6 rounded-[4px] bg-migss-surface px-4.5 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:px-9 lg:py-8">
          <div>
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
              className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-migss-accent-ink no-underline"
            >
              Find out more
              <MotionIcon motion="nudge">
                <ArrowRight size={16} strokeWidth={2} />
              </MotionIcon>
            </Link>
          </div>
          <a href="#book" className={`${cta} w-full lg:w-auto lg:min-w-[320px]`}>
            Book a design consultation
          </a>
        </div>
      </section>

      {/* Minimal footer: finance disclaimer and legal links only */}
      <footer {...DARK_BEHIND_HEADER} className="mt-[clamp(40px,6vw,72px)] bg-migss-neutral-900 text-migss-neutral-400">
        <div className={`${wrap} pt-7 pb-28 text-[11px] leading-[1.6] lg:flex lg:pb-24 lg:items-start lg:justify-between lg:gap-12`}>
          <p className="m-0 mb-3 max-w-[90ch] lg:mb-0">{FINANCE_DISCLAIMER}</p>
          <p className="m-0 flex flex-none gap-3.5">
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
