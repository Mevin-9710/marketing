import { z } from 'zod';
export declare const searchArticles: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        title: z.ZodString;
        description: z.ZodString;
        url: z.ZodString;
        author: z.ZodString;
        tags: z.ZodArray<z.ZodString>;
        reactionsCount: z.ZodNumber;
        commentsCount: z.ZodNumber;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=search-articles.d.ts.map