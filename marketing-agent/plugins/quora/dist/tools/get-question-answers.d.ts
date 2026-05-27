import { z } from 'zod';
export declare const getQuestionAnswers: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    question_url: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        default: "default";
        recent: "recent";
        upvotes: "upvotes";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    question: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>;
    answers: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        author: z.ZodString;
        author_url: z.ZodOptional<z.ZodString>;
        content: z.ZodString;
        upvote_count: z.ZodNumber;
        timestamp: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-question-answers.d.ts.map