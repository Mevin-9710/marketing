import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

const API_BASE = 'https://www.uneed.best/api';

export const postCommentTool = defineTool({
  name: 'post_comment',
  displayName: 'Post Comment',
  description: 'Post a comment on a Uneed community post or tool listing. Provide the post_id for API mode, or navigate to the post first for DOM mode.',
  icon: 'message-circle',
  group: 'Engagement',
  input: z.object({
    content: z.string().min(1).describe('Comment text'),
    post_id: z.number().optional().describe('Post ID to comment on (API mode). If omitted, uses the current page DOM.'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    log.info('Posting comment on Uneed');

    if (params.post_id) {
      const response = await fetch(`${API_BASE}/posts/${params.post_id}/comments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: params.content }),
      });
      if (!response.ok) {
        throw ToolError.internal(`API comment failed: ${response.status}`);
      }
      return { success: true, message: 'Comment posted successfully via API' };
    }

    const commentInput = document.querySelector(
      'textarea[class*="comment"], textarea, [contenteditable="true"]'
    ) as HTMLElement | null;

    if (!commentInput) {
      throw ToolError.notFound('Could not find comment input. Provide post_id or navigate to a post page.');
    }

    commentInput.focus();
    if (commentInput.tagName === 'TEXTAREA' || commentInput.tagName === 'INPUT') {
      (commentInput as HTMLTextAreaElement).value = params.content;
    } else {
      commentInput.innerHTML = params.content;
    }
    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 300));

    const submitBtn = Array.from(document.querySelectorAll('button')).find(b =>
      /comment|reply|submit|post|send/i.test(b.textContent || '')
    ) as HTMLElement | undefined;

    if (submitBtn) {
      submitBtn.click();
      return { success: true, message: 'Comment posted successfully' };
    }

    throw ToolError.internal('Could not find comment submit button');
  },
});
