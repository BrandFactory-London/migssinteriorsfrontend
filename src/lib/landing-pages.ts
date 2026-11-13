/**
 * The four Meta ads landing pages (TKT-103), one per room and area cluster.
 *
 * These pages exist only as destinations for paid social ads. They are not
 * linked from the menu, footer or any other site page, carry `noindex`, and
 * are left out of the sitemap, so every visit and lead on them came from an
 * ad (Locked decision, 13 Nov 2026). They are deliberately not blocked in
 * robots.txt: Meta crawls ad destinations during review.
 *
 * Copy follows the Migss verified claims and brand voice docs: no pound
 * values, no "free quote", areas only, and finance always with its terms.
 * The two testimonials per page are placeholders until real, evidenced
 * reviews are supplied; `testimonialsReady` stays false until then so the
 * pages are not used in live ads with placeholder proof.
 *
 * Pure data with no server imports, so the CRM form-name module can read it.
 */

export type LandingRoom = "Bathroom" | "Kitchen";
export type LandingClusterSlug = "north-london" | "essex-forest";

export type LandingTestimonial = {
  quote: string;
  /** First name and area only (verified claims rule 5). */
  name: string;
  area: string;
};

export type LandingPage = {
  slug: string;
  room: LandingRoom;
  /** "Bathrooms" / "Kitchens", for the kicker and form. */
  roomPlural: string;
  cluster: LandingClusterSlug;
  /** Area label for the kicker and form name. */
  clusterLabel: string;
  /** Repeats the ad headline: keep the ads in step with this. */
  headline: string;
  subline: string;
  projectsHeading: string;
  metaTitle: string;
  metaDescription: string;
  /** HeroMedia slot, filled from the Wix dashboard. */
  heroSlot: string;
  heroPlaceholder: string;
  testimonials: [LandingTestimonial, LandingTestimonial];
  /** Video testimonial for the first card; null hides the strip. */
  video: { url: string | null; label: string; duration: string };
  otherRoom: { label: string; href: string };
  otherArea: { label: string; href: string };
};

const SUB_NORTH =
  "Designed, built and guaranteed by our own team, from Hampstead to Cockfosters.";
const SUB_EAST =
  "Designed, built and guaranteed by our own team, across Chigwell, east London and the Essex forest towns.";

function placeholderTestimonials(
  room: string,
  areas: [string, string],
): [LandingTestimonial, LandingTestimonial] {
  return [
    {
      quote: `[Short, specific ${room} testimonial from this area]`,
      name: "[First name]",
      area: areas[0],
    },
    {
      quote: "[Second testimonial, outcome focused, same room and area]",
      name: "[First name]",
      area: areas[1],
    },
  ];
}

export const LANDING_PAGES: readonly LandingPage[] = [
  {
    slug: "bathrooms-north-london",
    room: "Bathroom",
    roomPlural: "Bathrooms",
    cluster: "north-london",
    clusterLabel: "North London",
    headline: "Luxury bathroom renovation in north London",
    subline: SUB_NORTH,
    projectsHeading: "Recently completed in north London",
    metaTitle: "Luxury Bathroom Renovation in North London | Migss Interiors",
    metaDescription:
      "Luxury bathroom renovation from Hampstead to Cockfosters, designed, built and guaranteed by our own in-house team. Book a design consultation.",
    heroSlot: "lp-bathrooms-north-london-hero",
    heroPlaceholder: "Hero: finished luxury bathroom, north London",
    testimonials: placeholderTestimonials("bathroom", ["Highgate", "Muswell Hill"]),
    video: { url: null, label: "[First name], Highgate", duration: "[1:30]" },
    otherRoom: { label: "Interested in kitchens?", href: "/lp/kitchens-north-london" },
    otherArea: {
      label: "In east London or Essex? See Chigwell bathrooms",
      href: "/lp/bathrooms-chigwell-essex",
    },
  },
  {
    slug: "kitchens-north-london",
    room: "Kitchen",
    roomPlural: "Kitchens",
    cluster: "north-london",
    clusterLabel: "North London",
    headline: "Luxury kitchen renovation in north London",
    subline: SUB_NORTH,
    projectsHeading: "Recently completed in north London",
    metaTitle: "Luxury Kitchen Renovation in North London | Migss Interiors",
    metaDescription:
      "Luxury kitchen renovation from Hampstead to Cockfosters, designed, built and guaranteed by our own in-house team. Book a design consultation.",
    heroSlot: "lp-kitchens-north-london-hero",
    heroPlaceholder: "Hero: finished luxury kitchen, north London",
    testimonials: placeholderTestimonials("kitchen", ["Highgate", "Muswell Hill"]),
    video: { url: null, label: "[First name], Highgate", duration: "[1:30]" },
    otherRoom: { label: "Interested in bathrooms?", href: "/lp/bathrooms-north-london" },
    otherArea: {
      label: "In east London or Essex? See Chigwell kitchens",
      href: "/lp/kitchens-chigwell-essex",
    },
  },
  {
    slug: "bathrooms-chigwell-essex",
    room: "Bathroom",
    roomPlural: "Bathrooms",
    cluster: "essex-forest",
    clusterLabel: "Chigwell & Essex",
    headline: "Luxury bathroom renovation in Chigwell and Essex",
    subline: SUB_EAST,
    projectsHeading: "Recently completed in Chigwell and Essex",
    metaTitle: "Luxury Bathroom Renovation in Chigwell & Essex | Migss Interiors",
    metaDescription:
      "Luxury bathroom renovation across Chigwell, east London and the Essex forest towns, designed, built and guaranteed by our own team. Book a design consultation.",
    heroSlot: "lp-bathrooms-chigwell-essex-hero",
    heroPlaceholder: "Hero: finished luxury bathroom, Chigwell",
    testimonials: placeholderTestimonials("bathroom", ["Buckhurst Hill", "Loughton"]),
    video: { url: null, label: "[First name], Buckhurst Hill", duration: "[1:30]" },
    otherRoom: { label: "Interested in kitchens?", href: "/lp/kitchens-chigwell-essex" },
    otherArea: {
      label: "In north London? See north London bathrooms",
      href: "/lp/bathrooms-north-london",
    },
  },
  {
    slug: "kitchens-chigwell-essex",
    room: "Kitchen",
    roomPlural: "Kitchens",
    cluster: "essex-forest",
    clusterLabel: "Chigwell & Essex",
    headline: "Luxury kitchen renovation in Chigwell and Essex",
    subline: SUB_EAST,
    projectsHeading: "Recently completed in Chigwell and Essex",
    metaTitle: "Luxury Kitchen Renovation in Chigwell & Essex | Migss Interiors",
    metaDescription:
      "Luxury kitchen renovation across Chigwell, east London and the Essex forest towns, designed, built and guaranteed by our own team. Book a design consultation.",
    heroSlot: "lp-kitchens-chigwell-essex-hero",
    heroPlaceholder: "Hero: finished luxury kitchen, Chigwell",
    testimonials: placeholderTestimonials("kitchen", ["Buckhurst Hill", "Loughton"]),
    video: { url: null, label: "[First name], Buckhurst Hill", duration: "[1:30]" },
    otherRoom: { label: "Interested in bathrooms?", href: "/lp/bathrooms-chigwell-essex" },
    otherArea: {
      label: "In north London? See north London kitchens",
      href: "/lp/kitchens-north-london",
    },
  },
];

