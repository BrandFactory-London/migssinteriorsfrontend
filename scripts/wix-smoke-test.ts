/**
 * Verifies the Wix Headless connection end to end:
 *   1. exchanges the client ID for an anonymous visitor token
 *   2. calls the Data API with that token
 *
 * Run with: pnpm wix:check
 */
import { createClient, OAuthStrategy } from "@wix/sdk";
import { collections } from "@wix/data";

const clientId = process.env.WIX_CLIENT_ID;

if (!clientId) {
  console.error("✗ WIX_CLIENT_ID is not set (expected in .env.local).");
  process.exit(1);
}

const client = createClient({
  modules: { collections },
  auth: OAuthStrategy({ clientId }),
});

async function main() {
  const tokens = await client.auth.generateVisitorTokens();
  console.log(
    `✓ Visitor token issued (expires in ${tokens.accessToken.expiresAt - Math.floor(Date.now() / 1000)}s)`,
  );

  try {
    const { collections: found } = await client.collections.listDataCollections();
    console.log(`✓ Data API reachable — ${found?.length ?? 0} collection(s):`);
    for (const collection of found ?? []) {
      console.log(`    · ${collection._id} — ${collection.displayName ?? "unnamed"}`);
    }
  } catch (error) {
    // A permissions error still proves the token and transport work — it just
    // means the headless client has no Data read permission yet.
    console.warn(
      "! Token works, but listDataCollections was rejected. Check the headless",
    );
    console.warn(
      "  client's permissions in the Wix dashboard (Manage Data Collections).",
    );
    console.warn(`  ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error("✗ Wix connection failed:");
  console.error(error);
  process.exit(1);
});
