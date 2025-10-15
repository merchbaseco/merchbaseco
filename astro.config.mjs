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
});
