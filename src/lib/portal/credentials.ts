/**
 * How a typed reference ID and postcode are compared with what is in the CMS.
 *
 * Both are compared in a normalised form, so the office can enter them however
 * they like and a client can type them however they like: "ig7 6ab", "IG76AB"
 * and " IG7 6AB " are the same postcode; "mig-7k4q-29" and "MIG 7K4Q 29" are
 * the same reference.
 */

export function normalisePostcode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Reference IDs are stored and matched as MIG-XXXX-XX. */
export function normaliseReference(value: string): string {
  const compact = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^MIG[A-Z0-9]{6}$/.test(compact)) return compact;
  return `MIG-${compact.slice(3, 7)}-${compact.slice(7)}`;
}

export function looksLikeReference(value: string): boolean {
  return /^MIG-[A-Z0-9]{4}-[A-Z0-9]{2}$/.test(value);
}

/**
 * Letters and digits that cannot be misread for one another on a handover
 * sheet or over the phone: no 0/O, 1/I/L, 5/S, 2/Z or 8/B.
 */
export const REFERENCE_ALPHABET = "34679ACDEFGHJKMNPQRTUVWXY";
