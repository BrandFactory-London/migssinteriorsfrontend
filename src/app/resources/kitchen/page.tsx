import type { Metadata } from "next";

import { PILLAR_COPY, PillarPage } from "@/components/resources/pillar-page";

export const metadata: Metadata = {
  title: "Kitchen Resources",
  description: PILLAR_COPY.Kitchen.intro,
};

export const revalidate = 60;

export default async function Page() {
  return <PillarPage pillar="Kitchen" />;
}
