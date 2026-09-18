import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";
import { ogImage } from "@/lib/wix/og-image";

const doc = getLegalDoc("terms-of-use");

export async function generateMetadata() {
  const image = await ogImage("home-hero");

  return pageMetadata({
    title: `${doc?.title ?? "Website Terms of Use"} | Migss Interiors`,
    description:
      doc?.description ??
      "Website Terms of Use for Migss Interiors, bathroom and kitchen renovation across London and Essex.",
    path: "/terms-of-use",
    image: image?.url,
    imageAlt: image?.alt,
  });
}

export default function Page() {
  // The slug is a literal above, so this only trips if the document is removed
  // from lib/legal.tsx without the route going with it.
  if (!doc) notFound();

  return <LegalPage doc={doc} />;
}
