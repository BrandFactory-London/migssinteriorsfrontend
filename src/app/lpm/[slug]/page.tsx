import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { SiteChrome } from "@/components/site-chrome";
import { SiteHeader } from "@/components/site-header";
import { getLandingPage, META_LANDING_PAGES } from "@/lib/landing-pages";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

/**
 * Meta (Facebook and Instagram) landing pages (TKT-103): the same layout as
 * the /lp pages, room only, with no town in the copy, because Meta's
 * targeting is broader than search.
 * Reached only from ads: not linked from the site, not in the sitemap, and
 * marked noindex so search engines leave them out. Not disallowed in
 * robots.txt, because ad platforms crawl destinations during review.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return META_LANDING_PAGES.map(({ slug }) => ({ slug }));
}

/** Only /lpm/bathrooms and /lpm/kitchens; anything else is a 404. */
export const dynamicParams = false;

/** The projects rail reads the live portfolio. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug, "meta");
  if (!page) return { title: "Page not found" };

  const image = await ogImage(page.heroSlot);

  return {
    ...pageMetadata({
      title: page.metaTitle,
      description: page.metaDescription,
      path: `/lpm/${page.slug}`,
      image: image?.url,
      imageAlt: image?.alt,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getLandingPage(slug, "meta");
  if (!page) notFound();

  return (
    <>
      <SiteHeader />
      <LandingPage page={page} />
      <SiteChrome />
    </>
  );
}
