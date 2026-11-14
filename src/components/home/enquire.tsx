import { Check } from "lucide-react";

import { EnquireCta } from "@/components/enquiry/enquire-cta";
import { MotionIcon } from "@/components/icons/motion-icon";
import { Reveal } from "@/components/reveal";
import { SITE, telHref } from "@/lib/site";

const POINTS = [
  "Fixed written quote, no sales pressure",
  "0% interest over 5 years available",
];

function Tick({ delay }: { delay?: number }) {
  return (
    <MotionIcon motion="draw" delay={delay} className="text-migss-accent">
      <Check size={16} strokeWidth={2} />
    </MotionIcon>
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
            Three quick steps. We reply the same working day, and your details
            never leave our office.
          </p>
          <ul className="flex list-none flex-col gap-2.5 text-sm text-migss-text/75">
            {POINTS.map((point, index) => (
              <li key={point} className="group flex items-center gap-2.5">
                <Tick delay={index * 90} />
                {point}
              </li>
            ))}
            <li className="group flex items-center gap-2.5">
              <Tick delay={POINTS.length * 90} />
              Or call us now on{" "}
              <a href={telHref} className="text-migss-accent-ink">
                {SITE.phone}
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={90}>
          <EnquireCta />
        </Reveal>
      </div>
    </section>
  );
}
