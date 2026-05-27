import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

const API_BASE = 'https://www.uneed.best/api';

export const getFeed = defineTool({
  name: 'get_feed',
  displayName: 'Get Community Feed',
  description: 'Browse the Uneed community feed at uneed.best/community — posts, discussions, and milestones from makers.',
  icon: 'layout-list',
  group: 'Discovery',
  input: z.object({
    limit: z.number().int().min(1).max(50).optional().describe('Maximum items to return (default 10)'),
    sort: z.enum(['latest', 'hot', 'following']).optional().describe('Sort order (default: latest)'),
  }),
  output: z.object({
    items: z.array(z.object({
      id: z.number(),
      url: z.string(),
      body: z.string(),
      author: z.string(),
      likeCount: z.number(),
      commentCount: z.number(),
      postType: z.string(),
      linkedTool: z.string().optional(),
      publishedAt: z.string().optional(),
    })),
    total: z.number(),
  }),
  async handle(params) {
    log.info('Getting Uneed community feed');

    const sortBy = params.sort || 'latest';
    const limit = params.limit ?? 10;
    const url = `${API_BASE}/posts?limit=${limit + 10}&offset=0&include_comments=false&sort_by=${sortBy}`;

    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
      throw ToolError.internal(`Failed to fetch feed: ${response.status}`);
    }

    const posts = await response.json() as any[];

    const items = posts.slice(0, limit).map((p: any) => ({
      id: p.id,
      url: `/posts/${p.id}`,
      body: (p.body || '').substring(0, 500),
      author: p.author?.display_name || p.author?.username || 'unknown',
      likeCount: p.like_count ?? 0,
      commentCount: p.comment_count ?? 0,
      postType: p.post_type || 'text',
      linkedTool: p.linked_tool?.name,
      publishedAt: p.published_at,
    }));

    return { items, total: items.length };
  },
});
