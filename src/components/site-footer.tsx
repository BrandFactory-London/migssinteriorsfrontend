import { SITE, telHref, mailHref } from "@/lib/site";
import { Wordmark } from "@/components/wordmark";

const EXPLORE = [
  { href: "#top", label: "Home" },
  { href: "/renovation-services", label: "Renovation Services" },
  { href: "/our-projects", label: "Our Projects" },
  { href: "/resources", label: "Resources & Insights" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
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
    <footer className="mt-[clamp(36px,7.5vw,84px)] bg-migss-neutral-900 text-migss-neutral-200">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(22px,3.5vw,44px)] px-[clamp(16px,4.5vw,48px)] py-[clamp(30px,6vw,60px)]">
        <div>
          <Wordmark size="lg" />
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
            Luxury bathroom, kitchen and interior renovation across London &amp;
            Essex.
          </p>
        </div>

        <FooterNav heading="Explore" links={EXPLORE} />
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
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="flex min-h-[44px] items-center text-[15px] text-inherit no-underline transition-colors [@media(hover:hover)]:hover:text-migss-accent-300"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
