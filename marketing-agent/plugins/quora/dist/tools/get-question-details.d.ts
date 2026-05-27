import { z } from 'zod';
export declare const getQuestionDetails: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{}, z.core.$strip>, z.ZodObject<{
    found: z.ZodBoolean;
    title: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    answer_count: z.ZodOptional<z.ZodNumber>;
    follower_count: z.ZodOptional<z.ZodNumber>;
    topic: z.ZodOptional<z.ZodString>;
    page_title: z.ZodString;
    current_url: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=get-question-details.d.ts.map