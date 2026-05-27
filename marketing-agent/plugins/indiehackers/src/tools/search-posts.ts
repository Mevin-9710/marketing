import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const searchPosts = defineTool({
  name: 'search_posts',
  displayName: 'Search Posts',
  description: 'Search IndieHackers posts by keyword. Returns matching posts with titles, snippets, and URLs.',
  icon: 'search',
  group: 'Discovery',
  input: z.object({
    query: z.string().min(1).describe('Search keyword or phrase'),
    limit: z.number().int().min(1).max(50).optional().describe('Maximum results (default 10)'),
  }),
  output: z.object({
    results: z.array(z.object({
      title: z.string(),
      url: z.string(),
      snippet: z.string().optional(),
      author: z.string().optional(),
      commentCount: z.number().optional(),
    })),
    total: z.number(),
  }),
  async handle(params) {
    log.info('Searching IndieHackers', { query: params.query });

    const algoliaAppId = 'N86T1R3OWZ';
    const algoliaApiKey = '5140dac5e87f47346abbda1a34ee70c3';

    const searchPayload = {
      requests: [{
        indexName: 'discussions',
        query: params.query,
        params: `hitsPerPage=${params.limit ?? 10}&highlightPreTag=<em class="query-match">&attributesToRetrieve=objectID,title,body,slug,authorUsername,points,replyCount`,
      }],
    };

    const searchUrl = `https://${algoliaAppId}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=IndieHackers`;
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Algolia-Application-Id': algoliaAppId,
        'X-Algolia-API-Key': algoliaApiKey,
      },
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      log.warn('Algolia search failed, falling back to page search', { status: response.status });
      return await fallbackSearch(params.query, params.limit ?? 10);
    }

    const data = await response.json();
    const hits = data.results?.[0]?.hits || [];

    const results = hits.map((hit: Record<string, unknown>) => {
      const objectID = hit.objectID as string;
      const slug = (hit.slug as string) || '';
      const title = (hit.title as string) || '';
      const author = (hit.authorUsername as string) || '';
      const body = (hit.body as string) || '';
      const upvoteCount = (hit.points as number) || 0;
      const commentCount = (hit.replyCount as number) || 0;

      const url = objectID?.startsWith('/')
        ? `https://www.indiehackers.com${objectID}`
        : slug
          ? `https://www.indiehackers.com/post/${slug}`
          : `https://www.indiehackers.com/post/${objectID}`;

      return {
        title: title.substring(0, 200),
        url,
        snippet: body.replace(/<[^>]*>/g, '').substring(0, 300),
        author,
        commentCount,
      };
    }).filter((r: { title: string }) => r.title);

    const limit = params.limit ?? 10;
    const finalResults = results.slice(0, limit);

    log.debug('Search complete', { query: params.query, count: finalResults.length });

    if (finalResults.length === 0) {
      return await fallbackSearch(params.query, limit);
    }

    return { results: finalResults, total: finalResults.length };
  },
});

async function fallbackSearch(query: string, limit: number) {
  const searchUrl = `/search?q=${encodeURIComponent(query)}`;
  const response = await fetch(searchUrl, { credentials: 'include' });
  if (!response.ok) {
    return { results: [], total: 0 };
  }
  const html = await response.text();
  const doc = document.createElement('div');
  doc.innerHTML = html;

  const results: Array<{ title: string; url: string; snippet?: string; author?: string; commentCount?: number }> = [];
  const links = doc.querySelectorAll('.story__text-link, a[href*="/post/"], a[href*="/thread/"], article a');

  const baseUrl = 'https://www.indiehackers.com';
  const seen = new Set<string>();

  links.forEach(el => {
    const anchor = el as HTMLAnchorElement;
    const rawHref = anchor.getAttribute('href') || '';
    const href = rawHref.startsWith('http') ? rawHref : `${baseUrl}${rawHref}`;
    if (seen.has(href)) return;
    seen.add(href);

    const title = anchor.textContent?.trim() || '';
    const card = anchor.closest('.story, article, [class*="card"]') || anchor.parentElement;
    const snippet = card?.querySelector('[class*="body"], [class*="content"], p')?.textContent?.trim();
    const author = card?.querySelector('.user-link__name--username, [class*="username"]')?.textContent?.trim();
    const commentLink = card?.querySelector('.story__count--comments');
    const commentCountText = commentLink?.textContent?.trim();
    const commentCount = commentCountText ? parseInt(commentCountText, 10) || undefined : undefined;

    results.push({
      title: title.substring(0, 200),
      url: href,
      snippet: snippet?.substring(0, 300),
      author,
      commentCount,
    });
  });

  return { results: results.slice(0, limit), total: results.length };
}
