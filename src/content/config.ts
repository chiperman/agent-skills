import { defineCollection, z } from 'astro:content';

const skillsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        description: z.string(),
        type: z.enum(['personal', 'reference']).default('reference'),
        github_url: z.string().url().optional(),
        install_command: z.string().optional(),
        files: z.record(z.array(z.object({
            path: z.string(),
            content: z.string().optional(),
            isBinary: z.boolean().default(false)
        }))).optional(),
    }).transform((data) => ({
        ...data,
        // Derived properties to reduce hardcoding in UI
        zipUrl: data.type === 'personal' ? `/agent-skills/downloads/${data.name}.zip` : null,
        rawUrl: data.type === 'personal' ? `/agent-skills/raw/${data.name}.md` : null,
    })),
});

export const collections = {
    'skills': skillsCollection,
};
