import type { Metadata } from "next";
import Link from "next/link";

import { ImageSlot } from "@/components/image-slot";
import { EnquireBand } from "@/components/projects/enquire-band";
import { Reveal } from "@/components/reveal";
import { AssuranceStrip } from "@/components/service/assurance-strip";
import { Breadcrumb } from "@/components/service/breadcrumb";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "Twenty-five years renovating bathrooms, kitchens and whole homes across London and Essex, with our own tradespeople, one fixed price and one project manager.",
};

const PRINCIPLES = [
  {
    title: "Our own trades",
    body: "Fitters, tilers, carpenters and electricians on our payroll. No day-rate strangers, no guarantee that belongs to someone else.",
  },
  {
    title: "One fixed price",
    body: "Written, itemised and agreed before we start. Variations only happen if you ask for them, and always in writing first.",
  },
  {
    title: "One project manager",
    body: "The same person from survey to handover, on site weekly, reachable directly, plus the MD's number behind them.",
  },
  {
    title: "We leave it clean",
    body: "Dust screens, protected routes, site cleared every evening, and a proper builder's clean before we hand the keys back.",
  },
];

const STATS = [
  { label: "Projects completed", value: "600+" },
  { label: "Years trading", value: "25" },
  { label: "Google rating", value: "5.0" },
  { label: "Work from referral", value: "70%" },
];

