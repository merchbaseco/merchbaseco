# Merchbase.co

Static Astro site for merchbase.co. The app builds into a standalone nginx image and deploys through the `merchbase-infra` repository.

## Local Development

```bash
yarn install
yarn dev
```

## Deployment Overview

- The Dockerfile performs a multi-stage build (`yarn build`) and produces a static nginx image served on port 80.
- On pushes to `main`, `.github/workflows/deploy.yml` builds the image, pushes it to GHCR at `ghcr.io/merchbaseco/merchbaseco`, then SSHes to the server to pull the tag and run `stack/merchbaseco/deploy.sh`.
- The server-side script (kept in `~/merchbase-infra/stack/merchbaseco`) updates the `.env` tag, runs `docker compose pull merchbaseco`, and restarts the container.

### Required Secrets

Set these Actions secrets in this repo:

- `GHCR_USERNAME` / `GHCR_TOKEN` – classic PAT with `write:packages`, `read:packages`, `repo`.
- `DEPLOY_SSH_HOST` – host (or IP) of the deployment server.
- `DEPLOY_SSH_USER` – deploy user with access to `docker` and `merchbase-infra/stack/merchbaseco`.
- `DEPLOY_SSH_PRIVATE_KEY` – private key for the deploy user (PEM format).
- `DEPLOY_SSH_PASSPHRASE` – optional; leave empty if key has no passphrase.

### Runtime Configuration

- `astro.config.mjs` reads `PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` if provided; defaults to `https://merchbase.co` and `/`.
- `stack/merchbaseco/.env` in the infra repo can pin `MERCHBASECO_IMAGE_TAG` to a specific version/digest.
