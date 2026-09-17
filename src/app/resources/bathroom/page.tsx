import type { Metadata } from "next";

import { PILLAR_COPY, PillarPage } from "@/components/resources/pillar-page";

export const metadata: Metadata = {
  title: "Bathroom Resources",
  description: PILLAR_COPY.Bathroom.intro,
};

export default function Page() {
  return <PillarPage pillar="Bathroom" />;
}
