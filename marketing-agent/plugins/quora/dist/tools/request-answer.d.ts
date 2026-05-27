import { z } from 'zod';
export declare const requestAnswer: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    question_url: z.ZodOptional<z.ZodString>;
    user_identifier: z.ZodString;
    message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=request-answer.d.ts.map