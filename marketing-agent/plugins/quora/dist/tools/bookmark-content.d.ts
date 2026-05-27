import { z } from 'zod';
export declare const bookmarkContent: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    content_url: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        bookmark: "bookmark";
        remove: "remove";
    }>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=bookmark-content.d.ts.map