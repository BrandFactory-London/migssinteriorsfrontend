import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { CLUSTERS, clusterTowns } from "@/lib/locations";

/**
 * The two clusters Migss specialises in, each with its core towns. Reads
 * CLUSTERS so the homepage, hub and schema never disagree about the list.
 */
export function Areas() {
  return (
    <section
      id="areas"
      className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/50"
    >
      <div className="mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
        <Reveal className="mb-[clamp(20px,3.5vw,40px)] max-w-[62ch]">
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            Areas we specialise in
          </p>
          <h2 className="mb-[13.8px] text-[clamp(28px,6.8vw,42px)] leading-[1.06] font-normal tracking-[-0.02em]">
            North London &amp; Chigwell, inside out
          </h2>
          <p className="mb-[13.8px] text-[15px] leading-[1.75] text-pretty text-migss-text/78">
            Migss Interiors designs and builds high-end bathrooms, kitchens and
            interiors for homes across north London and the Essex borders, from
            Hampstead and Highgate to Chigwell and Epping. We work alongside
            interior designers and luxury showrooms in both areas, and every
            project is run by our own tradespeople, documented and published,
            so you can see exactly how we work before you call.
          </p>
          <p className="text-[13px] leading-[1.75] text-migss-text/62">
            Not listed?{" "}
            <a
              href="#enquire"
              className="text-migss-accent-ink underline-offset-[3px]"
            >
              Ask us
            </a>{" "}
            and we will tell you honestly whether we can take your project on.
          </p>
        </Reveal>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(20px,3.5vw,52px)]">
          {CLUSTERS.map((cluster, clusterIndex) => {
            const { core } = clusterTowns(cluster);
            return (
              <Reveal key={cluster.slug} delay={clusterIndex * 90}>
                <Link
                  href={`/locations/${cluster.slug}`}
                  className="group mb-1 flex items-baseline justify-between gap-3 border-b border-migss-text/40 pb-2.5 text-inherit no-underline"
                >
                  <span className="font-heading text-[22px] leading-[1.15] transition-colors [@media(hover:hover)]:group-hover:text-migss-accent-ink">
                    {cluster.name}
                  </span>
                  <span className="text-xs text-migss-accent-ink">View →</span>
                </Link>
                <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-x-[clamp(16px,3vw,32px)]">
                  {core.map((town) => (
                    <li key={town.slug}>
                      <Link
                        href={`/locations/${town.slug}`}
                        className="flex min-h-[48px] items-center justify-between gap-2 border-b border-[var(--migss-divider)] px-0.5 text-[15px] text-inherit no-underline transition-colors [@media(hover:hover)]:hover:text-migss-accent-ink"
                      >
                        {town.name}
                        <span className="text-xs text-migss-accent-ink">
                          {town.postcode}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
