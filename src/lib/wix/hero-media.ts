import "server-only";

import { cache } from "react";
import { media } from "@wix/sdk";

import { getWixClient } from "@/lib/wix/client";

/**
 * The `HeroMedia` CMS collection: one row per photographic slot on the site,
 * addressed by a stable `slotId` rather than by page position, so Amir can
 * swap the photography behind any slot without a deploy.
 *
 * Slot IDs in use, 38 of them:
 *   home-hero
 *   services-door-{bathroom|kitchen|interior}
 *   {bathroom|kitchen|interior}-hero
 *   {bathroom|kitchen|interior}-detail
 *   {bathroom|kitchen|interior}-crosslink-{other service}
 *   resources-{bathroom|kitchen}-cover
 *   location-hero-{town slug}
 *   location-detail-{town slug}
 *
 * A slot with no row renders the placeholder it always did, so adding a slot
 * to the site before its row exists degrades rather than breaks.
 */

export type HeroMedia =
  | { kind: "image"; uri: string; alt: string | null }
  | { kind: "video"; url: string; poster: string | null; alt: string | null };

function text(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Every row, keyed by slot.
 *
 * One query serves the whole render: a page can hold several slots, and 38
 * separate lookups would be 38 round trips to the same small collection.
 */
const getHeroMediaMap = cache(async (): Promise<Map<string, HeroMedia>> => {
  const client = getWixClient();
  const { items } = await client.items.query("HeroMedia").limit(200).find();

  const map = new Map<string, HeroMedia>();

  for (const raw of items as Record<string, unknown>[]) {
    const slotId = text(raw.slotId);
    if (!slotId) continue;

    const alt = text(raw.altText);
    // `mediaType` is a hand-typed text field, same as the Projects category.
    const type = text(raw.mediaType)?.toLowerCase();
    const video = text(raw.video);

    if (type === "video" && video) {
      let url: string | null = null;
      try {
        url = media.getVideoUrl(video)?.url ?? null;
      } catch {
        url = null;
      }
      if (url) {
        map.set(slotId, {
          kind: "video",
          url,
          poster: text(raw.image),
          alt,
        });
        continue;
      }
      // A video row we cannot resolve falls through to its image, if it has
      // one, rather than leaving the slot empty.
    }

    const uri = text(raw.image);
    if (uri) map.set(slotId, { kind: "image", uri, alt });
  }

  return map;
});

export async function getHeroMedia(slotId: string) {
  return (await getHeroMediaMap()).get(slotId) ?? null;
}

/** Wix images are `wix:image://` URIs, scaled to the slot they fill. */
export function heroImageUrl(uri: string, width: number, height: number) {
  try {
    return media.getScaledToFillImageUrl(uri, width, height, {});
  } catch {
    return null;
  }
}

/** A poster frame for a video slot, when the row also carries an image. */
export function heroPosterUrl(
  poster: string | null,
  width: number,
  height: number,
) {
  return poster ? heroImageUrl(poster, width, height) : null;
}
