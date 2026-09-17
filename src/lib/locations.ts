import { PROJECTS, type Project } from "@/lib/projects";

/**
 * The ten service areas, and the per-town copy the location template is
 * parameterised on.
 *
 * Chigwell's copy is the design's own — it is the town the artboard was drawn
 * for. The other nine follow the same structure, written against the
 * characterisation each town is given on the hub page.
 *
 * Project examples are pulled from lib/projects.ts rather than invented, via
 * `projectMatch`. See getLocationProjects for the case where a town has no
 * completed work yet.
 */

export type Location = {
  slug: string;
  name: string;
  /** Postcode shown beside the name in the hub list. */
  postcode: string;
  /** One-line characterisation, hub list. */
  summary: string;

  kicker: string;
  heading: string;
  heroLead: string;

  /** Fact strip. */
  postcodes: string;
  travel: string;
  projectCount: string;

  localHeading: string;
  localCopy: [string, string];
  localFacts: { label: string; value: string }[];

  quote: { text: string; source: string };

  /** Substrings matched against a project's `location` field. */
  projectMatch: string[];
};

export const LOCATIONS: Location[] = [
  {
    slug: "chigwell",
    name: "Chigwell",
    postcode: "IG7",
    summary:
      "Manor Road, Hainault Road and the private roads off the High Road.",
    kicker: "Chigwell, IG7 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Chigwell.",
    heroLead:
      "Twenty minutes from our Essex workshop, and the postcode we have worked in longest — forty-plus completed projects between Manor Road and the High Road.",
    postcodes: "IG7, IG8",
    travel: "20 minutes",
    projectCount: "40+",
    localHeading: "We know what is behind the walls here.",
    localCopy: [
      "Most of the houses we renovate in Chigwell are 1960s–80s detached properties on generous plots, plus the newer gated developments off the High Road. In practice that means two recurring jobs: dated ensuites with boxed-in soil stacks eating floor space, and kitchens laid out for a household that no longer exists. Both are entirely fixable without touching the structure — we have done it forty times within a mile of Chigwell station.",
      "Practicalities matter here too. Several of the private roads have parking restrictions and narrow shared driveways, so we schedule skips and stone deliveries for mid-morning and keep one vehicle on site rather than five. On the Epping Forest side we allow extra time for tree-protection and conservation constraints, which we confirm with the council before quoting rather than after.",
    ],
    localFacts: [
      { label: "Typical property", value: "1960s–80s detached" },
      { label: "Most requested", value: "Master ensuites & wet rooms" },
      { label: "Local streets worked", value: "Manor Rd, Hainault Rd, Vicarage Ln" },
      { label: "Watch out for", value: "Narrow private-road access" },
    ],
    quote: {
      text: "“We had three quotes. Migss were the only ones who had worked on this road before and knew the drainage ran the wrong way.”",
      source: "Homeowner · Manor Road, Chigwell",
    },
    projectMatch: ["Chigwell"],
  },
  {
    slug: "epping",
    name: "Epping",
    postcode: "CM16",
    summary:
      "Period cottages and forest-edge houses where access needs planning.",
    kicker: "Epping, CM16 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Epping.",
    heroLead:
      "Period cottages, forest-edge houses and the newer closes off Bury Lane — twenty-five minutes from the workshop, with the access planned before we quote.",
    postcodes: "CM16",
    travel: "25 minutes",
    projectCount: "20+",
    localHeading: "Old buildings, and the surprises that come with them.",
    localCopy: [
      "Epping work divides between period cottages in the town and the larger houses along the forest edge. The cottages are the ones that need care: lath-and-plaster walls, floors that are never level, and services routed by whoever got there first. We survey them properly before pricing, because the difference between a straightforward kitchen and a difficult one is usually invisible until something comes off the wall.",
      "Access is the other constraint. The High Street has loading restrictions and several of the forest-side properties have long single-track approaches, so deliveries are scheduled rather than assumed. Where a property is listed or in the conservation area, we confirm what is permitted with the council before quoting.",
    ],
    localFacts: [
      { label: "Typical property", value: "Period cottages & forest-edge homes" },
      { label: "Most requested", value: "Kitchens & whole-home interiors" },
      { label: "Local streets worked", value: "Bury Lane, Lindsey St, Theydon Rd" },
      { label: "Watch out for", value: "Listed status & loading restrictions" },
    ],
    quote: {
      text: "“They found the old chimney breast behind the plasterboard on day one and redrew the layout before it cost us anything.”",
      source: "Homeowner · Bury Lane, Epping",
    },
    projectMatch: ["Epping"],
  },
  {
    slug: "loughton",
    name: "Loughton",
    postcode: "IG10",
    summary:
      "1930s semis on the Forest Drive estates — mostly bathrooms and lofts.",
    kicker: "Loughton, IG10 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Loughton.",
    heroLead:
      "The 1930s estates off Forest Drive and the roads climbing towards the forest — fifteen minutes away, and the town we are called back to most often.",
    postcodes: "IG10",
    travel: "15 minutes",
    projectCount: "35+",
    localHeading: "The same house, a hundred times over.",
    localCopy: [
      "Loughton is estate housing done well: 1930s semis and detached houses built to a handful of repeating plans. That is an advantage. We already know where the soil stack runs, which bathroom walls are non-structural, and how much width you recover by moving a doorway — because we have opened up the same layout on the next street.",
      "The most common brief here is a family bathroom and a small ensuite done together, with the family staying in the house. That is a four-week programme if the two rooms are sequenced properly, and considerably longer if they are not. Loft conversions are the other regular request, usually where a third bedroom needs its own shower room.",
    ],
    localFacts: [
      { label: "Typical property", value: "1930s semi-detached" },
      { label: "Most requested", value: "Family bathrooms & loft shower rooms" },
      { label: "Local streets worked", value: "Forest Drive, Alderton Hill, Roding Rd" },
      { label: "Watch out for", value: "Shared drives on the estates" },
    ],
    quote: {
      text: "“Two bathrooms in four weeks with three of us still living here. They cleared the site every single evening.”",
      source: "Homeowner · Forest Drive, Loughton",
    },
    projectMatch: ["Loughton"],
  },
  {
    slug: "theydon-bois",
    name: "Theydon Bois",
    postcode: "CM16",
    summary: "Larger plots off Coppice Row, often whole-home reconfigurations.",
    kicker: "Theydon Bois, CM16 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Theydon Bois.",
    heroLead:
      "Larger plots off Coppice Row and the village roads, where the brief is usually the whole house rather than a single room.",
    postcodes: "CM16",
    travel: "25 minutes",
    projectCount: "15+",
    localHeading: "Room counts that no longer suit the family.",
    localCopy: [
      "Theydon Bois houses tend to be generous but awkwardly divided — four or five bedrooms where three good ones and a dressing room would serve better, and bathrooms sized for 1970s expectations. Most of our work here is reconfiguration rather than extension: moving one or two walls, then rebuilding the services around the new plan.",
      "Because these are whole-floor projects, sequencing decides the timeline. We price a room schedule so the work can be staged if you would rather do the bedroom floor now and the ground floor next year, and we first-fix anything that would otherwise mean reopening finished walls later.",
    ],
    localFacts: [
      { label: "Typical property", value: "Detached, generous plots" },
      { label: "Most requested", value: "Whole-home reconfiguration" },
      { label: "Local streets worked", value: "Coppice Row, Forest Drive, Piercing Hill" },
      { label: "Watch out for", value: "Conservation area constraints" },
    ],
    quote: {
      text: "“Four bedrooms became three plus a dressing room. It is the same house and it works twice as well.”",
      source: "Homeowner · Coppice Row, Theydon Bois",
    },
    projectMatch: ["Theydon Bois"],
  },
  {
    slug: "hornchurch",
    name: "Hornchurch",
    postcode: "RM11",
    summary: "Butts Green and Emerson Park — kitchens opened to the garden.",
    kicker: "Hornchurch, RM11 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Hornchurch.",
    heroLead:
      "Butts Green and Emerson Park, where the recurring brief is opening the back of the house up to a garden it currently ignores.",
    postcodes: "RM11, RM12",
    travel: "30 minutes",
    projectCount: "20+",
    localHeading: "Most of the work here is at the back of the house.",
    localCopy: [
      "Hornchurch houses are typically 1930s and post-war, with the kitchen at the rear and the garden behind a solid wall and a single door. Opening that up — a steel goalpost frame, sliding doors, one continuous floor level — is the most requested job in this postcode, and it brings the structural work, the electrics and the floor build-up with it.",
      "Because that is a building job rather than a kitchen fit, we handle the engineer's calculations, the building control notification and the sign-off certificate inside the same contract. There is no second trade to coordinate and no gap where the kitchen company waits for a builder who waits for the steel.",
    ],
    localFacts: [
      { label: "Typical property", value: "1930s & post-war semis" },
      { label: "Most requested", value: "Kitchens opened to the garden" },
      { label: "Local streets worked", value: "Butts Green Rd, Emerson Park, Wingletye Ln" },
      { label: "Watch out for", value: "Structural sign-off lead times" },
    ],
    quote: {
      text: "“Two walls out, one floor through, and the garden finally feels like part of the house.”",
      source: "Homeowner · Butts Green, Hornchurch",
    },
    projectMatch: ["Hornchurch"],
  },
  {
    slug: "brentwood",
    name: "Brentwood",
    postcode: "CM14",
    summary: "Shenfield and Hutton — larger kitchens with structural openings.",
    kicker: "Brentwood, CM14 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Brentwood.",
    heroLead:
      "Shenfield, Hutton and the roads around them — larger kitchens, structural openings, and the longest-planned projects we take on.",
    postcodes: "CM13, CM14, CM15",
    travel: "35 minutes",
    projectCount: "15+",
    localHeading: "Bigger rooms, and briefs to match.",
    localCopy: [
      "Brentwood is the far edge of our range and the projects reflect it: larger kitchens, islands that seat five or six, and rear walls coming out on steel. These are rarely single-room jobs — the kitchen usually arrives with flooring, decoration and often a utility or boot room attached.",
      "The distance is why we schedule rather than improvise here. Cabinetry and stone are templated and delivered on planned days, and the same team stays on the project start to finish rather than rotating, because a thirty-five minute drive punishes any programme that assumes someone can nip back.",
    ],
    localFacts: [
      { label: "Typical property", value: "Large detached & Shenfield estates" },
      { label: "Most requested", value: "Kitchens with structural openings" },
      { label: "Local streets worked", value: "Shenfield, Hutton Mount, Middleton Hall Ln" },
      { label: "Watch out for", value: "Longer lead times on stone" },
    ],
    quote: {
      text: "“Eight weeks, planned to the day. The steel went in on a Tuesday and the kitchen was templated that Friday.”",
      source: "Homeowner · Shenfield, Brentwood",
    },
    projectMatch: ["Brentwood", "Shenfield"],
  },
  {
    slug: "wanstead",
    name: "Wanstead",
    postcode: "E11",
    summary:
      "Edwardian terraces off Nightingale Lane, side returns and rear extensions.",
    kicker: "Wanstead, E11 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Wanstead.",
    heroLead:
      "Edwardian terraces off Nightingale Lane, where a side return turns a dark galley into the room the house was missing.",
    postcodes: "E11, E12",
    travel: "25 minutes",
    projectCount: "30+",
    localHeading: "Narrow plans, and how to open them.",
    localCopy: [
      "Wanstead is terraces: long, narrow and originally divided into small rooms with the kitchen tacked on the back. The two jobs we do most here are the side return — bringing the kitchen out to the full width — and the boxroom ensuite, where four square metres has to work as a proper shower room rather than a compromise.",
      "Party walls come into almost every project on these streets. We serve notices early and talk to the neighbours ourselves rather than leaving you to it, because a party wall award arriving late is the single most common reason a terrace project slips.",
    ],
    localFacts: [
      { label: "Typical property", value: "Edwardian terrace" },
      { label: "Most requested", value: "Side returns & compact ensuites" },
      { label: "Local streets worked", value: "Nightingale Ln, Hermon Hill, Grove Park" },
      { label: "Watch out for", value: "Party wall notices & shared drains" },
    ],
    quote: {
      text: "“They served the party wall notices before we had even signed. It saved us about six weeks.”",
      source: "Homeowner · Nightingale Lane, Wanstead",
    },
    projectMatch: ["Wanstead"],
  },
  {
    slug: "woodford",
    name: "Woodford",
    postcode: "E18",
    summary: "South Woodford and Woodford Green — our most frequent postcode.",
    kicker: "Woodford, E18 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Woodford.",
    heroLead:
      "South Woodford and Woodford Green — the postcode we work in most, and the shortest drive from the workshop.",
    postcodes: "E18, IG8",
    travel: "15 minutes",
    projectCount: "50+",
    localHeading: "Our busiest postcode, by some distance.",
    localCopy: [
      "Woodford covers everything from Edwardian terraces around the station to large inter-war detached houses towards the Green, so the work is varied — but the volume means we have usually renovated something on your street. Whole-home programmes are more common here than anywhere else we work, often because families buy knowing the house needs everything.",
      "That is also where the fourteen-week whole-home schedule came from: kitchen, bathrooms, rewire, joinery and decoration on one programme, with the owners moved out for the middle eight weeks. Done as separate trades over three years it costs more and finishes worse.",
    ],
    localFacts: [
      { label: "Typical property", value: "Edwardian terrace to inter-war detached" },
      { label: "Most requested", value: "Whole-home renovation" },
      { label: "Local streets worked", value: "Hermitage Walk, The Drive, Monkhams Ln" },
      { label: "Watch out for", value: "Parking bays on the station roads" },
    ],
    quote: {
      text: "“We moved out for eight weeks and came back to a finished house. One phone number for the whole thing.”",
      source: "Homeowner · Hermitage Walk, South Woodford",
    },
    projectMatch: ["Woodford"],
  },
  {
    slug: "chingford",
    name: "Chingford",
    postcode: "E4",
    summary:
      "Victorian terraces around Kings Road, often full interior restorations.",
    kicker: "Chingford, E4 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Chingford.",
    heroLead:
      "Victorian terraces around Kings Road and the roads up towards the forest, where most of the original detail is still there under the paint.",
    postcodes: "E4",
    travel: "25 minutes",
    projectCount: "20+",
    localHeading: "Restoration more often than replacement.",
    localCopy: [
      "Chingford's Victorian stock has usually kept its cornice, its joinery and its floors — buried under decades of paint, carpet and the occasional sheet of plasterboard across an original arch. Where that detail survives, repairing it costs less than replacing it and looks incomparably better, so restoration is the default here rather than the upgrade.",
      "That takes a different kind of trade. Cornice is repaired in situ rather than ripped out, parquet is lifted and relaid rather than covered, and new panelling is made to match what is already on the wall. It is slower than stripping a room back, and it is the reason people call us for these houses.",
    ],
    localFacts: [
      { label: "Typical property", value: "Victorian terrace" },
      { label: "Most requested", value: "Full interior restoration" },
      { label: "Local streets worked", value: "Kings Rd, The Ridgeway, Station Rd" },
      { label: "Watch out for", value: "Original detail worth saving" },
    ],
    quote: {
      text: "“Everyone else quoted to rip the cornice out. Migss quoted to repair it, and it is the best thing in the house.”",
      source: "Homeowner · Kings Road, Chingford",
    },
    projectMatch: ["Chingford"],
  },
  {
    slug: "ilford",
    name: "Ilford",
    postcode: "IG1",
    summary:
      "From Cranbrook to Barkingside, including HMO-standard bathroom work.",
    kicker: "Ilford, IG1 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Ilford.",
    heroLead:
      "Cranbrook through to Barkingside — including landlord and HMO-standard bathroom work alongside the owner-occupier projects.",
    postcodes: "IG1, IG2, IG6",
    travel: "25 minutes",
    projectCount: "15+",
    localHeading: "Two different briefs in one postcode.",
    localCopy: [
      "Ilford splits more than most areas we cover. Around Cranbrook and Valentines the work is owner-occupier: family bathrooms and kitchens in solid inter-war housing. Further out towards Barkingside and Gants Hill we do a steady amount of landlord work, where the specification is about compliance and durability rather than book-matched stone.",
      "We quote both honestly, which sometimes means telling a landlord that the expensive option will not pay for itself, and telling a homeowner that the cheap tile will look tired in three years. The labour guarantee is the same either way.",
    ],
    localFacts: [
      { label: "Typical property", value: "Inter-war semis & converted flats" },
      { label: "Most requested", value: "Bathrooms, owner-occupier & HMO" },
      { label: "Local streets worked", value: "Cranbrook Rd, Valentines, Barkingside" },
      { label: "Watch out for", value: "HMO compliance & extraction standards" },
    ],
    quote: {
      text: "“They talked us out of the more expensive spec for the rental and did the family bathroom properly instead.”",
      source: "Homeowner · Cranbrook, Ilford",
    },
    projectMatch: ["Ilford"],
  },
];

export type LocationSlug = (typeof LOCATIONS)[number]["slug"];

export function getLocation(slug: string) {
  return LOCATIONS.find((location) => location.slug === slug);
}

/**
 * Project examples for a town, drawn from the existing placeholder projects.
 *
 * Not every area has completed work in the data — Ilford currently has none.
 * Rather than render an empty rail, those pages fall back to recent work from
 * elsewhere, and `isLocal` lets the page say so instead of implying the
 * projects are in that town.
 */
export function getLocationProjects(location: Location): {
  projects: Project[];
  isLocal: boolean;
} {
  const local = PROJECTS.filter((project) =>
    location.projectMatch.some((match) => project.location.includes(match)),
  );

  if (local.length > 0) return { projects: local, isLocal: true };

  return { projects: PROJECTS.slice(0, 3), isLocal: false };
}
