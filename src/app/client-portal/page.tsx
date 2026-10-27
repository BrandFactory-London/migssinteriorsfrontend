import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { currentProjectId } from "@/lib/portal/session";

import { PortalFrame } from "./portal-frame";
import { SignInForm } from "./sign-in-form";
import s from "./portal.module.css";

export const metadata: Metadata = {
  title: "Client Login",
  description: "Sign in to view your project documents.",
  robots: { index: false, follow: false },
};

/**
 * The client sign-in. A copy of the staff sign-in at staff.migssinteriors.com
 * (see portal.module.css for where every value comes from), with the email and
 * password replaced by the project reference ID and postcode.
 *
 * No site header, menu or footer, exactly as the staff screen has none: it is
 * a door, not a page of the site.
 */
export default async function ClientPortalSignIn() {
  // Already signed in: go straight to the documents rather than asking again.
  let signedIn = false;
  try {
    signedIn = Boolean(await currentProjectId());
  } catch {
    // A missing session secret surfaces as a sign-in error, not a crash here.
  }
  if (signedIn) redirect("/client-portal/documents");

  return (
    <PortalFrame barLabel="Client Login">
      <p className={s.subtitle}>Client Portal</p>
      <SignInForm />
    </PortalFrame>
  );
}
