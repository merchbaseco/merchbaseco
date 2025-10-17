# Deployment Checklist

Use this checklist to prepare CI/CD for publishing the `merchbaseco` site image to GHCR and deploying it to the Hetzner host.

## GitHub Container Registry (GHCR)
1. Enable GitHub Packages for the `merchbaseco` organization if not already enabled.
2. Generate a classic personal access token with scopes `write:packages`, `read:packages`, and `repo`. Store it in your password manager as `GHCR_WRITE_TOKEN`.
3. In the repository settings, add these GitHub Actions secrets:
   - `GHCR_USERNAME` – GitHub username that owns the token.
   - `GHCR_TOKEN` – The `GHCR_WRITE_TOKEN`.

## Deployment SSH Access
The workflow deploys directly from this repository. Add these secrets so GitHub Actions can SSH to the server:

- `DEPLOY_SSH_HOST` – Deployment host (IP or hostname).
- `DEPLOY_SSH_USER` – User with access to the compose stack and Docker.
- `DEPLOY_SSH_PRIVATE_KEY` – Private key (PEM) for the deploy user.
- `DEPLOY_SSH_PASSPHRASE` – Optional passphrase for the private key (leave blank if none).

## Runtime Configuration
1. On the server, follow `merchbase-infra/docs/registry-auth.md` to log in to GHCR using a read-only token.
2. In `~/merchbase-infra/stack/merchbaseco`, copy `.env.example` to `.env` and set `MERCHBASECO_IMAGE_TAG=latest` for initial bootstrap.
3. Update `~/merchbase-infra/caddy-proxy/Caddyfile` to route the public domain to the `merchbaseco-site` container.

Once these prerequisites are satisfied, the included workflow `.github/workflows/deploy.yml` will build and push the container image on commits to `main`, then SSH to the server to pull the tagged image and restart the container.
