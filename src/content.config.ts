import { defineCollection, z } from "astro:content";

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		excerpt: z.string().optional(),
		cover: z.string().optional(),
		tags: z.array(z.string()).optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { blog };
