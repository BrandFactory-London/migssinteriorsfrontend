import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Lets the dev server accept requests whose Origin is the machine's LAN
   * address, so the site can be opened on a phone. Hostname only — the scheme
   * and port are ignored.
   *
   * Ranges rather than single addresses, because a hostname that is not listed
   * does not fail loudly: Next blocks cross-origin requests to dev-only assets
   * and endpoints, the HMR socket among them, and the page then arrives as
   * server-rendered HTML that never hydrates. Nothing 404s and no script is
   * missing, so it reads as a React bug rather than a network one.
   *
   * `*` stands for exactly one label, and an IPv4 address is four labels, so
   * `172.20.10.*` covers a host reached over an iPhone's Personal Hotspot —
   * iOS always numbers that subnet 172.20.10.x — and `192.168.1.*` survives
   * the router handing out a different lease than it did last time.
   *
   * Development only. `next start` applies none of this.
   */
  allowedDevOrigins: ["192.168.1.*", "172.20.10.*"],

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
