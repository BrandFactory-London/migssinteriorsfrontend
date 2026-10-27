import { LocalProjects } from "@/components/locations/local-projects";
import { ServiceCards } from "@/components/locations/service-cards";
import { TownList } from "@/components/locations/town-list";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { type Cluster, clusterTowns } from "@/lib/locations";
import { getClusterProjects } from "@/lib/wix/projects";

/**
 * One cluster's hub: what Migss does there, its towns (core first, then any
 * surrounding areas), and the published work from anywhere in the cluster.
 * Sits between /locations and each town page.
 */
export async function ClusterPage({ cluster }: { cluster: Cluster }) {
  const { core, surrounding } = clusterTowns(cluster);
  const { projects, isLocal } = await getClusterProjects(
    [...core, ...surrounding].map((town) => town.name),
  );

  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[clamp(24px,3.4vw,38px)]">
            <Breadcrumb
              items={[
                { href: "/", label: "Home" },
                { href: "/locations", label: "Locations" },
                { label: cluster.shortName },
              ]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            {cluster.kicker}
          </p>
          <h1 className="mb-[18.4px] max-w-[23ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            {cluster.heading}
          </h1>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(14px,3vw,40px)] border-t border-[var(--migss-divider)] pt-[18.4px]">
            <p className="text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
              {cluster.intro[0]}
            </p>
            <p className="text-sm leading-[1.8] text-migss-text/62">
              {cluster.intro[1]}
            </p>
          </div>
        </section>

        <section
          id="areas"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <h2 className="mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
            Towns we specialise in
          </h2>
          <TownList towns={core} />

          {surrounding.length > 0 ? (
            <>
              <h2 className="mt-[clamp(28px,5vw,52px)] mb-[13.8px] text-[clamp(24px,5.6vw,32px)] leading-[1.1] font-normal tracking-[-0.02em]">
                Surrounding areas
              </h2>
              <TownList towns={surrounding} startAt={core.length + 1} />
            </>
          ) : null}
        </section>

        <LocalProjects
          town={cluster.shortName}
          projects={projects}
          isLocal={isLocal}
        />

        <section className="mx-auto mt-[clamp(32px,6.5vw,76px)] max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <ServiceCards
            heading={<>What we do across {cluster.shortName}</>}
            variant="hub"
          />
        </section>

        <EnquireBand
          heading="Tell us where you are."
          body="Two short steps. We reply the same working day to arrange a free home visit."
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
