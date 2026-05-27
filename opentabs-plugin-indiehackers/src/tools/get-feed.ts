import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractPostsFromPage } from '../indiehackers-api.js';

export const getFeed = defineTool({
  name: 'get_feed',
  displayName: 'Get Feed',
  description: 'Get the IndieHackers feed — posts, milestones, questions, and discussions from the community.',
  icon: 'layout-list',
  group: 'Discovery',
  input: z.object({
    limit: z.number().int().min(1).max(50).optional().describe('Maximum feed items to return (default 10)'),
  }),
  output: z.object({
    items: z.array(z.object({
      id: z.string(),
      title: z.string(),
      upvoteCount: z.number(),
      commentCount: z.number(),
      url: z.string(),
      type: z.string(),
    })),
    total: z.number(),
  }),
  async handle(params) {
    log.info('Getting IndieHackers feed');

    const posts = extractPostsFromPage();

    const limit = params.limit ?? 10;
    const items = posts.slice(0, limit);

    log.debug('Feed fetched', { count: items.length });
    return {
      items: items.map(p => ({
        id: p.id,
        title: p.title,
        upvoteCount: p.upvoteCount,
        commentCount: p.commentCount,
        url: p.url,
        type: p.type,
      })),
      total: items.length,
    };
  },
});
