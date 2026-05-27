import { z } from 'zod';
export declare const commentOnAnswer: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    answer_url: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=comment-on-answer.d.ts.map