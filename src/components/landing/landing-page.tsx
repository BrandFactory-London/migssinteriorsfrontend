import {
  ArrowRight,
  BadgePercent,
  Check,
  ClipboardCheck,
  Clock,
  PencilRuler,
  Ruler,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { HeroMedia } from "@/components/hero-media";
import { Herringbone } from "@/components/landing/herringbone";
import { FeaturedProjectCard } from "@/components/projects/featured-project-card";
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
  CALLBACK_TIME,
  CONSULTANT_PHOTO,
  FINANCE_TERMS_HREF,
  GOOGLE_REVIEW_COUNT,
  type LandingPage as LandingPageData,
  landingFaqs,
  PROCESS_STEPS,
  RAIL_SECTIONS,
  type ShotRef,
  WHY_MIGSS,
} from "@/lib/landing-pages";
import { FINANCE_DISCLAIMER } from "@/lib/site";
import { cn } from "@/lib/utils";
import { getProjects, type Project } from "@/lib/wix/projects";

/*
 * The warmer layout (TKT-103, approved by Amir on the design canvas
 * "Migss landing page: warmer version", 14 Nov 2026):
 * - warm cream canvas (accent-100) and deeper cream panels (accent-200)
 *   in place of the cool greys, warm-brown overlays instead of charcoal;
 * - white cards with a soft warm shadow for everything you act on;
 * - photography carried down the page (Why Migss, a full-width band);
 * - calls to action after the projects and after Why Migss;
 * - the four steps shown open;
 * - on phones the form comes straight after the projects (flex order),
 *   while desktop keeps the reviews beside it lower down.
 */

/**
 * The landing pages' container: the header's own gutters (fluid on phones
 * and tablets, 50px on desktop) at any screen width, so the content lines
 * up with the logo and the menu icon instead of floating in a narrow column
 * on large screens.
 */
const gutter = "px-[clamp(16px,7.2vw,100px)] lg:px-[50px]";
const wrap = `mx-auto w-full ${gutter}`;
/** The hero keeps its original centred 1280px column (Amir, 15 Nov 2026). */
const heroWrap = "mx-auto w-full max-w-[1280px] px-[clamp(16px,4.5vw,48px)]";
const gap = "pt-[clamp(52px,8vw,112px)]";
const kicker =
  "m-0 text-[11px] font-semibold tracking-[0.18em] text-migss-accent-ink uppercase";
const h2 =
  "mt-2 mb-0 text-[clamp(32px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance";
const muted = "text-[#5f544b]";
const card =
  "rounded-[10px] bg-[#fffdfb] shadow-[0_1px_2px_rgba(114,84,59,0.06),0_20px_44px_-20px_rgba(114,84,59,0.3)]";
const cta =
  "font-heading inline-flex min-h-[56px] items-center justify-center gap-2.5 rounded-[6px] bg-migss-accent-ink px-7 text-[18px] font-semibold text-white no-underline shadow-[0_1px_2px_rgba(114,84,59,0.2),0_12px_26px_-12px_rgba(114,84,59,0.6)] transition-[background-color,transform] duration-200 active:scale-[0.98] [@media(hover:hover)]:hover:bg-migss-accent-900";
const espresso = "#2a1e16";

const WHY_ICONS: LucideIcon[] = [ClipboardCheck, Users, Ruler, PencilRuler];

/** Every project, and this page's hand-picked ones in config order. */
async function loadProjects(page: LandingPageData) {
  const all = await getProjects();
  const bySlug = new Map(all.map((project) => [project.slug, project]));
  const picked = page.projects
    .map((slug) => bySlug.get(slug))
    .filter((project): project is Project => Boolean(project));
  return { bySlug, picked };
}

/** A project's gallery photo by media id; null when either is missing. */
function shot(
  bySlug: Map<string, Project>,
  ref: ShotRef | undefined,
): { url: string; alt: string } | null {
  if (!ref) return null;
  const found = bySlug
    .get(ref.project)
    ?.gallery.find((photo) => photo.url.includes(ref.media));
  return found ? { url: found.url, alt: found.alt } : null;
}

