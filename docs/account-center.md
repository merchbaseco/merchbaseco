---
summary: Account Center routes, Clerk ownership, Access Service integration, and local setup.
read_when:
  - changing sign-in, profile, product-access, or API-key behavior
  - integrating merchbase.co with Clerk or the Merchbase Access Service
  - deploying or testing the Account Center
---

# Account Center

Merchbase.co owns the shared customer account surface. It remains a static
Cloudflare Pages site: Clerk runs in client-side React islands, and Merchbase
does not add a second credential system or server-side session layer here.

## Routes

| Route | Owner |
| --- | --- |
| `/sign-in` | Clerk `SignIn` |
| `/sign-up` | Clerk `SignUp` |
| `/account` | MerchBase account overview |
| `/account/profile` | Clerk `UserProfile` |
| `/account/access` | Merchbase Access `GET /me` |
| `/account/api-keys` | Clerk `APIKeys` |

The Account Center uses its own compact page-level navigation. It does not
depend on the public site's header or sidebar.

## Ownership

Clerk owns authentication, sessions, profile security, and suite-wide API
keys. Merchbase Access owns the internal Merchbase User mapping and the
suite-wide Access Grant. The Account Center displays those systems; it does not
copy their records.

The Access page obtains the current Clerk session token in the browser and
sends it as a bearer token to `GET /me`. The token is never put in static HTML,
a URL, application logs, or browser storage by Merchbase code. The response
contains the opaque Merchbase User ID and access state for the suite and each
registered product.

Clerk API keys authenticate a user across Merchbase services. Access is
suite-wide for now. The `/me` response already exposes per-service states so
future product entitlements do not require an Account Center route change.

## Configuration

Cloudflare Pages needs these build-time variables:

- `PUBLIC_CLERK_PUBLISHABLE_KEY`: publishable key for the production MerchBase
  Clerk instance
- `PUBLIC_ACCESS_API_ORIGIN`: `https://access.merchbase.co`
- `HUGEICONS_LICENSE_KEY`: HugeIcons Pro package license key

The production Clerk instance must:

- allow the MerchBase production origins and Account Center redirect URLs;
- have User API Keys enabled;
- keep user deletion disabled until the Access Service owns a coordinated
  deletion flow.

For local development, use the Clerk development publishable key. Set
`PUBLIC_ACCESS_API_ORIGIN` to the Access Service checkout's local origin and
add the merchbase.co checkout's exact `dev-port` origin to the Access Service
development CORS allowlist. Do not use wildcard origins.

## Verification

Run:

```bash
bun run lint
bun run test
bun run build
```

Then exercise these browser paths with the development Clerk instance:

1. Signed-out `/account` shows only the sign-in prompt.
2. Sign-in and sign-up return to `/account`.
3. Profile updates render through Clerk.
4. Access shows granted, not-granted, retry, and unavailable states.
5. API keys can be created, named, copied once, and revoked.
6. Signing out returns to the public site and another visit to `/account`
   requires sign-in.

Revoked API keys may remain accepted for up to five minutes while service
authorization caches expire.
