"use client";

import * as React from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Fires the GA4 `generate_lead` event once for a genuine enquiry.
 *
 * Only rendered by /thank-you when the URL carries a valid one-time token
 * from the enquiry action. After firing, the token is removed from the
 * address bar, so a reload or a bookmark of the page fires nothing; the
 * sessionStorage mark covers Back/Forward restoring the old URL in the same
 * tab.
 *
 * Pushes to dataLayer the same way the gtag snippet does, so the event is
 * queued even if gtag.js has not finished loading yet. Without a GA
 * measurement ID (local, previews) dataLayer is never read, so nothing is
 * sent anywhere.
 */
export function LeadConversion({ token }: { token: string }) {
  React.useEffect(() => {
    const mark = `migss-lead-fired:${token}`;
    let alreadyFired = false;
    try {
      alreadyFired = window.sessionStorage.getItem(mark) === "1";
      window.sessionStorage.setItem(mark, "1");
    } catch {
      // No storage: the URL clean-up below still stops reload double counts.
    }

    if (!alreadyFired) {
      window.dataLayer = window.dataLayer || [];
      // gtag() pushes its `arguments` object, not an array; mirror that
      // exactly or gtag.js ignores the entry.
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      }
      (gtag as (...args: unknown[]) => void)("event", "generate_lead", {
        form_type: "enquiry",
      });
    }

    window.history.replaceState(window.history.state, "", "/thank-you");
  }, [token]);

  return null;
}
