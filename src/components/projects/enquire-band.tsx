import { EnquireCta } from "@/components/enquiry/enquire-cta";
import { EnquiryCardForm } from "@/components/enquiry/enquiry-card-form";
import { Reveal } from "@/components/reveal";
import type { EnquiryFocus } from "@/lib/enquiry";
import { SITE, telHref } from "@/lib/site";

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

/** The enquiry band shared by the listing, detail, location and contact pages. */
export function EnquireBand({
  kicker = "Start your project",
  heading,
  body,
  points,
  focus,
  town,
  inline = false,
}: {
  kicker?: string;
  heading: React.ReactNode;
  body: string;
  points: [string, string];
  focus?: EnquiryFocus;
  /** Pre-fills the card's town field on a location page. */
  town?: string;
  /**
   * Shows the enquiry form itself rather than a button that opens the card.
   * Only /contact does this, so the form works there without the pop-up.
   */
  inline?: boolean;
}) {
  return (
    <section
      id="enquire"
      className="mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 border-t border-[var(--migss-divider)] bg-migss-surface/60"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(20px,3.5vw,48px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,72px)]">
        <Reveal>
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            {kicker}
          </p>
          <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
            {heading}
          </h2>
          <p className="mb-[18.4px] text-[15px] leading-[1.75] text-migss-text/78">
            {body}
          </p>
          <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-text/75">
            {points.map((point) => (
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
          {inline ? (
            <div className="h-[600px] overflow-hidden rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg shadow-migss-sm">
              <EnquiryCardForm variant="contact page" context={{ focus, town }} />
            </div>
          ) : (
            <EnquireCta focus={focus} town={town} />
          )}
        </Reveal>
      </div>
    </section>
  );
}
