import { z } from 'zod';
export declare const getUserProfile: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    username: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodNumber;
    username: z.ZodString;
    name: z.ZodString;
    summary: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    websiteUrl: z.ZodOptional<z.ZodString>;
    joinedAt: z.ZodOptional<z.ZodString>;
    profileImage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
//# sourceMappingURL=get-user-profile.d.ts.map