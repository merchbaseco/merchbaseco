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
- `HUGEICONS_LICENSE_KEY` – HugeIcons Pro package license key

## Local Development

Provide the HugeIcons install credential through the approved install process.
Account Center needs no frontend authentication key or cross-origin API URL.
Use `dev-port` for the local server. A plain Astro server needs a same-origin
Access Worker or explicit local browser fixture to render authenticated settings.

```bash
bun install --frozen-lockfile
bunx astro dev --host 127.0.0.1 --port "$(dev-port)"
```

## Checks

```bash
bun run lint
bun run test
bun run build
```

The production build is written to `dist/`.
