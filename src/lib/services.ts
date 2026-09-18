/**
 * Content for the three service detail pages. They share one layout, so the
 * per-service differences live here as data rather than in three near-identical
 * component trees. Copy is taken verbatim from the Claude Design artboards.
 */

export type ServiceSlug = "bathroom" | "kitchen" | "interior";

export type Service = {
  slug: ServiceSlug;
  /** Breadcrumb leaf and dock label. */
  short: string;
  title: string;
  metaDescription: string;
  hero: {
    kicker: string;
    heading: string;
    body: string;
    cta: string;
    imagePlaceholder: string;
  };
  /** Replaces the fourth assurance cell, which is service-specific. */
  assurance4: string;
  spec: {
    heading: string;
    lead: string;
    cta: string;
    imagePlaceholder: string;
    items: { n: string; title: string; body: string }[];
  };
  process: {
    heading: string;
    steps: { when: string; title: string; body: string }[];
  };
  gallery: {
    kicker: string;
    heading: string;
    items: {
      placeholder: string;
      location: string;
      title: string;
      body: string;
    }[];
  };
  trust: {
    lead: string;
    cards: { title: string; body: string }[];
    quote: { text: string; source: string };
  };
  faq: { kicker: string; items: { q: string; a: string }[] };
  enquire: {
    kicker: string;
    heading: string;
    body: string;
    /** The third bullet is always the phone line, added by the component. */
    points: [string, string];
  };
  /** Cross-links to the other two services, in the design's order. */
  also: ServiceSlug[];
};

const TRUST_HEADING = "Guaranteed for ten years. Payable over five.";

