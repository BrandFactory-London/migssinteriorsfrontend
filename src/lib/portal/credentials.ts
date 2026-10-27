/**
 * How a typed reference ID and postcode are compared with what is in the CMS.
 *
 * Both are compared with spaces, hyphens and case stripped, so the office can
 * enter them however they like and a client can type them however they like:
 * "ig7 6ab", "IG76AB" and " IG7 6AB " are the same postcode; "mig-0001-001",
 * "MIG 0001 001" and "MIG0001001" are the same reference. No reference format
 * is enforced, so whatever scheme the office uses works.
 */

export function compact(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/**
 * The spellings a postcode is likely to be stored under in the CMS, for the
 * lookup: as typed, run together, and with the standard single space before
 * the last three characters (UK inward code).
 */
export function postcodeVariants(typed: string): string[] {
  const tight = compact(typed);
  const spaced =
    tight.length > 3 ? `${tight.slice(0, -3)} ${tight.slice(-3)}` : tight;
  const asTyped = typed.trim().replace(/\s+/g, " ");
  return Array.from(
    new Set(
      [tight, spaced, asTyped, asTyped.toUpperCase()].flatMap((v) => [
        v,
        v.toLowerCase(),
      ]),
    ),
  ).filter(Boolean);
}

/** Plausible as a reference or postcode at all: 4 to 24 letters and digits. */
export function plausible(value: string): boolean {
  return /^[A-Z0-9]{4,24}$/.test(value);
}

/**
 * Letters and digits that cannot be misread for one another on a handover
 * sheet or over the phone: no 0/O, 1/I/L, 5/S, 2/Z or 8/B. Used by
 * `pnpm portal:ref`.
 */
export const REFERENCE_ALPHABET = "34679ACDEFGHJKMNPQRTUVWXY";
