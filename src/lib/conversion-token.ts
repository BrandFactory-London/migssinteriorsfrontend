import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * A short-lived signed token that marks a /thank-you visit as the result of a
 * genuine enquiry, so the conversion event fires for real submissions only and
 * not for a reload, a bookmark or someone typing the URL.
 *
 * Format: "<expiry ms>.<nonce>.<signature>", all URL-safe.
 *
 * The signing key is derived from NOTION_TOKEN rather than a separate secret:
 * a token only needs to outlive the redirect, the server already has that key
 * whenever an enquiry can succeed at all, and it saves a second variable to
 * manage. Rotating NOTION_TOKEN invalidates outstanding tokens, which costs at
 * most a few minutes of conversions mid-rotation.
 */

export const CONVERSION_TOKEN_TTL_MS = 10 * 60 * 1000;

const KEY_LABEL = "migss-conversion-token-v1";

function signingKey(secret: string): Buffer {
  return createHmac("sha256", secret).update(KEY_LABEL).digest();
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", signingKey(secret)).update(payload).digest("base64url");
}

export function createConversionToken(
  secret: string,
  now: number = Date.now(),
): string {
  const payload = `${now + CONVERSION_TOKEN_TTL_MS}.${randomBytes(9).toString("base64url")}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyConversionToken(
  token: string | undefined,
  secret: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!token || !secret || token.length > 200) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expiry, nonce, signature] = parts;

  const expires = Number(expiry);
  if (!Number.isFinite(expires) || expires < now) return false;
  if (expires > now + CONVERSION_TOKEN_TTL_MS) return false;

  const expected = Buffer.from(sign(`${expiry}.${nonce}`, secret));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
