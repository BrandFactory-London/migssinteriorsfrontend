"use client";

import { useActionState } from "react";

import { signInToPortal, type PortalSignInState } from "@/app/actions/portal";
import { SITE, telHref } from "@/lib/site";

import s from "./portal.module.css";

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
        autoComplete="off"
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        placeholder="MIG-XXXX-XX"
        className={s.field}
        required
      />

      <label htmlFor="postcode" className={s.label}>
        Postcode
      </label>
      <input
        id="postcode"
        name="postcode"
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
