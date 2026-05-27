import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const upvotePost = defineTool({
  name: 'upvote_post',
  displayName: 'Upvote Post',
  description: 'Upvote an IndieHackers post. Must be on the post page or provide a URL.',
  icon: 'thumbs-up',
  group: 'Engagement',
  input: z.object({
    post_url: z.string().optional().describe('URL of the post to upvote. Leave empty if already on the post page.'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
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
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const likeBtn = document.querySelector(
      '.post-liker, .inline-actions__action--like, button.post-liker, [class*="post-liker"], .story__count--likes'
    ) as HTMLElement | null;

    if (!likeBtn) {
      throw ToolError.notFound('Could not find upvote/like button on this page. Navigate to a post page first.');
    }

    const isAlreadyLiked = likeBtn.classList.contains('post-liker--liked') || likeBtn.getAttribute('data-liked') === 'true';
    if (isAlreadyLiked) {
      return { success: true, message: 'Already upvoted' };
    }

    likeBtn.click();
    log.info('Upvoted post');
    return { success: true, message: 'Post upvoted successfully' };
  },
});
