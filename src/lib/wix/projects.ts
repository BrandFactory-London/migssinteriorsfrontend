import "server-only";

import { cache } from "react";
import { media } from "@wix/sdk";

import { getWixClient } from "@/lib/wix/client";

/**
 * The `Projects` CMS collection, which is the live portfolio.
 *
 * Amir adds and edits projects in the Wix dashboard continuously, so nothing
 * here is baked into a deploy: the pages that read this set ISR, and
 * /our-projects/[slug] accepts slugs that did not exist at build time.
 *
 * `category` and `location` are freeform text typed by hand, so both are
 * trimmed and matched case-insensitively, and an unrecognised value is kept
 * out of the UI rather than guessed at.
 */

export const CATEGORIES = ["Bathroom", "Kitchen", "Interior"] as const;
export type ProjectCategory = (typeof CATEGORIES)[number];

export type GalleryShot = {
  url: string;
  alt: string;
  /** The dashboard's own caption, when someone has written one. */
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Null when the dashboard value is blank or not one of the three. */
  category: ProjectCategory | null;
  /** The town, as typed. Null when blank. */
  location: string | null;
  /** Street-level caption line, e.g. "Manor Road, Chigwell". */
  addressLine: string | null;
  summary: string | null;
  /** Paragraphs, split on blank lines. */
  description: string[];
  clientName: string | null;
  testimonial: string | null;
  featured: boolean;
  /** Ready-to-use URLs, sized for where each one is rendered. */
  cardUrl: string | null;
  heroUrl: string | null;
  beforeUrl: string | null;
  gallery: GalleryShot[];
  videoUrl: string | null;
};

/** Rendered sizes. Cards are 4:5, heroes and gallery shots are landscape. */
const SIZE = {
  card: [800, 1000],
  hero: [2000, 1333],
  before: [1200, 900],
  gallery: [1440, 960],
} as const;

function scaled(uri: unknown, [width, height]: readonly [number, number]) {
  if (typeof uri !== "string" || !uri.startsWith("wix:image://")) return null;
  try {
    return media.getScaledToFillImageUrl(uri, width, height, {});
  } catch {
    // A malformed value in the dashboard should cost that one photograph,
    // not the whole page.
    return null;
  }
}

function videoUrl(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const resolved = media.getVideoUrl(value);
    return resolved?.url ?? null;
  } catch {
    return null;
  }
}

function text(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function category(value: unknown): ProjectCategory | null {
  const raw = text(value)?.toLowerCase();
  return CATEGORIES.find((option) => option.toLowerCase() === raw) ?? null;
}

function paragraphs(value: unknown) {
  const raw = text(value);
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function gallery(value: unknown, title: string): GalleryShot[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item, index) => {
    if (typeof item !== "object" || item === null) return [];
    const shot = item as Record<string, unknown>;
    const url = scaled(shot.src, SIZE.gallery);
    if (!url) return [];

    const caption = text(shot.description) ?? undefined;
    return [
      {
        url,
        alt: text(shot.alt) ?? caption ?? `${title}, photograph ${index + 1}`,
        caption,
      },
    ];
  });
}

function toProject(data: Record<string, unknown>): Project | null {
  const slug = text(data.slug);
  const title = text(data.title);

  // Without these two there is no page to link to and nothing to label it.
  if (!slug || !title) return null;

  return {
    slug,
    title,
    category: category(data.category),
    location: text(data.location),
    addressLine: text(data.addressLine),
    summary: text(data.summary),
    description: paragraphs(data.description),
    clientName: text(data.clientName),
    testimonial: text(data.testimonial),
    featured: data.featured === true,
    cardUrl: scaled(data.heroImage, SIZE.card),
    heroUrl: scaled(data.heroImage, SIZE.hero),
    beforeUrl: scaled(data.beforeImage, SIZE.before),
    gallery: gallery(data.gallery, title),
    videoUrl: videoUrl(data.videoTestimonial),
  };
}

/**
 * Every project, newest first.
 *
 * Deliberately not wrapped in a try/catch: if the CMS cannot be reached, the
 * page should fail and ISR keeps serving the last good render, rather than
 * quietly publishing an empty portfolio for the length of the revalidate
 * window.
 */
export const getProjects = cache(async (): Promise<Project[]> => {
  const client = getWixClient();
  const { items } = await client.items.query("Projects").limit(100).find();

  return items
    .map((item) => ({
      project: toProject(item as Record<string, unknown>),
      created: String((item as Record<string, unknown>)._createdDate ?? ""),
    }))
    .filter(
      (entry): entry is { project: Project; created: string } =>
        entry.project !== null,
    )
    .sort((a, b) => b.created.localeCompare(a.created))
    .map((entry) => entry.project);
});

export async function getProject(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug);
}

export async function getFeaturedProjects() {
  return (await getProjects()).filter((project) => project.featured);
}

/**
 * What the homepage rail shows: the featured projects, or the most recent
 * work when nobody has flagged one. The homepage should never carry an empty
 * rail because a checkbox is unticked.
 */
export async function getHomeProjects(count = 4) {
  const featured = await getFeaturedProjects();
  if (featured.length > 0) return featured;
  return (await getProjects()).slice(0, count);
}

/** The categories actually present in the data, in the canonical order. */
export function categoriesPresent(projects: Project[]) {
  return CATEGORIES.filter((option) =>
    projects.some((project) => project.category === option),
  );
}

/**
 * Projects in a town, falling back to recent work elsewhere.
 *
 * The town name is matched against the freeform `location` field, trimmed and
 * case-insensitively. Most of the ten towns have no photographed work yet, so
 * the fallback is the normal case rather than the exception — the caller says
 * so in the heading rather than implying we have worked on the next street.
 */
export async function getTownProjects(town: string) {
  const projects = await getProjects();
  const wanted = town.trim().toLowerCase();

  const local = projects.filter(
    (project) => project.location?.trim().toLowerCase() === wanted,
  );

  if (local.length > 0) return { projects: local, isLocal: true };

  return { projects: projects.slice(0, 3), isLocal: false };
}

/** Maps a project category onto the matching service page and form focus. */
export const CATEGORY_SERVICE = {
  Bathroom: { slug: "bathroom", label: "bathroom renovation" },
  Kitchen: { slug: "kitchen", label: "kitchen renovation" },
  Interior: { slug: "interior", label: "interior renovation" },
} as const;

/** Detail pages need a service even when the category is blank. */
export function serviceFor(project: Project) {
  return CATEGORY_SERVICE[project.category ?? "Interior"];
}
