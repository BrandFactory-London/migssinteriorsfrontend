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

It requests a visitor token and then reads the `ShowroomProjects` collection —
the same kind of call the live pages make. Note that it deliberately does not
call `listDataCollections`: that is an admin operation and always 403s for a
visitor token, so it says nothing about whether the connection works.

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
