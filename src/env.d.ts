/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="bun" />

interface ImportMetaEnv {
  readonly PUBLIC_ACCESS_API_ORIGIN?: string;
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
