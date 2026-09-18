"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SITE, telHref, NAV, WHATSAPP_URL } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button";
import { useNavMenu } from "@/components/nav-menu";
import { cn } from "@/lib/utils";

type DockItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

/**
 * Shared by the two room icons. The stroke is 2 rather than the 1.25 the rest
 * of the site draws at, because these sit beside the WhatsApp logo, which is a
 * filled mark: at matched colour it still deposits about twice the ink of a
 * thin outline, so the outlines are thickened to meet it rather than the logo
 * lightened to meet them. Arrived at by rendering 1.25 through 2.5 and looking:
 * 2.5 balances on the numbers but reads clumsy at 19px, 1.75 still reads thin,
 * 2 is where the four stop looking like two different sets.
 */
const iconProps = {
  width: 19,
  height: 19,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  className: "flex-none",
} as const;

/**
 * The two rooms most enquiries are about. Everything else the dock used to
 * carry — Home, Services, Interiors and the menu — is reachable from the
 * header's menu, which is where the menu button now lives.
 */
const DOCK_ITEMS: DockItem[] = [
  {
    href: "/renovation-services/bathroom",
    label: "Bathroom",
    icon: (
      <svg {...iconProps}>
        <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
        <path d="M7 12V6a2.5 2.5 0 0 1 5 0" />
      </svg>
    ),
  },
  {
    href: "/renovation-services/kitchen",
    label: "Kitchen",
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="4" width="16" height="16" />
        <path d="M4 10h16M9 4v6" />
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
  const menu = useNavMenu();
  const menuOpen = menu?.open ?? false;
  const setMenuOpen = React.useCallback(
    (open: boolean) => menu?.setOpen(open),
    [menu],
  );
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
  }, [menuOpen, setMenuOpen]);

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
          className="fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-1/2 z-50 flex max-w-[calc(100vw-20px)] animate-[migss-dock-in_0.5s_cubic-bezier(.2,.65,.2,1)_both] items-center gap-1 overflow-hidden rounded-full border border-migss-text/10 bg-migss-bg/60 py-[7px] pr-[10px] pl-[10px] shadow-[0_10px_34px_-12px_color-mix(in_srgb,#2d2b2b_38%,transparent),inset_0_1px_0_color-mix(in_srgb,#fff_55%,transparent)] backdrop-blur-[20px] backdrop-saturate-[180%]"
        >
          {DOCK_ITEMS.map((item) => (
            <DockLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
            />
          ))}

          {/* A pre-built WhatsApp Business click-to-chat link, used verbatim:
              it is not derivable from the phone number in lib/site.ts. */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Message us on WhatsApp"
            className={cn(dockItemClass, "group")}
          >
            {/* The supplied logo file, painted through a mask so it takes the
                dock's own colour rather than its own solid black, hover
                included. Prefixed as well as unprefixed: Safari before 15.4
                ignores the unprefixed property and would paint the span's
                background unmasked, as a solid square.

                Deliberately lighter than the icons beside it, at 70% of the
                dock's ink. It is a filled mark among outlines, so it covers
                about half again as much of its box as they do and reads
                heavier at equal colour. Colour parity is given up here for
                weight parity, which is the one the eye actually judges.
                Chosen by rendering the dock at 100, 80, 75, 70, 60 and 50 and
                looking: 80 and 75 still sit heavier, 60 reads faded, like a
                disabled control, 70 is where the four settle as one set. */}
            <span
              aria-hidden="true"
              className="block h-[19px] w-[19px] flex-none bg-current/70 [-webkit-mask-image:url(/Brand/whatsapplogo.svg)] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain] [mask-image:url(/Brand/whatsapplogo.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
            />
            <DockLabel>WhatsApp</DockLabel>
          </a>

          <span
            aria-hidden="true"
            className="mx-[3px] block h-[26px] w-px flex-none bg-migss-text/15"
          />

          <a
            href={telHref}
            title="Book a free call"
            className="group flex h-[46px] min-w-0 shrink items-center rounded-full bg-migss-accent-700 px-3.5 text-migss-text no-underline transition-[background-color,transform] duration-300 active:scale-[0.94] [@media(hover:hover)]:hover:bg-migss-accent-600"
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
            <span className="ml-2 truncate text-[13.5px] font-medium whitespace-nowrap">
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
