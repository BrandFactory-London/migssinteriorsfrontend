import { absolute, SITE_URL } from "@/lib/seo";
import type { Job } from "@/lib/wix/jobs";

/** "15 October 2026". Dates are calendar days, so read them as UTC. */
export function formatJobDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

/** The short facts shown on a card and in the role page's fact strip. */
export function jobFacts(job: Job) {
  return [
    job.payDisplay ? { label: "Pay", value: job.payDisplay } : null,
    job.location ? { label: "Location", value: job.location } : null,
    job.employmentType ? { label: "Type", value: job.employmentType } : null,
    job.hours ? { label: "Hours", value: job.hours } : null,
    job.startDate ? { label: "Start", value: job.startDate } : null,
  ].filter((fact) => fact !== null);
}

/**
 * Google's employment types. The dashboard field is freeform, so it is read
 * for the words that settle it; self-employed and CIS work is CONTRACTOR.
 */
function employmentType(value: string | null) {
  const raw = value?.toLowerCase() ?? "";
  if (/self.?employed|contract|cis|freelance/.test(raw)) return "CONTRACTOR";
  if (/part.?time/.test(raw)) return "PART_TIME";
  if (/temp/.test(raw)) return "TEMPORARY";
  if (/full.?time|permanent/.test(raw)) return "FULL_TIME";
  return undefined;
}

/**
 * The town for the posting's address. The dashboard says things like
 * "Chigwell and surrounding areas"; Google wants a locality.
 */
function locality(value: string | null) {
  if (!value) return undefined;
  return value.split(/,| and | & /i)[0].trim() || undefined;
}

/**
 * JobPosting structured data, which is what makes a role eligible for
 * Google's jobs results. Only emitted for open roles: a closed role carrying
 * the schema is a policy violation for Google, not just stale data.
 */
export function jobPostingJsonLd(job: Job) {
  const description = [
    ...job.description.map((paragraph) => `<p>${escape(paragraph)}</p>`),
    list("What you will do", job.responsibilities),
    list("What we need", job.requirements),
    list("What we offer", job.benefits),
    ...job.hiringProcess.map((paragraph) => `<p>${escape(paragraph)}</p>`),
  ]
    .filter(Boolean)
    .join("");

  const salary =
    job.payMin !== null && job.payUnit
      ? {
          "@type": "MonetaryAmount" as const,
          currency: "GBP",
          value: {
            "@type": "QuantitativeValue" as const,
            ...(job.payMax !== null && job.payMax !== job.payMin
              ? { minValue: job.payMin, maxValue: job.payMax }
              : { value: job.payMin }),
            unitText: job.payUnit,
          },
        }
      : undefined;

  return {
    "@context": "https://schema.org" as const,
    "@type": "JobPosting" as const,
    title: job.title,
    description: description || job.summary || job.title,
    ...(job.datePosted ? { datePosted: job.datePosted } : {}),
    ...(job.closingDate ? { validThrough: `${job.closingDate}T23:59:59Z` } : {}),
    ...(employmentType(job.employmentType)
      ? { employmentType: employmentType(job.employmentType) }
      : {}),
    hiringOrganization: {
      "@type": "Organization" as const,
      "@id": `${SITE_URL}/#business`,
      name: "Migss Interiors",
      sameAs: SITE_URL,
      logo: absolute("/Brand/logo-horizontal.png"),
    },
    jobLocation: {
      "@type": "Place" as const,
      address: {
        "@type": "PostalAddress" as const,
        ...(locality(job.location)
          ? { addressLocality: locality(job.location) }
          : {}),
        addressCountry: "GB",
      },
    },
    ...(salary ? { baseSalary: salary } : {}),
    // Applications are taken on the page itself.
    directApply: true,
    url: absolute(`/join-the-team/${job.slug}`),
  };
}

function list(heading: string, items: string[]) {
  if (items.length === 0) return "";
  return `<p><strong>${heading}</strong></p><ul>${items
    .map((item) => `<li>${escape(item)}</li>`)
    .join("")}</ul>`;
}

function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