const NEXT = [
  {
    href: "/our-projects",
    kicker: "Portfolio",
    title: "Our Projects",
    body: "Finished work, photographed the week we handed it over.",
  },
  {
    href: "/renovation-services",
    kicker: "Services",
    title: "Renovation Services",
    body: "Bathrooms, kitchens and whole-home interiors.",
  },
  {
    href: "/locations",
    kicker: "Areas",
    title: "Locations",
    body: "The ten areas we cover across London and Essex.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader variant="solid" />

      <main id="top">
        <section className="mx-auto max-w-[1280px] animate-[migss-fade_0.5s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(26px,6vw,68px)] pb-[clamp(22px,4.5vw,44px)]">
          <div className="mb-[18.4px]">
            <Breadcrumb
              items={[{ href: "/", label: "Home" }, { label: "About" }]}
            />
          </div>
          <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            <span className="block h-px w-[34px] bg-migss-accent" />
            Est. 2001 · London &amp; Essex
          </p>
          <h1 className="mb-[18.4px] max-w-[21ch] text-[clamp(38px,9vw,76px)] leading-none font-normal tracking-[-0.03em] text-balance">
            A builder you can ring, not a company you have to chase.
          </h1>
          <p className="max-w-[62ch] text-[clamp(15px,4vw,17.5px)] leading-[1.75] text-pretty text-migss-text/80">
            Migss Interiors has renovated bathrooms, kitchens and whole homes
            across London and Essex for twenty-five years. We are not a
            franchise and not a sales operation with a build team bolted on. We
            are tradespeople who employ tradespeople, and the same names turn up
            on your job from the first measure to the final snag.
          </p>
        </section>

        <section
          id="md"
          className="scroll-mt-20 bg-migss-neutral-900 text-migss-neutral-200"
        >
          <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
            <Reveal className="aspect-[4/5] max-h-[560px]">
              <ImageSlot
                placeholder="Portrait: Managing Director on site"
                src="/Brand/headshot-portrait.jpg"
                alt="The Managing Director of Migss Interiors"
                shape="rounded"
                className="migss-plate"
              />
            </Reveal>

            <Reveal delay={90}>
              <p className="mb-[13.8px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
                From the Managing Director
              </p>
              <blockquote className="mb-[18.4px] border-l-2 border-migss-accent-400 pl-[18.4px]">
                <p className="font-heading text-[clamp(22px,5.4vw,32px)] leading-[1.28] italic text-migss-neutral-100">
                  &ldquo;Every client gets my personal number. If something goes
                  wrong at seven on a Friday, you should be able to ring the
                  person who can actually fix it.&rdquo;
                </p>
              </blockquote>
              <p className="mb-[13.8px] text-[15px] leading-[1.8] text-pretty text-migss-neutral-400">
                That is not a slogan: it is the reason the business is the size
                it is. I started out fitting bathrooms myself, and the thing
                that made people recommend us was never the marble. It was that
                somebody picked up the phone, told the truth about what was
                going wrong, and came back to sort it.
              </p>
              <p className="text-[15px] leading-[1.8] text-pretty text-migss-neutral-400">
                So we employ our own fitters rather than subcontracting the work
                out, we quote a fixed price in writing before anyone lifts a
                tool, and we guarantee the labour for ten years. If we cannot do
                that honestly on your project, we will say so and recommend
                someone who can.
              </p>
            </Reveal>
          </div>
        </section>

        <section
          id="principles"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <Reveal>
            <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
              How we work
            </p>
            <h2 className="mb-7 max-w-[20ch] text-[clamp(28px,6.8vw,44px)] leading-[1.05] font-normal tracking-[-0.02em]">
              Four things we will not compromise on.
            </h2>
          </Reveal>

          <ol className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-[clamp(14px,2.5vw,28px)]">
            {PRINCIPLES.map((principle, index) => (
              <Reveal as="li" key={principle.title} delay={index * 80}>
                <span className="font-heading text-[13px] text-migss-accent-ink tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1.5 mb-1.5 text-[22px] leading-[1.15] font-normal">
                  {principle.title}
                </h3>
                <p className="text-[14.5px] leading-[1.65] text-migss-text/72">
                  {principle.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section
          id="numbers"
          className="mx-auto mt-[clamp(32px,6.5vw,76px)] max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)]"
        >
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)]">
            <Reveal>
              <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
                Twenty-five years
              </p>
              <h2 className="mb-[13.8px] text-[clamp(27px,6.4vw,40px)] leading-[1.08] font-normal tracking-[-0.02em]">
                Long enough to have made every mistake once.
              </h2>
              <p className="mb-[13.8px] text-[15.5px] leading-[1.8] text-pretty text-migss-text/82">
                Most of what we do well now is the result of something that went
                wrong years ago: a stone delivery that arrived mid-job, a wet
                room that was tanked in a hurry, a client who found out about a
                delay a week too late. The programme we run today exists to make
                those things structurally impossible rather than unlikely.
              </p>
              <p className="text-[15.5px] leading-[1.8] text-pretty text-migss-text/82">
                It is also why our aftercare is a service and not a formality.
                Houses move, sealant ages and things need adjusting in the first
                year. We would rather come back and sort it than have you living
                with it.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(50%,150px),1fr))] gap-px border-t border-l border-[var(--migss-divider)]">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="border-r border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,22px)] py-[18.4px]"
                  >
                    <dt className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-text/55">
                      {stat.label}
                    </dt>
                    <dd className="font-heading mt-1.5 text-[clamp(28px,7vw,40px)] leading-none tabular-nums">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        <div className="mt-[clamp(32px,6.5vw,76px)]">
          <AssuranceStrip
            fourth="Aftercare Packages Available"
            overlap={false}
          />
        </div>

        <EnquireBand
          kicker="Start a conversation"
          heading="Meet us before you commit to anything"
          body="A free home visit, an honest view on what is worth spending, and a fixed written quote. No obligation, and no follow-up calls you did not ask for."
          points={[
            "References from past clients on request",
            "Average response time under 20 minutes",
          ]}
        />

        <section
          id="next"
          className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(32px,6.5vw,76px)]"
        >
          <h2 className="mb-[18.4px] text-[clamp(24px,5.6vw,34px)] leading-[1.1] font-normal tracking-[-0.02em]">
            Where to next
          </h2>
          <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-[clamp(12px,2.5vw,24px)]">
            {NEXT.map((item, index) => (
              <Reveal as="li" key={item.href} delay={index * 80}>
                <Link
                  href={item.href}
                  className="flex min-h-[130px] flex-col gap-2 rounded-[4px] border border-[var(--migss-divider)] p-[18.4px] text-inherit no-underline transition-[background-color,border-color] duration-300 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-migss-accent [@media(hover:hover)]:hover:border-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/6"
                >
                  <span className="text-[10.5px] font-medium tracking-[0.16em] uppercase text-migss-accent-ink">
                    {item.kicker}
                  </span>
                  <h3 className="text-2xl leading-[1.15] font-normal">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-migss-text/72">
                    {item.body}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
      <SiteChrome />
    </>
  );
}
