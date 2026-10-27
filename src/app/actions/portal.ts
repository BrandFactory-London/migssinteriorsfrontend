"use server";

import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  looksLikeReference,
  normalisePostcode,
  normaliseReference,
} from "@/lib/portal/credentials";
import {
  clearFailures,
  isLockedOut,
  recordFailure,
} from "@/lib/portal/rate-limit";
import { endSession, startSession } from "@/lib/portal/session";
import { findProjectsByReference } from "@/lib/wix/portal";

export type PortalSignInState = {
  error?: string;
  reference?: string;
};

/*
 * One message for every wrong answer. Saying "reference not found" separately
 * from "postcode does not match" would tell a stranger which half they have
 * right.
 */
const WRONG = "Those details do not match a project. Check them and try again.";
const LOCKED =
  "Too many attempts. Please wait fifteen minutes, or ring the office.";
const BROKEN = "Sign in failed. Please try again, or ring the office.";

function same(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function signInToPortal(
  _previous: PortalSignInState,
  formData: FormData,
): Promise<PortalSignInState> {
  const reference = normaliseReference(String(formData.get("reference") ?? ""));
  const postcode = normalisePostcode(String(formData.get("postcode") ?? ""));

  if (!reference || !postcode) {
    return { error: "Enter your project reference ID and postcode.", reference };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const keys = [`ip:${ip}`, `ref:${reference}`];

  if (isLockedOut(keys)) return { error: LOCKED, reference };

  // A reference that cannot exist is still a failed attempt, but it does not
  // need a round trip to Wix to find that out.
  let projectId: string | null = null;
  if (looksLikeReference(reference)) {
    try {
      const candidates = await findProjectsByReference(reference);
      const match = candidates.find(
        (project) =>
          project.active &&
          normaliseReference(project.referenceId) === reference &&
          same(normalisePostcode(project.postcode), postcode),
      );
      projectId = match?.id ?? null;
    } catch (error) {
      console.error("[client-portal] sign-in lookup failed", error);
      return { error: BROKEN, reference };
    }
  }

  if (!projectId) {
    recordFailure(keys);
    return { error: WRONG, reference };
  }

  clearFailures(keys);
  try {
    await startSession(projectId);
  } catch (error) {
    console.error("[client-portal] could not start session", error);
    return { error: BROKEN, reference };
  }
  redirect("/client-portal/documents");
}

export async function signOutOfPortal() {
  await endSession();
  redirect("/");
}
