"use client";

import { useActionState } from "react";

import { signInToPortal, type PortalSignInState } from "@/app/actions/portal";
import { SITE, telHref } from "@/lib/site";

import s from "./portal.module.css";

/**
 * Formats the reference as it is typed, the way card-number fields space
 * themselves: letters and digits only, upper case, with a hyphen after the
 * third and sixth characters, so "mig12345" becomes "MIG-123-45".
 *
 * Purely a typing aid. The server ignores hyphens and case when it compares,
 * so a reference stored in any other shape still matches.
 */
function formatReference(value: string): string {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return [raw.slice(0, 3), raw.slice(3, 6), raw.slice(6)]
    .filter(Boolean)
    .join("-");
}

export function SignInForm() {
  const [state, action, busy] = useActionState<PortalSignInState, FormData>(
    signInToPortal,
    {},
  );

  return (
    <form action={action} noValidate>
      <label htmlFor="reference" className={s.label}>
        Project reference ID
      </label>
      <input
        id="reference"
        name="reference"
        defaultValue={state.reference}
        placeholder="MIG-123-45"
        maxLength={10}
        onInput={(event) => {
          const field = event.currentTarget;
          const formatted = formatReference(field.value);
          if (formatted !== field.value) field.value = formatted;
        }}
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className={s.field}
        required
      />

      <label htmlFor="postcode" className={s.label}>
        Postcode
      </label>
      <input
        id="postcode"
        name="postcode"
        defaultValue={state.postcode}
        autoComplete="postal-code"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        className={s.field}
        required
      />

      {state.error ? (
        <p role="alert" aria-live="polite" className={s.error}>
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className={s.button}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className={s.footer}>
        Trouble getting in? Ring the office.
        <br />
        <a href={telHref}>{SITE.phone}</a>
      </p>
    </form>
  );
}
