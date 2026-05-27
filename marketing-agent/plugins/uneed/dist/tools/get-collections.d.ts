import { z } from 'zod';
export declare const getCollections: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    collections: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodOptional<z.ZodString>;
        count: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-collections.d.ts.map