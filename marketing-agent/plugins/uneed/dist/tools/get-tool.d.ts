import { z } from 'zod';
export declare const getTool: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    tool_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    name: z.ZodString;
    tagline: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    voteCount: z.ZodOptional<z.ZodNumber>;
    votesSum: z.ZodOptional<z.ZodNumber>;
    maker: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    pricing: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
//# sourceMappingURL=get-tool.d.ts.map