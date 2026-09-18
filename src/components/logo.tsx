import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The Migss Interiors logo.
 *
 * Both files are the supplied artwork trimmed to its own content box: the
 * originals sit in a 500x500 canvas with the mark floating in transparent
 * padding, which would render the horizontal lockup a few pixels tall at any
 * sensible header height.
 *
 * The artwork is a single tan (#b08a6c, the brand accent), so one file serves
 * both the light page background and the dark footer without a tone variant.
 */
const ART = {
  horizontal: {
    src: "/Brand/logo-horizontal.png",
    width: 412,
    height: 86,
  },
  vertical: {
    src: "/Brand/logo-vertical.png",
    width: 347,
    height: 368,
  },
} as const;

export function Logo({
  className,
  lockup = "horizontal",
  /** Rendered height in CSS pixels; the width follows the aspect ratio. */
  height = 38,
  priority = false,
}: {
  className?: string;
  lockup?: keyof typeof ART;
  height?: number;
  priority?: boolean;
}) {
  const art = ART[lockup];

  return (
    <Image
      src={art.src}
      width={art.width}
      height={art.height}
      alt="Migss Tiles & Luxury Interiors"
      priority={priority}
      className={cn("w-auto", className)}
      style={{ height }}
    />
  );
}
