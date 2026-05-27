import { z } from 'zod';
export declare const getArticle: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    article_id: z.ZodOptional<z.ZodString>;
    include_comments: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    author: z.ZodString;
    tags: z.ZodArray<z.ZodString>;
    url: z.ZodString;
    readingTime: z.ZodOptional<z.ZodNumber>;
    reactionsCount: z.ZodNumber;
    commentsCount: z.ZodNumber;
    bodyPreview: z.ZodString;
    comments: z.ZodOptional<z.ZodArray<z.ZodObject<{
        body: z.ZodString;
        author: z.ZodString;
        createdAt: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>>;
//# sourceMappingURL=get-article.d.ts.map