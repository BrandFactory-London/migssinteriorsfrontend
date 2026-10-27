import { notFound } from "next/navigation";

import { ClusterPage } from "@/components/locations/cluster-page";
import { getCluster } from "@/lib/locations";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

/** The cluster's project rail reads the live portfolio. */
export const revalidate = 60;

const SLUG = "essex-forest";

export async function generateMetadata() {
  const cluster = getCluster(SLUG);
  if (!cluster) return { title: "Area not found" };
  const image = await ogImage("location-hero-chigwell");

  return pageMetadata({
    title: cluster.metaTitle,
    description: cluster.metaDescription,
    path: `/locations/${SLUG}`,
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export default async function Page() {
  const cluster = getCluster(SLUG);
  if (!cluster) notFound();

  return <ClusterPage cluster={cluster} />;
}