/** False until real testimonials replace the placeholders above. */
export const testimonialsReady = false;

export function getLandingPage(slug: string): LandingPage | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}

/** The CRM "Form" value, e.g. "Meta LP: Bathrooms, North London". */
export function landingFormName(slug: string): string | null {
  const page = getLandingPage(slug);
  return page ? `Meta LP: ${page.roomPlural}, ${page.clusterLabel}` : null;
}

export const FINANCE_LINE =
  "0% finance available for up to 5 years. See terms and conditions.";
export const FINANCE_TERMS_HREF = "/finance#terms";

export const WHY_MIGSS = [
  {
    title: "One firm, one contract",
    body: "One accountable team from specification to handover, so there is no one else to chase.",
  },
  {
    title: "Our own fitters",
    body: "A fully in-house team of 20+ fitters. We never use subcontractors.",
  },
  {
    title: "Specified before we start",
    body: "Materials, fittings and layout are agreed before work starts on site.",
  },
  {
    title: "Works with your designer",
    body: "Already have a designer or architect? We work alongside them.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    title: "Enquiry",
    body: "Tell us about the room. We talk through scope, timing and fit.",
  },
  {
    title: "Design consultation",
    body: "A senior member of our team visits your home to see the space.",
  },
  {
    title: "Specification and proposal",
    body: "Materials, fittings, layout and timeline, set out in a proposal fixed against the agreed scope.",
  },
  {
    title: "Installation and handover",
    body: "Our own team runs the work. We finish with a walk-through, your handover pack and aftercare.",
  },
] as const;

export function landingFaqs(room: LandingRoom) {
  return [
    {
      q: "Do you use subcontractors?",
      a: "No. Every project is delivered by our own in-house team of 20+ fitters, so the same hands carry your project from start to finish.",
    },
    room === "Bathroom"
      ? {
          q: "How long does a bathroom take?",
          a: "Most bathrooms take two to four weeks from strip-out to final snag. Larger or more complex specifications can take up to eight.",
        }
      : {
          q: "What happens at the design consultation?",
          a: "A senior member of our team visits your home to see the space and talk through scope, timing and specification. We then prepare a proposal fixed against the agreed scope.",
        },
    {
      q: "Can you work with my designer or architect?",
      a: "Yes. If you already have a designer or architect, we work alongside them and build to their specification.",
    },
    {
      q: "What does the guarantee cover?",
      a: "All our labour carries a 10-year guarantee. Product failure is excluded and covered by the manufacturer's own warranty.",
    },
  ];
}

/** Sections the progress rail tracks, in page order. */
export const RAIL_SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "why-migss", label: "Why us" },
  { id: "process", label: "Process" },
  { id: "reviews", label: "Reviews" },
  { id: "book", label: "Book" },
  { id: "faqs", label: "FAQs" },
  { id: "explore", label: "Explore" },
] as const;
