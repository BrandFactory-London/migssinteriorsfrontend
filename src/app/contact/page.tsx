import type { Metadata } from "next";
import Link from "next/link";

import { EnquireBand } from "@/components/projects/enquire-band";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { COMPANY, SITE, mailHref, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, email or send an enquiry. Average response time under 20 minutes, Monday to Saturday, 8am to 6pm.",
};

const cardClass =
  "flex min-h-[120px] flex-col gap-2 border-r border-b border-[var(--migss-divider)] p-[clamp(16px,2.8vw,26px)] text-inherit no-underline transition-colors duration-300";
const linkCardClass = `${cardClass} focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/7`;
const labelClass =
  "flex items-center gap-2.5 text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink";

export default function ContactPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,64px)] pb-[clamp(20px,4vw,40px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Contact" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Mon–Sat, 8am–6pm
          </p>
          <h1 className="mb-[13.8px] max-w-[18ch] text-[clamp(38px,9vw,72px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Get in touch.
          </h1>
          <p className="max-w-[54ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-migss-text/80">
            Call, email, or send the form below, whichever is easiest. Average
            response time is under 20 minutes during working hours.
          </p>
        </section>

        <section
          id="details"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] border-t border-l border-[var(--migss-divider)]">
            <a href={telHref} className={linkCardClass}>
              <span className={labelClass}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7.2 3.5h-3a1.7 1.7 0 0 0-1.7 1.9c.6 5.3 3 9.6 7 12.9 2.1 1.7 4.2 2.7 6.2 3.1a1.7 1.7 0 0 0 1.9-1.7v-2.9a1.7 1.7 0 0 0-1.4-1.7l-2.5-.4a1.7 1.7 0 0 0-1.5.5l-.9.9a14.5 14.5 0 0 1-4.6-4.6l.9-.9a1.7 1.7 0 0 0 .5-1.5l-.4-2.5a1.7 1.7 0 0 0-1.7-1.4z" />
                </svg>
                Call us
              </span>
              <span className="font-heading text-[clamp(26px,6vw,32px)] leading-[1.1] tabular-nums">
                {SITE.phone}
              </span>
              <span className="text-[13.5px] leading-[1.6] text-migss-text/68">
                Monday to Saturday, 8am–6pm.
              </span>
            </a>

            <a href={mailHref} className={linkCardClass}>
              <span className={labelClass}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="5" width="18" height="14" rx="1.5" />
                  <path d="m3.5 6.5 8.5 6 8.5-6" />
                </svg>
                Email us
              </span>
              <span className="font-heading text-[clamp(21px,4.6vw,27px)] leading-[1.15] break-words">
                {SITE.email}
              </span>
              <span className="text-[13.5px] leading-[1.6] text-migss-text/68">
                Photographs and plans welcome. They speed up the quote.
              </span>
            </a>

            <div className={cardClass}>
              <span className={labelClass}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 10.2c0 5.3-7 10.8-7 10.8s-7-5.5-7-10.8a7 7 0 0 1 14 0z" />
                  <circle cx="12" cy="10" r="2.4" />
                </svg>
                Registered address
              </span>
              <address className="font-heading text-[clamp(19px,4.2vw,23px)] leading-[1.3] not-italic">
                {COMPANY.registeredName}
                {COMPANY.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <span className="text-[13.5px] leading-[1.6] text-migss-text/68">
                Visits by appointment.
              </span>
            </div>
          </div>

          <p className="mt-[13.8px] text-[13px] leading-[1.75] text-migss-text/60">
            Registered in England &amp; Wales. Company no. {COMPANY.number}.
          </p>
        </section>

        <EnquireBand
          kicker="Send an enquiry"
          heading="Two short steps, and we will call you back"
          body="Tell us where you are and roughly what you are planning. We reply the same working day and arrange a free home visit, usually within the week."
          points={[
            "Average response time under 20 minutes",
            "Free home visit, fixed written quote",
          ]}
        />

        <section
          id="areas"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-[18.4px] rounded-[4px] border border-[var(--migss-divider)] p-[clamp(18px,3.5vw,32px)]">
            <div>
              <h2 className="mb-2 text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
                Where we work
              </h2>
              {/* Deliberately a pointer to /locations rather than a second copy
                  of the area list, which lives on that page. */}
              <p className="text-[15px] leading-[1.75] text-migss-text/76">
                Ten areas across London and Essex, all within an hour of our
                Essex workshop, from{" "}
                <Link href="/locations" className="text-migss-accent-ink">
                  Wanstead and Woodford to Brentwood and Epping
                </Link>
                .
              </p>
            </div>
            <ButtonLink href="/locations" className="font-body font-medium">
              See all service areas →
            </ButtonLink>
          </div>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
