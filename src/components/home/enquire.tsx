import { EnquiryForm } from "@/components/home/enquiry-form";
import { Reveal } from "@/components/reveal";
import { SITE, telHref } from "@/lib/site";

const POINTS = [
  "Fixed written quote, no sales pressure",
  "0% interest over 5 years available",
  "Same working day reply, Mon–Sat",
];

/** The reasons to send the form, stated as numbers rather than prose. */
const PROOF = [
  { figure: "25", label: "years in London & Essex" },
  { figure: "10", label: "year labour guarantee" },
  { figure: "24h", label: "typical reply time" },
];

function Tick() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      className="mt-[3px] flex-none text-migss-accent-400"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/**
 * The conversion section, and the only place on the homepage a visitor can
 * hand over their details — so it is built to stop the scroll rather than to
 * blend in.
 *
 * It inverts to the dark neutral the site already uses for the menu and the MD
 * card, lit by two soft accent washes. That is what makes the form read: the
 * card is deliberately left exactly as it was, on the page background, so
 * against the dark surround it lands as a bright panel rather than another
 * band of the same page. Nothing inside `EnquiryForm` is touched here.
 *
 * The supporting column carries the lead-focused material: the promise, the
 * three numbers worth knowing before you type, the objections answered as
 * ticks, and the phone number for anyone who would rather not type at all.
 */
export function Enquire() {
  return (
    <section
      id="enquire"
      className="relative isolate mt-[clamp(36px,7.5vw,84px)] scroll-mt-20 overflow-hidden bg-migss-neutral-900 text-migss-neutral-100"
    >
      {/* Two off-centre accent washes, so the panel has a light source rather
          than a flat fill. Decorative and non-interactive. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[30%] -left-[10%] -z-1 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,#b38c6d_26%,transparent)_0%,transparent_70%)] blur-[10px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] -bottom-[35%] -z-1 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,#b38c6d_18%,transparent)_0%,transparent_70%)] blur-[10px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,color-mix(in_srgb,#b38c6d_55%,transparent),transparent)]"
      />

      {/* Extra bottom padding clears the floating dock on small screens. */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(24px,3.5vw,56px)] px-[clamp(16px,4.5vw,48px)] pt-[clamp(38px,7vw,88px)] pb-[clamp(88px,16vw,96px)]">
        <Reveal>
          <p className="mb-[9.2px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
            <span className="block h-px w-[34px] bg-migss-accent-300" />
            Start your renovation
          </p>
          <h2 className="mb-[13.8px] text-[clamp(32px,7.6vw,52px)] leading-[1.03] font-normal tracking-[-0.02em] text-balance">
            Book your free consultation
          </h2>
          <p className="mb-[22px] max-w-[42ch] text-[15px] leading-[1.75] text-migss-neutral-100/78">
            Two short steps. We reply the same working day, and your details
            never leave our office.
          </p>

          <dl className="mb-[22px] flex flex-wrap gap-x-[clamp(18px,4vw,38px)] gap-y-3.5 border-y border-migss-neutral-100/15 py-[18px]">
            {PROOF.map((item) => (
              <div key={item.label} className="min-w-[88px]">
                <dt className="font-heading text-[clamp(26px,6vw,34px)] leading-none text-migss-accent-300 tabular-nums">
                  {item.figure}
                </dt>
                <dd className="mt-1.5 max-w-[14ch] text-[12px] leading-[1.5] text-migss-neutral-100/65">
                  {item.label}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-neutral-100/80">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Tick />
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-[20px] text-[13.5px] text-migss-neutral-100/65">
            Would rather talk it through? Call us on{" "}
            <a
              href={telHref}
              className="font-medium text-migss-accent-300 underline decoration-migss-accent-300/40 underline-offset-4 transition-colors [@media(hover:hover)]:hover:text-migss-accent-200"
            >
              {SITE.phone}
            </a>
          </p>
        </Reveal>

        <Reveal delay={90}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
