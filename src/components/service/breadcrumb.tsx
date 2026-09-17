import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

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
        "flex items-center gap-2 text-xs",
        tone === "light" ? "text-migss-neutral-100/70" : "text-migss-text/55",
      )}
    >
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? (
            <a href={item.href} className="text-inherit no-underline">
              {item.label}
            </a>
          ) : (
            <span
              aria-current="page"
              className={
                tone === "light"
                  ? "text-migss-accent-300"
                  : "text-migss-accent-700"
              }
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
