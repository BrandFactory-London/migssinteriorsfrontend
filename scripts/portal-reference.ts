/**
 * Prints new client portal reference IDs, MIG-XXX-XX (the shape the form auto-formats).
 *
 *   pnpm portal:ref        one reference
 *   pnpm portal:ref 5      five
 *
 * Random rather than sequential: the reference is what stops a stranger
 * reaching someone's documents with a postcode they found, so it must not be
 * guessable from the one before it. 25^5 is about 9.8 million combinations,
 * so a clash with an existing client is vanishingly unlikely, but search the
 * ClientProjects collection for it before using it all the same.
 */
import { randomInt } from "node:crypto";

import { REFERENCE_ALPHABET } from "../src/lib/portal/credentials";

function reference(): string {
  const pick = (n: number) =>
    Array.from({ length: n }, () => REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)]).join("");
  return `MIG-${pick(3)}-${pick(2)}`;
}

const count = Math.min(Math.max(Number(process.argv[2]) || 1, 1), 50);
for (let i = 0; i < count; i++) console.log(reference());
