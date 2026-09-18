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
 * Registered company details, for formal use — the Contact page's
 * registered-address block.
 *
 * `registeredName` carries the Ltd suffix deliberately, and is named so that
 * it cannot be mistaken for a general-purpose company name: the legal pages
 * refer to the company in prose without the suffix, matching the live site,
 * and keep their own wording rather than reading from here.
 *
 * The Contact artboard carried a different company number and address; these
 * are the verified ones. No VAT number has been verified, so none is shown.
 */
export const COMPANY = {
  registeredName: "Migss Tiles & Luxury Interiors Ltd",
  number: "16508162",
  address: [
    "Gable House, 1 Balfour Road",
    "Gable House Suite C, Room 3",
    "Ilford, IG1 4HP",
  ],
} as const;

/**
 * The WhatsApp Business click-to-chat link, as issued by WhatsApp. It carries
 * its own short code rather than a phone number, so it is stored verbatim and
 * deliberately not derived from `SITE.phone`.
 */
export const WHATSAPP_URL = "https://wa.me/message/LVSH5BUPL5X7B1";

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
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
