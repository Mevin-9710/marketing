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

    const searchUrl = `/search?q=${encodeURIComponent(params.query)}`;
    const response = await fetch(searchUrl, { credentials: 'include' });
    if (!response.ok) {
      throw ToolError.internal(`Search failed: ${response.status}`);
    }
    const html = await response.text();

    const doc = document.createElement('div');
    doc.innerHTML = html;

    const results: Array<{ title: string; url: string; snippet?: string; author?: string; commentCount?: number }> = [];
    const links = doc.querySelectorAll('.story__text-link, a[href*="/post/"], a[href*="/thread/"], article a');

    const seen = new Set<string>();
    links.forEach(el => {
      const anchor = el as HTMLAnchorElement;
      const href = anchor.href;
      if (seen.has(href) || !href.includes('indiehackers.com')) return;
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

    const limit = params.limit ?? 10;
    const finalResults = results.slice(0, limit);

    log.debug('Search complete', { query: params.query, count: finalResults.length });
    return { results: finalResults, total: finalResults.length };
  },
});
