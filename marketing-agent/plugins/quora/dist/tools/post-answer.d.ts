import { z } from 'zod';
export declare const postAnswer: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    question_url: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    is_anonymous: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    answer_url: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=post-answer.d.ts.map