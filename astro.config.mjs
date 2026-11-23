import react from "@astrojs/react";
import { defineConfig } from "astro/config";

const site = process.env.PUBLIC_SITE_URL ?? "https://merchbase.co";
const base = process.env.PUBLIC_BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  // Preserve Astro 6 whitespace between inline elements (v7 default is 'jsx').
  compressHTML: true,
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
