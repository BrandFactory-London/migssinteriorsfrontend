import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

/**
 * The finance page (TKT-103): 0% finance for up to 5 years, how it works,
 * and the finance terms with the verbatim Ideal4Finance disclaimer. Linked
 * from the Meta ads landing pages' "Find out more" and "terms and
 * conditions" (#terms).
 */
const doc = getLegalDoc("finance");

export async function generateMetadata() {
  const image = await ogImage("home-hero");

  return pageMetadata({
    title: "0% Finance | Migss Interiors",
    description: doc?.description ?? "0% finance on Migss Interiors renovations.",
    path: "/finance",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export default function Page() {
  if (!doc) notFound();
  return <LegalPage doc={doc} />;
}
