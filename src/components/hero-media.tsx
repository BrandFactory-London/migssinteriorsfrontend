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
 */
export async function HeroMedia({
  slotId,
  placeholder,
  width,
  height,
  shape,
  className,
  captionHidden,
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
}) {
  const media = await getHeroMedia(slotId);

  if (media?.kind === "video") {
    return (
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
      />
    );
  }

  const src = media
    ? (heroImageUrl(media.uri, width, height) ?? undefined)
    : undefined;

  return (
    <ImageSlot
      placeholder={placeholder}
      src={src}
      alt={media?.alt ?? placeholder}
      shape={shape}
      className={className}
      captionHidden={captionHidden}
    />
  );
}
