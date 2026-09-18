import type { Metadata } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";

import { SITE_URL } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/structured-data";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  // Resolves the relative URLs in each page's canonical and Open Graph tags.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Migss Interiors",
    template: "%s | Migss Interiors",
  },
  description:
    "Bathroom, kitchen and interior renovations across London and Essex.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${instrument.variable} h-full scroll-smooth antialiased`}
    >
      <body className="bg-migss-bg text-migss-text font-body flex min-h-full flex-col overflow-x-hidden">
        {children}
        {/* Describes the business rather than the page, so it is emitted once
            here rather than repeated on every route. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
