import { EnquiryForm } from "@/components/home/enquiry-form";
import { Reveal } from "@/components/reveal";
import { SITE, telHref } from "@/lib/site";

const POINTS = [
  "Fixed written quote, no sales pressure",
  "0% interest over 5 years available",
];

function Tick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-migss-accent)"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="flex-none"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function Enquire() {
  return (
    <section
      id="enquire"
      className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/60"
    >
      {/* Extra bottom padding clears the floating dock on small screens. */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] pt-[clamp(30px,6vw,72px)] pb-[clamp(88px,16vw,96px)]">
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            Start your renovation
          </p>
          <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
            Book your free consultation
          </h2>
          <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
            Two short steps. We reply the same working day, and your details
            never leave our office.
          </p>
          <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-text/75">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5">
                <Tick />
                {point}
              </li>
            ))}
            <li className="flex items-center gap-2.5">
              <Tick />
              Or call us now on{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={90}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
