import type { Metadata } from "next";

/**
 * The canonical origin, used for canonical links, Open Graph URLs and the
 * sitemap. Absolute URLs are not optional for any of those: a relative
 * og:image is ignored by every scraper.
 *
 * Defaults to the live domain the site is moving onto. Set
 * NEXT_PUBLIC_SITE_URL on a preview deployment to have it describe itself
 * rather than production.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.migssinteriors.com"
).replace(/\/$/, "");

export function absolute(path: string) {
  return new URL(path, SITE_URL).toString();
}

/** Every page shares this shape; only the values differ. */
export type PageSeo = {
  title: string;
  description: string;
  /** Route path, for the canonical link and og:url. */
  path: string;
  /** The most relevant real photograph for this page, already absolute. */
  image?: string | null;
  imageAlt?: string | null;
  /** Article pages get og:type "article" rather than "website". */
  type?: "website" | "article";
  publishedTime?: string;
};

/**
 * Builds a page's metadata: title, description, canonical, and the Open Graph
 * and Twitter cards that decide what a shared link looks like.
 *
 * The title is emitted as `absolute`, which opts out of the root layout's
 * "%s | Migss Interiors" template. Each page therefore states its whole title
 * itself, including the brand suffix where it wants one — otherwise a title
 * that already names the company would carry it twice.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
  publishedTime,
}: PageSeo): Metadata {
  const url = absolute(path);
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: imageAlt ?? title }]
    : undefined;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Migss Interiors",
      locale: "en_GB",
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
  };
}
