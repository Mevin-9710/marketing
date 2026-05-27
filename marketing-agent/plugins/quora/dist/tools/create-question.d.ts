import { z } from 'zod';
export declare const createQuestion: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    title: z.ZodString;
    details: z.ZodOptional<z.ZodString>;
    topics: z.ZodOptional<z.ZodArray<z.ZodString>>;
    is_anonymous: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    question_url: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=create-question.d.ts.map