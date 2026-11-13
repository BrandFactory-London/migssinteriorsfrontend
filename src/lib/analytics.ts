declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Records a genuine enquiry as the GA4 `generate_lead` event. Called once,
 * by the enquiry card, when the server confirms the lead was saved.
 *
 * Pushes to dataLayer the way the gtag snippet does, so the event is queued
 * even if gtag.js has not finished loading. Without a GA measurement ID
 * (local and previews) dataLayer is never read, so nothing is sent anywhere.
 */
export function pushLeadEvent(
  formType: "pop-up" | "contact page" | "landing page",
) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  // gtag() pushes its `arguments` object, not an array; mirror that exactly
  // or gtag.js ignores the entry.
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  }
  (gtag as (...args: unknown[]) => void)("event", "generate_lead", {
    form_type: formType,
  });
}
