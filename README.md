# Merchbase.co

Static Astro site for merchbase.co. The app builds into a standalone nginx image and deploys through the `merchbase-infra` repository.

## Local Development

```bash
yarn install
yarn dev
```

## Deployment Overview

- The Dockerfile performs a multi-stage build (`yarn build`) and produces a static nginx image served on port 80.
- On pushes to `main`, `.github/workflows/deploy.yml` builds the image, pushes it to GHCR at `ghcr.io/merchbaseco/merchbaseco`, and dispatches a `deploy_merchbase_site` event to the infra repo.
- The infra repo workflow SSHes to the server, pulls the new image, and runs `stack/merchbaseco/deploy.sh`, which updates the running container.

### Required Secrets

Set these Actions secrets in this repo:

- `GHCR_USERNAME` / `GHCR_TOKEN` – classic PAT with `write:packages`, `read:packages`, `repo`.
- `INFRA_DISPATCH_TOKEN` – classic PAT with `repo` scope (can reuse `GHCR_TOKEN`).

### Runtime Configuration

- `astro.config.mjs` reads `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` if provided; defaults to `https://merchbase.co` and `/`.
- `stack/merchbaseco/.env` in the infra repo can pin `MERCHBASECO_IMAGE_TAG` to a specific version/digest.
