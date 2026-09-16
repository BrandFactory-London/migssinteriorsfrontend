/**
 * Location landing pages. The slug is the URL segment under /locations.
 * Used to pre-render the /locations/[area] routes and to reject unknown areas.
 */
export const LOCATIONS = [
  { slug: "chigwell", name: "Chigwell" },
  { slug: "epping", name: "Epping" },
  { slug: "loughton", name: "Loughton" },
  { slug: "theydon-bois", name: "Theydon Bois" },
  { slug: "hornchurch", name: "Hornchurch" },
  { slug: "brentwood", name: "Brentwood" },
  { slug: "wanstead", name: "Wanstead" },
  { slug: "woodford", name: "Woodford" },
  { slug: "chingford", name: "Chingford" },
  { slug: "ilford", name: "Ilford" },
] as const;

export type LocationSlug = (typeof LOCATIONS)[number]["slug"];

export function getLocation(slug: string) {
  return LOCATIONS.find((location) => location.slug === slug);
}
