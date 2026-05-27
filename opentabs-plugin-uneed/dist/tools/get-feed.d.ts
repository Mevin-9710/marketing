import { z } from 'zod';
export declare const getFeed: import("@opentabs-dev/plugin-sdk").ToolDefinition<z.ZodObject<{
    limit: z.ZodOptional<z.ZodNumber>;
    sort: z.ZodOptional<z.ZodEnum<{
        latest: "latest";
        hot: "hot";
        following: "following";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        body: z.ZodString;
        author: z.ZodString;
        likeCount: z.ZodNumber;
        commentCount: z.ZodNumber;
        postType: z.ZodString;
        linkedTool: z.ZodOptional<z.ZodString>;
        publishedAt: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    total: z.ZodNumber;
}, z.core.$strip>>;
//# sourceMappingURL=get-feed.d.ts.map