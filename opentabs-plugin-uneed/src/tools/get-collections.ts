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
    const doc = document.createElement('div');
    doc.innerHTML = html;

    const collections: Array<{ name: string; url?: string; count?: number }> = [];
    const categoryLinks = doc.querySelectorAll(
      'a[href*="/category/"], a[href*="/collection/"], [class*="category"] a, footer a'
    );

    const seen = new Set<string>();
    categoryLinks.forEach(el => {
      const anchor = el as HTMLAnchorElement;
      const name = anchor.textContent?.trim() || '';
      const href = anchor.href;
      if (!name || seen.has(name) || !href.includes('uneed.best')) return;
      seen.add(name);
      collections.push({ name, url: href });
    });

    if (collections.length === 0) {
      const text = doc.textContent || '';
      const categories = text.match(/(CATEGORIES|ALTERNATIVES|BEST TAGS|BEST PRODUCTS)\s*([\s\S]*?)(?=\n\n[A-Z\s]{3,}|$)/);
      if (categories) {
        const items = categories[2].split('\n').map((s: string) => s.trim()).filter(Boolean);
        items.forEach((name: string) => {
          if (name && !seen.has(name) && name.length < 40) {
            seen.add(name);
            collections.push({ name });
          }
        });
      }
    }

    const limit = params.limit ?? 10;
    return { collections: collections.slice(0, limit), total: Math.min(collections.length, limit) };
  },
});
