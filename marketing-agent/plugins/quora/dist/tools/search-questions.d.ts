import { z } from 'zod';
export declare const searchQuestions: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    query: z.ZodString;
    limit: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        question: "question";
        answer: "answer";
        all: "all";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        url: z.ZodString;
        snippet: z.ZodOptional<z.ZodString>;
        answerCount: z.ZodOptional<z.ZodNumber>;
        topic: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=search-questions.d.ts.map