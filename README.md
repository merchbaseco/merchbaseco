# Merchbase.co

Static Astro site for merchbase.co, hosted on **Cloudflare Pages**.

## Hosting

This site is deployed automatically to Cloudflare Pages on every push to `main`.

- **URL:** https://merchbase.co
- **Pages project:** `merchbase`
- **Build command:** `npm run build`
- **Output directory:** `dist`

### Environment Variables (Cloudflare Pages)

Set these in the Cloudflare Pages dashboard:

- `PUBLIC_SITE_URL` – `https://merchbase.co`
- `PUBLIC_BASE_PATH` – `/`
- `NPM_TOKEN` – GitHub PAT with `read:packages` scope (for `@merchbaseco/icons`)

## Local Development

1. Copy `.env.example` to `.env` and set your npm token
2. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is written to `dist/`.
