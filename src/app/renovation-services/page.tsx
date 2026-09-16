import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renovation Services",
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Renovation Services</h1>
      <p className="mt-2 text-sm text-muted-foreground">Services overview — content to be built in Phase 4.</p>
    </main>
  );
}
