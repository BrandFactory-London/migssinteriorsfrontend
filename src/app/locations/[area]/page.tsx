import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LOCATIONS, getLocation } from "@/lib/locations";

type Props = { params: Promise<{ area: string }> };

export function generateStaticParams() {
  return LOCATIONS.map(({ slug }) => ({ area: slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const location = getLocation(area);

  return { title: location ? `${location.name} Renovations` : "Not found" };
}

export default async function Page({ params }: Props) {
  const { area } = await params;
  const location = getLocation(area);

  if (!location) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        {location.name}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Location page — content to be built in Phase 4.
      </p>
    </main>
  );
}
