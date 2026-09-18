import { Reveal } from "@/components/reveal";

/**
 * Native <details>/<summary>: the disclosure works on tap, click and keyboard
 * with no JavaScript, and still works if the bundle never loads. The chevron
 * rotation and the accent border are driven by the [open] attribute.
 */
export function Faq({
  kicker,
  items,
}: {
  kicker: string;
  items: { q: string; a: string }[];
}) {
  return (
    <section
      id="faq"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
    >
      <Reveal>
        <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
          {kicker}
        </p>
        <h2 className="mb-7 text-[clamp(28px,6.8vw,42px)] leading-[1.05] font-normal tracking-[-0.02em]">
          The things people ask before they book
        </h2>
      </Reveal>

      <div className="flex max-w-[860px] flex-col gap-2.5">
        {items.map((item, index) => (
          <Reveal key={item.q} delay={index * 60}>
            <details className="group rounded-[4px] border border-[var(--migss-divider)] px-[18.4px] transition-colors duration-300 open:border-migss-accent">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 text-base font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [&::-webkit-details-marker]:hidden">
                {item.q}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-migss-accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="flex-none transition-transform duration-300 group-open:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="mb-[18.4px] text-[14.5px] leading-[1.8] text-migss-text/78">
                {item.a}
              </p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
