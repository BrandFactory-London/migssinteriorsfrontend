import Link from "next/link";

import { ServiceCards } from "@/components/locations/service-cards";
import { TownList } from "@/components/locations/town-list";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";
import { CLUSTERS, clusterTowns } from "@/lib/locations";

export async function generateMetadata() {
  const image = await ogImage("location-hero-chigwell");

  return pageMetadata({
    title: "Areas We Cover | High-End Renovation in North London & Chigwell",
    description:
      "Migss Interiors specialises in two areas: north London and its suburbs, from Hampstead to Cockfosters, and Chigwell with the east London and Essex forest towns.",
    path: "/locations",
    image: image?.url,
    imageAlt: image?.alt,
  });
}
export default function LocationsPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[clamp(24px,3.4vw,38px)]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "Locations" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Two specialist areas · One team
          </p>
          <h1 className="mb-[18.4px] max-w-[23ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            Two areas we know inside out.
          </h1>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(14px,3vw,40px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              We specialise in two clusters: north London and its suburbs, and
              Chigwell with the east London and Essex forest towns. We work
              alongside the interior designers and luxury showrooms in both,
              and the same fitters, tiler and project manager stay on your job
              from first measure to final snag.
            </p>
            <p className="text-sm leading-[1.8] text-migss-text/62">
              Pick your town for local project examples and the nearest
              completed work. Not on the list?{" "}
              <a href="#enquire" className="text-migss-accent-ink">
                Ask us
              </a>{" "}
              and we will tell you honestly whether you are inside our range
              rather than quoting and hoping.
            </p>
          </div>
        </section>

        <section
          id="areas"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          {CLUSTERS.map((cluster, clusterIndex) => {
            const { core, surrounding } = clusterTowns(cluster);
            return (
              <div
                key={cluster.slug}
                className={clusterIndex > 0 ? "mt-[clamp(32px,6vw,64px)]" : ""}
              >
                <div className="mb-[13.8px] flex flex-wrap items-baseline justify-between gap-x-[18.4px] gap-y-1.5">
                  <h2 className="text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
                    {cluster.name}
                  </h2>
                  <Link
                    href={`/locations/${cluster.slug}`}
                    className="text-sm font-medium text-migss-accent-ink no-underline"
                  >
                    About this area →
                  </Link>
                </div>
                <TownList towns={core} />
                {surrounding.length > 0 ? (
                  <>
                    <p className="mt-[18.4px] mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-text/60">
                      Surrounding areas
                    </p>
                    <TownList towns={surrounding} startAt={core.length + 1} />
                  </>
                ) : null}
              </div>
            );
          })}
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
