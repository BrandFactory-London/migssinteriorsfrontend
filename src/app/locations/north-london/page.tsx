import { notFound } from "next/navigation";

import { ClusterPage } from "@/components/locations/cluster-page";
import { getCluster } from "@/lib/locations";
import { pageMetadata } from "@/lib/seo";

/** The cluster's project rail reads the live portfolio. */
export const revalidate = 60;

const SLUG = "north-london";

export async function generateMetadata() {
  const cluster = getCluster(SLUG);
  if (!cluster) return { title: "Area not found" };

  return pageMetadata({
    title: cluster.metaTitle,
    description: cluster.metaDescription,
    path: `/locations/${SLUG}`,
  });
}

export default async function Page() {
  const cluster = getCluster(SLUG);
  if (!cluster) notFound();

  return <ClusterPage cluster={cluster} />;
}
