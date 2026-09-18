import { PILLAR_COPY, PillarPage } from "@/components/resources/pillar-page";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

export async function generateMetadata() {
  const image = await ogImage("resources-kitchen-cover");

  return pageMetadata({
    title: "Kitchen Renovation Guides & Advice | Migss Interiors",
    description: PILLAR_COPY.Kitchen.intro,
    path: "/resources/kitchen",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export const revalidate = 60;

export default async function Page() {
  return <PillarPage pillar="Kitchen" />;
}
