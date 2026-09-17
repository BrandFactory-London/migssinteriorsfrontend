import { EnquiryForm } from "@/components/home/enquiry-form";
import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { Reveal } from "@/components/reveal";
import { AssuranceStrip } from "@/components/service/assurance-strip";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { Faq } from "@/components/service/faq";
import { ButtonLink } from "@/components/ui/button";
import { SITE, telHref } from "@/lib/site";
import {
  SERVICES,
  SERVICE_BLURB,
  TRUST,
  type Service,
} from "@/lib/services";

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
      className="flex-none"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * The shared layout behind /renovation-services/[bathroom|kitchen|interior].
 * All three artboards are the same page with different copy, so they are one
 * component driven by the data in lib/services.ts.
 */
export function ServicePage({ service }: { service: Service }) {
  return (
    <main id="top">
      {/* Hero */}
      <section className="relative flex min-h-[clamp(520px,82svh,900px)] items-end overflow-hidden">
        <div className="absolute inset-0">
          <ImageSlot placeholder={service.hero.imagePlaceholder} captionHidden />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_42%,color-mix(in_srgb,#2d2b2b_24%,transparent)_100%)]"
        />
        <div className="relative z-2 mx-auto w-full max-w-[1280px] animate-[migss-fade_0.6s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(96px,16vh,160px)] pb-[clamp(56px,8vw,96px)] text-migss-neutral-100">
          <div className="mb-[13.8px]">
            <Breadcrumb
              tone="light"
              items={[
                { href: "/", label: "Home" },
                { href: "/renovation-services", label: "Services" },
                { label: service.short },
              ]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
            <span className="block h-px w-[34px] bg-migss-accent-300" />
            {service.hero.kicker}
          </p>
          <h1 className="mb-[13.8px] max-w-[21ch] text-[clamp(38px,8.4vw,78px)] leading-none font-normal tracking-[-0.03em] text-balance">
            {service.hero.heading}
          </h1>
          <p className="mb-[18.4px] max-w-[48ch] text-[clamp(15px,4vw,17px)] leading-[1.65] text-migss-neutral-100/85">
            {service.hero.body}
          </p>
          <div className="flex max-w-[520px] flex-wrap gap-2.5">
            <ButtonLink
              href="#enquire"
              variant="contrast"
              className="font-body flex-[1_1_200px] font-medium"
            >
              {service.hero.cta}
            </ButtonLink>
            <ButtonLink
              href={telHref}
              variant="outlineLight"
              className="font-body flex-[1_1_200px] font-medium"
            >
              Book a Free Call Now
            </ButtonLink>
          </div>
          <p className="mt-[13.8px] text-[12.5px] text-migss-neutral-100/65">
            Free home visit. Fixed written quote. 0% finance over 5 years
            available.
          </p>
        </div>
      </section>

      <AssuranceStrip fourth={service.assurance4} />

      {/* Specification */}
      <section
        id="included"
        className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)]">
          <Reveal className="flex flex-col gap-[13.8px]">
            <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
              The specification
            </p>
            <h2 className="text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
              {service.spec.heading}
            </h2>
            <p className="max-w-[42ch] text-[15px] leading-[1.75] text-pretty text-migss-text/76">
              {service.spec.lead}
            </p>
            <div className="mt-1 aspect-[5/4]">
              <ImageSlot
                placeholder={service.spec.imagePlaceholder}
                shape="rounded"
                className="migss-plate"
              />
            </div>
            <ButtonLink
              href="#enquire"
              className="font-body min-h-[54px] text-sm font-medium"
            >
              {service.spec.cta}
            </ButtonLink>
          </Reveal>

          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] border-t border-l border-[var(--migss-divider)]">
            {service.spec.items.map((item, index) => (
              <Reveal
                as="li"
                key={item.n}
                delay={index * 50}
                className="flex flex-col gap-1.5 border-r border-b border-[var(--migss-divider)] p-[clamp(14px,2.4vw,20px)] transition-colors duration-300 [@media(hover:hover)]:hover:bg-migss-accent/6"
              >
                <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700 tabular-nums">
                  {item.n}
                </span>
                <h3 className="text-[19px] leading-[1.2] font-normal tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-[13.5px] leading-[1.6] text-migss-text/70">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Programme */}
      <section
        id="process"
        className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/45"
      >
        <div className="mx-auto max-w-[1280px] py-[clamp(28px,5.5vw,60px)]">
          <div className="flex flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-[9.2px] px-[clamp(16px,4.5vw,48px)]">
            <h2 className="text-[clamp(24px,5.6vw,34px)] leading-[1.1] font-normal tracking-[-0.02em]">
              {service.process.heading}
            </h2>
            <p className="text-[13px] text-migss-text/60">
              Swipe through the programme
            </p>
          </div>

          <ol
            className="migss-scroll mt-7 flex list-none items-start overflow-x-auto scroll-p-[clamp(16px,4.5vw,48px)] snap-x snap-proximity px-[clamp(16px,4.5vw,48px)]"
            aria-label={service.process.heading}
          >
            {service.process.steps.map((step, index) => (
              <Reveal
                as="li"
                key={`${step.when}-${step.title}`}
                delay={index * 70}
                className="w-[min(74vw,268px)] flex-none snap-start pr-[clamp(14px,2.5vw,28px)]"
              >
                <div className="mb-[13.8px] flex items-center gap-2">
                  <span className="block h-[9px] w-[9px] flex-none rounded-full border border-migss-accent bg-migss-bg" />
                  <span className="block h-px flex-1 bg-[var(--migss-divider)]" />
                </div>
                <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700 tabular-nums">
                  {step.when}
                </span>
                <h3 className="my-1.5 text-[21px] leading-[1.15] font-normal tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-migss-text/70">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section
        id="gallery"
        className="mx-auto max-w-[1280px] scroll-mt-20 pt-[clamp(36px,7.5vw,84px)]"
      >
        <div className="flex flex-wrap items-end justify-between gap-[13.8px] px-[clamp(16px,4.5vw,48px)]">
          <Reveal>
            <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
              {service.gallery.kicker}
            </p>
            <h2 className="text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
              {service.gallery.heading}
            </h2>
          </Reveal>
          <span className="flex items-center gap-2 text-[12.5px] text-migss-text/55">
            Swipe to explore
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <ul
          className="migss-scroll mt-7 flex list-none items-start gap-[clamp(14px,2.5vw,28px)] overflow-x-auto scroll-p-[clamp(16px,4.5vw,48px)] snap-x snap-proximity px-[clamp(16px,4.5vw,48px)] pb-[18.4px]"
          aria-label={service.gallery.heading}
        >
          {service.gallery.items.map((item, index) => (
            <Reveal
              as="li"
              key={item.placeholder}
              delay={index * 80}
              className="w-[min(82vw,360px)] flex-none snap-start"
            >
              <article className="group">
                <div className="relative aspect-[4/5]">
                  <ImageSlot
                    placeholder={item.placeholder}
                    shape="rounded"
                    className="migss-plate h-full w-full transition-transform duration-500 ease-out [@media(hover:hover)]:group-hover:scale-[1.02]"
                  />
                  <span className="absolute top-3 left-3 rounded-[2px] border border-[var(--migss-divider)] bg-migss-bg px-2.5 py-[5px] text-[10px] font-medium tracking-[0.14em] uppercase text-migss-accent-700">
                    {item.location}
                  </span>
                </div>
                <div className="mt-[13.8px] flex gap-3">
                  <span className="font-heading pt-1 text-[13px] text-migss-accent-700 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-[23px] font-normal tracking-[-0.01em]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-[1.65] text-migss-text/72">
                      {item.body}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Trust */}
      <section
        id="trust"
        className="mt-[clamp(30px,6vw,60px)] scroll-mt-20 bg-migss-neutral-900 text-migss-neutral-200"
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-start gap-[clamp(18px,3vw,40px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
          <Reveal>
            <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
              {TRUST.kicker}
            </p>
            <h2 className="mb-[13.8px] text-[clamp(28px,6.8vw,42px)] leading-[1.06] font-normal tracking-[-0.02em] text-migss-neutral-100">
              {TRUST.heading}
            </h2>
            <p className="text-[14.5px] leading-[1.8] text-pretty text-migss-neutral-400">
              {service.trust.lead}
            </p>
          </Reveal>

          {service.trust.cards.map((card, index) => (
            <Reveal
              key={card.title}
              delay={(index + 1) * 90}
              className="flex flex-col gap-2.5 rounded-[4px] border border-migss-accent-300/45 p-[18.4px]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-migss-accent-300)"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {index === 0 ? (
                  <>
                    <path d="M12 21s7-3.6 7-9V5.4L12 3 5 5.4V12c0 5.4 7 9 7 9z" />
                    <path d="m9 11.8 2.1 2.1L15 10" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 16 16 8" />
                    <circle cx="9.2" cy="9.2" r="1.6" />
                    <circle cx="14.8" cy="14.8" r="1.6" />
                  </>
                )}
              </svg>
              <h3 className="font-heading text-2xl font-normal text-migss-neutral-100">
                {card.title}
              </h3>
              <p className="text-sm leading-[1.7] text-migss-neutral-400">
                {card.body}
              </p>
            </Reveal>
          ))}

          <Reveal
            as="blockquote"
            delay={270}
            className="flex flex-col gap-[13.8px] border-l-2 border-migss-accent-400 pt-[9.2px] pl-[18.4px]"
          >
            <p className="font-heading text-[clamp(20px,5vw,26px)] leading-[1.3] italic text-migss-neutral-100">
              {service.trust.quote.text}
            </p>
            <footer className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-neutral-400">
              {service.trust.quote.source}
            </footer>
          </Reveal>
        </div>
      </section>

      <Faq kicker={service.faq.kicker} items={service.faq.items} />

      {/* Enquiry */}
      <section
        id="enquire"
        className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/60"
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
          <Reveal>
            <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
              {service.enquire.kicker}
            </p>
            <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
              {service.enquire.heading}
            </h2>
            <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
              {service.enquire.body}
            </p>
            <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-text/75">
              {service.enquire.points.map((point) => (
                <li key={point} className="flex items-center gap-2.5">
                  <Tick />
                  {point}
                </li>
              ))}
              <li className="flex items-center gap-2.5">
                <Tick />
                Or call us now on{" "}
                <a href={telHref} className="text-migss-accent-700">
                  {SITE.phone}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={90}>
            <EnquiryForm focus={service.slug} />
          </Reveal>
        </div>
      </section>

      {/* Cross-links */}
      <section
        id="also"
        className="mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
      >
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            You might also like
          </p>
          <h2 className="mb-7 text-[clamp(28px,6.8vw,42px)] leading-[1.05] font-normal tracking-[-0.02em]">
            While you are here
          </h2>
        </Reveal>

        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(14px,3vw,28px)]">
          {service.also.map((slug, index) => {
            const other = SERVICES[slug];
            return (
              <Reveal as="li" key={slug} delay={index * 90}>
                <Link
                  href={`/renovation-services/${slug}`}
                  className="group flex flex-col overflow-hidden rounded-[4px] border border-[var(--migss-divider)] text-inherit no-underline transition-[border-color,box-shadow] duration-[400ms] active:scale-[0.995] [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:shadow-migss-md"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:scale-105">
                      <ImageSlot
                        placeholder={`${other.title} cross-link image`}
                        captionHidden
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 p-[18.4px]">
                    <h3 className="text-[26px] font-normal tracking-[-0.01em]">
                      {other.title}
                    </h3>
                    <p className="text-sm leading-[1.65] text-migss-text/72">
                      {SERVICE_BLURB[slug]}
                    </p>
                    <span className="mt-1 text-sm font-medium text-migss-accent-700">
                      Explore {other.short.toLowerCase()} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
