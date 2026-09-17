import type { Metadata } from "next";
import Link from "next/link";

import { ServiceCards } from "@/components/locations/service-cards";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Reveal } from "@/components/reveal";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LOCATIONS } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "The ten areas across East London and Essex where Migss Interiors renovates bathrooms, kitchens and whole homes.",
};

export default function LocationsPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Locations" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Ten areas · One team
          </p>
          <h1 className="mb-[18.4px] max-w-[23ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Where we work, and why we keep it close.
          </h1>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(14px,3vw,40px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              Every area below is within an hour of our Essex workshop. That is
              deliberate: it is how the same fitters, the same tiler and the
              same project manager stay on your job from first measure to final
              snag, and how we can be back the week after handover if anything
              needs adjusting.
            </p>
            <p className="text-sm leading-[1.8] text-migss-text/62">
              Pick your town for local project examples and the nearest
              completed work. Not on the list?{" "}
              <a href="#enquire" className="text-migss-accent-700">
                Ask us
              </a>{" "}
              — we will tell you honestly whether you are inside our range
              rather than quoting and hoping.
            </p>
          </div>
        </section>

        <section
          id="areas"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <h2 className="mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
            Service areas
          </h2>
          {/* auto-rows-fr sizes every row to the tallest card, so Theydon Bois
              wrapping to two lines does not make row 1 taller than the rest.
              Gated at 620px because that is where the auto-fit track first
              yields two columns — below it each card is its own row, and
              equalising would only add dead space on a phone. */}
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] border-t border-l border-[var(--migss-divider)] min-[620px]:auto-rows-fr">
            {LOCATIONS.map((location, index) => (
              <Reveal
                as="li"
                key={location.slug}
                delay={Math.min(index, 6) * 50}
                className="border-r border-b border-[var(--migss-divider)]"
              >
                <Link
                  href={`/locations/${location.slug}`}
                  className="group flex h-full min-h-[104px] items-start gap-3.5 p-[clamp(16px,2.6vw,22px)] text-inherit no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/7"
                >
                  <span className="font-heading pt-[5px] text-[13px] text-migss-accent-700 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1">
                    <span className="font-heading flex items-baseline gap-2 text-[27px] leading-[1.1] transition-colors duration-300 [@media(hover:hover)]:group-hover:text-migss-accent-700">
                      {location.name}
                      <span className="font-body text-xs tracking-[0.06em] text-migss-text/52">
                        {location.postcode}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-[13.5px] leading-[1.6] text-migss-text/68">
                      {location.summary}
                    </span>
                  </span>
                  <span className="mt-1 grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-migss-accent text-migss-accent-700 opacity-100 transition-[transform,opacity] duration-[350ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:opacity-45 [@media(hover:hover)]:group-hover:translate-x-1 [@media(hover:hover)]:group-hover:opacity-100">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-[clamp(32px,6.5vw,76px)] max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <ServiceCards
            heading="The same three services in every area"
            variant="hub"
          />
        </section>

        <EnquireBand
          heading="Tell us where you are."
          body="Two short steps. We reply the same working day, and we will say honestly whether you are inside our range."
          points={[
            "Free home visit, fixed written quote",
            "Photographs of nearby projects on request",
          ]}
        />
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
