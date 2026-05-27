import { z } from 'zod';
export declare const followTopic: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    topic_url: z.ZodOptional<z.ZodString>;
    topic_name: z.ZodOptional<z.ZodString>;
    action: z.ZodEnum<{
        follow: "follow";
        unfollow: "unfollow";
    }>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=follow-topic.d.ts.map