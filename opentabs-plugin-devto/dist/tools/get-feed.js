import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { fetchArticles } from '../devto-api.js';
export const getFeed = defineTool({
    name: 'get_feed',
    displayName: 'Get Feed',
    description: 'Browse the DEV.to article feed. Returns articles with titles, descriptions, tags, and engagement metrics.',
    icon: 'layout-list',
    group: 'Discovery',
    input: z.object({
        tag: z.string().optional().describe('Filter by tag (e.g. "javascript", "python")'),
        top: z.number().int().optional().describe('Filter by top posts in N days (e.g. 1, 7, 30, 365)'),
        state: z.enum(['fresh', 'rising']).optional().describe('Filter by state: fresh or rising'),
        limit: z.number().int().min(1).max(40).optional().describe('Maximum articles to return (default 10)'),
        page: z.number().int().min(1).optional().describe('Page number for pagination (default 1)'),
    }),
    output: z.object({
        articles: z.array(z.object({
            id: z.number(),
            title: z.string(),
            description: z.string(),
            url: z.string(),
            author: z.string(),
            tags: z.array(z.string()),
            commentsCount: z.number(),
            reactionsCount: z.number(),
            readingTime: z.number().optional(),
            publishedAt: z.string().optional(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        log.info('Getting DEV.to feed', { tag: params.tag });
        const articles = await fetchArticles({
            tag: params.tag,
            top: params.top,
            state: params.state,
            per_page: params.limit ?? 10,
            page: params.page ?? 1,
        });
        return {
            articles: articles.map(a => ({
                id: a.id,
                title: a.title,
                description: a.description,
                url: a.url,
                author: a.user.name,
                tags: a.tag_list,
                commentsCount: a.comments_count,
                reactionsCount: a.public_reactions_count,
                readingTime: a.reading_time_minutes,
                publishedAt: a.readable_publish_date,
            })),
            total: articles.length,
        };
    },
});
//# sourceMappingURL=get-feed.js.map