import { defineCollection, z } from "astro:content";

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
  type: "content",
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
