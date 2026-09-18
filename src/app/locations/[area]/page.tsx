import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ImageSlot } from "@/components/image-slot";
import { LocalProjects } from "@/components/locations/local-projects";
import { ServiceCards } from "@/components/locations/service-cards";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Reveal } from "@/components/reveal";
import { AssuranceStrip } from "@/components/service/assurance-strip";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button";
import { LOCATIONS, getLocation } from "@/lib/locations";
import { getTownProjects } from "@/lib/wix/projects";
import { telHref } from "@/lib/site";

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return LOCATIONS.map(({ slug }) => ({ area: slug }));
}

/** Only the ten areas we cover; anything else is a genuine 404. */
export const dynamicParams = false;

/** The nearby-work rail reads the live portfolio. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const location = getLocation(area);
  if (!location) return { title: "Area not found" };

  return {
    title: `Renovation in ${location.name}`,
    description: location.heroLead,
  };
}

export default async function LocationDetailPage({ params }: Props) {
  const { area } = await params;
  const location = getLocation(area);

  if (!location) notFound();

  const { projects, isLocal } = await getTownProjects(location.name);
  const facts = [
    { label: "Postcodes", value: location.postcodes },
    { label: "From our workshop", value: location.travel },
    { label: "Projects completed", value: location.projectCount },
    { label: "Consultation", value: "Within the week" },
  ];

  return (
    <>
      <SiteHeader />

      <main id="top">
        <section className="relative flex min-h-[clamp(460px,72svh,800px)] items-end overflow-hidden">
          <div className="absolute inset-0">
            <ImageSlot
              placeholder={`Hero: recent project in ${location.name}, wide shot`}
              captionHidden
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_52%,transparent)_44%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)]"
          />
          <div className="relative z-2 mx-auto w-full max-w-[1280px] animate-[migss-fade_0.6s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(96px,16vh,150px)] pb-[clamp(44px,7vw,80px)] text-migss-neutral-100">
            <div className="mb-[13.8px]">
              <Breadcrumb
                tone="light"
                items={[
                  { href: "/", label: "Home" },
                  { href: "/locations", label: "Locations" },
                  { label: location.name },
                ]}
              />
            </div>
            <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
              <span className="block h-px w-[34px] bg-migss-accent-300" />
              {location.kicker}
            </p>
            <h1 className="mb-[13.8px] max-w-[21ch] text-[clamp(36px,8.4vw,74px)] leading-none font-normal tracking-[-0.03em] text-balance">
              {location.heading}
            </h1>
            <p className="mb-[18.4px] max-w-[48ch] text-[clamp(15px,4vw,17px)] leading-[1.65] text-migss-neutral-100/85">
              {location.heroLead}
            </p>
            <div className="flex max-w-[520px] flex-wrap gap-2.5">
              <ButtonLink
                href="#enquire"
                variant="contrast"
                className="font-body flex-[1_1_200px] font-medium"
              >
                Book a free local visit
              </ButtonLink>
              <ButtonLink
                href={telHref}
                variant="outlineLight"
                className="font-body flex-[1_1_200px] font-medium"
              >
                Book a Free Call Now
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="relative z-3 mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <dl className="mt-[clamp(-46px,-3.5vw,-30px)] grid grid-cols-[repeat(auto-fit,minmax(min(50%,170px),1fr))] border-t border-l border-[var(--migss-divider)] bg-migss-bg shadow-migss-md">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="border-r border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,24px)] py-[18.4px]"
              >
                <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                  {fact.label}
                </dt>
                <dd className="font-heading mt-1.5 text-[21px] tabular-nums">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          id="local"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)]">
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
                Working in {location.name}
              </p>
              <h2 className="mb-[13.8px] text-[clamp(27px,6.4vw,40px)] leading-[1.08] font-normal tracking-[-0.02em]">
                {location.localHeading}
              </h2>
              {location.localCopy.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82 last:mb-0"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal delay={90} className="flex flex-col gap-[18.4px]">
              <div className="aspect-[4/3]">
                <ImageSlot
                  placeholder={`${location.name} project detail shot`}
                  shape="rounded"
                  className="migss-plate"
                />
              </div>
              <ul className="grid list-none">
                {location.localFacts.map((fact, index) => (
                  <li
                    key={fact.label}
                    className={`flex justify-between gap-3 border-t border-[var(--migss-divider)] px-0.5 py-[13px] text-[14.5px] ${
                      index === location.localFacts.length - 1
                        ? "border-b border-b-[var(--migss-divider)]"
                        : ""
                    }`}
                  >
                    <span className="text-migss-text/62">{fact.label}</span>
                    <span className="text-right">{fact.value}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <LocalProjects
          town={location.name}
          projects={projects}
          isLocal={isLocal}
        />

        <div className="mt-[clamp(10px,2vw,24px)]">
          <AssuranceStrip
            fourth={`${location.travel} from our workshop`}
            overlap={false}
          />
        </div>

        <section className="mx-auto mt-[clamp(32px,6.5vw,76px)] max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
          <Reveal
            as="blockquote"
            className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] items-center gap-[clamp(16px,3vw,40px)] border-t border-[var(--migss-divider)] pt-7"
          >
            <p className="font-heading text-[clamp(22px,5.4vw,32px)] leading-[1.28] italic">
              {location.quote.text}
            </p>
            <footer className="flex flex-col gap-2">
              <span
                className="flex gap-1 text-migss-accent"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <svg
                    key={index}
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
                  </svg>
                ))}
              </span>
              <span className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-text/60">
                {location.quote.source}
              </span>
            </footer>
          </Reveal>
        </section>

        <EnquireBand
          heading={<>Book a free consultation in {location.name}</>}
          body="Your town is already filled in. Add your details and we will call you back the same working day to arrange a visit, usually within the week."
          points={[
            "Free home visit, fixed written quote",
            "Photographs of nearby projects on request",
          ]}
          town={`${location.name}, ${location.postcode}`}
        />

        <section
          id="next"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <ServiceCards
            heading={<>What we do in {location.name}</>}
            variant="detail"
          />
          <Link
            href="/locations"
            className="mt-[18.4px] flex min-h-[56px] items-center justify-between gap-3 rounded-[4px] border border-[var(--migss-divider)] px-[18.4px] text-[15px] text-inherit no-underline transition-colors duration-300 [@media(hover:hover)]:hover:border-migss-accent"
          >
            <span>See all ten areas we cover</span>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="flex-none text-migss-accent-700"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
