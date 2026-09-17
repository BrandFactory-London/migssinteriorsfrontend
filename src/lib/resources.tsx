import type * as React from "react";

/**
 * Resources and blog content.
 *
 * THIS ARRAY IS TEMPORARY. Unlike services.ts or locations.ts, it is not a
 * permanent content source: Phase 4 replaces it wholesale with the live Wix
 * Blog API, which already drives an automated posting pipeline. The field
 * names deliberately track a Wix Blog post object — title, slug, excerpt,
 * firstPublishedDate, minutesToRead, tags, coverMedia, richContent — so the
 * swap is a change of source rather than a reshape of every consumer.
 *
 * Only the featured article carries a full body, matching the one worked
 * example in the Blog Post artboard. The rest are listing-level entries: the
 * article template renders an honest short state for them rather than an empty
 * page, and they disappear the moment real posts arrive.
 */

export type ArticleBlock =
  | { kind: "p"; content: React.ReactNode }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: React.ReactNode[] };

export type Pillar = "Bathroom" | "Kitchen";

/** The design's filter chips, in order. */
export const TAGS = [
  "Inspiration",
  "Planning",
  "Mid-project",
  "Costs",
] as const;
export type Tag = (typeof TAGS)[number];

export type Article = {
  /** Wix: slug */
  slug: string;
  /** Wix: title */
  title: string;
  /** Wix: excerpt */
  excerpt: string;
  /** Wix: minutesToRead */
  minutesToRead: number;
  /** Wix: firstPublishedDate, ISO date. */
  publishedDate: string;
  /** Which library the article belongs to. */
  category: Pillar;
  /** Wix: tags */
  tags: [Tag];
  /** Stands in for Wix: coverMedia until real photography lands. */
  coverPlaceholder: string;
  /** Wix: richContent. Written out only for the featured article. */
  body?: ArticleBlock[];
  /** Lead paragraph above the fold on the article page. */
  standfirst?: string;
  heroCaption?: string;
  /** Wix: tags, as shown in the article's "Filed under" row. */
  filedUnder?: string[];
};

const AUTHOR = "The Migss Interiors team";

export const ARTICLE_AUTHOR = AUTHOR;

