import "server-only";

import { cache } from "react";

import { getWixClient } from "@/lib/wix/client";

/**
 * The `Jobs` CMS collection, which drives /join-the-team.
 *
 * Roles are added, edited and closed in the Wix dashboard, so nothing here is
 * baked into a deploy: the pages that read this set ISR, and the role page
 * accepts slugs that did not exist at build time.
 *
 * The list fields (What You Will Do, What We Need, What We Offer) are plain
 * text with one item per line, because that is the easiest thing to edit in
 * the dashboard. Description and Hiring Process are paragraphs split on
 * blank lines, the same convention as the Projects collection.
 */

export type PayUnit = "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";

export type Job = {
  slug: string;
  title: string;
  isOpen: boolean;
  employmentType: string | null;
  location: string | null;
  /** Pay as Migss wants it worded, e.g. "£250 - £350 a day". */
  payDisplay: string | null;
  payMin: number | null;
  payMax: number | null;
  payUnit: PayUnit | null;
  hours: string | null;
  startDate: string | null;
  summary: string | null;
  description: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  hiringProcess: string[];
  /** ISO date (YYYY-MM-DD). Falls back to the item's created date. */
  datePosted: string | null;
  closingDate: string | null;
  indeedUrl: string | null;
};

function text(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function paragraphs(value: unknown) {
  const raw = text(value);
  if (!raw) return [];
  return raw
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** One item per line; stray bullets typed into the dashboard are dropped. */
function lines(value: unknown) {
  const raw = text(value);
  if (!raw) return [];
  return raw
    .split(/\n/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function number(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

/** DATE fields arrive as "YYYY-MM-DD"; system dates as { $date: ISO }. */
function isoDate(value: unknown) {
  const raw =
    typeof value === "string"
      ? value
      : typeof value === "object" && value !== null && "$date" in value
        ? String((value as { $date: unknown }).$date)
        : value instanceof Date
          ? value.toISOString()
          : null;
  if (!raw) return null;
  const match = /^\d{4}-\d{2}-\d{2}/.exec(raw);
  return match ? match[0] : null;
}

const PAY_UNITS: Record<string, PayUnit> = {
  hour: "HOUR",
  hourly: "HOUR",
  day: "DAY",
  daily: "DAY",
  week: "WEEK",
  weekly: "WEEK",
  month: "MONTH",
  monthly: "MONTH",
  year: "YEAR",
  yearly: "YEAR",
  annual: "YEAR",
  annum: "YEAR",
};

function payUnit(value: unknown): PayUnit | null {
  const raw = text(value)?.toLowerCase();
  return raw ? (PAY_UNITS[raw] ?? null) : null;
}

function toJob(data: Record<string, unknown>): Job | null {
  const slug = text(data.slug);
  const title = text(data.title);

  // Without these two there is no page to link to and nothing to label it.
  if (!slug || !title) return null;

  return {
    slug,
    title,
    // An unticked or missing box means the role is not advertised. Closing a
    // role should take one click, and a half-finished draft should not go live.
    isOpen: data.isOpen === true,
    employmentType: text(data.employmentType),
    location: text(data.location),
    payDisplay: text(data.payDisplay),
    payMin: number(data.payMin),
    payMax: number(data.payMax),
    payUnit: payUnit(data.payUnit),
    hours: text(data.hours),
    startDate: text(data.startDate),
    summary: text(data.summary),
    description: paragraphs(data.description),
    responsibilities: lines(data.responsibilities),
    requirements: lines(data.requirements),
    benefits: lines(data.benefits),
    hiringProcess: paragraphs(data.hiringProcess),
    datePosted: isoDate(data.datePosted) ?? isoDate(data._createdDate),
    closingDate: isoDate(data.closingDate),
    indeedUrl: text(data.indeedUrl),
  };
}

/** Past its closing date, counted to the end of that day. */
function hasClosed(job: Job, today = new Date().toISOString().slice(0, 10)) {
  return job.closingDate !== null && job.closingDate < today;
}

/**
 * Every role in the collection, open or not, newest first.
 *
 * Deliberately not wrapped in a try/catch, for the same reason as projects:
 * if the CMS cannot be reached the render fails and ISR keeps serving the
 * last good page, rather than publishing "no roles open" by mistake.
 */
export const getAllJobs = cache(async (): Promise<Job[]> => {
  const client = getWixClient();
  const { items } = await client.items.query("Jobs").limit(100).find();

  return items
    .map((item) => toJob(item as Record<string, unknown>))
    .filter((job): job is Job => job !== null)
    .map((job) => (hasClosed(job) ? { ...job, isOpen: false } : job))
    .sort((a, b) => (b.datePosted ?? "").localeCompare(a.datePosted ?? ""));
});

/** The roles currently advertised. */
export async function getOpenJobs() {
  return (await getAllJobs()).filter((job) => job.isOpen);
}

/** A single role, open or closed, so an old link explains itself. */
export async function getJob(slug: string) {
  return (await getAllJobs()).find((job) => job.slug === slug);
}
