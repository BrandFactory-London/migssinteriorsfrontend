import type { MetadataRoute } from "next";

import { absolute } from "@/lib/seo";

/**
 * Indexing is open, with one exception: /thank-you is only ever reached by
 * redirect after an enquiry, and already carries `robots: { index: false }`.
 * Disallowing it here as well keeps it out of crawls that never fetch the
 * page to read its meta tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/thank-you" }],
    sitemap: absolute("/sitemap.xml"),
  };
}
