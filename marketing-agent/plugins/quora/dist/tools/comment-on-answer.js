import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const commentOnAnswer = defineTool({
    name: 'comment_on_answer',
    displayName: 'Comment on Answer',
    description: 'Post a comment on a Quora answer. Navigate to the answer page first or provide the answer URL.',
    icon: 'message-circle',
    group: 'Interaction',
    input: z.object({
        answer_url: z.string().url().optional().describe('URL of the answer to comment on. Leave empty to use the current page.'),
        content: z.string().min(1).max(5000).describe('Comment text'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info('Commenting on answer');
        if (params.answer_url && !window.location.href.includes(params.answer_url)) {
            return { success: false, message: `Navigate to ${params.answer_url} in your browser first, then call comment_on_answer without the answer_url parameter.` };
        }
        const commentBox = (document.querySelector('[data-testid="comment_input"]')
            || Array.from(document.querySelectorAll('[contenteditable="true"], textarea')).find(el => /comment/i.test(el.getAttribute('placeholder') || el.getAttribute('data-placeholder') || '')));
        if (!commentBox) {
            const commentTrigger = (document.querySelector('[data-testid="comment_button"]')
                || Array.from(document.querySelectorAll('button')).find(b => /comment/i.test(b.textContent || '')));
            if (commentTrigger) {
                commentTrigger.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            else {
                throw ToolError.notFound('Could not find the comment input. Navigate to a specific answer page.');
            }
        }
        const textarea = document.querySelector('[data-testid="comment_input"], textarea, [contenteditable="true"]');
        if (!textarea) {
            throw ToolError.notFound('Could not find comment text area');
        }
        if (textarea instanceof HTMLTextAreaElement) {
            textarea.value = params.content;
        }
        else {
            textarea.focus();
            textarea.innerHTML = params.content.replace(/\n/g, '<br>');
        }
        const inputEvent = new Event('input', { bubbles: true });
        textarea.dispatchEvent(inputEvent);
        await new Promise(resolve => setTimeout(resolve, 500));
        const submitBtn = (Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit' || /add|comment|post/i.test(b.textContent || '')));
        if (submitBtn) {
            submitBtn.click();
        }
        log.info('Comment posted');
        return { success: true, message: 'Comment posted successfully' };
    },
});
//# sourceMappingURL=comment-on-answer.js.map