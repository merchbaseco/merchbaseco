# Icons Package

We publish a private package, `@merchbaseco/icons`, that mirrors the full Hugeicons Pro catalog. This keeps license handling outside of `merchbase-co` and exposes tree-shakeable entry points for each icon family.

## Repo Location

The package code lives at `/Users/zknicker/Programming/icons` (separate repo). Publish it to GitHub Packages under the `@merchbaseco` scope.

## Setup Checklist

1. Obtain a Hugeicons Pro token and expose it as `HUGEICONS_TOKEN`.
2. Copy `.yarnrc.yml.example` to `.yarnrc.yml` and fill in the Hugeicons/GitHub tokens (the real file is ignored so secrets stay local). If you prefer environment variables, update the file accordingly.
3. Configure your user-level `.npmrc` with the Hugeicons and GitHub package registries:

   ```ini
   //npm.hugeicons.com/:_authToken=${HUGEICONS_TOKEN}
   @hugeicons-pro:registry=https://npm.hugeicons.com/
   @merchbaseco:registry=https://npm.pkg.github.com/
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```

4. In the `icons` repo (Yarn 4 via Corepack), run `yarn install && yarn build`.
5. Publish to GitHub Packages with `npm publish` (after logging in via `npm login --scope=@merchbaseco --registry=https://npm.pkg.github.com`).

## Consuming in merchbase-co

`package.json` should reference the GitHub Package (pin to the published tag or semver). Before installing, copy `.env.example` to `.env` and set `MERCHBASE_NPM_TOKEN` so Yarn can authenticate with GitHub Packages:

```jsonc
{
  "dependencies": {
    "@merchbaseco/icons": "^1.0.1"
  }
}
```

Usage inside components:

```astro
---
import { HugeiconsIcon } from "@merchbaseco/icons";
import { Home01Icon } from "@merchbaseco/icons/core-solid-rounded";
---
<HugeiconsIcon icon={Home01Icon} size={36} color="currentColor" />
```

Each Hugeicons style family has a dedicated sub-path:

- `@merchbaseco/icons/core-stroke-rounded`
- `@merchbaseco/icons/core-stroke-sharp`
- `@merchbaseco/icons/core-stroke-standard`
- `@merchbaseco/icons/core-solid-rounded`
- `@merchbaseco/icons/core-solid-sharp`
- `@merchbaseco/icons/core-solid-standard`
- `@merchbaseco/icons/core-bulk-rounded`
- `@merchbaseco/icons/core-duotone-rounded`
- `@merchbaseco/icons/core-twotone-rounded`

You can introspect the available icons for automation or tooling via:

```ts
import { iconManifest } from "@merchbaseco/icons/manifest";

const roundedIcons = iconManifest["core-solid-rounded"];
```

## Refreshing Icons

When Hugeicons ships new versions:

1. Bump the upstream `@hugeicons-pro/*` versions in `/Users/zknicker/Programming/icons/package.json`.
2. Run `yarn install && yarn clean && yarn build`.
3. Review and commit the regenerated files, publish a new package version, and update `merchbase-co` if needed.

## Upgrading merchbase-co to Yarn 4

The app is still on Yarn 1 today. Before switching:
- Run `corepack enable` locally so the workspace honors the `packageManager` field.
- Add a repo-level `.yarnrc.yml` with `nodeLinker: node-modules` and GitHub/Hugeicons scopes (reuse the sample from the icons package).
- Execute `yarn set version stable` (Berry) inside `merchbase-co`, update `package.json#packageManager` to `yarn@4.x`, and regenerate `yarn.lock` via `yarn install`.
- Update CI/Docker images to use the repo-managed Yarn (`yarn --version` should read 4.x). The existing Dockerfile can run `corepack enable` before `yarn install`.
- Verify tooling that shells into `node_modules` (`tsup`, `tsx`, `astro`) still functions—keep the node-modules linker to minimize churn.
- Commit `.yarn/releases` (if generated), `.yarnrc.yml`, and the new `yarn.lock` once the install succeeds.

Roll the change through a PR so the rest of the team updates their local environments in sync.
