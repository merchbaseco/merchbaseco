import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://merchbase-co.github.io/merchbase-co/",
  base: "/merchbase-co/",
  integrations: [react(), tailwind()],
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