export const SERVICES: Record<ServiceSlug, Service> = {
  bathroom: {
    slug: "bathroom",
    short: "Bathrooms",
    title: "Bathroom Renovation",
    metaDescription:
      "Wet rooms, master ensuites and family bathrooms across London and Essex, designed, tanked, tiled and finished by our own tradespeople with a ten-year labour guarantee.",
    hero: {
      kicker: "Bathroom renovation · London & Essex",
      heading: "Luxury bathrooms, taken back to brick and rebuilt properly.",
      body: "Wet rooms, master ensuites and family bathrooms, designed, tanked, tiled and finished by our own tradespeople in three to four weeks, with a ten-year labour guarantee.",
      cta: "Get a fixed quote",
      imagePlaceholder: "Hero: marble master ensuite, wide shot",
    },
    assurance4: "Own Bathroom Fitters, Not Subbies",
    spec: {
      heading: "One quote, every trade, nothing left for you to arrange.",
      lead: "A Migss bathroom is a complete strip-out and rebuild. The price you sign covers the labour, the materials and the making good, including the parts other quotes quietly leave out.",
      cta: "Get my bathroom quote",
      imagePlaceholder: "Detail shot: brassware, stone or tiling close-up",
      items: [
        { n: "01", title: "Design & 3D visuals", body: "Layout options and a render of the finished room before we order a thing." },
        { n: "02", title: "Strip-out & disposal", body: "Back to brick, skips and waste licensing included." },
        { n: "03", title: "Tanking", body: "Bonded membrane and correctly formed falls on every wet room." },
        { n: "04", title: "Plumbing, first & second fix", body: "Concealed brassware, pipework re-routed, pressure tested." },
        { n: "05", title: "Underfloor heating", body: "Electric or wet systems on insulation boards, with thermostat." },
        { n: "06", title: "Tiling & stone", body: "Book-matched marble and large-format porcelain, set out from the focal wall." },
        { n: "07", title: "Lighting & extraction", body: "IP-rated circuits and humidity-sensing extraction, Part P certified." },
        { n: "08", title: "Making good", body: "Plastering, skirting, door furniture and the landing repainted." },
      ],
    },
    process: {
      heading: "Three to four weeks, start to handover",
      steps: [
        { when: "Week 0", title: "Survey & design", body: "Joists, pressure and waste runs checked, then visuals, tile setting-out and a fixed price." },
        { when: "Week 1", title: "Strip-out & first fix", body: "Back to brick, then plumbing, electrics, tanking and boarding." },
        { when: "Weeks 2–3", title: "Tiling & second fix", body: "Stone and porcelain, then sanitaryware, screens, mirrors and lighting." },
        { when: "Week 4", title: "Snag & handover", body: "We clear the list on the spot, hand over certificates and register your guarantee." },
      ],
    },
    gallery: {
      kicker: "Bathrooms we have built",
      heading: "Recent bathroom projects",
      items: [
        { placeholder: "Manor Road, Chigwell: marble wet room", location: "Manor Road, Chigwell", title: "Book-matched marble wet room", body: "Linear drain, concealed thermostatic brassware and a full-height matched slab behind the vanity. Four weeks." },
        { placeholder: "Forest Drive, Loughton: family bathroom", location: "Forest Drive, Loughton", title: "Family bathroom, two children", body: "Bath with overhead shower, hard-wearing porcelain and storage joinery. Family in residence throughout." },
        { placeholder: "Nightingale Lane, Wanstead: guest ensuite", location: "Nightingale Ln, Wanstead", title: "Guest ensuite in 4.1 m²", body: "Wall-hung sanitaryware and a walk-in screen that made a boxroom feel twice its size." },
        { placeholder: "Hermitage Walk, South Woodford: his & hers ensuite", location: "Hermitage Walk, S. Woodford", title: "Twin-vanity master ensuite", body: "Bespoke vanity, backlit mirrors and underfloor heating zoned separately from the bedroom." },
      ],
    },
    trust: {
      lead: "We employ our own bathroom fitters, tilers and electricians, so the guarantee is ours to honour rather than a subcontractor's to argue about.",
      cards: [
        { title: "10-year labour guarantee", body: "Registered on handover and honoured by the same team that did the work. Sanitaryware and brassware carry their own manufacturer warranties on top." },
        { title: "0% interest over 5 years", body: "Spread the cost of the whole project with no interest and no arrangement fee. A soft check tells you where you stand before you commit." },
      ],
      quote: {
        text: "“Two bathrooms in four weeks, to the day they promised. The tiling setting-out alone was worth the money.”",
        source: "Homeowner · Loughton",
      },
    },
    faq: {
      kicker: "Bathroom questions",
      items: [
        { q: "What does a luxury bathroom actually cost?", a: "Most complete bathrooms we build in London and Essex land between £18,000 and £45,000 including all labour, materials and making good. The variables are stone, brassware and whether the layout moves. Your quote is fixed in writing before we start." },
        { q: "Can we stay in the house during the work?", a: "Almost always yes. We dust-sheet the route in, keep one working WC available wherever the house allows it, and clear the site every evening. If you only have one bathroom we will tell you honestly which days will be difficult." },
        { q: "Do you supply the tiles and sanitaryware?", a: "We can supply everything at trade, or fit items you have chosen yourself. Both are common. Where we supply, the product warranty and any replacement is handled by us rather than by you and a showroom." },
        { q: "How soon could you start?", a: "Typically four to eight weeks from signing, which is the time it takes to get stone and joinery in. Consultations are usually available within the week." },
      ],
    },
    enquire: {
      kicker: "Start your bathroom",
      heading: "Book your free bathroom consultation",
      body: "Two short steps. We measure up, talk budget openly, and send a fixed written quote, usually within three working days of the visit.",
      points: ["Fixed written quote, no sales pressure", "10-year labour guarantee on every bathroom"],
    },
    also: ["kitchen", "interior"],
  },

  kitchen: {
    slug: "kitchen",
    short: "Kitchens",
    title: "Kitchen Renovation",
    metaDescription:
      "Bespoke cabinetry, stone worktops, islands and the structural work behind them, delivered on one programme across London and Essex with a ten-year labour guarantee.",
    hero: {
      kicker: "Kitchen renovation · London & Essex",
      heading: "Kitchens built around how your family actually lives.",
      body: "Bespoke cabinetry, stone worktops, islands and the structural work behind them: knock-throughs, steels, electrics and plumbing, delivered on one programme with a ten-year labour guarantee.",
      cta: "Get a fixed quote",
      imagePlaceholder: "Hero: open-plan kitchen with island, wide shot",
    },
    assurance4: "Structural Work Handled In-House",
    spec: {
      heading: "Cabinetry is the last thing that happens, not the first.",
      lead: "A kitchen is a building job with furniture in it. We quote the whole thing: structure, services, floors, plaster and decoration included, so there is no second bill from someone else halfway through.",
      cta: "Get my kitchen quote",
      imagePlaceholder: "Detail shot: cabinetry, worktop edge or boiling tap",
      items: [
        { n: "01", title: "Layout design & visuals", body: "Work triangle, seating and storage planned against how you cook." },
        { n: "02", title: "Structural openings", body: "Steels designed by our engineer, building control notified and signed off." },
        { n: "03", title: "Bespoke cabinetry", body: "In-frame or handleless, made to the millimetre for walls that are never square." },
        { n: "04", title: "Stone worktops", body: "Laser-templated quartz, granite or porcelain with mitred edges." },
        { n: "05", title: "Appliance integration", body: "Boiling taps, wine coolers, extraction and ovens wired and tested." },
        { n: "06", title: "Electrics & lighting", body: "Task, feature and plinth lighting on separate circuits, Part P certified." },
        { n: "07", title: "Flooring & UFH", body: "Engineered timber or large-format tile, levelled properly first." },
        { n: "08", title: "Plaster & decoration", body: "Ceilings, walls and joinery finished, including rooms we walked through." },
      ],
    },
    process: {
      heading: "Five to eight weeks, with a temporary kitchen from day one",
      steps: [
        { when: "Week 0", title: "Survey & feasibility", body: "What is load-bearing, where the services run, and whether your layout is possible." },
        { when: "Week 0", title: "Design & cabinetry order", body: "Fixed price, then a six-week workshop lead we run in parallel with the build." },
        { when: "Weeks 1–2", title: "Strip-out & structure", body: "Openings formed, steels in, services re-routed, floors levelled, dust screens up." },
        { when: "Weeks 3–6", title: "Install & templating", body: "Cabinetry fitted and levelled, worktops templated, then appliances and splashbacks." },
        { when: "Weeks 7–8", title: "Decoration & handover", body: "Finishing decoration, an appliance walk-through, certificates and your guarantee." },
      ],
    },
    gallery: {
      kicker: "Kitchens we have built",
      heading: "Recent kitchen projects",
      items: [
        { placeholder: "Nightingale Lane, Wanstead: open-plan kitchen", location: "Nightingale Ln, Wanstead", title: "Open-plan kitchen & dining", body: "Structural opening, in-frame cabinetry and a quartz island seating five. Seven weeks." },
        { placeholder: "Epping: handleless kitchen in dark timber", location: "Bury Lane, Epping", title: "Handleless in smoked oak", body: "Full-height pantry run, boiling tap and a porcelain worktop with a mitred waterfall end." },
        { placeholder: "Chigwell: galley kitchen with pantry", location: "Manor Road, Chigwell", title: "Galley with hidden utility", body: "A narrow Victorian return turned into a working galley with the laundry behind pocket doors." },
        { placeholder: "Brentwood: kitchen with garden doors", location: "Shenfield, Brentwood", title: "Kitchen opened to the garden", body: "Rear wall removed, steel goalpost frame, sliding doors and a run of bench seating." },
      ],
    },
    trust: {
      lead: "Carpenters, electricians and plumbers on our own payroll, plus a workshop that makes the cabinetry, so a problem is ours to fix, not a supplier's to deny.",
      cards: [
        { title: "10-year labour guarantee", body: "Covers the install, the cabinetry fit and the building work. Appliances and worktops carry their manufacturer warranties on top." },
        { title: "0% interest over 5 years", body: "Kitchens are the project people most often spread. No interest, no arrangement fee, and a soft check before you commit." },
      ],
      quote: {
        text: "“They put a temporary kitchen in the dining room before the old one came out. Six weeks and we barely noticed the disruption.”",
        source: "Homeowner · Wanstead",
      },
    },
    faq: {
      kicker: "Kitchen questions",
      items: [
        { q: "What does a bespoke kitchen cost?", a: "Most of our kitchens run from £35,000 to £90,000 all in: cabinetry, stone, appliances, building work and decoration. Structural openings and appliance choices move the number most. The quote is fixed in writing before we start." },
        { q: "How do we cook while the kitchen is out?", a: "We set up a temporary kitchen (sink, fridge, worktop and hob) in another room before strip-out, and leave it until your new one is signed off. It is included, not an extra." },
        { q: "Can you remove a wall to open the space up?", a: "Yes. We handle the engineer's calculations, the steels, the building control notification and the sign-off certificate as part of the same project. No separate builder to coordinate." },
        { q: "Do you fit kitchens we have bought elsewhere?", a: "We do, and we will review the plan first. Showroom layouts sometimes ignore what is behind the wall. Our labour guarantee then covers our installation and building work rather than the units themselves." },
      ],
    },
    enquire: {
      kicker: "Start your kitchen",
      heading: "Book your free kitchen consultation",
      body: "Two short steps. We measure up, check what the structure allows, and send a fixed written quote, usually within five working days of the visit.",
      points: ["Fixed written quote, no sales pressure", "Temporary kitchen included as standard"],
    },
    also: ["bathroom", "interior"],
  },

  interior: {
    slug: "interior",
    short: "Interiors",
    title: "Interior Renovation",
    metaDescription:
      "Whole-home renovation across London and Essex, layouts, joinery, flooring, lighting, plastering and decoration on one programme, one team and one guarantee.",
    hero: {
      kicker: "Interior renovation · London & Essex",
      heading: "A whole house, on one programme and one guarantee.",
      body: "Layouts, joinery, flooring, lighting, plastering and decoration across every room, with the kitchen and bathrooms folded into the same schedule instead of three separate builders.",
      cta: "Discuss your whole home",
      imagePlaceholder: "Hero: whole-home interior, hallway or living room, wide shot",
    },
    assurance4: "One Project Manager, Every Room",
    spec: {
      heading: "Every room, every trade, one schedule to follow.",
      lead: "Whole-home projects fail on sequencing, not craft. We run the entire interior as one programme, so the floor goes down after the plaster dries and nobody drills through finished work.",
      cta: "Discuss my project",
      imagePlaceholder: "Detail shot: joinery, panelling or stair detail",
      items: [
        { n: "01", title: "Space planning", body: "Room-by-room drawings with circulation and storage resolved before pricing." },
        { n: "02", title: "Structural alterations", body: "Walls, steels, loft conversions and staircase changes, signed off." },
        { n: "03", title: "Kitchen & bathrooms", body: "Our own room teams, inside the same programme and the same quote." },
        { n: "04", title: "Bespoke joinery", body: "Wardrobes, media walls, panelling and window seats from our workshop." },
        { n: "05", title: "Rewire & lighting", body: "Full or partial rewires, circuits per room, dimming and smart controls." },
        { n: "06", title: "Heating & plumbing", body: "Boiler and cylinder upgrades, radiator moves, underfloor heating zones." },
        { n: "07", title: "Flooring throughout", body: "Timber, parquet, stone or carpet on levelled, acoustically treated sub-floors." },
        { n: "08", title: "Plaster & decoration", body: "Skimmed ceilings and walls, cornice repair, every room decorated to finish." },
      ],
    },
    process: {
      heading: "Eight to sixteen weeks, phased around whether you live in",
      steps: [
        { when: "Stage 01", title: "Walk-through & brief", body: "Every room: what stays, what goes, and what the house is costing you as it is." },
        { when: "Stage 02", title: "Design & room schedule", body: "Drawings, finishes and a price per room, so you can stage the work if you want to." },
        { when: "Stage 03", title: "Structure & first fix", body: "Alterations, rewire, plumbing and heating, all the dirty work in one house-wide pass." },
        { when: "Stage 04", title: "Plaster, joinery & rooms", body: "Skim coats, then kitchen, bathrooms and joinery in the order that protects finished work." },
        { when: "Stage 05", title: "Floors, decoration & handover", body: "Floors last, decoration room by room, snag list cleared and your guarantee registered." },
      ],
    },
    gallery: {
      kicker: "Whole homes we have renovated",
      heading: "Recent interior projects",
      items: [
        { placeholder: "Hermitage Walk, South Woodford: whole home", location: "Hermitage Walk, S. Woodford", title: "Four-bedroom home, top to bottom", body: "Kitchen, two bathrooms, full rewire, joinery and decoration on one programme. Fourteen weeks." },
        { placeholder: "Chingford: Victorian terrace, hallway and reception", location: "Kings Road, Chingford", title: "Victorian terrace, restored", body: "Cornice and joinery repaired rather than replaced, parquet relaid, panelling made to match." },
        { placeholder: "Theydon Bois: principal bedroom and dressing room", location: "Coppice Row, Theydon Bois", title: "Bedroom floor reconfigured", body: "Four rooms into three, with a dressing room in fitted oak and a new ensuite behind it." },
        { placeholder: "Hornchurch: open-plan ground floor", location: "Butts Green, Hornchurch", title: "Ground floor opened up", body: "Two walls out, media wall joinery, zoned lighting and one continuous stone floor." },
      ],
    },
    trust: {
      lead: "On a whole-home project the biggest risk is coordination. One contract, one project manager and directly employed trades removes it.",
      cards: [
        { title: "10-year labour guarantee", body: "One guarantee across every room and every trade, so there is never a question of whose work a defect belongs to." },
        { title: "0% interest over 5 years", body: "Or stage the work: the priced room schedule lets you do the ground floor now and the bedrooms next year at held rates." },
      ],
      quote: {
        text: "“We moved out for eight weeks and came back to a finished house. One phone number for the whole thing.”",
        source: "Homeowner · South Woodford",
      },
    },
    faq: {
      kicker: "Whole-home questions",
      items: [
        { q: "What does a whole-home renovation cost?", a: "Full interiors typically run from £120,000 on a three-bedroom house to £400,000 plus where there is structural work, bespoke joinery throughout and high-specification stone. You get a priced schedule per room, so you can see where the money sits before committing." },
        { q: "Do we need to move out?", a: "Not always. If the work includes a full rewire or floor-wide plastering, moving out for part of it is faster and cheaper, we will say which weeks matter. Otherwise we phase it floor by floor and always keep one bathroom working." },
        { q: "Can we do it in stages?", a: "Yes, and many clients do. We design the whole house once, then build it in phases, first fix anything that would mean reopening walls later, so a future stage never undoes finished work." },
        { q: "Do you work with our own architect or designer?", a: "Often. We price and build from their drawings, attend site meetings, and flag anything that will be difficult or expensive to detail before it reaches you as a variation." },
      ],
    },
    enquire: {
      kicker: "Start your interior",
      heading: "Book your free whole-home consultation",
      body: "Two short steps. We walk the house, agree the scope room by room, and send a priced schedule you can stage or build in one go.",
      points: ["A priced schedule, room by room", "One project manager for the whole house"],
    },
    also: ["bathroom", "kitchen"],
  },
};

export const TRUST = { heading: TRUST_HEADING, kicker: "Why homeowners sign" };

/** Short blurbs used by the hub cards and the cross-link cards. */
export const SERVICE_BLURB: Record<ServiceSlug, string> = {
  bathroom: "Wet rooms and ensuites taken back to brick and rebuilt properly.",
  kitchen: "Bespoke cabinetry, islands and the structural work behind them.",
  interior: "Whole-home work on one programme, one team, one guarantee.",
};

export const SERVICE_ORDER: ServiceSlug[] = ["bathroom", "kitchen", "interior"];
