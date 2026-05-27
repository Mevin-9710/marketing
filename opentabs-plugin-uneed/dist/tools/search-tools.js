import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
const API_BASE = 'https://www.uneed.best/api';
export const searchTools = defineTool({
    name: 'search_tools',
    displayName: 'Search Tools',
    description: 'Search for tools and products on Uneed by keyword.',
    icon: 'search',
    group: 'Discovery',
    input: z.object({
        query: z.string().min(1).describe('Search keyword or phrase'),
        limit: z.number().int().min(1).max(50).optional().describe('Maximum results (default 10)'),
    }),
    output: z.object({
        results: z.array(z.object({
            name: z.string(),
            description: z.string().optional(),
            url: z.string().optional(),
            voteCount: z.number().optional(),
            tags: z.array(z.string()).optional(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        log.info('Searching Uneed', { query: params.query });
        const searchUrl = `https://www.uneed.best/search?q=${encodeURIComponent(params.query)}`;
        const response = await fetch(searchUrl, { credentials: 'include' });
        if (!response.ok) {
            throw ToolError.internal(`Search failed: ${response.status}`);
        }
        const html = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = html;
        const results = [];
        const cards = doc.querySelectorAll('[class*="tool-card"], [class*="product-card"], article, a[href*="/tool/"]');
        const seen = new Set();
        cards.forEach(el => {
            const name = el.querySelector('h2, h3, [class*="name"], [class*="title"]')?.textContent?.trim() || '';
            if (!name || seen.has(name))
                return;
            seen.add(name);
            const desc = el.querySelector('p, [class*="description"], [class*="tagline"]')?.textContent?.trim();
            const link = el.href || el.querySelector('a')?.href || '';
            const voteText = el.querySelector('[class*="vote"], [class*="score"]')?.textContent?.trim();
            const voteCount = voteText ? parseInt(voteText.replace(/\D/g, ''), 10) : undefined;
            const tagEls = el.querySelectorAll('[class*="tag"], [class*="badge"]');
            const tags = Array.from(tagEls).map(t => t.textContent?.trim()).filter(Boolean);
            results.push({ name, description: desc?.substring(0, 300), url: link, voteCount, tags });
        });
        if (results.length === 0) {
            const titleEls = doc.querySelectorAll('h2, h3, [class*="title"]');
            titleEls.forEach(el => {
                const name = el.textContent?.trim() || '';
                if (!name || seen.has(name) || name.length > 60)
                    return;
                seen.add(name);
                const parentLink = el.closest('a');
                results.push({ name, url: parentLink?.href || '' });
            });
        }
        const limit = params.limit ?? 10;
        return { results: results.slice(0, limit), total: Math.min(results.length, limit) };
    },
});
//# sourceMappingURL=search-tools.js.map