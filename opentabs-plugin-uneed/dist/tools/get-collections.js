import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const getCollections = defineTool({
    name: 'get_collections',
    displayName: 'Get Collections',
    description: 'Browse tool collections/categories on Uneed — Development, Design, Marketing, etc.',
    icon: 'grid',
    group: 'Discovery',
    input: z.object({
        limit: z.number().int().min(1).max(50).optional().describe('Maximum collections to return (default 10)'),
    }),
    output: z.object({
        collections: z.array(z.object({
            name: z.string(),
            url: z.string().optional(),
            count: z.number().optional(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        log.info('Getting Uneed collections');
        const response = await fetch('https://www.uneed.best', { credentials: 'include' });
        if (!response.ok) {
            throw ToolError.internal(`Failed to load page: ${response.status}`);
        }
        const html = await response.text();
        const collections = [];
        const seen = new Set();
        const tagLinks = html.match(/href="\/tags\/([^"]+)"/g);
        if (tagLinks) {
            const tagUrls = new Set(tagLinks.map((l) => l.replace('href="', '').replace('"', '')));
            tagUrls.forEach(url => {
                const name = decodeURIComponent(url.replace('/tags/', ''));
                const displayName = name.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                if (!seen.has(displayName) && displayName.length < 40) {
                    seen.add(displayName);
                    collections.push({ name: displayName, url });
                }
            });
        }
        const sections = html.match(/href="\/tool\/([^"]+)">([^<]+)/g);
        if (sections) {
            const sectionMap = new Map();
            sections.forEach((match) => {
                const parts = match.match(/href="\/tool\/([^"]+)">([^<]+)/);
                if (parts) {
                    const cat = parts[2].trim();
                    if (cat && cat.length < 40 && !seen.has(cat)) {
                        seen.add(cat);
                        collections.push({ name: cat, url: `/tool/${parts[1]}` });
                    }
                }
            });
        }
        const limit = params.limit ?? 10;
        return { collections: collections.slice(0, limit), total: Math.min(collections.length, limit) };
    },
});
//# sourceMappingURL=get-collections.js.map