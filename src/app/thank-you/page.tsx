import type { Metadata } from "next";
import Link from "next/link";

import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { SITE, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry has been received.",
  // Only ever reached by redirect after a submission, so it should not be
  // indexed or turn up as a search result in its own right.
  robots: { index: false, follow: true },
};

const STEPS = [
  {
    title: "A quick call back",
    body: "Five minutes to understand the room, the timings and roughly what you had in mind.",
  },
  {
    title: "A free home visit",
    body: "Usually within the week, at a time that suits you. We measure up and talk budget openly.",
  },
  {
    title: "A fixed written quote",
    body: "Itemised, with no obligation and no follow-up calls you did not ask for.",
  },
];

const NEXT = [
  { href: "/renovation-services", kicker: "Services", title: "What we do" },
  { href: "/about", kicker: "About", title: "Who you will be working with" },
  { href: "/", kicker: "Home", title: "Back to the homepage" },
];

/**
 * Post-submission destination. Not linked from any navigation — it is reached
 * by redirect once the submission handler exists (Phase 4).
 *
 * Deliberately plain: no scroll reveals, no carousels, no client components of
 * its own. Its job is to load fast and fire cleanly as a conversion target, so
 * everything here is server-rendered and static.
 */
export default function ThankYouPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main className="mx-auto w-full max-w-[860px] flex-1 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,9vw,96px)] pb-[clamp(40px,8vw,80px)]">
        <span
          aria-hidden="true"
          className="grid h-[54px] w-[54px] place-items-center rounded-full border border-migss-accent text-migss-accent-700"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>

        <p className="mt-[18.4px] mb-[13.8px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
          Enquiry received
        </p>
        <h1 className="mb-[13.8px] text-[clamp(36px,8.5vw,64px)] leading-[1.02] font-normal tracking-[-0.03em] text-balance">
          Thank you — we have got it.
        </h1>
        <p className="mb-7 max-w-[52ch] text-[clamp(15px,4vw,18px)] leading-[1.7] text-pretty text-migss-text/80">
          A member of the team will call you back on the number you gave us. Our
          average response time is under 20 minutes during working hours —
          Monday to Saturday, 8am to 6pm. Enquiries sent overnight are answered
          first thing the next morning.
        </p>

        <ol className="mb-7 grid list-none border-t border-[var(--migss-divider)]">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-3.5 border-b border-[var(--migss-divider)] py-[18.4px]"
            >
              <span className="font-heading w-[2.2ch] flex-none pt-[3px] text-sm text-migss-accent-700 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="mb-1 text-xl leading-[1.2] font-normal">
                  {step.title}
                </h2>
                <p className="text-[14.5px] leading-[1.65] text-migss-text/72">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mb-7 flex flex-wrap gap-2.5">
          <ButtonLink
            href="/our-projects"
            className="font-body flex-[1_1_230px] font-medium"
          >
            Browse our projects while you wait
          </ButtonLink>
          <ButtonLink
            href={telHref}
            variant="secondary"
            className="font-body flex-[1_1_200px] font-medium"
          >
            Call us now on {SITE.phone}
          </ButtonLink>
        </div>

        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-2.5">
          {NEXT.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[88px] flex-col gap-1.5 rounded-[4px] border border-[var(--migss-divider)] p-[18.4px] text-inherit no-underline transition-[background-color,border-color] duration-300 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/6"
              >
                <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-700">
                  {item.kicker}
                </span>
                <span className="font-heading text-[21px] leading-[1.15]">
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
