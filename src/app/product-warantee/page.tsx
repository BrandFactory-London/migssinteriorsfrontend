import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/legal/legal-page";
import { getLegalDoc } from "@/lib/legal";

const doc = getLegalDoc("product-warantee");

export const metadata: Metadata = {
  title: doc?.title ?? "Not found",
  description: doc?.description,
};

export default function Page() {
  // The slug is a literal above, so this only trips if the document is removed
  // from lib/legal.tsx without the route going with it.
  if (!doc) notFound();

  return <LegalPage doc={doc} />;
}
