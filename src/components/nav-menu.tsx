"use client";

import * as React from "react";

type NavMenuValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NavMenuContext = React.createContext<NavMenuValue | null>(null);

/**
 * The full-screen menu is rendered by `SiteChrome` at the end of the page, but
 * is now opened from the header at the top of it. The two are siblings rather
 * than parent and child, so the open state lives above both, in the root
 * layout.
 */
export function NavMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open, setOpen }), [open]);

  return (
    <NavMenuContext.Provider value={value}>{children}</NavMenuContext.Provider>
  );
}

/**
 * Falls back to inert state rather than throwing: a page that renders the
 * header outside the provider should still render, without a menu button that
 * does nothing silently — the button checks this and hides itself instead.
 */
export function useNavMenu() {
  return React.useContext(NavMenuContext);
}
