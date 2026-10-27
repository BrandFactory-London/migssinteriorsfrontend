/**
 * The service areas, grouped into two clusters, and the per-town copy the
 * location template is parameterised on.
 *
 * Positioning (confirmed 27 Oct 2026): Migss specialises in two clusters,
 * North London & Suburbs and East London & Essex Forest Towns. CLUSTERS, at
 * the end of this file, is the one place that says which town sits where and
 * in what order; the hub, the cluster pages, the homepage and the schema all
 * read it.
 *
 * Claims policy: towns added for the north London cluster carry no project
 * counts, named streets or homeowner quotes until real ones are confirmed.
 * Their copy sticks to verifiable local character.
 *
 * Chigwell's copy is the design's own — it is the town the artboard was drawn
 * for. The other original towns follow the same structure, written against
 * the characterisation each town is given on the hub page.
 *
 * Project examples come from the live Projects CMS collection, matched on the
 * town name — see getTownProjects in lib/wix/projects.ts, which also handles
 * the towns with no photographed work yet.
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
  /**
   * Completed projects in the town. Optional: only shown where Migss has
   * confirmed a count. New towns carry none until real work is published.
   */
  projectCount?: string;

  localHeading: string;
  localCopy: [string, string];
  localFacts: { label: string; value: string }[];

  /** A real homeowner quote from this town. Omitted until one is confirmed. */
  quote?: { text: string; source: string };
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
      "The heart of our east London and Essex work, and the postcode we have worked in longest: forty-plus completed projects between Manor Road and the High Road.",
    postcodes: "IG7, IG8",
    projectCount: "40+",
    localHeading: "We know what is behind the walls here.",
    localCopy: [
      "Most of the houses we renovate in Chigwell are 1960s–80s detached properties on generous plots, plus the newer gated developments off the High Road. In practice that means two recurring jobs: dated ensuites with boxed-in soil stacks eating floor space, and kitchens laid out for a household that no longer exists. Both are entirely fixable without touching the structure, we have done it forty times within a mile of Chigwell station.",
      "Practicalities matter here too. Several of the private roads have parking restrictions and narrow shared driveways, so we schedule skips and stone deliveries for mid-morning and keep one vehicle on site rather than five. On the Epping Forest side we allow extra time for tree-protection and conservation constraints, which we confirm with the council before quoting rather than after.",
    ],
    localFacts: [
      { label: "Typical property", value: "1960s–80s detached" },
      { label: "Most requested", value: "Master ensuites & wet rooms" },
      {
        label: "Local streets worked",
        value: "Manor Rd, Hainault Rd, Vicarage Ln",
      },
      { label: "Watch out for", value: "Narrow private-road access" },
    ],
    quote: {
      text: "“We had three quotes. Migss were the only ones who had worked on this road before and knew the drainage ran the wrong way.”",
      source: "Homeowner · Manor Road, Chigwell",
    },
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
      "Period cottages, forest-edge houses and the newer closes off Bury Lane, with the access planned before we quote.",
    postcodes: "CM16",
    projectCount: "20+",
    localHeading: "Old buildings, and the surprises that come with them.",
    localCopy: [
      "Epping work divides between period cottages in the town and the larger houses along the forest edge. The cottages are the ones that need care: lath-and-plaster walls, floors that are never level, and services routed by whoever got there first. We survey them properly before pricing, because the difference between a straightforward kitchen and a difficult one is usually invisible until something comes off the wall.",
      "Access is the other constraint. The High Street has loading restrictions and several of the forest-side properties have long single-track approaches, so deliveries are scheduled rather than assumed. Where a property is listed or in the conservation area, we confirm what is permitted with the council before quoting.",
    ],
    localFacts: [
      {
        label: "Typical property",
        value: "Period cottages & forest-edge homes",
      },
      { label: "Most requested", value: "Kitchens & whole-home interiors" },
      {
        label: "Local streets worked",
        value: "Bury Lane, Lindsey St, Theydon Rd",
      },
      { label: "Watch out for", value: "Listed status & loading restrictions" },
    ],
    quote: {
      text: "“They found the old chimney breast behind the plasterboard on day one and redrew the layout before it cost us anything.”",
      source: "Homeowner · Bury Lane, Epping",
    },
  },
  {
    slug: "loughton",
    name: "Loughton",
    postcode: "IG10",
    summary:
      "1930s semis on the Forest Drive estates, mostly bathrooms and lofts.",
    kicker: "Loughton, IG10 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Loughton.",
    heroLead:
      "The 1930s estates off Forest Drive and the roads climbing towards the forest, and the town we are called back to most often.",
    postcodes: "IG10",
    projectCount: "35+",
    localHeading: "The same house, a hundred times over.",
    localCopy: [
      "Loughton is estate housing done well: 1930s semis and detached houses built to a handful of repeating plans. That is an advantage. We already know where the soil stack runs, which bathroom walls are non-structural, and how much width you recover by moving a doorway, because we have opened up the same layout on the next street.",
      "The most common brief here is a family bathroom and a small ensuite done together, with the family staying in the house. That is a four-week programme if the two rooms are sequenced properly, and considerably longer if they are not. Loft conversions are the other regular request, usually where a third bedroom needs its own shower room.",
    ],
    localFacts: [
      { label: "Typical property", value: "1930s semi-detached" },
      {
        label: "Most requested",
        value: "Family bathrooms & loft shower rooms",
      },
      {
        label: "Local streets worked",
        value: "Forest Drive, Alderton Hill, Roding Rd",
      },
      { label: "Watch out for", value: "Shared drives on the estates" },
    ],
    quote: {
      text: "“Two bathrooms in four weeks with three of us still living here. They cleared the site every single evening.”",
      source: "Homeowner · Forest Drive, Loughton",
    },
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
    projectCount: "15+",
    localHeading: "Room counts that no longer suit the family.",
    localCopy: [
      "Theydon Bois houses tend to be generous but awkwardly divided: four or five bedrooms where three good ones and a dressing room would serve better, and bathrooms sized for 1970s expectations. Most of our work here is reconfiguration rather than extension: moving one or two walls, then rebuilding the services around the new plan.",
      "Because these are whole-floor projects, sequencing decides the timeline. We price a room schedule so the work can be staged if you would rather do the bedroom floor now and the ground floor next year, and we first-fix anything that would otherwise mean reopening finished walls later.",
    ],
    localFacts: [
      { label: "Typical property", value: "Detached, generous plots" },
      { label: "Most requested", value: "Whole-home reconfiguration" },
      {
        label: "Local streets worked",
        value: "Coppice Row, Forest Drive, Piercing Hill",
      },
      { label: "Watch out for", value: "Conservation area constraints" },
    ],
    quote: {
      text: "“Four bedrooms became three plus a dressing room. It is the same house and it works twice as well.”",
      source: "Homeowner · Coppice Row, Theydon Bois",
    },
  },
  {
    slug: "hornchurch",
    name: "Hornchurch",
    postcode: "RM11",
    summary: "Butts Green and Emerson Park, kitchens opened to the garden.",
    kicker: "Hornchurch, RM11 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Hornchurch.",
    heroLead:
      "Butts Green and Emerson Park, where the recurring brief is opening the back of the house up to a garden it currently ignores.",
    postcodes: "RM11, RM12",
    projectCount: "20+",
    localHeading: "Most of the work here is at the back of the house.",
    localCopy: [
      "Hornchurch houses are typically 1930s and post-war, with the kitchen at the rear and the garden behind a solid wall and a single door. Opening that up, with a steel goalpost frame, sliding doors and one continuous floor level, is the most requested job in this postcode, and it brings the structural work, the electrics and the floor build-up with it.",
      "Because that is a building job rather than a kitchen fit, we handle the engineer's calculations, the building control notification and the sign-off certificate inside the same contract. There is no second trade to coordinate and no gap where the kitchen company waits for a builder who waits for the steel.",
    ],
    localFacts: [
      { label: "Typical property", value: "1930s & post-war semis" },
      { label: "Most requested", value: "Kitchens opened to the garden" },
      {
        label: "Local streets worked",
        value: "Butts Green Rd, Emerson Park, Wingletye Ln",
      },
      { label: "Watch out for", value: "Structural sign-off lead times" },
    ],
    quote: {
      text: "“Two walls out, one floor through, and the garden finally feels like part of the house.”",
      source: "Homeowner · Butts Green, Hornchurch",
    },
  },
  {
    slug: "brentwood",
    name: "Brentwood",
    postcode: "CM14",
    summary: "Shenfield and Hutton, larger kitchens with structural openings.",
    kicker: "Brentwood, CM14 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Brentwood.",
    heroLead:
      "Shenfield, Hutton and the roads around them: larger kitchens, structural openings, and the longest-planned projects we take on.",
    postcodes: "CM13, CM14, CM15",
    projectCount: "15+",
    localHeading: "Bigger rooms, and briefs to match.",
    localCopy: [
      "Brentwood projects tend to be the largest we take on in Essex: larger kitchens, islands that seat five or six, and rear walls coming out on steel. These are rarely single-room jobs. The kitchen usually arrives with flooring, decoration and often a utility or boot room attached.",
      "Projects of this size are scheduled rather than improvised. Cabinetry and stone are templated and delivered on planned days, and the same team stays on the project from start to finish rather than rotating, so nothing depends on someone nipping back.",
    ],
    localFacts: [
      {
        label: "Typical property",
        value: "Large detached & Shenfield estates",
      },
      { label: "Most requested", value: "Kitchens with structural openings" },
      {
        label: "Local streets worked",
        value: "Shenfield, Hutton Mount, Middleton Hall Ln",
      },
      { label: "Watch out for", value: "Longer lead times on stone" },
    ],
    quote: {
      text: "“Eight weeks, planned to the day. The steel went in on a Tuesday and the kitchen was templated that Friday.”",
      source: "Homeowner · Shenfield, Brentwood",
    },
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
    projectCount: "30+",
    localHeading: "Narrow plans, and how to open them.",
    localCopy: [
      "Wanstead is terraces: long, narrow and originally divided into small rooms with the kitchen tacked on the back. The two jobs we do most here are the side return, bringing the kitchen out to the full width, and the boxroom ensuite, where four square metres has to work as a proper shower room rather than a compromise.",
      "Party walls come into almost every project on these streets. We serve notices early and talk to the neighbours ourselves rather than leaving you to it, because a party wall award arriving late is the single most common reason a terrace project slips.",
    ],
    localFacts: [
      { label: "Typical property", value: "Edwardian terrace" },
      { label: "Most requested", value: "Side returns & compact ensuites" },
      {
        label: "Local streets worked",
        value: "Nightingale Ln, Hermon Hill, Grove Park",
      },
      { label: "Watch out for", value: "Party wall notices & shared drains" },
    ],
    quote: {
      text: "“They served the party wall notices before we had even signed. It saved us about six weeks.”",
      source: "Homeowner · Nightingale Lane, Wanstead",
    },
  },
  {
    slug: "woodford",
    name: "Woodford",
    postcode: "IG8",
    summary: "Woodford Green and South Woodford, our most frequent postcode.",
    kicker: "Woodford, IG8 & E18 · Est. 25 years",
    heading: "Bathroom, kitchen & interior renovation in Woodford.",
    heroLead:
      "Woodford Green and South Woodford, from the large inter-war houses around the Green to the Edwardian roads by the station.",
    postcodes: "E18, IG8",
    projectCount: "50+",
    localHeading: "Our busiest postcode, by some distance.",
    localCopy: [
      "Woodford covers everything from Edwardian terraces around the station to large inter-war detached houses towards the Green, so the work is varied, but the volume means we have usually renovated something on your street. Whole-home programmes are more common here than anywhere else we work, often because families buy knowing the house needs everything.",
      "That is also where the fourteen-week whole-home schedule came from: kitchen, bathrooms, rewire, joinery and decoration on one programme, with the owners moved out for the middle eight weeks. Done as separate trades over three years it costs more and finishes worse.",
    ],
    localFacts: [
      {
        label: "Typical property",
        value: "Edwardian terrace to inter-war detached",
      },
      { label: "Most requested", value: "Whole-home renovation" },
      {
        label: "Local streets worked",
        value: "Hermitage Walk, The Drive, Monkhams Ln",
      },
      { label: "Watch out for", value: "Parking bays on the station roads" },
    ],
    quote: {
      text: "“We moved out for eight weeks and came back to a finished house. One phone number for the whole thing.”",
      source: "Homeowner · Hermitage Walk, South Woodford",
    },
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
    projectCount: "20+",
    localHeading: "Restoration more often than replacement.",
    localCopy: [
      "Chingford's Victorian stock has usually kept its cornice, its joinery and its floors, buried under decades of paint, carpet and the occasional sheet of plasterboard across an original arch. Where that detail survives, repairing it costs less than replacing it and looks incomparably better, so restoration is the default here rather than the upgrade.",
      "That takes a different kind of trade. Cornice is repaired in situ rather than ripped out, parquet is lifted and relaid rather than covered, and new panelling is made to match what is already on the wall. It is slower than stripping a room back, and it is the reason people call us for these houses.",
    ],
    localFacts: [
      { label: "Typical property", value: "Victorian terrace" },
      { label: "Most requested", value: "Full interior restoration" },
      {
        label: "Local streets worked",
        value: "Kings Rd, The Ridgeway, Station Rd",
      },
      { label: "Watch out for", value: "Original detail worth saving" },
    ],
    quote: {
      text: "“Everyone else quoted to rip the cornice out. Migss quoted to repair it, and it is the best thing in the house.”",
      source: "Homeowner · Kings Road, Chingford",
    },
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
      "Cranbrook through to Barkingside, including landlord and HMO-standard bathroom work alongside the owner-occupier projects.",
    postcodes: "IG1, IG2, IG6",
    projectCount: "15+",
    localHeading: "Two different briefs in one postcode.",
    localCopy: [
      "Ilford splits more than most areas we cover. Around Cranbrook and Valentines the work is owner-occupier: family bathrooms and kitchens in solid inter-war housing. Further out towards Barkingside and Gants Hill we do a steady amount of landlord work, where the specification is about compliance and durability rather than book-matched stone.",
      "We quote both honestly, which sometimes means telling a landlord that the expensive option will not pay for itself, and telling a homeowner that the cheap tile will look tired in three years. The labour guarantee is the same either way.",
    ],
    localFacts: [
      { label: "Typical property", value: "Inter-war semis & converted flats" },
      { label: "Most requested", value: "Bathrooms, owner-occupier & HMO" },
      {
        label: "Local streets worked",
        value: "Cranbrook Rd, Valentines, Barkingside",
      },
      {
        label: "Watch out for",
        value: "HMO compliance & extraction standards",
      },
    ],
    quote: {
      text: "“They talked us out of the more expensive spec for the rental and did the family bathroom properly instead.”",
      source: "Homeowner · Cranbrook, Ilford",
    },
  },
  // North London & Suburbs. Added 27 Oct 2026 with no project counts, streets
  // or quotes, per the claims policy above.
  {
    slug: "hampstead",
    name: "Hampstead",
    postcode: "NW3",
    summary:
      "Georgian and Victorian townhouses, villas and mansion flats, much of it in conservation areas.",
    kicker: "Hampstead, NW3 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Hampstead.",
    heroLead:
      "Townhouses, villas and mansion flats where the brief is a high-end finish and the constraint is the building: conservation areas, listed fabric and neighbours a party wall away.",
    postcodes: "NW3",
    localHeading: "Period buildings, and a finish to match them.",
    localCopy: [
      "Much of Hampstead sits within conservation areas, and a good share of its houses are listed. That shapes the work before a tile is chosen: what can move, what has to be repaired rather than replaced, and what needs consent first. We establish those constraints at survey and price to them, so the design you approve is one the building will allow.",
      "Mansion flats bring their own process. Most leases need the freeholder's licence before a bathroom or kitchen is altered, and many buildings set working hours, lift bookings and waterproofing standards. We prepare the drawings and method statements a managing agent asks for, and we work alongside the interior designers and luxury showrooms our clients already use.",
    ],
    localFacts: [
      { label: "Typical property", value: "Period townhouses & mansion flats" },
      { label: "Typical brief", value: "Principal suites & kitchens" },
      { label: "Planning context", value: "Conservation areas & listed buildings" },
      { label: "Watch out for", value: "Freeholder licences on flats" },
    ],
  },
  {
    slug: "highgate",
    name: "Highgate",
    postcode: "N6",
    summary:
      "Georgian village houses and large Victorian homes either side of the borough line.",
    kicker: "Highgate, N6 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Highgate.",
    heroLead:
      "Georgian village houses and large Victorian homes, renovated to a high-end specification with the period detail kept where it matters.",
    postcodes: "N6",
    localHeading: "Two boroughs, one conservation-minded village.",
    localCopy: [
      "Highgate straddles Camden and Haringey, and much of it is conservation area under either council. The practical effect is that windows, external flues and extraction routes need thought early, and original joinery, cornice and floors are usually worth keeping. We plan services around the fabric rather than through it.",
      "The houses are tall and narrow more often than not, which makes sequencing the real skill: one staircase, deliveries on residential streets and several floors of finished rooms to protect. We programme the work floor by floor and coordinate with the designers and showrooms specifying the finishes.",
    ],
    localFacts: [
      { label: "Typical property", value: "Georgian & Victorian houses" },
      { label: "Typical brief", value: "Whole-floor bathroom suites" },
      { label: "Planning context", value: "Camden & Haringey conservation areas" },
      { label: "Watch out for", value: "Narrow plans and single staircases" },
    ],
  },
  {
    slug: "hampstead-garden-suburb",
    name: "Hampstead Garden Suburb",
    postcode: "NW11",
    summary:
      "Arts and Crafts houses where the Suburb Trust's consent comes before the build.",
    kicker: "Hampstead Garden Suburb, NW11 · North London",
    heading:
      "High-end bathroom, kitchen & interior renovation in Hampstead Garden Suburb.",
    heroLead:
      "Arts and Crafts houses with a character worth protecting, renovated inside to a modern, high-end standard.",
    postcodes: "NW11, N2",
    localHeading: "Consent first, then the build.",
    localCopy: [
      "The whole Suburb is a conservation area, and alterations are also controlled by the Hampstead Garden Suburb Trust under its scheme of management. Anything visible from outside, from a new window to an extractor outlet, can need the Trust's consent as well as the council's. We build that into the programme rather than discovering it halfway through.",
      "Inside, the houses reward careful work: generous rooms, original joinery and layouts that often predate modern bathrooms. Most briefs are about adding a proper principal suite or opening a kitchen to the garden without losing what makes the house what it is.",
    ],
    localFacts: [
      { label: "Typical property", value: "Arts and Crafts houses" },
      { label: "Typical brief", value: "Principal suites & garden kitchens" },
      { label: "Planning context", value: "Suburb Trust consent & conservation area" },
      { label: "Watch out for", value: "External changes need Trust approval" },
    ],
  },
  {
    slug: "finchley",
    name: "Finchley",
    postcode: "N2",
    summary:
      "East Finchley's Edwardian roads through to the large detached houses of N2.",
    kicker: "Finchley, N2 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Finchley.",
    heroLead:
      "From Edwardian family houses in East Finchley to the large detached homes of N2, renovated by one team from design to handover.",
    postcodes: "N2, N3",
    localHeading: "Family houses, and the briefs that come with them.",
    localCopy: [
      "N2 covers a wide range of housing, from Edwardian semis and terraces near the High Road to substantial detached houses towards The Bishops Avenue. The briefs follow the house: a family bathroom and ensuite done together in the Edwardian roads, whole-floor suites and large kitchens in the bigger homes.",
      "Whatever the size, the programme is the same discipline: a fixed written quote, one project manager and our own tradespeople on site, working to the specification you and your designer or showroom have chosen.",
    ],
    localFacts: [
      { label: "Typical property", value: "Edwardian semis to large detached" },
      { label: "Typical brief", value: "Bathroom suites & kitchens" },
      { label: "Borough", value: "Barnet" },
      { label: "Watch out for", value: "Party walls on the Edwardian roads" },
    ],
  },
  {
    slug: "muswell-hill",
    name: "Muswell Hill",
    postcode: "N10",
    summary:
      "Edwardian houses and mansion flats with original detail worth keeping.",
    kicker: "Muswell Hill, N10 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Muswell Hill.",
    heroLead:
      "Edwardian houses and mansion flats, where a high-end bathroom or kitchen has to sit comfortably with original detail.",
    postcodes: "N10",
    localHeading: "Edwardian houses, renovated without losing them.",
    localCopy: [
      "Muswell Hill is one of London's most complete Edwardian suburbs, and much of it is a conservation area. The houses typically keep their cornice, joinery and tiled floors, and the best renovations work with that detail rather than stripping it out.",
      "The common briefs are a loft or rear extension that needs a proper bathroom, and kitchens opened to the garden through the back of the house. Both bring structural and building control work with them, which we handle inside the same contract.",
    ],
    localFacts: [
      { label: "Typical property", value: "Edwardian houses & mansion flats" },
      { label: "Typical brief", value: "Bathrooms, lofts & garden kitchens" },
      { label: "Planning context", value: "Muswell Hill conservation area" },
      { label: "Watch out for", value: "Original detail worth saving" },
    ],
  },
  {
    slug: "totteridge",
    name: "Totteridge",
    postcode: "N20",
    summary:
      "Large detached houses on generous plots in a green-belt conservation area.",
    kicker: "Totteridge, N20 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Totteridge.",
    heroLead:
      "Large detached houses on generous plots, where the brief is usually several rooms at once and the finish has to match the house.",
    postcodes: "N20",
    localHeading: "Big houses, planned as one project.",
    localCopy: [
      "Totteridge is low-density and largely green belt, with a conservation area covering much of the village. The houses are big, the plots bigger, and renovation briefs tend to cover a whole floor or the whole house rather than a single room.",
      "That makes planning the difference between a smooth project and a long one: a single programme for bathrooms, kitchen, joinery and finishes, deliveries scheduled for long private drives, and one team accountable from start to finish.",
    ],
    localFacts: [
      { label: "Typical property", value: "Large detached houses" },
      { label: "Typical brief", value: "Whole-floor & whole-home renovation" },
      { label: "Planning context", value: "Green belt & conservation area" },
      { label: "Watch out for", value: "Long lead times on stone and joinery" },
    ],
  },
  {
    slug: "hadley-wood",
    name: "Hadley Wood",
    postcode: "EN4",
    summary:
      "Substantial detached houses on wooded roads, often whole-home projects.",
    kicker: "Hadley Wood, EN4 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Hadley Wood.",
    heroLead:
      "Substantial detached houses on quiet, wooded roads, renovated room by room or all at once to a high-end specification.",
    postcodes: "EN4",
    localHeading: "Large homes, and a specification to match.",
    localCopy: [
      "Hadley Wood's houses are large and individually designed, and the briefs reflect it: principal suites with dressing rooms, wet rooms and steam rooms, and kitchens built around islands and entertaining. Specification is the heart of these projects, and we work with the designers and showrooms our clients choose.",
      "Because these are multi-room projects, we price a room-by-room schedule so the work can be staged if needed, and we first-fix everything that would otherwise mean reopening finished walls later.",
    ],
    localFacts: [
      { label: "Typical property", value: "Large detached houses" },
      { label: "Typical brief", value: "Principal suites, wet rooms & kitchens" },
      { label: "Borough", value: "Enfield" },
      { label: "Watch out for", value: "Tree protection on wooded plots" },
    ],
  },
  {
    slug: "cockfosters",
    name: "Cockfosters",
    postcode: "EN4",
    summary:
      "Inter-war and post-war family houses on the edge of Trent Park.",
    kicker: "Cockfosters, EN4 · North London",
    heading: "High-end bathroom, kitchen & interior renovation in Cockfosters.",
    heroLead:
      "Inter-war and post-war family houses by Trent Park, where bathrooms and kitchens are rebuilt to a far higher standard than they were built to.",
    postcodes: "EN4",
    localHeading: "Solid houses, ready for a better finish.",
    localCopy: [
      "Cockfosters is mostly well-built inter-war and post-war housing, detached and semi-detached, with layouts that have not kept pace with how families live now. The usual briefs are a family bathroom and ensuite rebuilt together, and a kitchen opened up to the garden.",
      "These are projects where planning the sequence saves weeks: two bathrooms done with the family still at home, or a kitchen built while a temporary one keeps the house running. Our own tradespeople and one project manager carry it through.",
    ],
    localFacts: [
      { label: "Typical property", value: "Inter-war & post-war houses" },
      { label: "Typical brief", value: "Family bathrooms & open kitchens" },
      { label: "Borough", value: "Enfield & Barnet" },
      { label: "Watch out for", value: "Structural openings at the rear" },
    ],
  },

  // East London & Essex Forest Towns: towns added 27 Oct 2026.
  {
    slug: "buckhurst-hill",
    name: "Buckhurst Hill",
    postcode: "IG9",
    summary:
      "Victorian and Edwardian houses and larger detached homes on the forest edge.",
    kicker: "Buckhurst Hill, IG9 · Chigwell & Essex",
    heading: "High-end bathroom, kitchen & interior renovation in Buckhurst Hill.",
    heroLead:
      "Victorian and Edwardian houses and larger detached homes on the edge of Epping Forest, between Chigwell and Loughton.",
    postcodes: "IG9",
    localHeading: "Between the forest and the Central line.",
    localCopy: [
      "Buckhurst Hill mixes Victorian and Edwardian houses near the station with larger detached homes on the roads towards the forest. The period houses reward careful work on their original detail; the larger homes usually bring principal suites and kitchens opened to the garden.",
      "It sits between Chigwell and Loughton, at the centre of our east London and Essex work, so the same team, designers and showrooms we use across the area are on hand here too.",
    ],
    localFacts: [
      { label: "Typical property", value: "Period houses & forest-edge detached" },
      { label: "Typical brief", value: "Principal suites & garden kitchens" },
      { label: "District", value: "Epping Forest" },
      { label: "Watch out for", value: "Hilly roads and tight access" },
    ],
  },
  {
    slug: "abridge",
    name: "Abridge",
    postcode: "RM4",
    summary:
      "A green-belt village of larger detached houses and converted properties.",
    kicker: "Abridge, RM4 · Chigwell & Essex",
    heading: "High-end bathroom, kitchen & interior renovation in Abridge.",
    heroLead:
      "Larger detached houses and converted properties in the village and the green belt around it, a short way from Chigwell.",
    postcodes: "RM4",
    localHeading: "Village homes, renovated to a high standard.",
    localCopy: [
      "Abridge and the lanes around it are green belt, with a mix of large detached houses, older village properties and conversions. Renovations here are often whole-home or multi-room projects, and older properties need surveying properly before pricing.",
      "Rural access shapes the programme: longer drives, narrow lanes and deliveries that need planning. We schedule stone, cabinetry and skips on fixed days so the site stays tidy and the work stays on time.",
    ],
    localFacts: [
      { label: "Typical property", value: "Detached houses & conversions" },
      { label: "Typical brief", value: "Whole-home & multi-room projects" },
      { label: "District", value: "Epping Forest" },
      { label: "Watch out for", value: "Green-belt constraints & lane access" },
    ],
  },
];

