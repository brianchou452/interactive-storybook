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
                            x: z.number(),
                            y: z.number()
                        }),
                    })
                ),
                options: z.array(
                    z.object({
                        text: z.string(),
                        next: z.string(),
                        position: z.object({
                            x: z.number(),
                            y: z.number()
                        }),
                    })
                ),
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