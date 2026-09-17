/**
 * Placeholder project data for /our-projects and /our-projects/[slug].
 *
 * The twelve entries and their copy come from the Claude Design artboard.
 * This is deliberately a typed local array: Phase 4 replaces it with the
 * ShowcaseProjects CMS query, and keeping the shape explicit here is what
 * makes that swap mechanical.
 *
 * Only the Manor Road wet room carries the full case-study content, because
 * that is the one project the detail artboard specifies. Every other entry
 * has the core fields; the detail template renders the richer blocks only
 * when they are present, so a half-populated project still looks deliberate.
 */

export type ProjectCategory = "Bathroom" | "Kitchen" | "Interior";

export type Project = {
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  /** One or more paragraphs of case-study copy. */
  narrative: string[];
  /** How many shots the gallery carousel holds. */
  imageCount: number;

  /** Short line used on the listing card. */
  blurb: string;
  /** Postcode shown in the detail page's fact strip. */
  postcode: string;
  programme: string;
  scope: string;
  completed: string;
  /** Promoted into the listing page's featured carousel. */
  featured?: boolean;

  /** The brief, as a line the owners actually said. */
  brief?: string;
  before?: string;
  /** Materials and finishes, as label/value rows. */
  spec?: { label: string; value: string }[];
  quote?: { text: string; source: string };
  /** Per-shot captions. Falls back to a numbered caption when absent. */
  shots?: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "manor-road-chigwell-marble-wet-room",
    title: "Book-matched marble wet room",
    location: "Manor Road, Chigwell",
    postcode: "Chigwell, IG7",
    category: "Bathroom",
    featured: true,
    completed: "Completed March 2026",
    programme: "4 weeks",
    scope: "Strip-out & rebuild",
    blurb:
      "Linear drain, concealed brassware and a matched slab behind the vanity.",
    imageCount: 6,
    brief: "“A hotel bathroom, but one we can actually clean.”",
    narrative: [
      "The owners had lived with a 1990s ensuite for eleven years: a corner bath nobody used, a shower cubicle that leaked into the ceiling below, and storage in a freestanding cabinet. They wanted one large walk-in shower, twin basins, and no grout lines running through the middle of the room.",
      "We moved the doorway 400mm to square off the room, formed a fully tanked wet area with a linear drain, and set out a book-matched Calacatta slab so the veining mirrors across the shower wall. Brassware is concealed, the heating is underfloor and zoned, and every service is accessible behind a removable panel in the adjoining cupboard.",
    ],
    before:
      "Corner bath, leaking cubicle and a boxed-in soil stack eating 600mm of floor. The stack was re-boxed tight and clad in matching stone, recovering enough width for the second basin.",
    spec: [
      { label: "Stone", value: "Calacatta Viola, book-matched" },
      { label: "Brassware", value: "Concealed thermostatic, brushed brass" },
      { label: "Heating", value: "Wet underfloor, separate zone" },
      { label: "Joinery", value: "Bespoke vanity in oiled oak" },
    ],
    quote: {
      text: "“They set the stone out on the floor and walked us through every cut before anything went on the wall. Four weeks, to the day.”",
      source: "Homeowner · Manor Road, Chigwell",
    },
    shots: [
      "The wet area, seen from the doorway",
      "Veining mirrored across the shower wall",
      "Bespoke oak vanity with backlit mirrors",
      "Concealed thermostatic brassware in brushed brass",
      "Linear drain, with falls formed in the screed",
      "Recessed niche cut from the same slab",
    ],
  },
  {
    slug: "nightingale-lane-wanstead-open-plan-kitchen",
    title: "Open-plan kitchen & dining",
    location: "Nightingale Lane, Wanstead",
    postcode: "Wanstead, E11",
    category: "Kitchen",
    featured: true,
    completed: "Completed February 2026",
    programme: "7 weeks",
    scope: "Structural opening & fit-out",
    blurb:
      "Structural opening, in-frame cabinetry and a quartz island seating five.",
    imageCount: 6,
    narrative: [
      "A rear reception and a galley kitchen separated by a load-bearing wall, in a house where everyone ate in the hallway-facing dining room and nobody used the garden.",
      "We formed a single opening on a steel goalpost frame, ran one floor level through both spaces, and built the kitchen around a five-seat island so the cooking side faces the room rather than the wall.",
    ],
  },
  {
    slug: "hermitage-walk-south-woodford-whole-home",
    title: "Four-bedroom home, top to bottom",
    location: "Hermitage Walk, S. Woodford",
    postcode: "South Woodford, E18",
    category: "Interior",
    featured: true,
    completed: "Completed January 2026",
    programme: "14 weeks",
    scope: "Whole-home renovation",
    blurb:
      "Kitchen, two bathrooms, rewire, joinery and decoration in fourteen weeks.",
    imageCount: 8,
    narrative: [
      "A family bought the house knowing every room needed work, and wanted it finished before term started rather than spread across three years of weekends.",
      "One programme covered the full rewire, the kitchen, two bathrooms, fitted joinery on the bedroom floor and decoration throughout — with the owners moved out for eight weeks in the middle, which is what made the schedule possible.",
    ],
  },
  {
    slug: "forest-drive-loughton-family-bathroom",
    title: "Family bathroom & landing",
    location: "Forest Drive, Loughton",
    postcode: "Loughton, IG10",
    category: "Bathroom",
    completed: "Completed March 2026",
    programme: "4 weeks",
    scope: "Two rooms & landing joinery",
    blurb: "Two rooms in four weeks with the family in residence throughout.",
    imageCount: 5,
    narrative: [
      "Two children, one bathroom, and a landing cupboard that had been storing towels since the house was built.",
      "We rebuilt the bathroom around a bath with an overhead shower, specified porcelain that survives daily use, and turned the cupboard into fitted storage — working around the family, who stayed in the house for the whole four weeks.",
    ],
  },
  {
    slug: "bury-lane-epping-handleless-kitchen",
    title: "Handleless kitchen in smoked oak",
    location: "Bury Lane, Epping",
    postcode: "Epping, CM16",
    category: "Kitchen",
    completed: "Completed December 2025",
    programme: "6 weeks",
    scope: "Kitchen & utility",
    blurb:
      "Full-height pantry run, boiling tap and a mitred porcelain waterfall end.",
    imageCount: 6,
    narrative: [
      "The owners wanted no visible handles and no wall units — which puts every practical demand on a single run of tall cabinetry.",
      "A full-height pantry bank absorbs the appliances and the clutter, and the island takes a mitred porcelain waterfall end so the worktop reads as one piece of stone.",
    ],
  },
  {
    slug: "kings-road-chingford-victorian-terrace",
    title: "Victorian terrace, restored",
    location: "Kings Road, Chingford",
    postcode: "Chingford, E4",
    category: "Interior",
    completed: "Completed November 2025",
    programme: "11 weeks",
    scope: "Restoration & decoration",
    blurb: "Cornice and joinery repaired rather than replaced, parquet relaid.",
    imageCount: 7,
    narrative: [
      "A terrace with most of its original detail still in place under forty years of paint, and a previous owner's plasterboard over the hall arch.",
      "The brief was restoration rather than replacement: cornice repaired in situ, the parquet lifted and relaid, and new panelling made to match what was already there rather than bought in.",
    ],
  },
  {
    slug: "nightingale-lane-wanstead-guest-ensuite",
    title: "Guest ensuite in 4.1 m²",
    location: "Nightingale Lane, Wanstead",
    postcode: "Wanstead, E11",
    category: "Bathroom",
    completed: "Completed October 2025",
    programme: "3 weeks",
    scope: "Boxroom conversion",
    blurb: "Wall-hung sanitaryware and a walk-in screen in a former boxroom.",
    imageCount: 4,
    narrative: [
      "A boxroom too small to be a bedroom and too useful to lose, at the end of a landing with the soil stack already running past it.",
      "Wall-hung sanitaryware keeps the floor continuous, and a single walk-in screen instead of a cubicle makes 4.1 square metres read as a proper room rather than a compromise.",
    ],
  },
  {
    slug: "shenfield-brentwood-kitchen-garden-doors",
    title: "Kitchen opened to the garden",
    location: "Shenfield, Brentwood",
    postcode: "Brentwood, CM14",
    category: "Kitchen",
    completed: "Completed September 2025",
    programme: "8 weeks",
    scope: "Structural & kitchen",
    blurb:
      "Rear wall removed, steel goalpost frame, sliding doors and bench seating.",
    imageCount: 6,
    narrative: [
      "The kitchen looked at the garden through a single window and a back door that opened onto the bins.",
      "We took the rear wall out on a goalpost frame, fitted sliding doors across the full width, and built a run of bench seating so the table could sit where the wall used to be.",
    ],
  },
  {
    slug: "coppice-row-theydon-bois-bedroom-floor",
    title: "Bedroom floor reconfigured",
    location: "Coppice Row, Theydon Bois",
    postcode: "Theydon Bois, CM16",
    category: "Interior",
    completed: "Completed August 2025",
    programme: "9 weeks",
    scope: "Reconfiguration & joinery",
    blurb: "Four rooms into three, fitted oak dressing room and a new ensuite.",
    imageCount: 6,
    narrative: [
      "Four bedrooms, none of them large, and a family who needed three good ones more than four adequate ones.",
      "The smallest room became a dressing room in fitted oak with a new ensuite behind it, which required moving one wall and re-planning the entire first-floor plumbing run.",
    ],
  },
  {
    slug: "hermitage-walk-south-woodford-master-ensuite",
    title: "Twin-vanity master ensuite",
    location: "Hermitage Walk, S. Woodford",
    postcode: "South Woodford, E18",
    category: "Bathroom",
    completed: "Completed January 2026",
    programme: "4 weeks",
    scope: "Ensuite rebuild",
    blurb:
      "Bespoke vanity, backlit mirrors and separately zoned underfloor heating.",
    imageCount: 5,
    narrative: [
      "Part of the whole-home programme on the same street, built in the same fourteen weeks but specified as its own room.",
      "Twin basins in a bespoke vanity, backlit mirrors on a separate circuit, and underfloor heating zoned away from the bedroom so it can run early without heating the whole floor.",
    ],
  },
  {
    slug: "butts-green-hornchurch-ground-floor",
    title: "Ground floor opened up",
    location: "Butts Green, Hornchurch",
    postcode: "Hornchurch, RM11",
    category: "Interior",
    completed: "Completed July 2025",
    programme: "10 weeks",
    scope: "Structural & fit-out",
    blurb:
      "Two walls out, media wall joinery, zoned lighting, one continuous stone floor.",
    imageCount: 7,
    narrative: [
      "Three small rooms across the ground floor, each with its own door, in a house where the family only ever used one of them.",
      "Two walls came out, one continuous stone floor ties the space together, and zoned lighting plus a media wall in fitted joinery give the single room the separate moods the three rooms used to.",
    ],
  },
  {
    slug: "manor-road-chigwell-galley-kitchen",
    title: "Galley with hidden utility",
    location: "Manor Road, Chigwell",
    postcode: "Chigwell, IG7",
    category: "Kitchen",
    completed: "Completed June 2025",
    programme: "5 weeks",
    scope: "Kitchen & utility",
    blurb: "A narrow Victorian return, with the laundry behind pocket doors.",
    imageCount: 5,
    narrative: [
      "A Victorian return too narrow for an island and too long to leave as a corridor, with the washing machine in the middle of the run.",
      "The laundry moved behind pocket doors at the far end, which freed the whole galley for cooking and put the noisy appliances behind something that closes.",
    ],
  },
];

export const CATEGORIES: ProjectCategory[] = ["Bathroom", "Kitchen", "Interior"];

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export const FEATURED = PROJECTS.filter((project) => project.featured);

/** Maps a project category onto the matching service page and form focus. */
export const CATEGORY_SERVICE = {
  Bathroom: { slug: "bathroom", label: "bathroom renovation" },
  Kitchen: { slug: "kitchen", label: "kitchen renovation" },
  Interior: { slug: "interior", label: "interior renovation" },
} as const;
