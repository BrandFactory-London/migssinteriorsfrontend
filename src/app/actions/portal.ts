"use server";

import { timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";

import { compact, plausible, postcodeVariants } from "@/lib/portal/credentials";
import { endSession, startSession } from "@/lib/portal/session";
import { findProjectsByPostcode } from "@/lib/wix/portal";

export type PortalSignInState = {
  error?: string;
  /** Echoed back exactly as typed, so a failed attempt keeps its hyphens. */
  reference?: string;
  postcode?: string;
};

/*
 * One message for every wrong answer. Saying "reference not found" separately
 * from "postcode does not match" would tell a stranger which half they have
 * right.
 */
const WRONG = "Those details do not match a project. Check them and try again.";
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
      postcode: typedPostcode,
    };
  }

  let projectId: string | null = null;
  // How many records shared the postcode; logged on a miss (count only, no
  // personal details) so a failed sign-in can be told apart from a bad key.
  let candidateCount = -1;
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
      candidateCount = candidates.length;
      projectId = match?.id ?? null;
    } catch (error) {
      console.error("[client-portal] sign-in lookup failed", error);
      return { error: BROKEN, reference: typedReference, postcode: typedPostcode };
    }
  }

  if (!projectId) {
    console.info("[client-portal] no match", { candidateCount });
    return { error: WRONG, reference: typedReference, postcode: typedPostcode };
  }

  try {
    await startSession(projectId);
  } catch (error) {
    console.error("[client-portal] could not start session", error);
    return { error: BROKEN, reference: typedReference, postcode: typedPostcode };
  }
  redirect("/client-portal/documents");
}

export async function signOutOfPortal() {
  await endSession();
  redirect("/");
}
