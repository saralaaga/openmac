import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    /** Slug of the linked app in src/data/apps (bidirectional link) */
    app: z.string(),
    /** Optional 0-10 score shown on the app page */
    score: z.number().min(0).max(10).optional(),
    verdict: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { reviews };
