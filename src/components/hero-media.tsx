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
 * A row marked Video renders a muted, looping background clip. It carries no
 * controls because these are decorative backgrounds behind copy, and it falls
 * back to its own poster frame while loading.
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
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={heroPosterUrl(media.poster, width, height) ?? undefined}
        aria-label={media.alt ?? placeholder}
        className={cn(
          "h-full w-full object-cover",
          shape === "rounded" && "rounded-[4px]",
          shape === "circle" && "rounded-full",
          className,
        )}
      >
        <source src={media.url} />
      </video>
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
