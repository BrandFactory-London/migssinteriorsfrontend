import { HeroMedia } from "@/components/hero-media";
import { ButtonLink } from "@/components/ui/button";
import { telHref } from "@/lib/site";

export async function Hero() {
  return (
    <section className="relative flex min-h-[clamp(540px,86svh,940px)] items-end overflow-hidden">
      <div className="absolute inset-0">
        <HeroMedia
          slotId="home-hero"
          placeholder="Hero: finished luxury bathroom, wide shot"
          width={2000}
          height={1200}
          captionHidden
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,color-mix(in_srgb,#2d2b2b_88%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_42%,color-mix(in_srgb,#2d2b2b_22%,transparent)_100%)]"
      />

      <div className="relative z-2 mx-auto w-full max-w-[1280px] animate-[migss-fade_0.6s_ease-out_both] px-[clamp(16px,4.5vw,48px)] pt-[clamp(96px,16vh,160px)] pb-[clamp(56px,8vw,96px)] text-migss-neutral-100">
        <p className="mb-[13.8px] flex items-center gap-2.5 text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-300">
          <span className="block h-px w-[34px] bg-migss-accent-300" />
          London &amp; Essex · Est. 25 years
        </p>

        <h1 className="mb-[13.8px] max-w-[20ch] text-[clamp(40px,8.4vw,82px)] leading-none font-normal tracking-[-0.03em] text-balance">
          Luxury bathrooms &amp; interiors, finished to the last millimetre.
        </h1>

        <p className="mb-[18.4px] max-w-[46ch] text-[clamp(15px,4vw,17px)] leading-[1.65] text-migss-neutral-100/85">
          Bathroom, kitchen and whole-home renovations for homeowners across
          London &amp; Essex, designed, built and guaranteed by one team for
          over 25 years.
        </p>

        <div className="flex max-w-[520px] flex-wrap gap-2.5">
          <ButtonLink
            href="#work"
            variant="contrast"
            className="font-body flex-[1_1_200px] font-medium"
          >
            View our projects
          </ButtonLink>
          <ButtonLink
            href={telHref}
            variant="outlineLight"
            className="font-body flex-[1_1_200px] font-medium"
          >
            Book a Free Call Now
          </ButtonLink>
        </div>

        <p className="mt-[13.8px] text-[12.5px] text-migss-neutral-100/65">
          No obligation. A 15-minute call with the team who&apos;ll do the work.
        </p>
      </div>
    </section>
  );
}
