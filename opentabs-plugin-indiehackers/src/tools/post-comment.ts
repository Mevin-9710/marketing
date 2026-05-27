import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const postComment = defineTool({
  name: 'post_comment',
  displayName: 'Post Comment',
  description: 'Post a comment on an IndieHackers post or thread. Navigate to the post first.',
  icon: 'message-circle',
  group: 'Engagement',
  input: z.object({
    content: z.string().min(1).describe('Comment text'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    log.info('Posting comment on IndieHackers');

    let commentInput = document.querySelector(
      '.comment-box__textarea, textarea[class*="comment"], [contenteditable="true"][class*="comment"], [class*="comment"] textarea'
    ) as HTMLElement | null;

    if (!commentInput) {
      const commentBox = document.querySelector('.comment-box, [class*="comment-box"]') as HTMLElement | null;
      if (commentBox) {
        commentInput = commentBox.querySelector('textarea, [contenteditable="true"]') as HTMLElement | null;
      }
    }

    if (!commentInput) {
      const replyBtns = Array.from(document.querySelectorAll('button')).filter(b =>
        /reply|comment/i.test(b.textContent || '')
      );
      const topReply = replyBtns.find(b => b.textContent?.trim() === 'Reply' || b.textContent?.includes('Reply'));
      if (topReply) {
        topReply.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        commentInput = document.querySelector('.comment-box__textarea, textarea[class*="comment"]') as HTMLElement | null;
      }
    }

    if (!commentInput) {
      const showCommentBox = document.querySelector('button:has-text("Post Comment"), .comment-box--unfocused') as HTMLElement | null;
      if (showCommentBox) {
        (showCommentBox as HTMLElement).click();
        await new Promise(resolve => setTimeout(resolve, 500));
        commentInput = document.querySelector('.comment-box__textarea') as HTMLElement | null;
      }
    }

    if (!commentInput) {
      throw ToolError.notFound('Could not find comment input. Make sure you are on a post page and logged in.');
    }

    commentInput.focus();
    if (commentInput.tagName === 'TEXTAREA' || commentInput.tagName === 'INPUT') {
      (commentInput as HTMLTextAreaElement).value = params.content;
    } else {
      commentInput.innerHTML = params.content;
    }
    commentInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(resolve => setTimeout(resolve, 500));

    const submitBtn = (document.querySelector('.comment-box__save-button')
      || Array.from(document.querySelectorAll('button')).find(b =>
        /post comment|reply|submit/i.test(b.textContent?.trim() || '')
      )) as HTMLElement | null;

    if (submitBtn) {
      submitBtn.click();
      log.info('Comment submitted');
      return { success: true, message: 'Comment posted successfully' };
    }

    throw ToolError.internal('Could not find comment submit button');
  },
});
