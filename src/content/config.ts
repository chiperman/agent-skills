import { defineCollection, z } from 'astro:content';

const skillsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        description: z.string(),
        github_url: z.string().url().optional(),
        status: z.enum(['Featured', 'Curated']).optional().default('Curated'),
        install_command: z.string().optional(),
    }),
});

export const collections = {
    'skills': skillsCollection,
};