function Stars({ size = 15 }: { size?: number }) {
  return (
    <p className="group m-0 flex gap-1 text-migss-accent-700" aria-label="Five stars">
      {[0, 1, 2, 3, 4].map((index) => (
        <MotionIcon key={index} motion="star" delay={index * 70}>
          <Star size={size} strokeWidth={2} fill="currentColor" />
        </MotionIcon>
      ))}
    </p>
  );
}

const ratingLabel =
  GOOGLE_REVIEW_COUNT !== null
    ? `from ${GOOGLE_REVIEW_COUNT} Google reviews`
    : "Google rating";

export async function LandingPage({ page }: { page: LandingPageData }) {
  const { bySlug, picked: projects } = await loadProjects(page);
  const [first, second] = page.testimonials;
  const whyPhoto = shot(bySlug, page.imagery?.why);
  const whyDetail = shot(bySlug, page.imagery?.whyDetail);
  const band = shot(bySlug, page.imagery?.band);
  const isBathroom = page.room === "Bathroom";

  const proof: { value: string; label: string; phone?: boolean }[] = [
    { value: "5.0", label: ratingLabel },
    { value: "2001", label: "Established", phone: !isBathroom },
    { value: "600+", label: "Projects completed" },
    { value: "10 years", label: "Labour guarantee" },
    ...(isBathroom
      ? [{ value: "2 to 4 weeks", label: "Most bathrooms, start to finish" }]
      : []),
  ];

  const firstCard = (
    <div
      className={cn(card, "overflow-hidden bg-[#fffaf5] text-migss-text")}
    >
      <div className="px-5 pt-5.5 pb-4.5 lg:px-7 lg:pt-7 lg:pb-6">
        <Stars />
        <p className="font-heading mt-3.5 mb-3.5 text-[22px] leading-[1.3] italic lg:text-[24px]">
          &ldquo;{first.quote}&rdquo;
        </p>
        <p className="m-0 text-[13px] text-[#6b5d51]">
          {first.name}, {first.area}
        </p>
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
    <main className="flex flex-col bg-migss-accent-100 text-migss-text">
      <EnquiryPageContext focus={isBathroom ? "bathroom" : "kitchen"} />

      {/* Hero: copy on the left; on desktop the first testimonial sits on
          the right so the proof is visible without scrolling. Shorter on
          phones so the proof strip clears the dock on first view. */}
      <section
        id="lp-hero"
        {...DARK_BEHIND_HEADER}
        className="relative order-1 flex min-h-[clamp(540px,76svh,820px)] items-end overflow-hidden lg:min-h-[clamp(560px,80svh,860px)]"
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
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(42,30,22,0.92)_0%,rgba(42,30,22,0.6)_42%,rgba(42,30,22,0.2)_100%)] lg:bg-[linear-gradient(to_right,rgba(42,30,22,0.86)_0%,rgba(42,30,22,0.6)_48%,rgba(42,30,22,0.22)_100%)]"
        />
        <div
          className={`relative z-2 ${heroWrap} grid items-center gap-12 pt-[clamp(112px,16vh,160px)] pb-[clamp(30px,7vw,88px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16`}
        >
          <div className="text-[#fbf6f1]">
            <p className="mb-4 flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.2em] text-[#e6cdb6] uppercase">
              <span className="block h-px w-[28px] bg-[#e6cdb6]" />
              {page.roomPlural} · {page.kicker ?? page.clusterLabel}
            </p>
            <h1 className="mb-4 max-w-[16ch] text-[clamp(38px,8.4vw,72px)] leading-[1.02] font-normal tracking-[-0.025em] text-balance">
              {page.headline}
            </h1>
            <p className="mb-6 max-w-[46ch] text-[clamp(15px,4vw,17px)] leading-[1.6] text-[#efe2d6]">
              {page.subline}
            </p>
            <a href="#book" className={`${cta} w-full sm:w-auto sm:min-w-[300px]`}>
              Book a design consultation
              <MotionIcon motion="nudge" className="hidden sm:inline-flex">
                <ArrowRight size={18} strokeWidth={2} />
              </MotionIcon>
            </a>
            <div className="mt-4.5 flex max-w-[46ch] items-center gap-3">
              {CONSULTANT_PHOTO ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={CONSULTANT_PHOTO}
                  alt=""
                  className="size-11 flex-none rounded-full border-2 border-[#fbf6f1] object-cover"
                />
              ) : null}
              <p className="m-0 text-[13px] leading-[1.5] text-[#e9dbcd]">
                A senior member of our team visits your home to talk through the
                space, the specification and timing. No obligation.
              </p>
            </div>
          </div>
          <div className="hidden lg:block">{firstCard}</div>
        </div>
      </section>

      {/* Proof strip */}
      <section className="order-2 bg-migss-accent-200">
        <dl
          className={cn(
            wrap,
            "my-0 grid grid-cols-2 gap-x-4 gap-y-4 py-5 lg:py-7",
            isBathroom ? "sm:grid-cols-5" : "sm:grid-cols-4",
          )}
        >
          {proof.map((item) => (
            <div
              key={item.label}
              className={cn("flex flex-col-reverse", item.phone === false && "hidden sm:flex")}
            >
              <dt className={cn("mt-1 text-xs lg:text-[13px]", muted)}>{item.label}</dt>
              <dd className="font-heading m-0 text-[clamp(26px,3.2vw,36px)] leading-none">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Testimonial 1 on phones and tablets (in the hero on desktop) */}
      <section className={`${wrap} order-3 pt-8 lg:hidden`}>
        <div className="max-w-[640px]">{firstCard}</div>
      </section>

      {/* Local projects: the homepage carousel, hand-picked per page */}
      <section id="projects" className={`relative isolate order-4 scroll-mt-24 ${gap}`}>
        <Herringbone width={760} height={400} className="top-0 right-0 h-[400px] w-[56%]" />
        <div className={wrap}>
          <p className={kicker}>
            {page.channel === "meta" ? "Our work" : "Recently completed nearby"}
          </p>
          <h2 className={h2}>{page.projectsHeading}</h2>
        </div>
        <ul
          className={cn(
            "migss-scroll mx-auto mt-8 flex list-none items-start gap-[clamp(14px,2vw,32px)] overflow-x-auto overscroll-x-contain scroll-p-[clamp(16px,7.2vw,100px)] lg:scroll-p-[50px] snap-x snap-proximity pt-1 pb-10",
            gutter,
          )}
          aria-label={page.projectsHeading}
        >
          {projects.length === 0
            ? [1, 2, 3].map((n) => (
                <li
                  key={n}
                  className={cn(
                    "w-[min(82vw,360px)] flex-none snap-start lg:w-auto lg:max-w-[600px] lg:flex-1",
                    n === 2 && "mt-[clamp(0px,4vw,44px)]",
                  )}
                >
                  <div className={cn(card, "relative aspect-[4/5] overflow-hidden")}>
                    <ImageSlot
                      placeholder={`[${page.clusterLabel ?? page.roomPlural} project ${n}: add in Wix Projects]`}
                    />
                  </div>
                </li>
              ))
            : null}
          {projects.map((project, index) => (
            <li
              key={project.slug}
              className={cn(
                "w-[min(82vw,360px)] flex-none snap-start",
                projects.length <= 3 && "lg:w-auto lg:max-w-[600px] lg:flex-1",
                index % 2 === 1 && "mt-[clamp(0px,4vw,44px)]",
              )}
            >
              <FeaturedProjectCard project={project} index={index} areaOnly raised />
            </li>
          ))}
        </ul>
        <p
          className={`${wrap} -mt-4 mb-0 flex items-center gap-1.5 text-xs tracking-[0.06em] text-migss-accent-ink ${projects.length <= 3 ? "lg:hidden" : ""}`}
        >
          Swipe to explore
          <MotionIcon motion="nudge">
            <ArrowRight size={14} strokeWidth={2} />
          </MotionIcon>
        </p>

        {/* Desktop: a nudge to book while the work is on screen. On phones
            the form itself comes next, so this is left out. */}
        <div className={`${wrap} mt-12 hidden lg:block`}>
          <div
            className={cn(
              card,
              "flex items-center justify-between gap-8 bg-[#fffaf5] px-9 py-7",
            )}
          >
            <div>
              <p className="font-heading m-0 text-[28px] leading-[1.15]">Like what you see?</p>
              <p className={cn("mt-1 mb-0 text-[15px]", muted)}>
                We&rsquo;ll visit your home, look at the space and talk you through
                what&rsquo;s possible.
              </p>
            </div>
            <a href="#book" className={cta}>
              Book a design consultation
            </a>
          </div>
        </div>
      </section>

      {/* Why Migss: a photo pair beside the reasons, when the page has photos */}
      <section
        id="why-migss"
        className={cn(
          wrap,
          gap,
          "relative isolate order-6 grid scroll-mt-24 items-center gap-10",
          whyPhoto && "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-[72px]",
        )}
      >
        <Herringbone width={560} height={540} seed={11} className="top-1/2 right-0 -mt-[270px] h-[540px] w-[42%]" />
        {whyPhoto ? (
          <div className="relative lg:mr-9 lg:mb-9">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={whyPhoto.url}
              alt={whyPhoto.alt}
              loading="lazy"
              className="h-[240px] w-full rounded-[12px] object-cover shadow-[0_30px_60px_-28px_rgba(42,30,22,0.55)] sm:h-[340px] lg:aspect-[4/5] lg:h-auto"
            />
            {whyDetail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={whyDetail.url}
                alt={whyDetail.alt}
                loading="lazy"
                className="absolute -right-9 -bottom-9 hidden aspect-square w-[46%] rounded-[10px] border-[6px] border-migss-accent-100 object-cover shadow-[0_20px_40px_-20px_rgba(42,30,22,0.55)] lg:block"
              />
            ) : null}
          </div>
        ) : null}
        <div>
          <p className={kicker}>Why Migss</p>
          <h2 className={h2}>One team, from first visit to handover</h2>
          <ul className="mt-7 flex list-none flex-col gap-5 p-0">
            {WHY_MIGSS.map((row, index) => {
              const Icon = WHY_ICONS[index] ?? ClipboardCheck;
              return (
                <li key={row.title} className="flex gap-4">
                  <span className="grid size-10 flex-none place-items-center rounded-full bg-[#f3e6da] text-migss-accent-ink">
                    <Icon size={19} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="m-0 text-[15.5px] font-semibold">{row.title}</p>
                    <p className={cn("mt-1 mb-0 text-[14.5px] leading-[1.55]", muted)}>
                      {row.body}
                    </p>
                  </div>
                </li>
              );
            })}
            <li className="flex gap-4">
              <span className="grid size-10 flex-none place-items-center rounded-full bg-[#f3e6da] text-migss-accent-ink">
                <BadgePercent size={19} strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <p className="m-0 text-[15.5px] font-semibold">0% finance available</p>
                <p className={cn("mt-1 mb-0 text-[14.5px] leading-[1.55]", muted)}>
                  0% finance available for up to 5 years. See{" "}
                  <Link href={FINANCE_TERMS_HREF} className="text-migss-accent-ink">
                    terms and conditions
                  </Link>
                  .
                </p>
              </div>
            </li>
          </ul>
          <a href="#book" className={`${cta} mt-8 w-full sm:w-auto`}>
            Book a design consultation
          </a>
        </div>
      </section>

      {/* How it works: the four steps, open */}
      <section id="process" className={`${wrap} ${gap} relative isolate order-7 scroll-mt-24`}>
        <Herringbone width={760} height={360} seed={19} className="top-0 right-0 h-[360px] w-[56%]" />
        <p className={kicker}>How it works</p>
        <h2 className={h2}>How your renovation runs</h2>
        <ol className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.title}
              className={cn(card, "flex gap-4 px-5 py-5 lg:flex-col lg:gap-0 lg:px-6 lg:pt-6.5 lg:pb-7")}
            >
              <span className="font-heading w-5 flex-none text-[32px] leading-none text-migss-accent-700 lg:w-auto lg:text-[40px]">
                {index + 1}
              </span>
              <div>
                <p className="m-0 text-[15.5px] font-semibold lg:mt-3.5">{step.title}</p>
                <p className={cn("mt-1 mb-0 text-[14px] leading-[1.55]", muted)}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* A full-width photograph before the reviews */}
      {band ? (
        <section
          {...DARK_BEHIND_HEADER}
          className="relative order-8 mt-[clamp(52px,8vw,112px)] h-[380px] overflow-hidden lg:h-[460px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={band.url}
            alt={band.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(42,30,22,0.82)_0%,rgba(42,30,22,0.18)_62%,rgba(42,30,22,0.05)_100%)]"
          />
          <div className={`${wrap} relative flex h-full flex-col justify-end pb-[clamp(28px,5vw,56px)] text-[#fbf6f1]`}>
            <p className="font-heading m-0 max-w-[24ch] text-[clamp(30px,4.2vw,46px)] leading-[1.1]">
              One team designs it, builds it and stands behind it for ten years.
            </p>
            <p className="mt-2.5 mb-0 text-[13px] text-[#e6cdb6]">{page.imagery?.band?.caption}</p>
          </div>
        </section>
      ) : null}

      {/* Reviews beside the form on desktop. On phones the pair dissolves
          (display: contents) so the form can sit straight after the
          projects and the full review after the photo band. */}
      <div
        className={`contents lg:relative lg:isolate lg:order-9 lg:mx-auto lg:grid lg:w-full lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start lg:gap-10 lg:px-[50px] lg:pt-[112px]`}
      >
        <Herringbone width={880} height={240} seed={23} className="top-[-40px] left-[18%] h-[240px] w-[64%]" />
        <section id="reviews" className={cn(wrap, "order-9 scroll-mt-24 pt-10 lg:sticky lg:top-28 lg:order-none lg:mx-0 lg:px-0 lg:pt-0")}>
          <div
            {...DARK_BEHIND_HEADER}
            className="relative overflow-hidden rounded-[12px] text-[#fbf6f1] shadow-[0_30px_60px_-30px_rgba(42,30,22,0.7)]"
            style={{ backgroundColor: espresso }}
          >
            {band ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={band.url}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.16]"
              />
            ) : null}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(160deg,rgba(90,64,46,0.5),rgba(42,30,22,0.94))]"
            />
            <div className="relative px-6 py-7 lg:px-10 lg:py-10">
              <div className="mb-5 flex items-baseline gap-2.5">
                <span className="font-heading text-[clamp(44px,4.4vw,56px)] leading-none">5.0</span>
                <span className="text-[13px] text-[#e6cdb6]">{ratingLabel}</span>
              </div>
              <p className="font-heading m-0 mb-4 text-[clamp(20px,1.8vw,22px)] leading-[1.4] italic">
                &ldquo;{second.quote}&rdquo;
              </p>
              <p className="m-0 text-[13px] text-[#e6cdb6]">
                {second.name}, {second.area}
              </p>
            </div>
          </div>
        </section>

        <section id="book" className={cn(wrap, "order-5 scroll-mt-24 pt-12 lg:order-none lg:mx-0 lg:px-0 lg:pt-0")}>
          <div className={cn(card, "px-5 py-6 lg:px-9 lg:py-9")}>
            <p className={kicker}>Book a design consultation</p>
            <LandingForm roomPlural={page.roomPlural} />
            <p className={cn("mt-4 mb-0 flex items-center justify-center gap-2 text-center text-[13.5px]", muted)}>
              <Clock size={16} strokeWidth={2} aria-hidden="true" className="flex-none text-migss-accent-ink" />
              {CALLBACK_TIME
                ? `We'll call you to arrange your visit, usually ${CALLBACK_TIME}.`
                : "We'll call you to arrange your visit."}
            </p>
            <div className="mt-6 border-t border-migss-accent-200 pt-5">
              <p className="m-0 text-[11.5px] font-semibold tracking-[0.14em] text-migss-accent-ink uppercase">
                At your consultation
              </p>
              <ul className="mt-2.5 mb-0 grid list-none gap-2 p-0 text-[14px] text-[#3d342d]">
                {[
                  "A senior member of our team visits your home",
                  "We talk through the space, the specification and timing",
                  "No obligation",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 flex-none text-migss-accent-ink" />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 mb-0 text-[12px] text-[#7a6c60]">
                We only use your details to arrange your consultation.{" "}
                <Link href="/privacy-policy" className="text-migss-accent-ink">
                  Privacy policy
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* FAQs and the explore strip, side by side on desktop */}
      <div className={`${wrap} ${gap} relative isolate order-10 grid gap-x-[clamp(40px,6vw,96px)] gap-y-[clamp(40px,7.5vw,96px)] lg:grid-cols-2`}>
        <Herringbone width={880} height={260} seed={29} className="top-[-40px] left-[18%] h-[260px] w-[64%]" />
        <section id="faqs" className="scroll-mt-24">
          <p className={kicker}>Questions</p>
          <h2 className={`${h2} mb-6`}>Before you book</h2>
          <div className={cn(card, "px-5 lg:px-6 [&>ul]:border-t-0 [&>ul>li:last-child]:border-b-0")}>
            <ToggleList
              items={landingFaqs(page.room).map((faq) => ({ title: faq.q, body: faq.a }))}
            />
          </div>
        </section>

        <section id="explore" className="scroll-mt-24">
          <p className={kicker}>Explore more</p>
          <h2 className={`${h2} mb-6`}>Looking for something else?</h2>
          <ul className="m-0 grid list-none gap-3 p-0">
            {[
              { label: "Other rooms", text: page.otherRoom.label, href: page.otherRoom.href },
              {
                label: page.otherArea.kicker ?? "Other locations",
                text: page.otherArea.label,
                href: page.otherArea.href,
              },
              { label: "General advice", text: "Read our renovation guides", href: "/resources" },
            ].map((row) => (
              <li key={row.label}>
                <Link
                  href={row.href}
                  className={cn(
                    card,
                    "group flex min-h-[72px] items-center gap-3.5 px-5 py-4 text-migss-text no-underline transition-transform duration-300 lg:px-6 [@media(hover:hover)]:hover:-translate-y-0.5",
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10.5px] font-semibold tracking-[0.16em] text-migss-accent-ink uppercase">
                      {row.label}
                    </span>
                    <span className="font-heading mt-1 block text-[22px] leading-[1.2]">
                      {row.text}
                    </span>
                  </span>
                  <MotionIcon motion="nudge" className="text-migss-accent-ink">
                    <ArrowRight size={20} strokeWidth={2} />
                  </MotionIcon>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Finance and the closing call to action */}
      <section className={`${wrap} ${gap} relative isolate order-11 pb-[clamp(48px,7vw,104px)]`}>
        <Herringbone width={880} height={240} seed={31} className="top-[-40px] left-[18%] h-[240px] w-[64%]" />
        <div className="grid items-center gap-6 rounded-[12px] bg-migss-accent-200 px-5 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-10 lg:px-10 lg:py-9">
          <div className="flex gap-4">
            <span className="hidden size-10 flex-none place-items-center rounded-full bg-[#fffaf5] text-migss-accent-ink sm:grid">
              <BadgePercent size={19} strokeWidth={2} aria-hidden="true" />
            </span>
            <div>
              <p className="font-heading m-0 mb-1.5 text-[26px] leading-[1.15]">0% finance available</p>
              <p className="m-0 mb-2.5 text-[14.5px] leading-[1.6] text-[#4d433b]">
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
          </div>
          <a href="#book" className={`${cta} w-full lg:w-auto lg:min-w-[320px]`}>
            Book a design consultation
          </a>
        </div>
      </section>

      {/* Minimal footer: finance disclaimer and legal links only */}
      <footer {...DARK_BEHIND_HEADER} className="order-12 bg-[#241a13] text-[#cbbcae]">
        <div className={`${wrap} pt-7 pb-28 text-[11.5px] leading-[1.6] lg:flex lg:items-start lg:justify-between lg:gap-12 lg:pb-24`}>
          <p className="m-0 mb-3 max-w-[90ch] lg:mb-0">{FINANCE_DISCLAIMER}</p>
          <p className="m-0 flex flex-none gap-3.5">
            <Link href="/privacy-policy" className="text-[#e6cdb6]">Privacy</Link>
            <Link href="/terms-of-use" className="text-[#e6cdb6]">Terms</Link>
            <Link href="/labour-guarantee" className="text-[#e6cdb6]">Labour guarantee</Link>
          </p>
        </div>
      </footer>

      <ProgressRail sections={RAIL_SECTIONS} heroId="lp-hero" />
    </main>
  );
}
