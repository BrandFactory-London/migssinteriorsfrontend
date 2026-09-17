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

/** Section anchors, shared by the dock, the mobile menu and the footer. */
export const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "services", label: "Renovation Services" },
  { id: "work", label: "Our Projects" },
  { id: "resources", label: "Resources & Insights" },
  { id: "areas", label: "Locations" },
  { id: "about", label: "About" },
  { id: "enquire", label: "Contact" },
] as const;
