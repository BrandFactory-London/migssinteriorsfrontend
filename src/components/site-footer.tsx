import Link from "next/link";

import { SITE, telHref, mailHref, CLIENT_LOGIN_PATH } from "@/lib/site";
import { Logo } from "@/components/logo";
import { DARK_BEHIND_HEADER } from "@/lib/header-ink";

const SERVICES_LINKS = [
  { href: "/renovation-services", label: "Renovation Services" },
  { href: "/renovation-services/bathroom", label: "Bathroom Renovation" },
  { href: "/renovation-services/kitchen", label: "Kitchen Renovation" },
  { href: "/renovation-services/interior", label: "Interior Renovation" },
];

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/our-projects", label: "Our Projects" },
  { href: "/resources", label: "Resources & Insights" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/join-the-team", label: "Join the Team" },
  { href: "/contact", label: "Contact" },
];

const LEGAL = [
  { href: "/terms-of-use", label: "Terms of Use" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/labour-guarantee", label: "Labour Guarantee" },
  { href: "/product-warantee", label: "Product Warranty" },
];

export function SiteFooter() {
  return (
    <footer
      {...DARK_BEHIND_HEADER}
      className="mt-[clamp(36px,7.5vw,84px)] bg-migss-neutral-900 text-migss-neutral-200"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(22px,3.5vw,44px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,60px)]">
        <div>
          <Logo height={44} />
          <p className="mt-[18.4px] text-[14.5px] leading-[1.9]">
            <a href={telHref} className="text-migss-accent-300 no-underline">
              {SITE.phone}
            </a>
            <br />
            <a href={mailHref} className="text-migss-accent-300 no-underline">
              {SITE.email}
            </a>
          </p>
          <p className="mt-[13.8px] text-[13px] leading-[1.75] text-migss-neutral-400">
            High-end bathroom, kitchen and interior renovation across north
            London and Chigwell.
          </p>
          {/* The same chip as in the menu, so a client recognises it in
              either place. */}
          <Link
            href={CLIENT_LOGIN_PATH}
            className="mt-[18.4px] inline-flex min-h-[40px] items-center gap-2 rounded-full border border-migss-accent-400 bg-migss-accent-300/12 px-4 text-[11px] font-medium tracking-[0.24em] text-migss-accent-300 uppercase no-underline transition-colors active:bg-migss-accent-300/20 [@media(hover:hover)]:hover:bg-migss-accent-300/20"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4.5" y="10.5" width="15" height="10" rx="1.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
            Client Login
          </Link>
        </div>

        <FooterNav heading="Services" links={SERVICES_LINKS} />
        <FooterNav heading="Explore" links={EXPLORE} />
        {/* The new shared footer drops the Legal column. Kept here because
            removing the only route to the policy pages is a compliance
            regression rather than a design change. */}
        <FooterNav heading="Legal" links={LEGAL} />
      </div>

      <div className="border-t border-migss-neutral-200/20">
        {/* Bottom padding keeps the copyright line clear of the dock. */}
        <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-[9.2px] px-[clamp(16px,4.5vw,48px)] pt-[18.4px] pb-[calc(18.4px+72px)] text-[12.5px] text-migss-neutral-400">
          <span>© 2026 Migss Interiors. All rights reserved.</span>
          <span>Powered by BrandFactory London.</span>
        </div>
      </div>
    </footer>
  );
}

const footerLinkClass =
  "flex min-h-[44px] items-center text-[15px] text-inherit no-underline transition-colors [@media(hover:hover)]:hover:text-migss-accent-300";

function FooterNav({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={heading} className="flex flex-col">
      <h2 className="font-body mb-[9.2px] text-[11px] font-medium tracking-[0.18em] uppercase text-migss-neutral-400">
        {heading}
      </h2>
      {links.map((link) =>
        // In-page anchors stay plain <a>; they never change route.
        link.href.startsWith("#") ? (
          <a key={link.label} href={link.href} className={footerLinkClass}>
            {link.label}
          </a>
        ) : (
          <Link key={link.label} href={link.href} className={footerLinkClass}>
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
