import { defineConfig } from "astro/config";
import react from "@astrojs/react";

const site = process.env.PUBLIC_SITE_URL ?? "https://merchbase.co";
const base = process.env.PUBLIC_BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  integrations: [react()],
  srcDir: "./src",
  typescript: {
    strict: true,
  },
  alias: {
    "@": "./src",
  },
  vite: {
    resolve: {
      alias: {
        "@squircle-js/react": "@squircle-js/react/dist/index.mjs",
      },
    },
    optimizeDeps: {
      exclude: ["@squircle-js/react"],
    },
    ssr: {
      noExternal: ["@squircle-js/react"],
    },
  },
});
