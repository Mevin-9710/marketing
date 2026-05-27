import { z } from 'zod';
export declare const createArticle: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    published: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
    url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
//# sourceMappingURL=create-article.d.ts.map