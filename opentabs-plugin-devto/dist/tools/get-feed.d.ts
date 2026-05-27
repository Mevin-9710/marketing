import { z } from 'zod';
export declare const getFeed: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    tag: z.ZodOptional<z.ZodString>;
    top: z.ZodOptional<z.ZodNumber>;
    state: z.ZodOptional<z.ZodEnum<{
        fresh: "fresh";
        rising: "rising";
    }>>;
    limit: z.ZodOptional<z.ZodNumber>;
    page: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    articles: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        title: z.ZodString;
        description: z.ZodString;
        url: z.ZodString;
        author: z.ZodString;
        tags: z.ZodArray<z.ZodString>;
        commentsCount: z.ZodNumber;
        reactionsCount: z.ZodNumber;
        readingTime: z.ZodOptional<z.ZodNumber>;
        publishedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-feed.d.ts.map