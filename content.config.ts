import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: 'page',
            source: '**/*.md'
        }),
        stories: defineCollection({
            type: 'data',
            source: 'story/**/*.json',
            schema: z.object({
                storyId: z.string(),
                pageId: z.string(),
                content: z.array(
                    z.object({
                        text: z.string(),
                        position: z.object({
                            x: z.number().or(z.string()),
                            y: z.number().or(z.string())
                        }),
                    })
                ),
                options: z.array(
                    z.object({
                        text: z.string(),
                        next: z.string(),
                        position: z.object({
                            x: z.number().or(z.string()),
                            y: z.number().or(z.string())
                        }),
                    })
                ),
                characters: z.object({
                    name: z.string(),
                    src: z.string(),
                    position: z.object({
                        x: z.number().or(z.string()),
                        y: z.number().or(z.string())
                    }),
                }).optional(),
                background: z.object({
                    src: z.string(),
                }),
                sound: z.object({
                    src: z.string(),
                    volume: z.number()
                }).optional(),
            })
        }),
    }
})