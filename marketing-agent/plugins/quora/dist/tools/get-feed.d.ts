import { z } from 'zod';
export declare const getFeed: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            question: "question";
            answer: "answer";
            ad: "ad";
            unknown: "unknown";
        }>;
        title: z.ZodOptional<z.ZodString>;
        preview: z.ZodOptional<z.ZodString>;
        url: z.ZodOptional<z.ZodString>;
        author: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-feed.d.ts.map