import { z } from 'zod';
export declare const getNotifications: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
    mark_read: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    notifications: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        type: z.ZodOptional<z.ZodString>;
        time: z.ZodOptional<z.ZodString>;
        unread: z.ZodBoolean;
    }, z.core.$strip>>;
    total: z.ZodNumber;
    unread_count: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>>;
//# sourceMappingURL=get-notifications.d.ts.map