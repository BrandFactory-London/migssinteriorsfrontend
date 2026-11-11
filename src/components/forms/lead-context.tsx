"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

import { ATTRIBUTION_STORAGE_KEY } from "@/lib/crm/attribution";

/**
 * Hidden context every lead form sends with the visitor's answers:
 *
 * - `pagePath`: the page the form was sent from, which names the form in the
 *   CRM. Works the same for an inline form or a site-wide enquiry card.
 * - `pageUrl`: the full address, with any query string, for the Notes.
 * - `attribution`: what AttributionCapture stored when the visitor arrived.
 * - `submissionId`: one ID per form, kept across retries, so resending after
 *   an error or a double click cannot create a second CRM row.
 *
 * The ID is made on first submit, not on render, so server and browser HTML
 * match. It lives in a ref because React resets uncontrolled form fields after
 * each action; the hidden inputs are refilled on every submit instead.
 */
export function useLeadContext() {
  const pathname = usePathname();
  const submissionId = React.useRef<string | null>(null);
  const idInput = React.useRef<HTMLInputElement>(null);
  const urlInput = React.useRef<HTMLInputElement>(null);
  const attributionInput = React.useRef<HTMLInputElement>(null);

  // Runs before React builds the FormData for the action.
  const onSubmit = React.useCallback(() => {
    if (!submissionId.current) submissionId.current = makeId();
    if (idInput.current) idInput.current.value = submissionId.current;
    if (urlInput.current) urlInput.current.value = window.location.href;
    if (attributionInput.current) {
      try {
        attributionInput.current.value =
          window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "";
      } catch {
        attributionInput.current.value = "";
      }
    }
  }, []);

  const fields = (
    <>
      <input type="hidden" name="pagePath" value={pathname ?? "/"} readOnly />
      <input type="hidden" name="submissionId" ref={idInput} />
      <input type="hidden" name="pageUrl" ref={urlInput} />
      <input type="hidden" name="attribution" ref={attributionInput} />
    </>
  );

  /**
   * The same context as plain values, for forms that build their own
   * FormData (the enquiry card). Keeps the submission ID across retries.
   */
  const snapshot = React.useCallback((): Record<string, string> => {
    if (!submissionId.current) submissionId.current = makeId();
    let attribution = "";
    try {
      attribution = window.sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "";
    } catch {
      // No storage: send without attribution.
    }
    return {
      pagePath: window.location.pathname,
      pageUrl: window.location.href,
      attribution,
      submissionId: submissionId.current,
    };
  }, []);

  /** Starts a new submission, e.g. "Send another" after a successful one. */
  const reset = React.useCallback(() => {
    submissionId.current = null;
  }, []);

  return { fields, onSubmit, snapshot, reset };
}

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Older browsers without randomUUID: the server swaps in its own ID when
  // this is not a UUID, which only loses retry protection for that visitor.
  return "";
}
