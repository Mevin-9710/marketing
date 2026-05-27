import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getPost = defineTool({
  name: 'get_post',
  displayName: 'Get Post',
  description: 'Get a specific IndieHackers post and its comments. Navigate to a post URL first, or provide a URL.',
  icon: 'file-text',
  group: 'Reading',
  input: z.object({
    post_url: z.string().optional().describe('URL of the post. Leave empty if already on the post page.'),
  }),
  output: z.object({
    title: z.string(),
    body: z.string(),
    author: z.string(),
    commentCount: z.number(),
    upvoteCount: z.number(),
    comments: z.array(z.object({
      body: z.string(),
      author: z.string(),
    })),
  }),
  async handle(params) {
    const targetUrl = params.post_url || window.location.href;

    if (params.post_url && !window.location.href.includes(params.post_url)) {
      const response = await fetch(targetUrl, { credentials: 'include' });
      if (!response.ok) {
        throw ToolError.internal(`Failed to load post page: ${response.status}`);
      }
      const html = await response.text();
      const doc = document.createElement('div');
      doc.innerHTML = html;
      document.body.innerHTML = doc.innerHTML;
    }

    const title = document.querySelector('h1.post-page__title')?.textContent?.trim()
      || document.querySelector('h1')?.textContent?.trim()
      || '';
    const body = document.querySelector('.post-page__body.content, [class*="post-body"], [class*="post-content"]')?.textContent?.trim() || '';
    const author = document.querySelector('.post-page__byline-author span, [class*="author"] a, [class*="username"] a')?.textContent?.trim() || '';

    const commentEls = document.querySelectorAll('ol.comment-tree > li > .comment');
    const seen = new Set<string>();
    const comments = Array.from(commentEls).map(el => {
      const body = el.querySelector('.comment__content')?.textContent?.trim() || '';
      const author = el.querySelector('.user-link__name--username')?.textContent?.trim() || '';
      return { body, author };
    }).filter(c => {
      if (!c.body || seen.has(c.body)) return false;
      seen.add(c.body);
      return true;
    });

    const votesEl = document.querySelector('.post-liker__count, [class*="vote"], [class*="upvote"]');
    const upvoteCount = parseInt(votesEl?.textContent || '0', 10) || 0;

    log.info('Got post', { title, comments: comments.length });
    return { title, body, author, commentCount: comments.length, upvoteCount, comments };
  },
});
