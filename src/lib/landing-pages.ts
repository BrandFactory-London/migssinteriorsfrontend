/**
 * The ads landing pages (TKT-103): four Google Ads search pages under /lp, one
 * per room and area cluster, and two Meta pages under /lpm, one per room.
 *
 * These pages exist only as destinations for paid ads (search and social). They are not
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

/**
 * Which ads a page serves (14 Nov 2026, Amir): "google" pages under /lp are
 * room plus area, for Google Ads search campaigns with tight local
 * targeting; "meta" pages under /lpm are room only, with no town, for Meta
 * (Facebook and Instagram), whose targeting is broader.
 */
export type LandingChannel = "google" | "meta";

export type LandingPage = {
  slug: string;
  channel: LandingChannel;
  room: LandingRoom;
  /** "Bathrooms" / "Kitchens", for the kicker and form. */
  roomPlural: string;
  /** Null on the Meta pages, which name no area. */
  cluster: LandingClusterSlug | null;
  /** Area label for the kicker and form name; null on the Meta pages. */
  clusterLabel: string | null;
  /** Hero kicker after the room; defaults to the area label. */
  kicker?: string;
  /** Repeats the ad headline: keep the ads in step with this. */
  headline: string;
  subline: string;
  projectsHeading: string;
  /**
   * Wix Projects slugs shown in this page's carousel, in order. Chosen by
   * hand per page; slugs not found in Wix are skipped. Empty shows labelled
   * placeholders.
   */
  projects: string[];
  /**
   * Photos for the "Why Migss" pair and the full-width band, picked from a
   * Wix project's gallery by media id. Optional: without them the sections
   * render without photos (the band is left out).
   */
  imagery?: {
    why?: ShotRef;
    whyDetail?: ShotRef;
    band?: ShotRef & { caption: string };
  };
  metaTitle: string;
  metaDescription: string;
  /** HeroMedia slot, filled from the Wix dashboard. */
  heroSlot: string;
  heroPlaceholder: string;
  testimonials: [LandingTestimonial, LandingTestimonial];
  /**
   * Video testimonial for the first card, filmed portrait. `url` is a Wix
   * Media Manager MP4; `poster` is the thumbnail frame. Null url shows the
   * placeholder viewer.
   */
  video: { url: string | null; poster: string | null; label: string; duration: string };
  otherRoom: { label: string; href: string };
  /** The second "Explore more" row; `kicker` defaults to "Other locations". */
  otherArea: { label: string; href: string; kicker?: string };
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

/*
 * Real bathroom testimonials (supplied by Amir, 14 Nov 2026, with the
 * customers' permission for ads and the site). Quoted verbatim; the hero
 * card carries one sentence of each and the reviews section the full text.
 */
const BILAL_FULL =
  "We are over-the-moon with how the bathroom has turned out, it is exactly how we envisioned it. The project went as planned to the millimetre so we can definitely recommend Migss for your renovation.";
const BILAL_SHORT =
  "The project went as planned to the millimetre so we can definitely recommend Migss for your renovation.";
const DUANE_FULL =
  "I had a really strong vision of how I wanted the rooms to look, and Migss truly helped us bring that idea to life. We collaborated back and forth on paper designs, and they brought some incredible, creative suggestions to the table that we hadn't even considered. The quality of the work is simply outstanding. Having previously done renovations in high-end properties, I thought I knew what top-tier quality looked like, but this is on an entirely different level.";
const DUANE_SHORT =
  "Having previously done renovations in high-end properties, I thought I knew what top-tier quality looked like, but this is on an entirely different level.";

/** A gallery photo of a Wix project: the project's slug and the photo's media id. */
export type ShotRef = { project: string; media: string };

/*
 * Facts the warmer layout (TKT-103, 14 Nov 2026) can show once Migss confirms
 * them. Null hides the wording that depends on them, so nothing unverified
 * goes live:
 * - the Google review count ("5.0 from N Google reviews"; else "Google rating")
 * - the callback time under the form ("usually <time>"; else no time given)
 * - a photo of whoever does the consultations, beside the hero line
 */
/** "100+" confirmed by Amir, 15 Nov 2026 (verified claims doc). */
export const GOOGLE_REVIEW_COUNT: string | null = "100+";
export const CALLBACK_TIME: string | null = null;
/** Mo, supplied by Amir 15 Nov 2026. Not named on the page. */
/**
 * The line beside the MD's photo in every landing hero (Amir, 16 Nov 2026):
 * "Our managing director takes messages on his personal WhatsApp. No
 * obligation." Split so the WhatsApp words carry the underline.
 */
export const MD_LINE_LEAD = "Our managing director takes messages on";
export const MD_LINE_LINK = "his personal WhatsApp";
export const MD_LINE_TAIL = ". No obligation.";

export const CONSULTANT_PHOTO: string | null = "/images/landing/consultant.jpg";

export const LANDING_PAGES: readonly LandingPage[] = [
  {
    slug: "bathrooms-north-london",
    channel: "google",
    room: "Bathroom",
    roomPlural: "Bathrooms",
    cluster: "north-london",
    clusterLabel: "North London",
    // Copy option B (15 Nov 2026): local proof in the headline.
    headline: "Luxury bathroom renovation in north London, recently completed in Hampstead Garden Suburb",
    subline:
      "Designed, built and guaranteed by our own team since 2001, from Hampstead to Cockfosters. Rated 5.0 from 100+ Google reviews.",
    projectsHeading: "Recently completed in north London",
    projects: ["family-bathroom-hampstead-garden-suburb"],
    metaTitle: "Luxury Bathroom Renovation in North London | Migss Interiors",
    metaDescription:
      "Recently completed in Hampstead Garden Suburb. Luxury bathroom renovation by our own team since 2001, rated 5.0 on Google. Book a design consultation.",
    heroSlot: "lp-bathrooms-north-london-hero",
    heroPlaceholder: "Hero: finished luxury bathroom, north London",
    testimonials: [
      { quote: BILAL_SHORT, name: "Bilal", area: "Hampstead Garden Suburb" },
      { quote: BILAL_FULL, name: "Bilal", area: "Hampstead Garden Suburb" },
    ],
    video: {
      url: "https://video.wixstatic.com/video/8bde49_09edd105f09e45f5954004ae63cc15da/1080p/mp4/file.mp4",
      poster: "https://static.wixstatic.com/media/8bde49_a8188e05f9b04292be51d8d8ede1e0df~mv2.jpg",
      label: "Bilal, Hampstead Garden Suburb",
      duration: "0:27",
    },
    otherRoom: { label: "Interested in kitchens?", href: "/lp/kitchens-north-london" },
    otherArea: {
      label: "In east London or Essex? See Chigwell bathrooms",
      href: "/lp/bathrooms-chigwell-essex",
    },
  },
  {
    slug: "kitchens-north-london",
    channel: "google",
    room: "Kitchen",
    roomPlural: "Kitchens",
    cluster: "north-london",
    clusterLabel: "North London",
    headline: "Luxury kitchen renovation in north London",
    subline: SUB_NORTH,
    projectsHeading: "Recently completed in north London",
    projects: ["family-bathroom-hampstead-garden-suburb"],
    metaTitle: "Luxury Kitchen Renovation in North London | Migss Interiors",
    metaDescription:
      "Luxury kitchen renovation from Hampstead to Cockfosters, designed, built and guaranteed by our own in-house team. Book a design consultation.",
    heroSlot: "lp-kitchens-north-london-hero",
    heroPlaceholder: "Hero: finished luxury kitchen, north London",
    testimonials: placeholderTestimonials("kitchen", ["Highgate", "Muswell Hill"]),
    video: { url: null, poster: null, label: "[First name], Highgate", duration: "[1:30]" },
    otherRoom: { label: "Interested in bathrooms?", href: "/lp/bathrooms-north-london" },
    otherArea: {
      label: "In east London or Essex? See Chigwell kitchens",
      href: "/lp/kitchens-chigwell-essex",
    },
  },
  {
    slug: "bathrooms-chigwell-essex",
    channel: "google",
    room: "Bathroom",
    roomPlural: "Bathrooms",
    cluster: "essex-forest",
    clusterLabel: "Chigwell & Essex",
    // Copy option B (15 Nov 2026): local proof in the headline.
    headline: "Luxury bathroom renovation in Chigwell and Essex, recently completed in Chigwell and Theydon Bois",
    subline:
      "Designed, built and guaranteed by our own team since 2001, across the Essex forest towns and the commuter belt. Rated 5.0 from 100+ Google reviews.",
    projectsHeading: "Recently completed in Chigwell and Essex",
    projects: ["versace-wet-room-chigwell", "main-bathroom-theydon-bois", "basement-home-cinema-chigwell"],
    imagery: {
      why: { project: "versace-wet-room-chigwell", media: "8bde49_eff1643aab2a4cc99efef058c80bd34d" },
      whyDetail: { project: "versace-wet-room-chigwell", media: "8bde49_864c0bdc8dec48a186c6df6f1f7aa48f" },
      band: {
        project: "versace-wet-room-chigwell",
        media: "8bde49_87961bf90e6a42f3836b94b16d03b7b6",
        caption: "Versace Wet Room, Chigwell",
      },
    },
    metaTitle: "Luxury Bathroom Renovation in Chigwell & Essex | Migss",
    metaDescription:
      "Recently completed in Chigwell. Luxury bathroom renovation by our own team since 2001, rated 5.0 on Google. Book a design consultation.",
    heroSlot: "lp-bathrooms-chigwell-essex-hero",
    heroPlaceholder: "Hero: finished luxury bathroom, Chigwell",
    testimonials: [
      { quote: DUANE_SHORT, name: "Duane", area: "Chigwell" },
      { quote: DUANE_FULL, name: "Duane", area: "Chigwell" },
    ],
    video: {
      url: "https://video.wixstatic.com/video/8bde49_becbec327f3e4db893c4da89389f46ae/1080p/mp4/file.mp4",
      poster: "https://static.wixstatic.com/media/8bde49_8d9ed3028b13411cb0d0f7c35100fc63~mv2.jpg",
      label: "Duane, Chigwell",
      duration: "0:54",
    },
    otherRoom: { label: "Interested in kitchens?", href: "/lp/kitchens-chigwell-essex" },
    otherArea: {
      label: "In north London? See north London bathrooms",
      href: "/lp/bathrooms-north-london",
    },
  },
  {
    slug: "kitchens-chigwell-essex",
    channel: "google",
    room: "Kitchen",
    roomPlural: "Kitchens",
    cluster: "essex-forest",
    clusterLabel: "Chigwell & Essex",
    headline: "Luxury kitchen renovation in Chigwell and Essex",
    subline: SUB_EAST,
    projectsHeading: "Recently completed in Chigwell and Essex",
    projects: ["basement-home-cinema-chigwell", "versace-wet-room-chigwell", "main-bathroom-theydon-bois"],
    metaTitle: "Luxury Kitchen Renovation in Chigwell & Essex | Migss Interiors",
    metaDescription:
      "Luxury kitchen renovation across Chigwell, east London and the Essex forest towns, designed, built and guaranteed by our own team. Book a design consultation.",
    heroSlot: "lp-kitchens-chigwell-essex-hero",
    heroPlaceholder: "Hero: finished luxury kitchen, Chigwell",
    testimonials: placeholderTestimonials("kitchen", ["Buckhurst Hill", "Loughton"]),
    video: { url: null, poster: null, label: "[First name], Buckhurst Hill", duration: "[1:30]" },
    otherRoom: { label: "Interested in bathrooms?", href: "/lp/bathrooms-chigwell-essex" },
    otherArea: {
      label: "In north London? See north London kitchens",
      href: "/lp/kitchens-north-london",
    },
  },
];

/** False until real testimonials replace the placeholders above. */
export const testimonialsReady = false;

/*
 * Meta (Facebook and Instagram) landing pages under /lpm: the same layout,
 * room only, no town in the copy. The service area is mentioned once, the
 * way the rest of the site does, without limiting the offer.
 */
const SUB_META =
  "Designed, built and guaranteed by our own in-house team, across north London, east London and Essex.";

export const META_LANDING_PAGES: readonly LandingPage[] = [
  {
    slug: "bathrooms",
    channel: "meta",
    room: "Bathroom",
    roomPlural: "Bathrooms",
    cluster: null,
    clusterLabel: null,
    // Copy option D (15 Nov 2026), headline replaced 16 Nov 2026 (Amir):
    // say what the page is in the first second.
    kicker: "Luxury renovation",
    headline: "Luxury bathroom renovations, designed, supplied and fitted. Guaranteed for 10 years.",
    subline:
      "Bespoke bathrooms designed, built and guaranteed by our own in-house team, across north London, east London, the Essex forest towns and the commuter belt.",
    projectsHeading: "Recent renovations",
    projects: [
      "versace-wet-room-chigwell",
      "family-bathroom-hampstead-garden-suburb",
      "main-bathroom-theydon-bois",
    ],
    imagery: {
      why: { project: "versace-wet-room-chigwell", media: "8bde49_eff1643aab2a4cc99efef058c80bd34d" },
      whyDetail: { project: "versace-wet-room-chigwell", media: "8bde49_864c0bdc8dec48a186c6df6f1f7aa48f" },
      band: {
        project: "versace-wet-room-chigwell",
        media: "8bde49_87961bf90e6a42f3836b94b16d03b7b6",
        caption: "Versace Wet Room",
      },
    },
    metaTitle: "Luxury Bathroom Renovation | Migss Interiors",
    metaDescription:
      "Luxury bathrooms designed, built and guaranteed by our own team across north London, east London and Essex. 5.0 on Google. Book a design consultation.",
    heroSlot: "lpm-bathrooms-hero",
    heroPlaceholder: "Hero: finished luxury bathroom",
    testimonials: [
      { quote: DUANE_SHORT, name: "Duane", area: "Chigwell" },
      { quote: BILAL_FULL, name: "Bilal", area: "Hampstead Garden Suburb" },
    ],
    video: {
      url: "https://video.wixstatic.com/video/8bde49_becbec327f3e4db893c4da89389f46ae/1080p/mp4/file.mp4",
      poster: "https://static.wixstatic.com/media/8bde49_8d9ed3028b13411cb0d0f7c35100fc63~mv2.jpg",
      label: "Duane, Chigwell",
      duration: "0:54",
    },
    otherRoom: { label: "Interested in kitchens?", href: "/lpm/kitchens" },
    otherArea: { kicker: "Our work", label: "See all our projects", href: "/our-projects" },
  },
  {
    slug: "kitchens",
    channel: "meta",
    room: "Kitchen",
    roomPlural: "Kitchens",
    cluster: null,
    clusterLabel: null,
    kicker: "Design and build",
    headline: "Luxury kitchen renovation, designed and built by one team",
    subline: SUB_META,
    projectsHeading: "Recent renovations",
    projects: ["kitchen-extension-grays"],
    metaTitle: "Luxury Kitchen Renovation | Migss Interiors",
    metaDescription:
      "Luxury kitchen renovation designed, built and guaranteed by our own in-house team, across north London, east London and Essex. Book a design consultation.",
    heroSlot: "lpm-kitchens-hero",
    heroPlaceholder: "Hero: finished luxury kitchen",
    testimonials: [
      {
        quote: "[Short, specific kitchen testimonial]",
        name: "[First name]",
        area: "[Area]",
      },
      {
        quote: "[Second kitchen testimonial, outcome focused]",
        name: "[First name]",
        area: "[Area]",
      },
    ],
    video: { url: null, poster: null, label: "[First name], [Area]", duration: "[1:30]" },
    otherRoom: { label: "Interested in bathrooms?", href: "/lpm/bathrooms" },
    otherArea: { kicker: "Our work", label: "See all our projects", href: "/our-projects" },
  },
];

/** The URL folder for each channel. */
export const LANDING_BASE: Record<LandingChannel, "/lp" | "/lpm"> = {
  google: "/lp",
  meta: "/lpm",
};

export function landingPath(page: LandingPage): string {
  return `${LANDING_BASE[page.channel]}/${page.slug}`;
}

export function getLandingPage(
  slug: string,
  channel: LandingChannel = "google",
): LandingPage | undefined {
  const pages = channel === "meta" ? META_LANDING_PAGES : LANDING_PAGES;
  return pages.find((page) => page.slug === slug);
}

/** "Bathrooms, North London" on /lp; "Bathrooms" on /lpm. */
export function landingLabel(page: LandingPage): string {
  return page.clusterLabel ? `${page.roomPlural}, ${page.clusterLabel}` : page.roomPlural;
}

/**
 * The CRM "Form" value: "Google LP: Bathrooms, North London" for /lp pages,
 * "Meta LP: Bathrooms" for /lpm pages, so leads show which channel sent them.
 */
export function landingFormName(
  slug: string,
  channel: LandingChannel = "google",
): string | null {
  const page = getLandingPage(slug, channel);
  if (!page) return null;
  return `${channel === "meta" ? "Meta" : "Google"} LP: ${landingLabel(page)}`;
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

/*
 * Bathroom copy approved 15 Nov 2026 (copy doc "Migss bathroom landing
 * pages: copy options"; claims added to the verified claims doc the same
 * day). Kitchen pages keep WHY_MIGSS until their copy is done.
 */
export const WHY_MIGSS_BATHROOM = [
  {
    title: "One firm, one contract, in-house only",
    body: "One accountable team from specification to handover, and every fitter is on our own payroll. We never use subcontractors, so the team that starts your bathroom finishes it.",
  },
  {
    title: "A client portal, updated daily",
    body: "Follow your project at any time: daily updates with photos, a direct line to each fitter, and a schedule of which trades are booked in, so you always know who is in your home.",
  },
  {
    title: "Specified before we start",
    body: "Materials, fittings and layout are agreed before a tile is cut, so there are no surprises halfway through.",
  },
  {
    title: "Guaranteed for ten years",
    body: "All our labour carries a 10-year guarantee. Product failure is covered by the manufacturer's own warranty.",
  },
] as const;

/** "What you won't have to manage": crossed off one by one on scroll. */
export const NOT_MANAGED = [
  {
    title: "Coordinating trades",
    body: "One team runs the whole job. Our own fitters do every stage, so there is one source of responsibility and nothing gets lost between trades who don't talk to each other.",
  },
  {
    title: "Decisions made on site",
    body: "Every tile, fitting and finish is agreed before work starts. Nothing waits on a late choice, which is what usually pushes a renovation into the long grass.",
  },
  {
    title: "Chasing for updates",
    body: "Your client portal shows progress every day, with photos from site. You also have the director's number for the whole project, to call whenever you need.",
  },
  {
    title: "Sourcing the products",
    body: "Supply and fit is optional. We order through our luxury bathroom and tile partners at trade rates, and deal with any supply or product issues. Once you sign off the specification, it is all handled.",
  },
  {
    title: "Protecting your home",
    body: "Floors are covered, door handles protected and furniture kept under dust sheets from the first day. We look after the rest of your home as carefully as the room we are building.",
  },
  {
    title: "Worrying about it later",
    body: "Our labour is guaranteed for ten years, and the director's personal number stays yours for all of it. He stands behind every installation we do. Product failure is covered by the manufacturer's own warranty.",
  },
] as const;

/** Finance wording for the bathroom pages: installation is the point. */
export const FINANCE_INSTALL_TITLE = "0% finance, including installation";
export const FINANCE_INSTALL_BODY =
  "0% finance available for up to 5 years, on installation as well as products. Spreading the cost of installation can let you choose a higher specification.";

export function landingFaqs(room: LandingRoom) {
  if (room === "Bathroom") {
    return [
      {
        q: "Which areas do you cover?",
        a: "North London from Hampstead to Cockfosters, and east London and Essex, including Chigwell, Buckhurst Hill, Woodford Green, Theydon Bois, Brentwood and Hornchurch.",
      },
      ...baseFaqs(room),
      {
        q: "What happens after you finish?",
        a: "We walk through the room with you, hand over the documents for everything we have installed, and aftercare is available after completion.",
      },
    ];
  }
  return baseFaqs(room);
}

function baseFaqs(room: LandingRoom) {
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
