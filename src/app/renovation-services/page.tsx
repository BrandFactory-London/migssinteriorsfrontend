import type { Metadata } from "next";

import { EnquiryForm } from "@/components/home/enquiry-form";
import { Reveal } from "@/components/reveal";
import { AssuranceStrip } from "@/components/service/assurance-strip";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { ServiceDoor } from "@/components/service/service-door";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SERVICE_ORDER } from "@/lib/services";
import { SITE, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Renovation Services",
  description:
    "Bathrooms, kitchens and whole-home interiors across London and Essex, designed, built and guaranteed by one team of directly employed tradespeople.",
};

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

/** The service door cards read HeroMedia. */
export const revalidate = 60;

export default function RenovationServicesPage() {
  return (
    <>
      {/* This page opens on the background colour rather than a hero image,
          so the header takes its solid treatment. */}
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(28px,7vw,76px)] pb-[clamp(24px,5vw,48px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[
                { href: "/", label: "Home" },
                { label: "Renovation Services" },
              ]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Three ways to work with us
          </p>
          <h1 className="mb-[18.4px] max-w-[24ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Choose the room. We handle everything inside it.
          </h1>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(14px,3vw,40px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              Bathrooms, kitchens and whole-home interiors, designed, built and
              guaranteed by one team of directly employed tradespeople. Same
              project manager from first measure to final snag, a fixed written
              quote before anyone lifts a tool, and a ten-year labour guarantee
              on the work itself.
            </p>
            <p className="text-sm leading-[1.8] text-migss-text/62">
              Not sure which you need? Most of our projects begin as one room
              and grow. Start with whichever is most urgent and we will tell you
              honestly what else is worth doing at the same time, and what is
              not.
            </p>
          </div>
        </section>

        <section
          id="services"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <ul className="flex list-none flex-col gap-[clamp(16px,3.5vw,32px)]">
            {SERVICE_ORDER.map((slug, index) => (
              <ServiceDoor key={slug} slug={slug} index={index} />
            ))}
          </ul>
        </section>

        <div className="mt-[clamp(32px,7vw,80px)]">
          <AssuranceStrip
            fourth="Aftercare Packages Available"
            overlap={false}
          />
        </div>

        <section
          id="enquire"
          className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/60"
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                Still deciding
              </p>
              <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
                Tell us the room. We will tell you the truth.
              </h2>
              <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
                A free home visit, a fixed written quote, and an honest view on
                what is worth spending and what is not. We reply the same
                working day.
              </p>
              <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-text/75">
                <li className="flex items-center gap-2.5">
                  <Tick />
                  Fixed written quote, no sales pressure
                </li>
                <li className="flex items-center gap-2.5">
                  <Tick />
                  0% interest over 5 years available
                </li>
                <li className="flex items-center gap-2.5">
                  <Tick />
                  Or call us now on{" "}
                  <a href={telHref} className="text-migss-accent-ink">
                    {SITE.phone}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={90}>
              {/* No pre-selected room: the visitor is still choosing. */}
              <EnquiryForm />
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
