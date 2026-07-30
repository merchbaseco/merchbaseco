# MerchBase

The public MerchBase site and Account Center, built as a static Astro site and
hosted on Cloudflare Pages.

Account Center implementation and environment details live in
[`docs/account-center.md`](docs/account-center.md).

## Hosting

This site is deployed automatically to Cloudflare Pages on every push to `main`.

- URL: <https://merchbase.co>
- Pages project: `merchbase`
- Build command: `bun run build`
- Output directory: `dist`

### Environment Variables (Cloudflare Pages)

Set these in the Cloudflare Pages dashboard:

- `PUBLIC_SITE_URL` – `https://merchbase.co`
- `PUBLIC_BASE_PATH` – `/`
- `PUBLIC_CLERK_PUBLISHABLE_KEY` – the publishable key for the production MerchBase Clerk instance
- `PUBLIC_ACCESS_API_ORIGIN` – `https://access.merchbase.co`
- `HUGEICONS_LICENSE_KEY` – HugeIcons Pro package license key

## Local Development

1. Copy `.env.example` to `.env`.
2. Set `HUGEICONS_LICENSE_KEY`, `PUBLIC_CLERK_PUBLISHABLE_KEY`, and the local
   Access Service origin. Obtain the Access Service port from its checkout with
   `dev-port`.
3. Install dependencies and start the development server:

```bash
bun install --frozen-lockfile
bun run dev
```

## Checks

```bash
bun run lint
bun run test
bun run build
```

The production build is written to `dist/`.