const BATHROOM_COSTS_BODY: ArticleBlock[] = [
  {
    kind: "p",
    content: (
      <>
        Nobody asks what a bathroom costs. They ask what <em>their</em> bathroom
        costs, and the honest answer is that the number depends less on the room
        than on about six decisions you will make in the first fortnight. So
        rather than give you a range wide enough to be useless, we asked a
        client in Chigwell whether we could publish their quote in full. They
        said yes.
      </>
    ),
  },
  {
    kind: "p",
    content: (
      <>
        The room is a 6.2 m² master ensuite in a 1970s detached house. Complete
        strip-out to brick, doorway moved 400mm, wet area formed with a linear
        drain, book-matched Calacatta on the shower wall, twin basins in a
        bespoke oak vanity, wet underfloor heating on its own zone. Four weeks
        on site. The final figure, including everything, was{" "}
        <strong>£28,400 including VAT</strong>.
      </>
    ),
  },
  { kind: "h2", text: "Where the £28,400 went" },
  {
    kind: "p",
    content:
      "Roughly half of any bathroom is labour, and that proportion holds almost regardless of specification — which is the first useful thing to know. Spending more on stone does not change how many days a tiler needs; it changes the risk if he gets it wrong.",
  },
  {
    kind: "ul",
    items: [
      <>
        <strong>Labour — £13,100.</strong> Strip-out, first fix plumbing and
        electrics, tanking, boarding, tiling, second fix, plastering and
        decoration. Four weeks, two trades on site most days.
      </>,
      <>
        <strong>Stone and tiling materials — £5,900.</strong> Book-matched
        Calacatta slabs for the shower wall and niche, large-format porcelain
        elsewhere, adhesives and the tanking system.
      </>,
      <>
        <strong>Sanitaryware and brassware — £4,200.</strong> Concealed
        thermostatic valves, twin basins, wall-hung WC with a concealed frame, a
        fixed glass screen.
      </>,
      <>
        <strong>Joinery — £2,300.</strong> The oak vanity, made in our workshop
        to the millimetre, plus the removable service panel in the adjoining
        cupboard.
      </>,
      <>
        <strong>Underfloor heating and electrics — £1,600.</strong> Wet UFH
        zone, thermostat, IP-rated lighting circuits, humidity-sensing
        extraction, Part P certification.
      </>,
      <>
        <strong>Making good, waste and welfare — £1,300.</strong> Skips and
        waste licensing, plastering beyond the room, the landing repainted,
        protection and the final clean.
      </>,
    ],
  },
  {
    kind: "p",
    content:
      "Add those and you land slightly over; the difference is the small contingency we hold for what turns up behind a 1970s wall. On this job it paid for a rotten section of floor plate nobody could have seen until the old bath came out.",
  },
  { kind: "h2", text: "The six decisions that moved the number" },
  { kind: "h3", text: "1. Whether the layout moves" },
  {
    kind: "p",
    content: (
      <>
        Moving the doorway 400mm cost about £900 in labour and making good.
        Moving the <em>soil stack</em> would have cost four times that and
        gained less. As a rule: moving a basin is cheap, moving a shower is
        manageable, moving a WC is where the money starts, and moving the stack
        is a structural conversation rather than a bathroom one.
      </>
    ),
  },
  { kind: "h3", text: "2. Wet room or tray" },
  {
    kind: "p",
    content:
      "A tanked wet area with a linear drain added roughly £1,800 over a high-quality low-profile tray — membrane, screed falls, the drain itself and the extra days. It is the right decision in a room this size and often the wrong one in a small family bathroom, where a tray is quicker, cheaper and just as good.",
  },
  { kind: "h3", text: "3. Which stone, and how it is set out" },
  {
    kind: "p",
    content: (
      <>
        This is the widest variable on the page. The same room in a good
        large-format porcelain throughout would have saved around{" "}
        <strong>£3,400</strong> in materials and a day of labour, and ninety per
        cent of visitors would not know. Book-matching is a genuine luxury: it
        buys you one wall that looks like a single piece of quarried stone, and
        it demands a tiler who will spend half a day setting out before cutting
        anything.
      </>
    ),
  },
  { kind: "h3", text: "4. Brassware" },
  {
    kind: "p",
    content:
      "Concealed valves cost more than exposed ones, both in the fitting and the maintenance access you have to design in. Budget brassware in a hard-water area is the single most common false economy we see — it is the part you touch twice a day, and it is the part that gets replaced in year four.",
  },
  { kind: "h3", text: "5. Bespoke joinery versus a bought vanity" },
  {
    kind: "p",
    content:
      "The oak vanity was £2,300. A very good off-the-shelf unit would have been £800. In a room with square walls, buy the unit. In this room — where the re-boxed stack left an awkward 1,840mm run — bespoke was the only way to use the whole wall, and it bought back the storage that let us remove a separate cabinet.",
  },
  { kind: "h3", text: "6. Underfloor heating" },
  {
    kind: "p",
    content:
      "Wet UFH on its own zone was £1,600 fitted. Electric would have been around £700 but costs meaningfully more to run. In a room used for twenty minutes a day, electric on a timer is usually the more rational choice; here the house was already having its heating reworked, so the marginal cost was small.",
  },
  { kind: "h2", text: "So what could this room have cost?" },
  {
    kind: "p",
    content:
      "Take the same footprint, the same trades and the same standard of workmanship. Swap book-matched stone for large-format porcelain, the wet area for a low-profile tray, the bespoke vanity for a good bought one, and wet underfloor heating for electric. Keep the brassware — that is not where to save.",
  },
  {
    kind: "p",
    content: (
      <>
        That room comes in at about <strong>£16,800</strong>. It is not a lesser
        bathroom in any way that shows up in a snagging report. It is a lesser
        bathroom in the way it feels when you walk in, which is a perfectly
        legitimate thing to pay for, provided you know that is what you are
        paying for.
      </>
    ),
  },
  { kind: "h2", text: "What honest quotes have in common" },
  {
    kind: "p",
    content:
      "Whoever you use, a quote worth trusting will name the tanking system, say who removes the waste, state what happens to the landing and the ceiling below, and put a number against making good rather than leaving it implied. If those four things are missing, the quote is not cheaper than ours — it is just less finished.",
  },
  {
    kind: "p",
    content:
      "If you would like the same breakdown for your own room, we will do it as part of a free home visit: measured, itemised and fixed in writing, with a straight answer about where we think you should not spend.",
  },
];

