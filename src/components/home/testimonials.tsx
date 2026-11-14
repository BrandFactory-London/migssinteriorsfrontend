import { ArrowRight, Phone, Star as LucideStar } from "lucide-react";

import { ImageSlot } from "@/components/image-slot";
import { MotionIcon } from "@/components/icons/motion-icon";
import { Reveal } from "@/components/reveal";
import { ButtonLink } from "@/components/ui/button";
import { mdTelHref } from "@/lib/site";

function Star({ index }: { index: number }) {
  return (
    <MotionIcon motion="star" delay={index * 70}>
      <LucideStar size={18} strokeWidth={2} fill="currentColor" />
    </MotionIcon>
  );
}

export function Testimonials() {
  return (
    <section
      id="about"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(18px,3vw,32px)]">
        <Reveal className="flex flex-col gap-[9.2px] rounded-[4px] border border-[var(--migss-divider)] border-t-2 border-t-migss-accent bg-migss-bg p-[18.4px]">
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-ink">
            Google reviews
          </span>
          <p className="font-heading text-[56px] leading-[0.95] tabular-nums">
            5.0
          </p>
          <div
            className="group flex gap-1 text-migss-accent-ink"
            aria-label="5 out of 5 stars"
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <Star key={index} index={index} />
            ))}
          </div>
          <p className="text-[13.5px] leading-[1.65] text-migss-text/70">
            Rated by homeowners across north London and Chigwell. Read every review on
            our Google Business profile.
          </p>
        </Reveal>

        <Reveal
          delay={90}
          as="blockquote"
          className="flex flex-col gap-[13.8px] border-l-2 border-migss-accent pt-[9.2px] pl-[18.4px]"
        >
          <p className="font-heading text-[clamp(21px,5.2vw,28px)] leading-[1.3] italic">
            &ldquo;They treated our home like their own. The site was spotless
            every evening and the finish is better than the visuals we were
            shown.&rdquo;
          </p>
          <footer className="text-[11.5px] font-medium tracking-[0.12em] uppercase text-migss-text/60">
            Homeowner · Chigwell
          </footer>
        </Reveal>

        <Reveal
          delay={180}
          as="blockquote"
          className="flex flex-col gap-[13.8px] rounded-[4px] bg-migss-neutral-900 p-[18.4px] text-migss-neutral-100"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-[58px] w-[58px] flex-none">
              <ImageSlot
                placeholder="MD portrait"
                src="/Brand/headshot-square.jpg"
                alt="The Managing Director of Migss Interiors"
                shape="circle"
              />
            </div>
            <div>
              <p className="font-heading text-[18px]">Managing Director</p>
              <p className="text-xs text-migss-neutral-400">Migss Interiors</p>
            </div>
          </div>
          <p className="text-[15px] leading-[1.75] italic">
            &ldquo;You will always be able to reach me personally, during your
            project and long after it. That is the whole reason this company has
            lasted 25 years.&rdquo;
          </p>
          <ButtonLink
            href={mdTelHref}
            variant="outlineAccent"
            size="md"
            className="group font-body self-start gap-2 font-medium"
          >
            <MotionIcon motion="ring">
              <Phone size={16} strokeWidth={2} />
            </MotionIcon>
            Call the MD directly
            <MotionIcon motion="nudge">
              <ArrowRight size={16} strokeWidth={2} />
            </MotionIcon>
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
