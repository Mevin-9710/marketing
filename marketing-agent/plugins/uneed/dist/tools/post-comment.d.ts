import { z } from 'zod';
export declare const postCommentTool: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    content: z.ZodString;
    post_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=post-comment.d.ts.map