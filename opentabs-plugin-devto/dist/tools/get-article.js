import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { fetchArticle, fetchArticleComments } from '../devto-api.js';
export const getArticle = defineTool({
    name: 'get_article',
    displayName: 'Get Article',
    description: 'Get a full DEV.to article with content and comments. Use an article ID or slug, or be on the article page.',
    icon: 'file-text',
    group: 'Reading',
    input: z.object({
        article_id: z.string().optional().describe('Article ID or slug. Leave empty if already on the article page.'),
        include_comments: z.boolean().optional().describe('Whether to include comments (default: true)'),
    }),
    output: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        tags: z.array(z.string()),
        url: z.string(),
        readingTime: z.number().optional(),
        reactionsCount: z.number(),
        commentsCount: z.number(),
        bodyPreview: z.string(),
        comments: z.array(z.object({
            body: z.string(),
            author: z.string(),
            createdAt: z.string(),
        })).optional(),
    }),
    async handle(params) {
        const articleId = params.article_id || extractArticleIdFromUrl();
        if (!articleId) {
            throw ToolError.notFound('No article ID provided and not on an article page');
        }
        log.info('Getting DEV.to article', { articleId });
        const article = await fetchArticle(articleId);
        const comments = params.include_comments !== false ? await fetchArticleComments(articleId) : [];
        const flattenComments = (items) => items.flatMap(c => [
            { body: c.body_html.replace(/<[^>]*>/g, '').substring(0, 500), author: c.user.name, createdAt: c.created_at },
            ...flattenComments(c.children || []),
        ]);
        return {
            title: article.title,
            description: article.description,
            author: article.user.name,
            tags: article.tag_list,
            url: article.url,
            readingTime: article.reading_time_minutes,
            reactionsCount: article.public_reactions_count,
            commentsCount: article.comments_count,
            bodyPreview: (article.body_html || '').replace(/<[^>]*>/g, '').substring(0, 1000),
            comments: flattenComments(comments).slice(0, 20),
        };
    },
});
function extractArticleIdFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/^\/[^/]+\/([^/]+)/);
    return match ? match[1] : null;
}
//# sourceMappingURL=get-article.js.map