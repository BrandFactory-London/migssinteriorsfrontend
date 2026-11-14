import {
  Award,
  BadgePercent,
  HeartHandshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { MotionIcon, type IconMotion } from "@/components/icons/motion-icon";
import { Reveal } from "@/components/reveal";

const POINTS: {
  label: string;
  Icon: LucideIcon;
  motion: IconMotion;
}[] = [
  { label: "10 Year Labour Guarantee", Icon: ShieldCheck, motion: "draw" },
  { label: "0% Interest Finance Available", Icon: BadgePercent, motion: "spin" },
  { label: "Over 25 Years of Experience", Icon: Award, motion: "bob" },
  { label: "Aftercare Packages Available", Icon: HeartHandshake, motion: "beat" },
];

/** Overlaps the hero's lower edge, per the design's negative top margin. */
export function AssuranceBar() {
  return (
    <section className="relative z-3 mx-auto max-w-[1280px] px-[clamp(16px,4.5vw,48px)]">
      <div className="mt-[clamp(-52px,-4vw,-34px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] border border-[var(--migss-divider)] bg-migss-bg shadow-migss-md">
        {POINTS.map((point, index) => (
          <Reveal
            key={point.label}
            delay={index * 70}
            className="group flex items-center gap-3 border-b border-[var(--migss-divider)] px-[clamp(14px,2vw,24px)] py-[18.4px]"
          >
            <MotionIcon motion={point.motion} className="text-migss-accent">
              <point.Icon size={22} strokeWidth={2} />
            </MotionIcon>
            <span className="text-[14.5px] leading-tight font-medium">
              {point.label}
            </span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
