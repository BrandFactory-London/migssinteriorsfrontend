"use client";

import * as React from "react";

import {
  ATTRIBUTION_STORAGE_KEY,
  type Attribution,
  attributionFromSearch,
} from "@/lib/crm/attribution";

/**
 * Remembers how the visitor arrived (UTM tags, ad click IDs, landing page and
 * referring site) for the rest of the browser session, so an enquiry sent
 * from a later page still carries it into the CRM for manual attribution.
 *
 * First touch per session: once something is stored it is not overwritten by
 * internal navigation. Renders nothing. Storage can be blocked or throw, in
 * which case enquiries simply arrive without attribution.
 */
export function AttributionCapture() {
  React.useEffect(() => {
    try {
      if (window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY)) return;

      const attribution: Attribution = {
        ...attributionFromSearch(window.location.search),
        landing_page: window.location.pathname,
      };

      const referrer = document.referrer;
      if (referrer) {
        const from = new URL(referrer);
        if (from.host !== window.location.host) {
          attribution.referrer = from.host;
        }
      }

      window.sessionStorage.setItem(
        ATTRIBUTION_STORAGE_KEY,
        JSON.stringify(attribution),
      );
    } catch {
      // No storage, or an unparseable referrer: nothing to remember.
    }
  }, []);

  return null;
}
