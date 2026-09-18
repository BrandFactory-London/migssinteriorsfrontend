import type { MetadataRoute } from "next";

import { LOCATIONS } from "@/lib/locations";
import { absolute } from "@/lib/seo";
import { getPosts } from "@/lib/wix/blog";
import { getProjects } from "@/lib/wix/projects";

/**
 * Every indexable route, static and dynamic.
 *
 * The dynamic sets are queried rather than listed: projects and blog posts
 * are published from the dashboard between deploys, and a hardcoded list
 * would quietly go stale. Regenerated on the same hourly cadence as the rest
 * of the site's ISR.
 *
 * /thank-you is deliberately absent. It is only reached by redirect after an
 * enquiry, carries `robots: { index: false }`, and is disallowed in
 * robots.ts; listing it in the sitemap would contradict all three.
 */
export const revalidate = 3600;

const STATIC_ROUTES: [path: string, priority: number][] = [
  ["/", 1],
  ["/renovation-services", 0.9],
  ["/renovation-services/bathroom", 0.9],
  ["/renovation-services/kitchen", 0.9],
  ["/renovation-services/interior", 0.9],
  ["/our-projects", 0.8],
  ["/locations", 0.8],
  ["/resources", 0.7],
  ["/resources/bathroom", 0.7],
  ["/resources/kitchen", 0.7],
  ["/blog", 0.7],
  ["/about", 0.6],
  ["/contact", 0.6],
  ["/terms-of-use", 0.3],
  ["/privacy-policy", 0.3],
  ["/labour-guarantee", 0.3],
  ["/product-warantee", 0.3],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  const now = new Date();

  return [
    ...STATIC_ROUTES.map(([path, priority]) => ({
      url: absolute(path),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),

    ...LOCATIONS.map((location) => ({
      url: absolute(`/locations/${location.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    ...projects.map((project) => ({
      url: absolute(`/our-projects/${project.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),

    ...posts.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      // The blog carries real publication dates; use them rather than "now".
      lastModified: post.publishedDate ? new Date(post.publishedDate) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
