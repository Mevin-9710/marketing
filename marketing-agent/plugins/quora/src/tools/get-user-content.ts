import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getUserContent = defineTool({
  name: 'get_user_content',
  displayName: 'Get User Content',
  description: 'Get a Quora user\'s answers or questions. Provide the profile URL or the username.',
  icon: 'file-text',
  group: 'People',
  input: z.object({
    profile_url: z.string().url().optional().describe('User profile URL. Leave empty for the current user\'s content.'),
    content_type: z.enum(['answers', 'questions']).describe('Whether to fetch the user\'s answers or questions'),
    limit: z.number().int().min(1).max(50).optional().describe('Maximum items to return (default 10)'),
  }),
  output: z.object({
    username: z.string(),
    items: z.array(z.object({
      title: z.string().describe('Question title (for answers) or question text'),
      url: z.string().describe('URL to the content'),
      preview: z.string().optional().describe('Content snippet/preview'),
      upvote_count: z.number().optional(),
      timestamp: z.string().optional(),
    })),
    total: z.number(),
  }),
  async handle(params) {
    log.info('Getting user content', { type: params.content_type });

    const targetUrl = params.profile_url || window.location.href;
    const contentUrl = `${targetUrl.replace(/\/$/, '')}/${params.content_type}`;

    const response = await fetch(contentUrl, { credentials: 'include' });
    if (!response.ok) {
      throw ToolError.internal(`Failed to load user content: ${response.status}`);
    }
    const html = await response.text();
    const doc = document.createElement('div');
    doc.innerHTML = html;

    const items: Array<{
      title: string;
      url: string;
      preview?: string;
      upvote_count?: number;
      timestamp?: string;
    }> = [];

    const contentCards = doc.querySelectorAll('[data-testid="content_card"], .q-box.content-item, .q-box[class*="answer"], .q-box[class*="question"]');
    contentCards.forEach((card) => {
      const link = card.querySelector('a[href*="/question/"], a[href*="/answer/"]') as HTMLAnchorElement | null;
      if (!link) return;

      const title = link.textContent?.trim() || '';
      if (!title) return;

      const preview = card.querySelector('.q-text:not(a .q-text)')?.textContent?.trim();
      const voteEl = card.querySelector('[class*="vote"], [class*="upvote"], [class*="count"]');
      const voteMatch = voteEl?.textContent?.match(/([\d.]+[KMB]?)/);
      const upvoteCount = voteMatch ? parseFloat(voteMatch[1].replace(/[KMB]/g, '')) : undefined;
      const timeEl = card.querySelector('time, [class*="time"], [class*="date"]');

      items.push({
        title: title.substring(0, 300),
        url: link.href,
        preview: preview?.substring(0, 300),
        upvote_count: upvoteCount,
        timestamp: timeEl?.textContent?.trim() || undefined,
      });
    });

    if (items.length === 0) {
      const allLinks = doc.querySelectorAll('a[href*="/answer/"]');
      allLinks.forEach(link => {
        const anchor = link as HTMLAnchorElement;
        const title = anchor.textContent?.trim();
        if (title && title.length > 5) {
          items.push({ title: title.substring(0, 300), url: anchor.href });
        }
      });
    }

    const limit = params.limit ?? 10;
    const finalItems = items.slice(0, limit);

    log.debug('User content fetched', { type: params.content_type, count: finalItems.length });

    return {
      username: targetUrl.split('/').pop() || 'unknown',
      items: finalItems,
      total: finalItems.length,
    };
  },
});
