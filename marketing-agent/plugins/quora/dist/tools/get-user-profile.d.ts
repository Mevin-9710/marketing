import { z } from 'zod';
export declare const getUserProfile: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    profile_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    display_name: z.ZodString;
    username: z.ZodString;
    bio: z.ZodOptional<z.ZodString>;
    follower_count: z.ZodOptional<z.ZodNumber>;
    following_count: z.ZodOptional<z.ZodNumber>;
    answer_count: z.ZodOptional<z.ZodNumber>;
    question_count: z.ZodOptional<z.ZodNumber>;
    profile_image_url: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
//# sourceMappingURL=get-user-profile.d.ts.map