"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE, telHref, NAV } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DockItem = {
  href: string;
  label: string;
  /** Hidden below 1000px, where the dock has no room for them. */
  desktopOnly?: boolean;
  icon: React.ReactNode;
};

const iconProps = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "flex-none",
} as const;

const DOCK_ITEMS: DockItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg {...iconProps}>
        <path d="M4 10.8 12 4.5l8 6.3V20H4z" />
      </svg>
    ),
  },
  {
    href: "/renovation-services",
    label: "Services",
    icon: (
      <svg {...iconProps}>
        <path d="M4 20V8l8-4 8 4v12" />
        <path d="M4 13h16" />
      </svg>
    ),
  },
  {
    href: "/renovation-services/bathroom",
    label: "Bathrooms",
    desktopOnly: true,
    icon: (
      <svg {...iconProps}>
        <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
        <path d="M7 12V6a2.5 2.5 0 0 1 5 0" />
      </svg>
    ),
  },
  {
    href: "/renovation-services/kitchen",
    label: "Kitchens",
    desktopOnly: true,
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" />
        <path d="M4 10h16M9 4v6" />
      </svg>
    ),
  },
  {
    href: "/renovation-services/interior",
    label: "Interiors",
    desktopOnly: true,
    icon: (
      <svg {...iconProps}>
        <path d="M3 20h18M6 20V9l6-4 6 4v11" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
  },
];

/**
 * Shared interaction shell: the floating dock and the full-screen menu it
 * opens. They are one component because the dock hides while the menu is
 * open, so a single piece of state drives both.
 */
export function SiteChrome() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);

  // Lock the page behind the overlay, and restore scroll on close.
  React.useEffect(() => {
    if (!menuOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {menuOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-90 flex animate-[migss-menu-in_0.22s_ease-out_both] flex-col bg-migss-neutral-900 text-migss-neutral-100"
        >
          <div className="flex items-center justify-between border-b border-migss-neutral-100/20 px-[clamp(16px,4.5vw,48px)] py-3">
            <span className="text-[11px] tracking-[0.24em] uppercase text-migss-accent-300">
              Menu
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-[46px] w-[46px] cursor-pointer place-items-center rounded-[4px] border border-migss-neutral-100/30 bg-transparent text-inherit transition-colors hover:bg-migss-neutral-100/10 active:scale-95"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col overflow-y-auto px-[clamp(16px,4.5vw,48px)] pt-[18px] pb-7">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[64px] items-baseline gap-3.5 border-b border-migss-neutral-100/15 pt-3.5 text-inherit no-underline transition-colors active:text-migss-accent-300"
              >
                <span className="w-[22px] text-[11px] text-migss-accent-300 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-heading text-[28px] leading-[1.1]">
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="mt-auto flex flex-col gap-2.5 pt-7">
              <ButtonLink href={telHref} variant="outlineAccent" size="lg">
                Book a Free Call Now
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outlineLight"
                size="lg"
                onClick={() => setMenuOpen(false)}
              >
                Request a quote
              </ButtonLink>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-migss-neutral-400">
                {SITE.phone} · {SITE.email}
                <br />
                Mon–Sat, 8am–6pm · London &amp; Essex
              </p>
            </div>
          </nav>
        </div>
      ) : (
        <nav
          aria-label="Primary"
          className="fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-1/2 z-50 flex max-w-[calc(100vw-20px)] animate-[migss-dock-in_0.5s_cubic-bezier(.2,.65,.2,1)_both] items-center gap-1 rounded-full border border-migss-text/10 bg-migss-bg/60 p-[7px] shadow-[0_10px_34px_-12px_color-mix(in_srgb,#2d2b2b_38%,transparent),inset_0_1px_0_color-mix(in_srgb,#fff_55%,transparent)] backdrop-blur-[20px] backdrop-saturate-[180%]"
        >
          {DOCK_ITEMS.map((item) => (
            <DockLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
            />
          ))}

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open full menu"
            className={cn(dockItemClass, "group border-0 bg-transparent")}
          >
            <svg {...iconProps} strokeLinejoin={undefined}>
              <path d="M4 8h16M4 16h16" />
            </svg>
            <DockLabel>Menu</DockLabel>
          </button>

          <span
            aria-hidden="true"
            className="mx-[3px] block h-[26px] w-px flex-none bg-migss-text/15"
          />

          <a
            href={telHref}
            title="Book a free call"
            className="group flex h-[50px] flex-none items-center rounded-full bg-migss-accent-700 px-4 text-migss-text no-underline transition-[background-color,transform] duration-300 active:scale-[0.94] [@media(hover:hover)]:hover:bg-migss-accent-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="flex-none"
            >
              <path d="M7.2 3.5h-3a1.7 1.7 0 0 0-1.7 1.9c.6 5.3 3 9.6 7 12.9 2.1 1.7 4.2 2.7 6.2 3.1a1.7 1.7 0 0 0 1.9-1.7v-2.9a1.7 1.7 0 0 0-1.4-1.7l-2.5-.4a1.7 1.7 0 0 0-1.5.5l-.9.9a14.5 14.5 0 0 1-4.6-4.6l.9-.9a1.7 1.7 0 0 0 .5-1.5l-.4-2.5a1.7 1.7 0 0 0-1.7-1.4z" />
            </svg>
            {/* The CTA's label is always expanded — it is the one item that
                must read as a call to action without being hovered. */}
            <span className="ml-2.5 text-[13.5px] font-medium whitespace-nowrap">
              Book a call
            </span>
          </a>
        </nav>
      )}
    </>
  );
}

const dockItemClass =
  "group flex h-[50px] flex-none cursor-pointer items-center rounded-full px-[15px] text-inherit no-underline transition-[background-color,color,transform] duration-300 active:scale-[0.94] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-migss-accent [@media(hover:hover)]:hover:bg-migss-accent/15 [@media(hover:hover)]:hover:text-migss-accent-ink";

/**
 * Labels expand on hover where hovering exists. On touch there is no hover
 * state to enter, so the label stays collapsed and the icon carries the
 * meaning — with the accessible name on the control itself, and the active
 * section marked from scroll position instead.
 */
function DockLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="ml-0 max-w-0 overflow-hidden text-[13.5px] font-medium whitespace-nowrap opacity-0 transition-[max-width,opacity,margin-left] duration-[450ms] ease-[cubic-bezier(.2,.65,.2,1)] [@media(hover:hover)]:group-hover:ml-2.5 [@media(hover:hover)]:group-hover:max-w-[200px] [@media(hover:hover)]:group-hover:opacity-100">
      {children}
    </span>
  );
}

function DockLink({ item, active }: { item: DockItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      title={item.label}
      aria-current={active ? "page" : undefined}
      className={cn(
        dockItemClass,
        item.desktopOnly && "hidden min-[1000px]:flex",
        active && "bg-migss-accent/15 text-migss-accent-ink",
      )}
    >
      {item.icon}
      <DockLabel>{item.label}</DockLabel>
    </Link>
  );
}

/**
 * The dock now navigates between pages, so "you are here" is the current
 * route. On touch this is the only position feedback the dock can give —
 * there is no hover state to enter.
 */
function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href;
}
