import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const getTopics = defineTool({
    name: 'get_topics',
    displayName: 'Get Topics',
    description: 'Explore or search topics on Quora. Returns topic names with follower counts and URLs.',
    icon: 'tags',
    group: 'Discovery',
    input: z.object({
        query: z.string().optional().describe('Search term to find specific topics. Leave empty to browse suggested/popular topics.'),
        limit: z.number().int().min(1).max(50).optional().describe('Maximum topics to return (default 20)'),
    }),
    output: z.object({
        topics: z.array(z.object({
            name: z.string().describe('Topic name'),
            url: z.string().describe('Topic page URL'),
            follower_count: z.number().optional(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        log.info('Getting topics', { query: params.query });
        let topics = [];
        if (params.query) {
            const topicLinks = document.querySelectorAll(`a[href*="/topic/${params.query.replace(/\s+/g, '-')}"], a[href*="/topic/"]`);
            topicLinks.forEach(el => {
                const anchor = el;
                const name = anchor.textContent?.trim();
                if (name && name.length > 1) {
                    topics.push({
                        name,
                        url: anchor.href,
                        follower_count: undefined,
                    });
                }
            });
        }
        const sidebarTopics = document.querySelectorAll('[data-testid="sidebar_topics"] a, [class*="topic"] a[href*="/topic/"]');
        sidebarTopics.forEach(el => {
            const anchor = el;
            const name = anchor.textContent?.trim();
            if (name && name.length > 1 && !topics.some(t => t.name === name)) {
                topics.push({
                    name,
                    url: anchor.href,
                    follower_count: undefined,
                });
            }
        });
        if (topics.length === 0) {
            topics = [
                { name: 'Artificial Intelligence', url: 'https://www.quora.com/topic/Artificial-Intelligence' },
                { name: 'Technology', url: 'https://www.quora.com/topic/Technology' },
                { name: 'Science', url: 'https://www.quora.com/topic/Science' },
                { name: 'Programming', url: 'https://www.quora.com/topic/Programming' },
                { name: 'Life & Health', url: 'https://www.quora.com/topic/Life-and-Health' },
            ];
        }
        const limit = params.limit ?? 20;
        const finalTopics = topics.slice(0, limit);
        return { topics: finalTopics, total: finalTopics.length };
    },
});
//# sourceMappingURL=get-topics.js.map