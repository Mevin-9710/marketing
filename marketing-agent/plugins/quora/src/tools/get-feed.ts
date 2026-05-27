import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractFeedFromPage } from '../quora-api.js';

export const getFeed = defineTool({
  name: 'get_feed',
  displayName: 'Get Feed',
  description: 'Get the user\'s main Quora feed — questions and stories from topics/users the user follows. Returns feed items with titles, previews, and URLs.',
  icon: 'layout-list',
  group: 'Discovery',
  input: z.object({
    limit: z.number().int().min(1).max(50).optional().describe('Maximum feed items to return (default 10)'),
  }),
  output: z.object({
    items: z.array(z.object({
      id: z.string().describe('Feed item ID'),
      type: z.enum(['question', 'answer', 'ad', 'unknown']).describe('Content type'),
      title: z.string().optional().describe('Question title or story headline'),
      preview: z.string().optional().describe('Text preview snippet'),
      url: z.string().optional().describe('URL to the content'),
      author: z.string().optional().describe('Author name if applicable'),
    })),
    total: z.number().describe('Total items returned'),
  }),
  async handle(params) {
    log.info('Getting Quora feed');

    const feedItems = extractFeedFromPage();

    if (feedItems.length === 0) {
      const response = await fetch('https://www.quora.com/', { credentials: 'include' });
      if (!response.ok) {
        throw ToolError.internal(`Failed to load feed: ${response.status}`);
      }
      const html = await response.text();
      const doc = document.createElement('div');
      doc.innerHTML = html;
      const parsed = extractFeedFromPage();
      if (parsed.length > 0) {
        feedItems.push(...parsed);
      }
    }

    const limit = params.limit ?? 10;
    const finalItems = feedItems.slice(0, limit).map(item => ({
      id: item.id,
      type: item.type,
      title: item.title,
      preview: item.preview,
      url: item.url,
      author: item.author,
    }));

    log.debug('Feed fetched', { count: finalItems.length });

    return { items: finalItems, total: finalItems.length };
  },
});
