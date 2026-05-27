import { z } from 'zod';
export declare const getRelatedQuestions: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    question_url: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    questions: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-related-questions.d.ts.map