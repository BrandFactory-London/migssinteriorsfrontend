/**
 * Verifies the Wix Headless connection end to end:
 *   1. exchanges the client ID for an anonymous visitor token
 *   2. reads real CMS content with that token
 *
 * Run with: pnpm wix:check
 *
 * Note on the read: this queries the ShowroomProjects collection rather than
 * calling collections.listDataCollections(). Listing collections is an admin
 * operation — it always 403s for a visitor token by design, not because of a
 * misconfiguration — so it can't tell us anything about the connection. A
 * public-collection read is also what the live site actually does, so a pass
 * here means the pages will work.
 */
import { createClient, OAuthStrategy } from "@wix/sdk";
import { items } from "@wix/data";

const COLLECTION_ID = "ShowroomProjects";

const clientId = process.env.WIX_CLIENT_ID;

if (!clientId) {
  console.error("✗ WIX_CLIENT_ID is not set (expected in .env.local).");
  process.exit(1);
}

const client = createClient({
  modules: { items },
  auth: OAuthStrategy({ clientId }),
});

async function main() {
  const tokens = await client.auth.generateVisitorTokens();
  const ttl = tokens.accessToken.expiresAt - Math.floor(Date.now() / 1000);
  console.log(`✓ Visitor token issued (expires in ${ttl}s)`);

  const results = await client.items.query(COLLECTION_ID).find();

  console.log(
    `✓ Read ${COLLECTION_ID}: ${results.items.length} of ${results.totalCount} item(s)`,
  );
  for (const item of results.items.slice(0, 5)) {
    console.log(`    · ${item._id}`);
  }
}

main().catch((error) => {
  console.error("✗ Wix connection failed:");
  console.error(error);
  process.exit(1);
});
