import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sermons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sermons' }),
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    pastor:      z.string(),
    scripture:   z.string(),
    description: z.string(),
    videoUrl:    z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    time:        z.string(),
    location:    z.string(),
    description: z.string(),
  }),
});

export const collections = { sermons, events };