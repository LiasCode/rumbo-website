import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
	docs: defineCollection({
		loader: glob({ base: './src/content/docs', pattern: '**/*.md' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			sidebar: z.object({ label: z.string() }).optional(),
		}),
	}),
};
