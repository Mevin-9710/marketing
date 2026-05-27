import { z } from 'zod';
export declare const upvoteContent: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    content_url: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        upvote: "upvote";
        downvote: "downvote";
        neutral: "neutral";
    }>;
    content_type: z.ZodOptional<z.ZodEnum<{
        question: "question";
        answer: "answer";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    new_count: z.ZodOptional<z.ZodNumber>;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=upvote-content.d.ts.map