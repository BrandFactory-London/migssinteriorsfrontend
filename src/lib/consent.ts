/**
 * Cookie consent, shared between the pre-hydration bootstrap script, the
 * banner, and anything that later needs to know what the visitor allowed.
 *
 * Two categories rather than one, because the privacy policy names Google
 * Analytics and the Meta Pixel separately and a visitor is entitled to accept
 * one without the other. Only analytics is wired to a tag today; advertising
 * is recorded so the pixel can be added later without asking everyone again.
 */

/** The categories a visitor can decide about. Strictly necessary is not one:
 *  it needs no consent and so is never asked about or stored. */
export type ConsentCategory = "analytics" | "advertising";

export type ConsentState = Record<ConsentCategory, boolean>;

export const CONSENT_COOKIE = "migss_consent";

/**
 * Six months. Long enough not to nag, short enough that consent is refreshed
 * about twice a year — the ICO's guidance is that consent should not be
 * treated as indefinite, and twelve months is the outer edge of what is
 * usually considered reasonable.
 */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 183;

/** Version of the ask. Bumping it re-prompts everyone — do that when the
 *  categories or the vendors behind them change, not for copy edits. */
export const CONSENT_VERSION = 1;

export const CONSENT_DENIED: ConsentState = {
  analytics: false,
  advertising: false,
};

export const CONSENT_GRANTED: ConsentState = {
  analytics: true,
  advertising: true,
};

/** Fired on `window` to ask the banner to open its preferences panel — the
 *  footer's control is a separate component and holds none of its state. */
export const CONSENT_OPEN_EVENT = "migss:consent-open";

/**
 * Set on `<html>` by the bootstrap script, before first paint, when a usable
 * decision is already stored. A rule in globals.css hides the banner while it
 * is present.
 *
 * This attribute, rather than React state, is what stops the banner flashing
 * up at a returning visitor. The decision lives in a cookie, which the server
 * cannot read without making every page dynamic, so the markup is the same for
 * everyone and a script that runs before paint decides whether it is seen —
 * nothing waits for hydration.
 */
export const CONSENT_DECIDED_ATTR = "data-consent";

type StoredConsent = ConsentState & { version: number };

/**
 * Reads the cookie. Returns null when there is no usable decision — no
 * cookie, malformed JSON, or a decision recorded against an older version of
 * the ask — and the banner then shows.
 *
 * Deliberately tolerant: a visitor whose cookie we cannot parse is treated as
 * not having consented, which is the safe direction to fail in.
 */
export function readConsent(cookieString: string): ConsentState | null {
  const match = cookieString.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)`),
  );
  if (!match) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(match[1])) as StoredConsent;
    if (parsed?.version !== CONSENT_VERSION) return null;

    return {
      analytics: parsed.analytics === true,
      advertising: parsed.advertising === true,
    };
  } catch {
    return null;
  }
}

/**
 * Writes the decision and tells Google about it. Order matters: the cookie is
 * set first so a visitor who navigates immediately is not asked again, then
 * the consent update is pushed so tags already on the page unlock without a
 * reload.
 */
export function writeConsent(state: ConsentState) {
  const value: StoredConsent = { ...state, version: CONSENT_VERSION };

  // `Secure` is omitted on purpose for localhost, where it would stop the
  // cookie being set over plain http. In production the site is https-only,
  // and this cookie holds no personal data — it records a preference.
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(value))}` +
    `; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;

  document.documentElement.setAttribute(CONSENT_DECIDED_ATTR, "set");
  updateGoogleConsent(state);
}

/**
 * Maps our two categories onto Google's four consent signals.
 *
 * `ad_user_data` and `ad_personalization` are the two Consent Mode v2 added:
 * a tag that is given `ad_storage` but neither of those will still not use the
 * data for audiences or personalisation, so all three move together under
 * "advertising" rather than being offered as separate toggles nobody could
 * meaningfully choose between.
 */
export function updateGoogleConsent(state: ConsentState) {
  const analytics = state.analytics ? "granted" : "denied";
  const advertising = state.advertising ? "granted" : "denied";

  window.dataLayer = window.dataLayer || [];
  // Pushed as an `arguments`-shaped array rather than through a `gtag()`
  // helper: this runs in React, where the global the inline bootstrap defined
  // is not something we can rely on having been typed or hoisted.
  window.dataLayer.push([
    "consent",
    "update",
    {
      analytics_storage: analytics,
      ad_storage: advertising,
      ad_user_data: advertising,
      ad_personalization: advertising,
    },
  ]);
}

/**
 * The bootstrap that must run before `gtag.js`, as source, because Consent
 * Mode only honours defaults set before the tag loads. Anything set after is
 * an update, and by then a tag may already have written a cookie.
 *
 * It reads the same cookie as `readConsent` so a returning visitor who
 * accepted is granted immediately, with no denied-then-granted flicker that
 * would cost the first page view of every session.
 *
 * Kept as a string in this module rather than inline in the layout so the
 * cookie name and the category mapping have exactly one definition. Only
 * module constants are interpolated — never anything from a request.
 */
export function consentBootstrapScript() {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var granted = { analytics: false, advertising: false };
var decided = false;
try {
  var m = document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=([^;]*)/);
  if (m) {
    var c = JSON.parse(decodeURIComponent(m[1]));
    if (c && c.version === ${CONSENT_VERSION}) {
      decided = true;
      granted.analytics = c.analytics === true;
      granted.advertising = c.advertising === true;
    }
  }
} catch (e) {}
gtag('consent', 'default', {
  analytics_storage: granted.analytics ? 'granted' : 'denied',
  ad_storage: granted.advertising ? 'granted' : 'denied',
  ad_user_data: granted.advertising ? 'granted' : 'denied',
  ad_personalization: granted.advertising ? 'granted' : 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500
});
// Without consent, pass the click id in the page URL instead of a cookie, and
// strip ad identifiers from the pings that are still sent. Both are Google's
// recommended companions to a denied default.
gtag('set', 'url_passthrough', true);
gtag('set', 'ads_data_redaction', true);
if (decided) {
  document.documentElement.setAttribute('${CONSENT_DECIDED_ATTR}', 'set');
}
`.trim();
}
