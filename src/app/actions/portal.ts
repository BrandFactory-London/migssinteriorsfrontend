"use server";

import { timingSafeEqual } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { compact, plausible, postcodeVariants } from "@/lib/portal/credentials";
import {
  clearFailures,
  isLockedOut,
  recordFailure,
} from "@/lib/portal/rate-limit";
import { endSession, startSession } from "@/lib/portal/session";
import { findProjectsByPostcode } from "@/lib/wix/portal";

export type PortalSignInState = {
  error?: string;
  /** Echoed back exactly as typed, so a failed attempt keeps its hyphens. */
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
  const typedReference = String(formData.get("reference") ?? "").trim();
  const typedPostcode = String(formData.get("postcode") ?? "").trim();
  const reference = compact(typedReference);
  const postcode = compact(typedPostcode);

  if (!reference || !postcode) {
    return {
      error: "Enter your project reference ID and postcode.",
      reference: typedReference,
    };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const keys = [`ip:${ip}`, `ref:${reference}`];

  if (isLockedOut(keys)) return { error: LOCKED, reference: typedReference };

  let projectId: string | null = null;
  // Nonsense input is still a failed attempt, but needs no round trip to Wix.
  if (plausible(reference) && plausible(postcode)) {
    try {
      const candidates = await findProjectsByPostcode(
        postcodeVariants(typedPostcode),
      );
      const match = candidates.find(
        (project) =>
          project.active &&
          same(compact(project.postcode), postcode) &&
          same(compact(project.referenceId), reference),
      );
      projectId = match?.id ?? null;
    } catch (error) {
      console.error("[client-portal] sign-in lookup failed", error);
      return { error: BROKEN, reference: typedReference };
    }
  }

  if (!projectId) {
    recordFailure(keys);
    return { error: WRONG, reference: typedReference };
  }

  clearFailures(keys);
  try {
    await startSession(projectId);
  } catch (error) {
    console.error("[client-portal] could not start session", error);
    return { error: BROKEN, reference: typedReference };
  }
  redirect("/client-portal/documents");
}

export async function signOutOfPortal() {
  await endSession();
  redirect("/");
}
