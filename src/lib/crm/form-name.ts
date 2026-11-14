/**
 * The "Form" value written to the Contacts CRM, worked out from the page the
 * enquiry was sent from.
 *
 * Derived from the path rather than passed in by each form placement, so it
 * keeps working when the inline forms are replaced by a single site-wide
 * enquiry card: whatever page the visitor is on decides the name. One place to
 * change if the naming ever needs to.
 */

import { landingFormName } from "@/lib/landing-pages";

const SERVICE_NAMES: Record<string, string> = {
  bathroom: "Bathroom page enquiry",
  kitchen: "Kitchen page enquiry",
  interior: "Interior page enquiry",
};

const SECTION_NAMES: Record<string, { index: string; item: string }> = {
  "renovation-services": {
    index: "Renovation services enquiry",
    item: "Renovation services enquiry",
  },
  locations: { index: "Locations enquiry", item: "Location page enquiry" },
  "our-projects": { index: "Our projects enquiry", item: "Project page enquiry" },
  resources: { index: "Resources enquiry", item: "Resources page enquiry" },
  blog: { index: "Blog enquiry", item: "Blog post enquiry" },
};

const PAGE_NAMES: Record<string, string> = {
  contact: "Contact page enquiry",
  about: "About page enquiry",
};

/** "north-london" -> "North London". */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Strips query, hash and trailing slashes; always starts with "/". */
export function cleanPath(path: string): string {
  const withoutExtras = path.split(/[?#]/)[0] ?? "";
  const trimmed = withoutExtras.replace(/\/+$/, "");
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function enquiryFormName(path: string): string {
  const clean = cleanPath(path).slice(0, 200);
  if (clean === "/") return "Homepage enquiry";

  const [section, item] = clean.slice(1).split("/");

  // Meta ads landing pages (TKT-103): one name per page, for attribution.
  if (section === "lp" && item) {
    const name = landingFormName(item);
    if (name) return name;
  }

  if (section === "renovation-services" && item && SERVICE_NAMES[item]) {
    return SERVICE_NAMES[item];
  }

  const sectionNames = SECTION_NAMES[section];
  if (sectionNames) {
    return item
      ? `${sectionNames.item}: ${titleFromSlug(decodeSafely(item))}`
      : sectionNames.index;
  }

  if (!item && PAGE_NAMES[section]) return PAGE_NAMES[section];

  return `Website enquiry: ${clean}`;
}

export function applicationFormName(roleTitle: string): string {
  const role = roleTitle.trim().slice(0, 120);
  return `Job application: ${role || "Unspecified role"}`;
}

function decodeSafely(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
