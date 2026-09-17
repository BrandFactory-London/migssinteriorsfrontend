/**
 * Business details surfaced across the site. The design exposes these as
 * editable props; here they are one source of truth for header, dock,
 * enquiry form and footer.
 */
export const SITE = {
  phone: "0208 243 2903",
  email: "info@migssinteriors.com",
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
  { href: "#enquire", label: "Contact" },
] as const;
