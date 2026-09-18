import "server-only";

import { getHeroMedia, heroImageUrl } from "@/lib/wix/hero-media";

/** Open Graph's expected aspect: 1.91:1. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/**
 * The share image for a page backed by a HeroMedia slot.
 *
 * A Video slot has no still to share, so it falls back to its poster frame,
 * and a slot with no row falls back to whatever the caller passes — in
 * practice the home hero, which is the one image that always exists.
 */
export async function ogImageForSlot(slotId: string) {
  const media = await getHeroMedia(slotId);
  if (!media) return null;

  const uri = media.kind === "image" ? media.uri : media.poster;
  if (!uri) return null;

  return {
    url: heroImageUrl(uri, OG_WIDTH, OG_HEIGHT),
    alt: media.alt,
  };
}

/**
 * The share image for a page with a slot of its own, falling back to the home
 * hero so that no page shares as a bare link.
 */
export async function ogImage(slotId: string) {
  const own = await ogImageForSlot(slotId);
  if (own?.url) return own;

  const home = await ogImageForSlot("home-hero");
  return home?.url ? home : null;
}
