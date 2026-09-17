import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server accept requests whose Origin is the machine's LAN
  // address, so the site can be opened on a phone on the same network.
  // Hostname only — the scheme and port are ignored.
  allowedDevOrigins: ["192.168.1.217"],
};

export default nextConfig;
