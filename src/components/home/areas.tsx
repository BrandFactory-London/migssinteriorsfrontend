import { Reveal } from "@/components/reveal";

const AREAS = [
  { name: "Wanstead", postcode: "E11", slug: "wanstead" },
  { name: "South Woodford", postcode: "E18", slug: "woodford" },
  { name: "Chingford", postcode: "E4", slug: "chingford" },
  { name: "Loughton", postcode: "IG10", slug: "loughton" },
  { name: "Chigwell", postcode: "IG7", slug: "chigwell" },
  { name: "Epping", postcode: "CM16", slug: "epping" },
  { name: "Theydon Bois", postcode: "CM16", slug: "theydon-bois" },
  { name: "Hornchurch", postcode: "RM11", slug: "hornchurch" },
  { name: "Brentwood", postcode: "CM14", slug: "brentwood" },
];

export function Areas() {
  return (
    <section
      id="areas"
      className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/50"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[clamp(20px,3.5vw,52px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            Areas we serve
          </p>
          <h2 className="mb-[13.8px] text-[clamp(28px,6.8vw,42px)] leading-[1.06] font-normal tracking-[-0.02em]">
            Renovating homes across East London &amp; Essex
          </h2>
          <p className="mb-[13.8px] text-[15px] leading-[1.75] text-pretty text-migss-text/78">
            We work within an hour of our Essex workshop, which is how we keep
            the same team on your project from first visit to final snag. If you
            are in one of the towns listed, we can usually be with you for a
            free consultation within the week.
          </p>
          <p className="text-[13px] leading-[1.75] text-migss-text/62">
            Plus the surrounding IG postcodes, IG1 to IG10, and neighbouring E4,
            E11, E18, RM and CM areas. Not listed?{" "}
            <a
              href="#enquire"
              className="text-migss-accent-ink underline-offset-[3px]"
            >
              Ask us
            </a>{" "}
            and we will tell you honestly if you are outside our range.
          </p>
        </Reveal>

        <ul className="grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] content-start gap-x-[clamp(16px,3vw,32px)]">
          {AREAS.map((area, index) => (
            <Reveal as="li" key={area.name} delay={index * 40}>
              <a
                href={`/locations/${area.slug}`}
                className="group flex min-h-[52px] items-center justify-between gap-2 border-b border-[var(--migss-divider)] px-0.5 text-[15px] text-inherit no-underline transition-colors [@media(hover:hover)]:hover:text-migss-accent-ink"
              >
                {area.name}
                <span className="text-xs text-migss-accent-ink">
                  {area.postcode}
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
