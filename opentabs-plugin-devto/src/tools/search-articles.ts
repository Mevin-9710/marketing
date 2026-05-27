import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

const ALGOLIA_APP_ID = 'PRSOBFP46H';
const ALGOLIA_API_KEY = '9aa7d31610cba78851c9b1f63776a9dd';
const ALGOLIA_INDEX = 'Article_production';

interface AlgoliaHit {
  objectID: string;
  id: number;
  title: string;
  description?: string;
  path: string;
  tag_list: string[];
  user: { name: string; username: string; profile_image?: string };
  public_reactions_count: number;
  comments_count: number;
  readable_publish_date?: string;
  reading_time_minutes?: number;
  url: string;
}

export const searchArticles = defineTool({
  name: 'search_articles',
  displayName: 'Search Articles',
  description: 'Search DEV.to articles by keyword using Algolia search.',
  icon: 'search',
  group: 'Discovery',
  input: z.object({
    query: z.string().min(1).describe('Search keyword or phrase'),
    limit: z.number().int().min(1).max(60).optional().describe('Maximum results (default 10)'),
  }),
  output: z.object({
    results: z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      url: z.string(),
      author: z.string(),
      tags: z.array(z.string()),
      reactionsCount: z.number(),
      commentsCount: z.number(),
    })),
    total: z.number(),
  }),
  async handle(params) {
    log.info('Searching DEV.to', { query: params.query });

    const url = `https://${ALGOLIA_APP_ID.toLowerCase()}-dsn.algolia.net/1/indexes/${ALGOLIA_INDEX}/query`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Algolia-API-Key': ALGOLIA_API_KEY,
        'X-Algolia-Application-Id': ALGOLIA_APP_ID,
      },
      body: JSON.stringify({
        query: params.query,
        hitsPerPage: String(params.limit ?? 10),
        page: '0',
      }),
    });

    if (!response.ok) {
      throw ToolError.internal(`Search failed: ${response.status}`);
    }

    const data = await response.json() as { hits: AlgoliaHit[] };
    const hits = data.hits || [];

    const results = hits.map(hit => ({
      id: hit.id,
      title: hit.title,
      description: hit.description || '',
      url: `https://dev.to${hit.path}`,
      author: hit.user?.name || '',
      tags: hit.tag_list || [],
      reactionsCount: hit.public_reactions_count || 0,
      commentsCount: hit.comments_count || 0,
    }));

    log.debug('Search complete', { query: params.query, count: results.length });
    return { results, total: results.length };
  },
});