export const ARTICLES: Article[] = [
  // ---------------------------------------------------------------- bathroom
  {
    slug: "what-a-luxury-bathroom-really-costs-in-2026",
    title: "What a luxury bathroom really costs in 2026",
    excerpt:
      "A line-by-line breakdown of a real £28,000 ensuite, and where the same room could have cost twelve thousand less.",
    standfirst:
      "We took a finished £28,400 ensuite in Chigwell and published every line of the quote — then worked out where the same room could have been built for sixteen.",
    heroCaption:
      "The finished room: 6.2 m², book-matched Calacatta, concealed brassware and a bespoke oak vanity. Manor Road, Chigwell.",
    minutesToRead: 9,
    publishedDate: "2026-03-04",
    category: "Bathroom",
    tags: ["Costs"],
    coverPlaceholder: "Marble ensuite, wide shot",
    filedUnder: ["Costs", "Bathrooms", "Planning"],
    body: BATHROOM_COSTS_BODY,
  },
  {
    slug: "twelve-things-missing-from-most-bathroom-quotes",
    title: "Twelve things missing from most bathroom quotes",
    excerpt:
      "Tanking, waste licensing, making good, the landing repaint — the omissions that turn a cheap quote expensive.",
    minutesToRead: 8,
    publishedDate: "2026-02-18",
    category: "Bathroom",
    tags: ["Planning"],
    coverPlaceholder: "Quote document on a worktop",
  },
  {
    slug: "wet-room-or-shower-tray-how-to-decide-honestly",
    title: "Wet room or shower tray? How to decide honestly",
    excerpt:
      "Floor build-up, joist direction and drainage falls decide this more often than taste does. Here is how to tell.",
    minutesToRead: 7,
    publishedDate: "2026-02-05",
    category: "Bathroom",
    tags: ["Planning"],
    coverPlaceholder: "Linear drain and tanked floor",
  },
  {
    slug: "small-bathrooms-that-do-not-feel-small",
    title: "Small bathrooms that do not feel small",
    excerpt:
      "Five real rooms under five square metres, and the three moves that made each of them feel twice the size.",
    minutesToRead: 6,
    publishedDate: "2026-01-21",
    category: "Bathroom",
    tags: ["Inspiration"],
    coverPlaceholder: "Compact ensuite with walk-in screen",
  },
  {
    slug: "book-matched-stone-explained-without-the-jargon",
    title: "Book-matched stone, explained without the jargon",
    excerpt:
      "What book-matching actually is, what it costs, and when a single large-format porcelain slab does the job better.",
    minutesToRead: 6,
    publishedDate: "2026-01-08",
    category: "Bathroom",
    tags: ["Inspiration"],
    coverPlaceholder: "Book-matched marble wall",
  },
  {
    slug: "underfloor-heating-wet-electric-or-neither",
    title: "Underfloor heating: wet, electric or neither",
    excerpt:
      "Running costs, build heights and whether it is worth it in a room you spend twenty minutes a day in.",
    minutesToRead: 7,
    publishedDate: "2025-12-16",
    category: "Bathroom",
    tags: ["Planning"],
    coverPlaceholder: "Underfloor heating mat being laid",
  },
  {
    slug: "ventilation-is-the-thing-that-ruins-bathrooms",
    title: "Ventilation is the thing that ruins bathrooms",
    excerpt:
      "Why humidity-sensing extraction matters more than the tile you chose, and how to size a fan properly.",
    minutesToRead: 5,
    publishedDate: "2025-12-03",
    category: "Bathroom",
    tags: ["Planning"],
    coverPlaceholder: "Ceiling extraction detail",
  },
  {
    slug: "living-through-a-bathroom-build-with-one-wc",
    title: "Living through a bathroom build with one WC",
    excerpt:
      "What the difficult days actually look like, and the five things a good contractor does to soften them.",
    minutesToRead: 6,
    publishedDate: "2025-11-19",
    category: "Bathroom",
    tags: ["Mid-project"],
    coverPlaceholder: "Dust-sheeted landing during works",
  },
  {
    slug: "how-to-snag-a-bathroom-properly",
    title: "How to snag a bathroom properly",
    excerpt:
      "A checklist we hand to clients at handover — silicone lines, falls, door swings, grout and everything behind the panel.",
    minutesToRead: 7,
    publishedDate: "2025-11-05",
    category: "Bathroom",
    tags: ["Mid-project"],
    coverPlaceholder: "Snagging checklist on site",
  },
  {
    slug: "where-to-spend-and-where-to-save-in-order",
    title: "Where to spend and where to save, in order",
    excerpt:
      "Ranked by how much you will regret it: tanking, brassware, stone, storage joinery, mirrors, towel rails.",
    minutesToRead: 8,
    publishedDate: "2025-10-22",
    category: "Bathroom",
    tags: ["Costs"],
    coverPlaceholder: "Brassware and stone detail",
  },
  {
    slug: "0-percent-finance-on-a-bathroom-how-the-numbers-work",
    title: "0% finance on a bathroom: how the numbers work",
    excerpt:
      "A worked example over five years, what a soft check does to your credit file, and when it is a bad idea.",
    minutesToRead: 5,
    publishedDate: "2025-10-08",
    category: "Bathroom",
    tags: ["Costs"],
    coverPlaceholder: "Finance paperwork at a kitchen table",
  },
  {
    slug: "brushed-brass-chrome-or-black-ageing-in-real-homes",
    title: "Brushed brass, chrome or black: ageing in real homes",
    excerpt:
      "How four finishes actually look after three years of hard water, and which ones we have stopped recommending.",
    minutesToRead: 6,
    publishedDate: "2025-09-24",
    category: "Bathroom",
    tags: ["Inspiration"],
    coverPlaceholder: "Brassware finishes side by side",
  },

  // ----------------------------------------------------------------- kitchen
  {
    slug: "seven-kitchen-layouts-and-who-each-one-suits",
    title: "Seven kitchen layouts, and who each one suits",
    excerpt:
      "Galley, L, U, island, peninsula, broken-plan and single-run — with the household each one actually works for.",
    minutesToRead: 7,
    publishedDate: "2026-03-11",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Open-plan kitchen with island",
  },
  {
    slug: "what-a-bespoke-kitchen-costs-and-what-drives-it",
    title: "What a bespoke kitchen costs, and what drives it",
    excerpt:
      "Why two kitchens the same size can differ by forty thousand pounds, broken down by cabinetry, stone and structure.",
    minutesToRead: 9,
    publishedDate: "2026-03-02",
    category: "Kitchen",
    tags: ["Costs"],
    coverPlaceholder: "In-frame cabinetry detail",
  },
  {
    slug: "can-this-wall-come-down-reading-your-own-house",
    title: "Can this wall come down? Reading your own house",
    excerpt:
      "How to spot a load-bearing wall, what a steel actually costs, and when building control has to be involved.",
    minutesToRead: 10,
    publishedDate: "2026-02-12",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Steel goalpost frame during works",
  },
  {
    slug: "islands-when-they-transform-a-room-and-when-they-ruin-it",
    title: "Islands: when they transform a room and when they ruin it",
    excerpt:
      "The clearance numbers nobody tells you, and four rooms where a peninsula was the better answer.",
    minutesToRead: 6,
    publishedDate: "2026-02-03",
    category: "Kitchen",
    tags: ["Inspiration"],
    coverPlaceholder: "Kitchen island with seating",
  },
  {
    slug: "marble-quartz-or-porcelain-an-honest-comparison",
    title: "Marble, quartz or porcelain: an honest comparison",
    excerpt:
      "Staining, heat, chipping and repair — how each worktop material behaves after five years of family cooking.",
    minutesToRead: 6,
    publishedDate: "2026-01-15",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Worktop samples on a bench",
  },
  {
    slug: "in-frame-or-handleless-what-you-are-really-choosing",
    title: "In-frame or handleless? What you are really choosing",
    excerpt:
      "Construction, tolerances and cleaning, plus the cost difference that surprises people at quote stage.",
    minutesToRead: 7,
    publishedDate: "2026-01-06",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Handleless cabinetry close-up",
  },
  {
    slug: "lead-times-stone-ten-days-cabinetry-six-weeks",
    title: "Lead times: why stone takes ten days and cabinetry six weeks",
    excerpt:
      "A realistic programme from signing to first meal, and the two orders that must be placed before anything else.",
    minutesToRead: 5,
    publishedDate: "2025-12-10",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Workshop cabinetry in production",
  },
  {
    slug: "showroom-quote-versus-builder-quote-reading-both",
    title: "Showroom quote versus builder quote: reading both",
    excerpt:
      "The same kitchen, two quotes, line by line — and the building work that only one of them included.",
    minutesToRead: 8,
    publishedDate: "2025-12-02",
    category: "Kitchen",
    tags: ["Costs"],
    coverPlaceholder: "Two kitchen quotes side by side",
  },
  {
    slug: "cooking-without-a-kitchen-for-six-weeks",
    title: "Cooking without a kitchen for six weeks",
    excerpt:
      "How we set up a temporary kitchen, what to put in it, and the week that is genuinely hardest.",
    minutesToRead: 6,
    publishedDate: "2025-11-12",
    category: "Kitchen",
    tags: ["Mid-project"],
    coverPlaceholder: "Temporary kitchen in a dining room",
  },
  {
    slug: "appliance-planning-before-cabinetry-not-after",
    title: "Appliance planning before cabinetry, not after",
    excerpt:
      "Boiling taps, extraction rates, integrated fridges and the three measurements that change your entire run.",
    minutesToRead: 7,
    publishedDate: "2025-11-04",
    category: "Kitchen",
    tags: ["Planning"],
    coverPlaceholder: "Integrated appliance run",
  },
  {
    slug: "kitchens-that-open-onto-gardens-done-properly",
    title: "Kitchens that open onto gardens, done properly",
    excerpt:
      "Thresholds, levels, glare and heat loss — four rear openings and what each one got right.",
    minutesToRead: 6,
    publishedDate: "2025-10-15",
    category: "Kitchen",
    tags: ["Inspiration"],
    coverPlaceholder: "Kitchen with sliding garden doors",
  },
  {
    slug: "snagging-a-kitchen-the-forty-point-walk-through",
    title: "Snagging a kitchen: the forty-point walk-through",
    excerpt:
      "Door alignment, drawer runners, silicone, worktop joints and every appliance tested before we hand over.",
    minutesToRead: 7,
    publishedDate: "2025-10-01",
    category: "Kitchen",
    tags: ["Mid-project"],
    coverPlaceholder: "Snagging a cabinetry run",
  },
];

/** Newest first, the order the blog index and Wix both use. */
export const ARTICLES_BY_DATE = [...ARTICLES].sort((a, b) =>
  b.publishedDate.localeCompare(a.publishedDate),
);

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export function articlesFor(category: Pillar) {
  return ARTICLES.filter((article) => article.category === category).sort(
    (a, b) => b.publishedDate.localeCompare(a.publishedDate),
  );
}

export function relatedTo(article: Article, count = 3) {
  return ARTICLES.filter(
    (other) =>
      other.slug !== article.slug && other.category === article.category,
  ).slice(0, count);
}

const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const FULL = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "9 min read · March 2026", as the cards show it. */
export function cardMeta(article: Article) {
  return `${article.minutesToRead} min read · ${MONTH.format(new Date(article.publishedDate))}`;
}

/** "Published 4 March 2026 · 9 min read", as the article byline shows it. */
export function bylineMeta(article: Article) {
  return `Published ${FULL.format(new Date(article.publishedDate))} · ${article.minutesToRead} min read`;
}
