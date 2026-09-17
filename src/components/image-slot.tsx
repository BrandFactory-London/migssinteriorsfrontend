import { cn } from "@/lib/utils";

type ImageSlotProps = {
  /** Describes the photograph this slot is waiting for. */
  placeholder: string;
  /** Once real photography lands (or comes from the Wix CMS), pass a URL. */
  src?: string;
  alt?: string;
  className?: string;
  shape?: "rect" | "rounded" | "circle";
  /**
   * Full-bleed slots sit behind text, where a caption would collide with it.
   * The icon alone marks the slot; `placeholder` still names it for
   * assistive tech.
   */
  captionHidden?: boolean;
};

/**
 * Stands in for the design's <image-slot>. The handoff ships no photography,
 * so this renders a labelled placeholder rather than a broken image — swap in
 * `src` per slot as assets arrive, no layout change required.
 */
export function ImageSlot({
  placeholder,
  src,
  alt,
  className,
  shape = "rect",
  captionHidden = false,
}: ImageSlotProps) {
  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "rounded"
        ? "rounded-[4px]"
        : "";

  if (src) {
    return (
      // Photography is unoptimised by design for now: these become Wix media
      // URLs, which need their loader configured before next/image can serve.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? placeholder}
        className={cn("h-full w-full object-cover", shapeClass, className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={placeholder}
      className={cn(
        "flex h-full w-full items-center justify-center bg-migss-neutral-300/45 p-4",
        shapeClass,
        className,
      )}
    >
      <span className="flex flex-col items-center gap-2 text-center text-[11px] leading-snug text-migss-neutral-700">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
          className="opacity-70"
        >
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <circle cx="8.5" cy="10" r="1.6" />
          <path d="m4 17 5-5 4 4 2.5-2 4.5 4.5" />
        </svg>
        {shape !== "circle" && !captionHidden ? placeholder : null}
      </span>
    </div>
  );
}
