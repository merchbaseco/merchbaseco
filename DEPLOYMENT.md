# Deployment Checklist

Use this checklist to prepare CI/CD for publishing the `merchbaseco` site image to GHCR and deploying it to the Hetzner host.

## GitHub Container Registry (GHCR)
1. Enable GitHub Packages for the `merchbaseco` organization if not already enabled.
2. Generate a classic personal access token with scopes `write:packages`, `read:packages`, and `repo`. Store it in your password manager as `GHCR_WRITE_TOKEN`.
3. In the repository settings, add these GitHub Actions secrets:
   - `GHCR_USERNAME` – GitHub username that owns the token.
   - `GHCR_TOKEN` – The `GHCR_WRITE_TOKEN`.
- `INFRA_DISPATCH_TOKEN` – A classic PAT with `repo` scope (can be the same user as above). This token is used to send a `repository_dispatch` event to the infra repo after each successful image push.

## Deployment SSH Access
SSH credentials now live in the `merchbase-infra` repository workflow (see below). The `merchbaseco` repo no longer needs deploy SSH secrets.

## Runtime Configuration
1. On the server, follow `merchbase-infra/docs/registry-auth.md` to log in to GHCR using a read-only token.
2. In `~/merchbase-infra/stack/merchbaseco`, copy `.env.example` to `.env` and set `MERCHBASECO_IMAGE_TAG=latest` for initial bootstrap.
3. Update `~/merchbase-infra/caddy-proxy/Caddyfile` to route the public domain to the `merchbaseco-site` container.

Once these prerequisites are satisfied, the included workflow `.github/workflows/deploy.yml` will build and push the container image on commits to `main`, then trigger the infra repo to perform the server deployment.
