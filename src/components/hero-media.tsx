import type * as React from "react";

import { HeroParallax } from "@/components/hero-parallax";
import { HeroVideo } from "@/components/hero-video";
import { ImageSlot } from "@/components/image-slot";
import {
  getHeroMedia,
  heroImageUrl,
  heroPosterUrl,
} from "@/lib/wix/hero-media";
import { cn } from "@/lib/utils";

/**
 * A photographic slot filled from the HeroMedia collection.
 *
 * Drops straight into where an ImageSlot was: same props, same placeholder
 * when the slot has no row yet, so an unmatched slotId degrades to the
 * labelled grey box rather than an empty hole.
 *
 * A row marked Video renders a muted, looping background clip through
 * HeroVideo, which holds it still for anyone who has asked for reduced
 * motion. It carries no controls because these are decorative backgrounds
 * behind copy.
 *
 * `parallax` makes the slot a full-bleed hero backdrop: it fills the section
 * it sits in and drifts against the scroll. It is opt-in rather than the
 * default because this component fills more than heroes — service doors,
 * detail plates, cross-link and resource card covers all go through it, and
 * an oversized drifting layer inside a fixed-ratio card would fight the
 * hover-scale already on it. What the flag does not care about is which kind
 * of row it got: the wrapper goes around whatever this function decided to
 * render, so a slot switched from photograph to video in the CMS keeps its
 * parallax with no code change.
 */
export async function HeroMedia({
  slotId,
  placeholder,
  width,
  height,
  shape,
  className,
  captionHidden,
  parallax,
}: {
  slotId: string;
  /** Describes the photograph, and labels the box when no row exists. */
  placeholder: string;
  /** The rendered size this slot fills, used to scale the image. */
  width: number;
  height: number;
  shape?: "rect" | "rounded" | "circle";
  className?: string;
  captionHidden?: boolean;
  /** Fill the surrounding hero section and drift against the scroll. */
  parallax?: boolean;
}) {
  const media = await getHeroMedia(slotId);
  const wrap = (node: React.ReactNode) =>
    parallax ? <HeroParallax>{node}</HeroParallax> : node;

  if (media?.kind === "video") {
    return wrap(
      <HeroVideo
        src={media.url}
        poster={heroPosterUrl(media.poster, width, height) ?? undefined}
        label={media.alt ?? placeholder}
        className={cn(
          "h-full w-full object-cover",
          shape === "rounded" && "rounded-[4px]",
          shape === "circle" && "rounded-full",
          className,
        )}
      />,
    );
  }

  const src = media
    ? (heroImageUrl(media.uri, width, height) ?? undefined)
    : undefined;

  return wrap(
    <ImageSlot
      placeholder={placeholder}
      src={src}
      alt={media?.alt ?? placeholder}
      shape={shape}
      className={className}
      captionHidden={captionHidden}
    />,
  );
}