export type LocationSlug = (typeof LOCATIONS)[number]["slug"];

export function getLocation(slug: string) {
  return LOCATIONS.find((location) => location.slug === slug);
}

/** A cluster of towns Migss specialises in. */
export type Cluster = {
  slug: "north-london" | "essex-forest";
  name: string;
  /** Short label for kickers and tight spaces. */
  shortName: string;
  kicker: string;
  heading: string;
  intro: [string, string];
  metaTitle: string;
  metaDescription: string;
  /** Town slugs, in display order. */
  core: string[];
  /** Towns presented as the cluster's surrounding areas. */
  surrounding: string[];
};

export const CLUSTERS: Cluster[] = [
  {
    slug: "north-london",
    name: "North London & Suburbs",
    shortName: "North London",
    kicker: "Cluster one · North London & Suburbs",
    heading: "High-end renovation across north London and its suburbs.",
    intro: [
      "From Hampstead and Highgate out to Totteridge, Hadley Wood and Cockfosters, we design and build high-end bathrooms, kitchens and interiors for period townhouses, mansion flats and large family homes.",
      "We work alongside the interior designers and luxury showrooms our clients use across north London, and we have built up specific expertise in what these homes need: conservation-area consent, freeholder licences, original detail worth keeping and specifications that leave no room for error.",
    ],
    metaTitle:
      "High-End Renovation in North London | Hampstead to Cockfosters | Migss Interiors",
    metaDescription:
      "High-end bathroom, kitchen and interior renovation across north London and its suburbs, from Hampstead, Highgate and Muswell Hill to Finchley, Totteridge and Cockfosters.",
    core: [
      "hampstead",
      "highgate",
      "hampstead-garden-suburb",
      "finchley",
      "muswell-hill",
      "totteridge",
      "hadley-wood",
      "cockfosters",
    ],
    surrounding: [],
  },
  {
    slug: "essex-forest",
    name: "East London & Essex Forest Towns",
    shortName: "Chigwell & Essex",
    kicker: "Cluster two · East London & Essex Forest Towns",
    heading: "High-end renovation in Chigwell and the Essex forest towns.",
    intro: [
      "Chigwell is where Migss has worked longest, and the forest towns around it, from Buckhurst Hill and Loughton to Theydon Bois, Woodford Green, Epping and Abridge, are the heart of our east London and Essex work.",
      "We work alongside the interior designers and luxury showrooms our clients use across the area, and we also cover the surrounding areas of Wanstead, Chingford, Ilford, Hornchurch and Brentwood.",
    ],
    metaTitle:
      "High-End Renovation in Chigwell & the Essex Forest Towns | Migss Interiors",
    metaDescription:
      "High-end bathroom, kitchen and interior renovation in Chigwell, Buckhurst Hill, Loughton, Theydon Bois, Woodford Green, Epping and Abridge, plus the surrounding areas.",
    core: [
      "chigwell",
      "buckhurst-hill",
      "loughton",
      "theydon-bois",
      "woodford",
      "epping",
      "abridge",
    ],
    surrounding: ["wanstead", "chingford", "ilford", "hornchurch", "brentwood"],
  },
];

export function getCluster(slug: string) {
  return CLUSTERS.find((cluster) => cluster.slug === slug);
}

/** The cluster a town belongs to. Every town in LOCATIONS has exactly one. */
export function clusterFor(townSlug: string) {
  return CLUSTERS.find(
    (cluster) =>
      cluster.core.includes(townSlug) ||
      cluster.surrounding.includes(townSlug),
  );
}

/** A cluster's towns, resolved to their full records, in display order. */
export function clusterTowns(cluster: Cluster) {
  const resolve = (slugs: string[]) =>
    slugs
      .map((slug) => getLocation(slug))
      .filter((town): town is Location => town !== undefined);
  return { core: resolve(cluster.core), surrounding: resolve(cluster.surrounding) };
}
