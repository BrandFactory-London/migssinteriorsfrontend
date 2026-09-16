import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  return { title: slug };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">{slug}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Blog post — posts will be sourced from the Wix CMS in Phase 4.
      </p>
    </main>
  );
}
