# Merchbase.co

## Local Development

```bash
yarn dev
```

## Contributor Utilities

To capture a full-page screenshot of the local `/merchbase-co/` route in Astro:

```bash
yarn screenshot
```

The helper starts a temporary dev server, waits for it to become reachable at
`http://127.0.0.1:4321/merchbase-co/`, captures the page using Playwright, and saves the
PNG to `artifacts/merchbase-dev.png`.
