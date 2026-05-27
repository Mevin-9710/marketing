import { z } from 'zod';
export declare const getUserProfile: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    username: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    followerCount: z.ZodOptional<z.ZodNumber>;
    followingCount: z.ZodOptional<z.ZodNumber>;
    toolsSubmitted: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>>;
//# sourceMappingURL=get-user-profile.d.ts.map