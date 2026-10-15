import { Reveal } from "@/components/reveal";

/**
 * The careers page's "could you build this?" band: one finished shower wall,
 * annotated with the details a fitter would look for.
 *
 * The photograph lives in /public rather than the HeroMedia collection on
 * purpose. Each marker is positioned on this exact image, so swapping the
 * photo from the dashboard would leave the labels pointing at the wrong
 * thing. A new photo means new marker positions, which is a code change.
 *
 * Positions are percentages of the 16:9 frame. The frame is held at the
 * photo's own ratio at every width (no cropping), so they never drift.
 */
const DETAILS = [
  { x: 72, y: 21, label: "Lit recessed niche" },
  { x: 46, y: 56, label: "Mitred ledge edge" },
  { x: 18, y: 68, label: "Brushed brass, concealed valve" },
  { x: 40, y: 85, label: "Large-format tiles, tight joints" },
] as const;

/** Labels sit to the left of markers on the right-hand side of the frame. */
const flip = (x: number) => x > 60;

function Marker({ index }: { index: number }) {
  return (
    <span className="relative grid h-8 w-8 flex-none place-items-center rounded-full bg-migss-accent-700 text-[13px] font-semibold text-migss-text shadow-migss-md tabular-nums">
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-migss-accent-700/60 motion-safe:animate-ping"
        style={{ animationDuration: "2.4s" }}
      />
      <span className="relative">{index}</span>
    </span>
  );
}

export function CraftDetail() {
  return (
    <section
      aria-labelledby="craft-heading"
      className="mx-auto mt-[clamp(30px,6vw,68px)] max-w-[1280px] px-[clamp(16px,4.5vw,48px)]"
    >
      {/* Below laptop width: copy first, then the photo, then the key. */}
      <div className="mb-[clamp(18px,4vw,26px)] lg:hidden">
        <CraftCopy tone="dark" />
      </div>

      <figure className="relative m-0 overflow-hidden rounded-[4px] bg-migss-neutral-900 lg:shadow-migss-md">
        {/* Below lg the copy sits above the photo instead of on it: a 16:9
            frame below laptop width has no room for a headline and the markers. */}
        <div className="relative aspect-[16/9]">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet="/careers/shower-niche-detail.jpg"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/careers/shower-niche-detail-1200.jpg"
              alt="A finished Migss shower wall: large-format stone-effect tiles, a lit recessed niche with a mitred ledge, and brushed brass fittings."
              width={2000}
              height={1125}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>

          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-[radial-gradient(ellipse_75%_95%_at_0%_0%,color-mix(in_srgb,#2d2b2b_86%,transparent)_0%,color-mix(in_srgb,#2d2b2b_55%,transparent)_42%,transparent_72%)] lg:block"
          />

          <div className="absolute top-0 left-0 hidden max-w-[min(440px,38%)] p-[clamp(24px,3.6vw,48px)] text-migss-neutral-100 lg:block">
            <CraftCopy tone="light" />
          </div>

          <ol className="m-0 list-none p-0">
            {DETAILS.map((detail, index) => (
              <li
                key={detail.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${detail.x}%`, top: `${detail.y}%` }}
              >
                <Reveal
                  delay={300 + index * 220}
                  className={`flex items-center gap-2.5 ${flip(detail.x) ? "flex-row-reverse" : ""}`}
                >
                  <Marker index={index + 1} />
                  {/* Labels ride on the photo from lg up; below that they
                      move to the key under it. */}
                  <span className="hidden rounded-full border border-migss-neutral-100/25 bg-migss-neutral-900/60 px-3 py-1.5 text-[13px] whitespace-nowrap text-migss-neutral-100 backdrop-blur-[6px] lg:inline-block">
                    {detail.label}
                  </span>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </figure>

      <div className="lg:hidden">
        <ol className="mt-[13.8px] grid list-none grid-cols-2 gap-x-[13.8px] gap-y-2.5 p-0">
          {DETAILS.map((detail, index) => (
            <li
              key={detail.label}
              className="flex items-start gap-2 text-[13.5px] leading-[1.45] text-migss-text/80"
            >
              <span className="grid h-5 w-5 flex-none place-items-center rounded-full bg-migss-accent-700 text-[11px] font-semibold text-migss-text tabular-nums">
                {index + 1}
              </span>
              {detail.label}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CraftCopy({ tone }: { tone: "light" | "dark" }) {
  const light = tone === "light";
  return (
    <>
      <p
        className={`mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase ${light ? "text-migss-accent-300" : "text-migss-accent-ink"}`}
      >
        The standard we work to
      </p>
      <h2
        id={light ? "craft-heading" : undefined}
        className="mb-[13.8px] text-[clamp(28px,3.4vw,42px)] leading-[1.05] font-normal tracking-[-0.02em] text-balance"
      >
        Are you experienced in delivering this kind of luxury quality?
      </h2>
      <p
        className={`mb-[18.4px] text-[15px] leading-[1.7] ${light ? "text-migss-neutral-100/85" : "text-migss-text/78"}`}
      >
        A finished Migss shower wall, built by our own team. If this is the
        standard you work to, view our available positions below.
      </p>
      <a
        href="#roles"
        className={`text-sm font-medium no-underline ${light ? "text-migss-accent-300" : "text-migss-accent-ink"}`}
      >
        View available positions ↓
      </a>
    </>
  );
}
