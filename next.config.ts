import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server accept requests whose Origin is the machine's LAN
  // address, so the site can be opened on a phone on the same network.
  // Hostname only — the scheme and port are ignored.
  allowedDevOrigins: ["192.168.1.217"],

  /**
   * The Wix site's URL structure, kept alive for bookmarks and for links
   * already in the search index. None of these paths exists as a route here,
   * so nothing is shadowed.
   *
   * `statusCode: 301` rather than `permanent: true`: Next serves the latter
   * as a 308. Both are permanent and search engines treat them alike, but a
   * 301 is read without argument by older crawlers and by the SEO tooling
   * that will be checking these once the domain moves.
   */
  async redirects() {
    return [
      // The Jobs page has no equivalent here.
      { source: "/jobs", destination: "/", statusCode: 301 },
      {
        source: "/renovations-showcase",
        destination: "/our-projects",
        statusCode: 301,
      },
      {
        source: "/bathroom-renovations",
        destination: "/renovation-services/bathroom",
        statusCode: 301,
      },
      {
        source: "/kitchen-renovation",
        destination: "/renovation-services/kitchen",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
