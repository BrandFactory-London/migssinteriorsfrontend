import "server-only";

import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

/**
 * Server-side Wix Headless client.
 *
 * Auth is anonymous-visitor OAuth: the SDK exchanges the client ID for a
 * visitor token on first use, so no login and no client secret are involved.
 * `server-only` keeps this module (and the client ID) out of the browser
 * bundle — import it from Server Components, route handlers and server
 * actions only.
 */
export function getWixClient() {
  const clientId = process.env.WIX_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      "WIX_CLIENT_ID is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  return createClient({
    modules: { items },
    auth: OAuthStrategy({ clientId }),
  });
}

export type WixClient = ReturnType<typeof getWixClient>;
