import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional(),
		}),
});

const portfolio = defineCollection({
	loader: glob({ base: './src/content/portfolio', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		// Grav "filter" was a space-separated string like "dev des" — store as array here
		filter: z.array(z.enum(['dev', 'des'])),
		description: z.string(),
		link: z.string().url(),
		thumb: z.string(),
		thumbAlt: z.string().optional(),
		image: z.string(),
		imageAlt: z.string().optional(),
		// Preserves original Grav date for ordering
		date: z.coerce.date().optional(),
	}),
});

export const collections = { blog, portfolio };
