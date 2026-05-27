import { z } from 'zod';
export declare const getUserContent: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    profile_url: z.ZodOptional<z.ZodString>;
    content_type: z.ZodEnum<{
        answers: "answers";
        questions: "questions";
    }>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    username: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        preview: z.ZodOptional<z.ZodString>;
        upvote_count: z.ZodOptional<z.ZodNumber>;
        timestamp: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-user-content.d.ts.map