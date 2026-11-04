import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";

import { CookieConsent } from "@/components/cookie-consent";
import { GoogleAnalytics } from "@/components/google-analytics";
import { NavMenuProvider } from "@/components/nav-menu";
import { ScrollReset } from "@/components/scroll-reset";
import { consentBootstrapScript } from "@/lib/consent";
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
    "High-end bathroom, kitchen and interior renovation across north London and Chigwell.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-GB"
      className={`${cormorant.variable} ${instrument.variable} h-full antialiased`}
    >
      <body className="bg-migss-bg text-migss-text font-body flex min-h-full flex-col overflow-x-hidden">
        <ScrollReset />
        <NavMenuProvider>{children}</NavMenuProvider>
        {/* Describes the business rather than the page, so it is emitted once
            here rather than repeated on every route. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd()),
          }}
        />
        {/* Google Consent Mode v2 defaults.

            `beforeInteractive` is the whole point: Consent Mode only honours a
            `default` call made before gtag.js runs. Set afterwards it is an
            `update`, and by then a tag may already have written the cookie
            consent is meant to gate. Next injects these into the initial HTML
            ahead of its own modules, so this lands before the tag below
            whatever order the JSX is in.

            Inline here rather than in a component of its own because the
            strategy is only valid in a root layout, and the lint rule that
            enforces that reads the file it is written in.

            The source is assembled from module constants in lib/consent —
            nothing from a request reaches it. */}
        <Script
          id="google-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
        />
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
