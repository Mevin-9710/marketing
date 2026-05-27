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

    const limit = params.limit ?? 10;
    const allResults: Array<{ name: string; description?: string; url?: string; voteCount?: number; tags?: string[] }> = [];
    const seen = new Set<string>();

    const response = await fetch(`${API_BASE}/posts?limit=100&offset=0&sort_by=latest`, { credentials: 'include' });
    if (!response.ok) {
      throw ToolError.internal(`Search failed: ${response.status}`);
    }

    const posts = await response.json() as any[];
    const lower = params.query.toLowerCase();

    for (const p of posts) {
      const body = (p.body || '').toLowerCase();
      const author = p.author?.username || '';
      const name = p.linked_tool?.name || '';

      if (!body.includes(lower) && !author.includes(lower) && !name.toLowerCase().includes(lower)) continue;

      if (p.linked_tool?.name && seen.has(p.linked_tool.name)) continue;
      if (p.linked_tool?.name) seen.add(p.linked_tool.name);
      if (!p.linked_tool?.name) continue;

      allResults.push({
        name: p.linked_tool.name,
        description: (p.body || '').replace(/<[^>]*>/g, '').substring(0, 300),
        url: `/tool/${p.linked_tool.slug}`,
        voteCount: p.linked_tool.votes_sum ?? p.like_count,
        tags: p.linked_tool.tags?.map((t: any) => t.name || t) || [],
      });

      if (allResults.length >= limit) break;
    }

    if (allResults.length === 0) {
      for (const p of posts) {
        const body = (p.body || '').toLowerCase();
        const author = p.author?.username || '';
        if (!body.includes(lower) && !author.includes(lower)) continue;

        allResults.push({
          name: p.author?.display_name || p.author?.username || 'Post',
          description: (p.body || '').replace(/<[^>]*>/g, '').substring(0, 300),
          url: `/posts/${p.id}`,
          voteCount: p.like_count,
        });

        if (allResults.length >= limit) break;
      }
    }

    return { results: allResults, total: allResults.length };
  },
});
