import { PILLAR_COPY, PillarPage } from "@/components/resources/pillar-page";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

export async function generateMetadata() {
  const image = await ogImage("resources-bathroom-cover");

  return pageMetadata({
    title: "Bathroom Renovation Guides & Advice | Migss Interiors",
    description: PILLAR_COPY.Bathroom.intro,
    path: "/resources/bathroom",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export const revalidate = 60;

export default async function Page() {
  return <PillarPage pillar="Bathroom" />;
}
