# Deployment Checklist

Use this checklist to prepare CI/CD for publishing the `merchbaseco` site image to GHCR and deploying it to the Hetzner host.

## GitHub Container Registry (GHCR)
1. Enable GitHub Packages for the `merchbaseco` organization if not already enabled.
2. Generate a classic personal access token with scopes `write:packages`, `read:packages`, and `repo`. Store it in your password manager as `GHCR_WRITE_TOKEN`.
3. In the repository settings, add these GitHub Actions secrets:
   - `GHCR_USERNAME` – GitHub username that owns the token.
   - `GHCR_TOKEN` – The `GHCR_WRITE_TOKEN`.

## Deployment SSH Access
1. Create (or reuse) a deploy SSH keypair on a secure workstation: `ssh-keygen -t ed25519 -f ~/.ssh/merchbaseco-deploy`.
2. Add the **public** key to `~/.ssh/authorized_keys` on the server for the deploy user (e.g., `zknicker`), optionally wrapping it with a forced-command script.
3. Store the **private** key (and optional passphrase) in your password manager. Add these repository secrets:
   - `DEPLOY_SSH_PRIVATE_KEY` – Base64 encode the private key or paste it directly.
   - `DEPLOY_SSH_USER` – e.g., `zknicker`.
   - `DEPLOY_SSH_HOST` – Hostname or IP of the server (e.g., `server.merchbase.co`).
   - `DEPLOY_SSH_PASSPHRASE` – Leave blank if the key has no passphrase.

## Runtime Configuration
1. On the server, follow `merchbase-infra/docs/registry-auth.md` to log in to GHCR using a read-only token.
2. In `~/merchbase-infra/stack/merchbaseco`, copy `.env.example` to `.env` and set `MERCHBASECO_IMAGE_TAG=latest` for initial bootstrap.
3. Update `~/merchbase-infra/caddy-proxy/Caddyfile` to route the public domain to the `merchbaseco-site` container.

Once these prerequisites are satisfied, the included workflow `.github/workflows/deploy.yml` will build, push, and deploy the site on commits to `main` (and when manually dispatched).
