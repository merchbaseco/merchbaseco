---
summary: Account Center routes, Cloudflare sign-in, and same-origin access and API-key management.
read_when:
  - changing sign-in, profile, product-access, or API-key behavior
  - integrating merchbase.co with Cloudflare Access or the Merchbase Access Service
---

# Account Center

Account Center is a static Astro site on Cloudflare Pages. Cloudflare Access
protects `/account` and its pages. The Access Worker owns the narrow zone route
`merchbase.co/account/api/*`; all other public pages remain on Pages.

| Route | Purpose |
| --- | --- |
| `/sign-in`, `/sign-up` | Continue to an approved Account Center page and its Cloudflare sign-in gate |
| `/account` | Overview |
| `/account/profile` | Stable Merchbase identity and provider-managed sign-in information |
| `/account/access` | Current suite grant, grant expiry, and service access |
| `/account/api-keys` | Create, inspect, and retire user-owned machine credentials |

The sign-in page accepts `return_url` and legacy `redirect_url` only for local
`/account` pages. It never redirects to arbitrary origins, public routes, or
API endpoints. There is no public signup or client-created Merchbase identity.
The approved email login and identity provider are configured in Cloudflare.
Account Center does not edit identity-provider security settings.

The sign-out link is `/cdn-cgi/access/logout`. Cloudflare documents that this
revokes the session across applications and clears this origin's cookie.
Remote token rejection can take 20–30 seconds. See
[Cloudflare session management](https://developers.cloudflare.com/cloudflare-one/access-controls/access-settings/session-management/).

## Browser API

All calls use same-origin cookies, no browser-managed bearer token, no-store
caching, and `X-Requested-With: XMLHttpRequest`. Mutations send JSON; the Worker
requires the exact Account Center Origin header. No cross-origin API host is
configurable in the frontend.

| Method and path | Response |
| --- | --- |
| `GET /account/api/me` | `merchbaseUserId`, effective `access`, ISO `accessValidUntil`, and service map |
| `GET /account/api/api-keys` | `{ apiKeys: [...] }`, metadata only |
| `POST /account/api/api-keys` | `{ apiKey, metadata }`; request `{ name, expiresAt }` |
| `POST /account/api/api-keys/{providerId}/retire` | `204`; request `{}` |

Service maps accept additional valid service names so older frontend builds
can display new products. Account settings and retirement remain available
without an active suite grant. Creating a key requires current access.

Cloudflare issues each key secret once. The `mbk_v1` string wraps its native
client ID and secret for supported Merchbase HTTP adapters. The browser holds
the new key only in transient component state. Copying requires a user action.
Closing the panel, starting another creation, leaving the page, or unmounting
clears that state. No local storage, session storage, cookie, URL, or log stores
the key. A failed creation is never automatically retried because its outcome
may be uncertain. Refresh the metadata list before creating another key.

The UI displays the provider-confirmed key expiry. A key's lifetime and the
user's product access period are independent. Retirement is permanent; the
metadata history remains visible.

## Local verification

Install packages with the approved HugeIcons registry credential provided only
to the install process. No Clerk publishable key or Access API origin is needed.
Obtain a local server port with `dev-port`, then run:

```bash
bun install --frozen-lockfile
bunx astro dev --host 127.0.0.1 --port "$(dev-port)"
bun run test
bun run lint
bun run build
```

A plain local Astro server does not authenticate users or provide the Access
Worker API. Without the same-origin backend it shows the appropriate account
error. Use a separately protected Cloudflare fidelity target for real sign-in,
key management, and logout. Local browser fixtures can verify rendering and
one-time key interaction, but do not prove Cloudflare authentication.

## Release

Every main push automatically deploys the Cloudflare Pages project `merchbase`.
Coordinate the frontend release with the Access Worker, its same-origin zone
route, and exact Access policies. Do not push this frontend ahead of that
backend. Protect production account pages and review preview deployment
protection. The Worker must reject missing or wrong-audience assertions even
when called directly.
