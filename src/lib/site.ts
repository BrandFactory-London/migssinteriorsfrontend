/**
 * Business details surfaced across the site. The design exposes these as
 * editable props; here they are one source of truth for header, dock,
 * enquiry form and footer.
 */
export const SITE = {
  phone: "0208 243 2903",
  email: "info@migssinteriors.com",
} as const;

/**
 * Registered company details.
 *
 * Taken from the legal pages, which were transcribed from the live site. The
 * Contact artboard carried a different company number and address; these are
 * the verified ones. No VAT number has been verified, so none is shown.
 */
export const COMPANY = {
  name: "Migss Tiles & Luxury Interiors",
  number: "16508162",
  address: [
    "Gable House, 1 Balfour Road",
    "Gable House Suite C, Room 3",
    "Ilford, IG1 4HP",
  ],
} as const;

export const telHref = `tel:${SITE.phone.replace(/\s+/g, "")}`;
export const mailHref = `mailto:${SITE.email}`;

/**
 * Site-wide navigation, in the order the design's full-screen menu lists it.
 * Now that the service pages exist, the dock and menu navigate between pages
 * rather than between sections of a single page — entries that are still
 * homepage anchors keep their hash.
 */
export const NAV = [
  { href: "/", label: "Home" },
  { href: "/renovation-services", label: "Renovation Services" },
  { href: "/renovation-services/bathroom", label: "Bathroom Renovation" },
  { href: "/renovation-services/kitchen", label: "Kitchen Renovation" },
  { href: "/renovation-services/interior", label: "Interior Renovation" },
  { href: "/our-projects", label: "Our Projects" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
