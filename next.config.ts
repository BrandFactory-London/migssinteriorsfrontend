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
   * `permanent: true` is Next's permanent redirect, which it serves as a 308
   * rather than a 301. Both are permanent and search engines treat them the
   * same; 308 additionally preserves the request method. If a literal 301 is
   * ever needed, swap `permanent` for `statusCode: 301`.
   */
  async redirects() {
    return [
      // The Jobs page has no equivalent here.
      { source: "/jobs", destination: "/", permanent: true },
      {
        source: "/renovations-showcase",
        destination: "/our-projects",
        permanent: true,
      },
      {
        source: "/bathroom-renovations",
        destination: "/renovation-services/bathroom",
        permanent: true,
      },
      {
        source: "/kitchen-renovation",
        destination: "/renovation-services/kitchen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
