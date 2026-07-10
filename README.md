# Orthopedic PI

Bilingual (en / es) marketing site for an orthopedic clinic in Utah.

## Stack

- **Astro 6** (`output: 'static'`) + **TypeScript**
- **@astrojs/react** islands, **Motion** / **GSAP** / **Lenis** for animation
- **Tailwind CSS v4** (via `@tailwindcss/vite`); tokens in `global.css`
- **react-hook-form** + **zod v4** for the lead form
- **@astrojs/vercel** adapter — pages prerender to static; only opted-out routes
  (the `/api/lead` endpoint) run on-demand on Vercel's serverless runtime
- Native Astro **i18n** — `en` (default, unprefixed) and `/es/`

## Getting started

```bash
cp .env.example .env   # fill in real values (optional — defaults work)
npm install
npm run dev            # http://localhost:4321
```

## Lead capture & contact form

The contact form (`src/components/forms/LeadForm.tsx`) posts JSON to the
**server** endpoint `src/pages/api/lead.ts` (`export const prerender = false`),
which validates the payload and forwards it to a **LeadConnector / GoHighLevel**
webhook. The webhook URL lives only in the serverless function — it is **never
in the client bundle**.

- **Field rules:** name + phone + consent required; email, reason and message
  optional. The submit button is disabled until the minimum is met, and required
  fields are marked with a red asterisk.
- **Anti-spam:** a hidden honeypot field (`company`) is validated server-side —
  filled submissions are silently dropped.
- **Delivery:** JSON `POST /api/lead` → server validation (zod) → GHL webhook.

### Environment variables

| Variable | Scope | Purpose |
|---|---|---|
| `GHL_WEBHOOK_URL` | **server** | CRM inbound webhook for lead submissions. Optional — a default is baked into `src/pages/api/lead.ts`. **Not** `PUBLIC_`, so it never reaches the browser. |
| `PUBLIC_GHL_CALENDAR_URL` | client | GHL calendar widget URL embedded on `/contact` |
| `PUBLIC_SITE_URL` | client | Canonical/OG/sitemap base URL |
| `PUBLIC_HERO_VIDEO_URL` | client | Optional hero background video |

### ⚠️ Production config that MUST stay in place

The lead endpoint depends on the **Vercel adapter** in `astro.config.mjs`. If the
adapter is removed the `/api/lead` route silently becomes unavailable and the
form breaks in production. Keep `adapter: vercel()`.

`security.allowedDomains` also lists the production hosts (apex + `www` +
`**.vercel.app`). The endpoint uses JSON (which is exempt from Astro's form-CSRF
origin check), but the allow-list keeps `url.origin` correct for any future
server route — without it, behind Vercel's proxy `url.origin` falls back to
`localhost` and form-type POSTs would 403.

Verify against the **deployed** URL after any change to those settings:

```bash
# Expect HTTP 400 (validation), proving the server route runs (not 404/static).
curl -s -X POST "https://www.orthopedicpi.com/api/lead" \
  -H "Content-Type: application/json" -d '{"name":"probe"}' \
  -o /dev/null -w "%{http_code}\n"
```

## Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build (static pages + serverless `/api/lead`) |
| `npm run preview` | Preview the build locally |
| `npm run optimize:images` | Re-encode images in `scripts/optimize-images.mjs` |
