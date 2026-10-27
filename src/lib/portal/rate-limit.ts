import "server-only";

/**
 * Slows down guessing at the sign-in form.
 *
 * Five failed attempts in fifteen minutes from one address, or against one
 * reference ID, locks that address or reference out for the rest of the
 * window. Keying on the reference as well as the address is what stops
 * someone working through postcodes for a reference they already have from
 * several addresses at once.
 *
 * In memory, per server instance. On Vercel that means each warm instance
 * keeps its own count, so a determined attacker spread across instances gets
 * a few more tries than five. Against a reference space of 25^6 (about 244
 * million) that is still nowhere near enough to find one by guessing, which is
 * the threat this exists for. If the portal ever needs a hard global limit,
 * swap this store for Vercel's KV or the firewall's rate limiting.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

const failures = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  const list = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length) failures.set(key, list);
  else failures.delete(key);
  return list;
}

export function isLockedOut(keys: string[], now = Date.now()): boolean {
  return keys.some((key) => recent(key, now).length >= MAX_FAILURES);
}

export function recordFailure(keys: string[], now = Date.now()) {
  for (const key of keys) {
    failures.set(key, [...recent(key, now), now]);
  }
  // A cap on the map itself, so a flood of distinct keys cannot grow it
  // without bound between cold starts.
  if (failures.size > 5000) failures.clear();
}

export function clearFailures(keys: string[]) {
  for (const key of keys) failures.delete(key);
}
