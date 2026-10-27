import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * The client portal's session: one signed cookie naming the Wix item ID of
 * the project the visitor proved they own, and when that proof runs out.
 *
 * Signed rather than looked up because there is nowhere to look it up: the
 * site has no database of its own, and adding one for a two-hour cookie would
 * cost more than it protects. The signature is what stops someone editing the
 * cookie to name another project, which is the only attack a plain value
 * would invite.
 */

export const SESSION_COOKIE = "migss_portal";
/** Two hours, as agreed. Not sliding: the clock starts at sign-in. */
export const SESSION_SECONDS = 2 * 60 * 60;

type Payload = { p: string; exp: number };

function secret(): string {
  const value = process.env.PORTAL_SESSION_SECRET;
  // Refusing beats signing with an empty or guessable key, which would let
  // anyone mint a cookie for any project.
  if (!value || value.length < 32) {
    throw new Error("PORTAL_SESSION_SECRET is not set (32+ characters).");
  }
  return value;
}

function sign(body: string): string {
  return createHmac("sha256", secret()).update(body).digest("base64url");
}

export function encodeSession(projectItemId: string, now = Date.now()): string {
  const payload: Payload = {
    p: projectItemId,
    exp: Math.floor(now / 1000) + SESSION_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(
  value: string | undefined,
  now = Date.now(),
): string | null {
  if (!value) return null;
  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Payload;
    if (typeof payload.p !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp * 1000 <= now) return null;
    return payload.p;
  } catch {
    return null;
  }
}

/** The signed-in project's Wix item ID, or null. */
export async function currentProjectId(): Promise<string | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value);
}

export async function startSession(projectItemId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(projectItemId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    // Scoped to the portal, so the cookie is never sent with the rest of the
    // site's requests.
    path: "/client-portal",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession() {
  const jar = await cookies();
  jar.delete({ name: SESSION_COOKIE, path: "/client-portal" });
}
