import { describe, expect, it } from "vitest";

import {
  CONVERSION_TOKEN_TTL_MS,
  createConversionToken,
  verifyConversionToken,
} from "@/lib/conversion-token";

const SECRET = "test-secret";
const NOW = 1_800_000_000_000;

describe("conversion token", () => {
  it("accepts a fresh token", () => {
    const token = createConversionToken(SECRET, NOW);
    expect(verifyConversionToken(token, SECRET, NOW + 1000)).toBe(true);
  });

  it("is URL safe", () => {
    expect(createConversionToken(SECRET, NOW)).toMatch(/^[A-Za-z0-9._-]+$/);
  });

  it("rejects an expired token", () => {
    const token = createConversionToken(SECRET, NOW);
    expect(verifyConversionToken(token, SECRET, NOW + CONVERSION_TOKEN_TTL_MS + 1)).toBe(false);
  });

  it("rejects a token signed with another secret", () => {
    const token = createConversionToken("other", NOW);
    expect(verifyConversionToken(token, SECRET, NOW)).toBe(false);
  });

  it("rejects a tampered expiry", () => {
    const token = createConversionToken(SECRET, NOW);
    const [, nonce, sig] = token.split(".");
    const forged = `${NOW + CONVERSION_TOKEN_TTL_MS * 100}.${nonce}.${sig}`;
    expect(verifyConversionToken(forged, SECRET, NOW)).toBe(false);
  });

  it("rejects missing or malformed input", () => {
    expect(verifyConversionToken(undefined, SECRET, NOW)).toBe(false);
    expect(verifyConversionToken("abc", SECRET, NOW)).toBe(false);
    expect(verifyConversionToken(createConversionToken(SECRET, NOW), undefined, NOW)).toBe(false);
  });
});
