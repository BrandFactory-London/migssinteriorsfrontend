import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LandingPage } from "@/components/landing/landing-page";
import { SiteChrome } from "@/components/site-chrome";
import { SiteHeader } from "@/components/site-header";
import { getLandingPage, LANDING_PAGES } from "@/lib/landing-pages";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

/**
 * Meta ads landing pages (TKT-103). Reached only from ads: not linked from
 * the site, not in the sitemap, and marked noindex so search engines leave
 * them out. Not disallowed in robots.txt, because Meta crawls ad
 * destinations during review.
 */

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LANDING_PAGES.map(({ slug }) => ({ slug }));
}

/** Only the four pages; anything else under /lp is a 404. */
export const dynamicParams = false;

/** The projects rail reads the live portfolio. */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) return { title: "Page not found" };

  const image = await ogImage(page.heroSlot);

  return {
    ...pageMetadata({
      title: page.metaTitle,
      description: page.metaDescription,
      path: `/lp/${page.slug}`,
      image: image?.url,
      imageAlt: image?.alt,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (!page) notFound();

  return (
    <>
      <SiteHeader contactIcons />
      <LandingPage page={page} />
      <SiteChrome />
    </>
  );
}
