"use client";

import * as React from "react";

import type { EnquiryContext } from "@/lib/enquiry";

/**
 * What the current page tells the enquiry card: the room a service or project
 * page is about, or the town of a location page. The dock's "Free quote"
 * button sits outside any page section, so this is how it knows.
 */
let current: { path: string; context: EnquiryContext } | null = null;

export function pageEnquiryContext(): EnquiryContext {
  if (!current || current.path !== window.location.pathname) return {};
  return current.context;
}

/** Renders nothing; registers the page's context while it is mounted. */
export function EnquiryPageContext({ focus, town }: EnquiryContext) {
  React.useEffect(() => {
    const entry = { path: window.location.pathname, context: { focus, town } };
    current = entry;
    return () => {
      if (current === entry) current = null;
    };
  }, [focus, town]);
  return null;
}
