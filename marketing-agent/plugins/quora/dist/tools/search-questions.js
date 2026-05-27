import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const searchQuestions = defineTool({
    name: 'search_questions',
    displayName: 'Search Questions',
    description: 'Search for questions on Quora by keyword. Returns a list of matching questions with snippets and URLs.',
    icon: 'search',
    group: 'Discovery',
    input: z.object({
        query: z.string().min(1).describe('Search keyword or phrase'),
        limit: z.number().int().min(1).max(50).optional().describe('Maximum results to return (default 10)'),
        type: z.enum(['question', 'answer', 'all']).optional().describe('Content type to search — questions, answers, or all (default: question)'),
    }),
    output: z.object({
        results: z.array(z.object({
            title: z.string().describe('Question title or result headline'),
            url: z.string().describe('Full URL to the result'),
            snippet: z.string().optional().describe('Text snippet preview'),
            answerCount: z.number().optional().describe('Number of answers (if available)'),
            topic: z.string().optional().describe('Topic name if applicable'),
        })),
        total: z.number().describe('Total number of results returned'),
    }),
    async handle(params) {
        log.info('Searching Quora', { query: params.query });
        const searchUrl = `/search?q=${encodeURIComponent(params.query)}${params.type && params.type !== 'all' ? `&type=${params.type}` : ''}`;
        const response = await fetch(searchUrl, { credentials: 'include' });
        if (!response.ok) {
            throw ToolError.internal(`Search request failed: ${response.status}`);
        }
        const html = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = html;
        const results = [];
        const questionLinks = doc.querySelectorAll('a.question_link, a[href*="/question/"]');
        const seen = new Set();
        questionLinks.forEach(el => {
            const anchor = el;
            const href = anchor.href;
            if (seen.has(href))
                return;
            seen.add(href);
            const title = anchor.textContent?.trim() || '';
            const parent = anchor.closest('.q-box') || anchor.parentElement;
            const snippet = parent?.querySelector('.q-text:not(a .q-text)')?.textContent?.trim();
            const topicEl = parent?.querySelector('a[href*="/topic/"]');
            const topic = topicEl?.textContent?.trim();
            const countText = parent?.textContent?.match(/(\d+)\s*answer/);
            const answerCount = countText ? parseInt(countText[1], 10) : undefined;
            results.push({
                title,
                url: href.startsWith('http') ? href : `https://www.quora.com${href}`,
                snippet: snippet?.substring(0, 300),
                answerCount,
                topic,
            });
        });
        const limit = params.limit ?? 10;
        const finalResults = results.slice(0, limit);
        log.debug('Search complete', { query: params.query, count: finalResults.length });
        return { results: finalResults, total: finalResults.length };
    },
});
//# sourceMappingURL=search-questions.js.map