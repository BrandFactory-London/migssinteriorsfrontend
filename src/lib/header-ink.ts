/**
 * Marks a band that sits behind the overlay header in light-on-dark.
 *
 * The header floats over the page with no background of its own, so its
 * controls have to take their colour from whatever is underneath them. It
 * cannot read that: a photographic hero has no background colour to inspect,
 * and sampling pixels is neither cheap nor reliable. So the page declares it,
 * and the header watches for these bands crossing the strip it occupies.
 *
 * Spread onto any full-width dark section — a hero, a dark call-to-action, the
 * footer. Partial-width dark things, a card or a plate inside a grid, are not
 * behind the header and should not carry it.
 *
 *     <section {...DARK_BEHIND_HEADER} className="bg-migss-neutral-900">
 *
 * A section that forgets it reads as light, so the header puts dark ink on it.
 * That is the safe way round: wrong-looking rather than invisible.
 */
export const DARK_BEHIND_HEADER = { "data-header-ink": "light" } as const;

/** Matches anything carrying {@link DARK_BEHIND_HEADER}. */
export const DARK_BEHIND_HEADER_SELECTOR = '[data-header-ink="light"]';
