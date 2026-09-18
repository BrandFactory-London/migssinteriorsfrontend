import { absolute, SITE_URL } from "@/lib/seo";
import { COMPANY, SITE } from "@/lib/site";
import { LOCATIONS } from "@/lib/locations";

/**
 * LocalBusiness schema for the company.
 *
 * Emitted once, in the root layout, rather than per page: it describes the
 * business, not the document, and repeating it on every route gives search
 * engines the same entity many times over.
 *
 * Everything here is already established elsewhere in the codebase — the
 * registered name, number and address from COMPANY, the phone and email from
 * SITE, the ten towns from LOCATIONS — so there is one place to correct if
 * any of it changes.
 */
export function localBusinessJsonLd() {
  // COMPANY.address is written for display, three lines ending "Ilford, IG1 4HP".
  const [building, suite, town] = COMPANY.address;
  const [locality, postcode] = town.split(",").map((part) => part.trim());

  // The second line repeats the building name for a postal label; a single
  // streetAddress should not say "Gable House" twice.
  const name = building.split(",")[0].trim();
  const room = suite.startsWith(name) ? suite.slice(name.length).trim() : suite;

  return {
    "@context": "https://schema.org" as const,
    "@type": "HomeAndConstructionBusiness" as const,
    "@id": `${SITE_URL}/#business`,
    name: "Migss Interiors",
    legalName: COMPANY.registeredName,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    image: absolute("/Brand/logo-horizontal.png"),
    logo: absolute("/Brand/logo-horizontal.png"),
    address: {
      "@type": "PostalAddress" as const,
      streetAddress: `${building}, ${room}`,
      addressLocality: locality,
      postalCode: postcode,
      addressCountry: "GB",
    },
    identifier: {
      "@type": "PropertyValue" as const,
      name: "Company number",
      value: COMPANY.number,
    },
    areaServed: LOCATIONS.map((location) => ({
      "@type": "City" as const,
      name: location.name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog" as const,
      name: "Renovation services",
      itemListElement: [
        {
          name: "Bathroom renovation",
          url: absolute("/renovation-services/bathroom"),
        },
        {
          name: "Kitchen renovation",
          url: absolute("/renovation-services/kitchen"),
        },
        {
          name: "Interior renovation",
          url: absolute("/renovation-services/interior"),
        },
      ].map((service) => ({
        "@type": "Offer" as const,
        itemOffered: {
          "@type": "Service" as const,
          name: service.name,
          url: service.url,
        },
      })),
    },
  };
}
