import type { Metadata } from "next";

import { PILLAR_COPY, PillarPage } from "@/components/resources/pillar-page";

export const metadata: Metadata = {
  title: "Bathroom Resources",
  description: PILLAR_COPY.Bathroom.intro,
};

export const revalidate = 60;

export default async function Page() {
  return <PillarPage pillar="Bathroom" />;
}
