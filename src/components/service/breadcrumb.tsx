import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

/**
 * The trail sits in a pill so it reads as its own object rather than a stray
 * line of small type above the kicker. The pill is unfilled — a hairline
 * border and, on a photographic hero, a light blur — because a solid fill
 * would compete with the hero's own gradient. The clearance below the trail
 * is set by the wrapper each page already had, widened so the trail reads as
 * its own band rather than crowding the eyebrow beneath it.
 */
export function Breadcrumb({
  items,
  tone = "dark",
}: {
  items: Crumb[];
  /** `light` for breadcrumbs sitting on a photographic hero. */
  tone?: "light" | "dark";
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full border px-3.5 py-[7px] text-xs",
        tone === "light"
          ? "border-migss-neutral-100/25 text-migss-neutral-100/70 backdrop-blur-[2px]"
          : "border-[var(--migss-divider)] text-migss-text/55",
      )}
    >
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="opacity-60">
              /
            </span>
          ) : null}
          {item.href ? (
            <a
              href={item.href}
              className={cn(
                "text-inherit no-underline transition-colors",
                tone === "light"
                  ? "[@media(hover:hover)]:hover:text-migss-accent-300"
                  : "[@media(hover:hover)]:hover:text-migss-accent-ink",
              )}
            >
              {item.label}
            </a>
          ) : (
            <span
              aria-current="page"
              className={cn(
                "truncate",
                tone === "light"
                  ? "text-migss-accent-300"
                  : "text-migss-accent-ink",
              )}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
