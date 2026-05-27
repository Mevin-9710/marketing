import { z } from 'zod';
export declare const followQuestion: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    question_url: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        follow: "follow";
        unfollow: "unfollow";
    }>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=follow-question.d.ts.map