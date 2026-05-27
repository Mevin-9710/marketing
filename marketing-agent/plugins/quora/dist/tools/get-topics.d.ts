import { z } from 'zod';
export declare const getTopics: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    query: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    topics: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
        follower_count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-topics.d.ts.map