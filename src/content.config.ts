import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const heroFigureSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("image"),
    src: z.string(),
    alt: z.string().optional(),
  }),
  z.object({
    type: z.literal("component"),
    name: z.string(),
    props: z.record(z.unknown()).optional(),
  }),
]);

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    heroFigure: heroFigureSchema.optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };
