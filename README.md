# Migss Interiors — frontend

Next.js (App Router) frontend for a self-managed Wix Headless project.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local   # already contains the headless client ID
pnpm dev
```

## Wix connection

`src/lib/wix/client.ts` builds the SDK client with `OAuthStrategy` and anonymous
visitor tokens — no login, no client secret. The module imports `server-only`,
so it can only be used from Server Components, route handlers and server
actions, and the client ID never reaches the browser bundle.

Verify the connection:

```bash
pnpm wix:check
```

It requests a visitor token and then reads the `ShowcaseProjects` collection —
the same kind of call the live pages make. Note that it deliberately does not
call `listDataCollections`: that is an admin operation and always 403s for a
visitor token, so it says nothing about whether the connection works.

## Forms and leads

Enquiries and job applications are saved to the shared BrandFactory **Contacts
CRM** in Notion, not to Wix. Code: `src/lib/crm/` and the two server actions in
`src/app/actions/`.

- Each submission is a new CRM row: Owner Migss Interiors
  (`src/lib/crm/config.ts`), Type `Lead` or `Applicant`, Status `New`, Source
  `Website form`, Acquired today, phone normalised to `+44`.
- **Form** is worked out from the page the form was sent from
  (`src/lib/crm/form-name.ts`), e.g. `/renovation-services/bathroom` gives
  "Bathroom page enquiry". A site-wide enquiry card needs no extra wiring.
- **Notes** carry the page URL, any UTM tags or ad click IDs captured on
  arrival (`AttributionCapture`), and a submission ID. A retry with the same
  ID returns the existing row, so errors and double clicks never duplicate.
- A successful enquiry redirects to `/thank-you?lead=<token>`. Only a valid,
  unexpired token fires the GA4 `generate_lead` event, once; reloads and
  direct visits fire nothing.
- Needs `NOTION_TOKEN` (server-side) for an integration connected to the
  Contacts CRM. Without it every submission fails with the inline error.

Tests: `pnpm test` (Vitest, unit tests with Notion mocked).

## Routes

The route tree is scaffolded but intentionally empty — every page renders a
placeholder. Page content is the next phase of work.

- `/`, `/about`, `/contact`, `/our-projects`
- `/renovation-services` + `/bathroom`, `/kitchen`, `/interior`
- `/resources` + `/bathroom`, `/kitchen`
- `/blog`, `/blog/[slug]`
- `/locations`, `/locations/[area]` — areas listed in `src/lib/locations.ts`
- `/terms-of-use`, `/privacy-policy`, `/labour-guarantee`, `/product-warantee`

## shadcn/ui

Initialised manually (`components.json`, tokens in `src/app/globals.css`,
`cn()` in `src/lib/utils.ts`). Add components with:

```bash
pnpm dlx shadcn@latest add button card
```
