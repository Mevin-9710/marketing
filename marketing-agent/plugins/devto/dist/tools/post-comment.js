import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const postComment = defineTool({
    name: 'post_comment',
    displayName: 'Post Comment',
    description: 'Post a comment on a DEV.to article. Must be on the article page.',
    icon: 'message-circle',
    group: 'Engagement',
    input: z.object({
        content: z.string().min(1).describe('Comment text (supports Markdown)'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info('Posting comment on DEV.to');
        // Find and click the comment area to expand it
        const commentTrigger = document.querySelector('#new_comment_link_textarea, [data-testid="comment-trigger"], .comment-form textarea');
        if (commentTrigger) {
            commentTrigger.click();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        const commentInput = document.querySelector('#text-area, textarea[class*="comment"], [contenteditable="true"][class*="comment"], .comment-form textarea, #new_comment textarea');
        if (!commentInput) {
            throw ToolError.notFound('Could not find comment input. Make sure you are on an article page and logged in.');
        }
        commentInput.focus();
        if (commentInput.tagName === 'TEXTAREA' || commentInput.tagName === 'INPUT') {
            commentInput.value = params.content;
        }
        else {
            commentInput.innerHTML = params.content;
        }
        commentInput.dispatchEvent(new Event('input', { bubbles: true }));
        await new Promise(resolve => setTimeout(resolve, 500));
        const submitBtn = Array.from(document.querySelectorAll('button, input[type="submit"]')).find(b => /submit|comment|reply|post/i.test(b.textContent || b.value || ''));
        if (submitBtn) {
            submitBtn.click();
            log.info('Comment submitted');
            return { success: true, message: 'Comment posted successfully' };
        }
        throw ToolError.internal('Could not find comment submit button');
    },
});
//# sourceMappingURL=post-comment.js.map