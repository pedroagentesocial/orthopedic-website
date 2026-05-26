import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const SERVICE_ICONS = ['Footprints', 'Bone', 'Dumbbell', 'Hand', 'Activity', 'Sparkles'] as const;
const SERVICE_SLUGS = ['knee', 'spine', 'shoulder', 'hand', 'sports', 'joint'] as const;

const services = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/services',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    slug: z.enum(SERVICE_SLUGS),
    lang: z.enum(['en', 'es']),
    title: z.string(),
    summary: z.string(),
    icon: z.enum(SERVICE_ICONS),
    image: z.string().optional(),
    treatments: z.array(z.string()).default([]),
    conditions: z.array(z.string()).default([]),
    durationLabel: z.string().optional(),
    recoveryLabel: z.string().optional(),
    order: z.number().default(0),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = { services };
