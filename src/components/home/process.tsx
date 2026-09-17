import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    title: "Consultation",
    body: "A free home visit to measure up, understand how you live, and talk budget openly.",
  },
  {
    title: "Design",
    body: "Layouts, 3D visuals and a fixed written quote — every material specified before we start.",
  },
  {
    title: "Build",
    body: "Our own tradespeople, a named project manager and a clean site with weekly updates.",
  },
  {
    title: "Handover & Aftercare",
    body: "A walk-round, your 10-year labour guarantee, and an aftercare package that keeps it perfect.",
  },
];

export function Process() {
  return (
    <section
      id="services"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-[clamp(16px,4.5vw,48px)] pt-[clamp(36px,7.5vw,84px)]"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-start gap-[clamp(18px,3vw,40px)]">
        {/* Sticky only once there is a column beside it to stay level with. */}
        <Reveal className="lg:sticky lg:top-[84px]">
          <p className="mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-accent-700">
            The Migss renovation process
          </p>
          <h2 className="mb-[13.8px] text-[clamp(30px,7.2vw,46px)] leading-[1.05] font-normal tracking-[-0.02em]">
            Four steps, one team, no handovers to strangers.
          </h2>
          <p className="max-w-[40ch] text-[15px] leading-[1.7] text-migss-text/72">
            Every stage is run by people on our own payroll — the same faces
            from first measure to final snag.
          </p>
        </Reveal>

        <ol className="flex list-none flex-col">
          {STEPS.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 90}
              className={`flex gap-[clamp(14px,3vw,26px)] border-t border-[var(--migss-divider)] py-[18.4px] ${
                index === STEPS.length - 1
                  ? "border-b border-b-[var(--migss-divider)]"
                  : ""
              }`}
            >
              <span className="font-heading w-[2.2ch] flex-none text-[clamp(30px,8vw,40px)] leading-[0.9] text-migss-accent-300 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1.5 text-[22px] font-normal">{step.title}</h3>
                <p className="text-[14.5px] leading-[1.65] text-migss-text/72">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
