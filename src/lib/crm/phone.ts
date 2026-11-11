/**
 * Normalises a phone number as typed by a visitor into international format.
 *
 * UK numbers are what the site sees: "07700 900123", "+44 (0)7700 900123",
 * "0044 7700 900123" and "447700900123" all become "+447700900123". Anything
 * already in international form for another country is kept, minus spacing.
 *
 * A number that does not look like a phone number at all is returned as typed
 * rather than rejected: a lead with an odd number is still a lead, and a person
 * can read it. Never throws.
 */
export function normaliseUkPhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  let compact = trimmed.replace(/[\s\-().]/g, "");
  if (compact.startsWith("00")) compact = `+${compact.slice(2)}`;

  if (compact.startsWith("+")) {
    // "+44 (0)7700..." leaves a trunk zero behind the country code.
    const fixed = compact.replace(/^\+440/, "+44");
    return /^\+\d{7,15}$/.test(fixed) ? fixed : trimmed;
  }

  // UK national format: 0 followed by 9 or 10 digits.
  if (/^0\d{9,10}$/.test(compact)) return `+44${compact.slice(1)}`;

  // Country code typed without the plus.
  if (/^44\d{9,10}$/.test(compact)) return `+${compact}`;

  return trimmed;
}
