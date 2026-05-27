import { z } from 'zod';
export declare const shareContent: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    content_url: z.ZodOptional<z.ZodString>;
    platform: z.ZodOptional<z.ZodEnum<{
        link: "link";
        copy: "copy";
        facebook: "facebook";
        twitter: "twitter";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodBoolean;
    share_url: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>>;
//# sourceMappingURL=share-content.d.ts.map