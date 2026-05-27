import { defineTool, postJSON, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
function findVoteButton(direction) {
    const testId = direction === 'up' ? 'upvote_button' : 'downvote_button';
    const cls = direction === 'up' ? '.puppeteer_test_upvote' : '.puppeteer_test_downvote';
    const btn = document.querySelector(`[data-testid="${testId}"]${cls}`);
    if (btn)
        return btn;
    const allButtons = document.querySelectorAll('button');
    for (const b of allButtons) {
        const svg = b.querySelector('svg');
        if (!svg)
            continue;
        const ariaLabel = (b.getAttribute('aria-label') || '').toLowerCase();
        const text = (b.textContent || '').toLowerCase();
        if (direction === 'up' && (ariaLabel.includes('upvote') || text.includes('upvote') || svg.innerHTML.includes('caret-up')))
            return b;
        if (direction === 'down' && (ariaLabel.includes('downvote') || text.includes('downvote') || svg.innerHTML.includes('caret-down')))
            return b;
    }
    return null;
}
export const upvoteContent = defineTool({
    name: 'upvote_content',
    displayName: 'Upvote / Downvote',
    description: 'Upvote or downvote content on Quora (answers, questions). Provide the content URL or target content on the current page. Use action "upvote" to upvote, "downvote" to downvote, or "neutral" to remove your vote.',
    icon: 'thumbs-up',
    group: 'Interaction',
    input: z.object({
        content_url: z.string().url().optional().describe('URL of the answer or question to vote on. Leave empty to use current page.'),
        action: z.enum(['upvote', 'downvote', 'neutral']).describe('Vote action: upvote, downvote, or neutral (remove vote)'),
        content_type: z.enum(['answer', 'question']).optional().describe('Type of content being voted on'),
    }),
    output: z.object({
        success: z.boolean(),
        new_count: z.number().optional().describe('Updated vote count if detectable'),
        message: z.string(),
    }),
    async handle(params) {
        log.info('Voting on content', { action: params.action });
        const upvoteBtn = findVoteButton('up');
        const downvoteBtn = findVoteButton('down');
        if (params.action === 'upvote' && upvoteBtn) {
            const isAlreadyUpvoted = upvoteBtn.classList.contains('active') || upvoteBtn.getAttribute('aria-pressed') === 'true';
            if (!isAlreadyUpvoted) {
                upvoteBtn.click();
                log.info('Upvoted via click');
                return { success: true, message: 'Upvoted successfully' };
            }
            return { success: true, message: 'Already upvoted' };
        }
        if (params.action === 'downvote' && downvoteBtn) {
            const isAlreadyDownvoted = downvoteBtn.classList.contains('active') || downvoteBtn.getAttribute('aria-pressed') === 'true';
            if (!isAlreadyDownvoted) {
                downvoteBtn.click();
                log.info('Downvoted via click');
                return { success: true, message: 'Downvoted successfully' };
            }
            return { success: true, message: 'Already downvoted' };
        }
        if (params.action === 'neutral') {
            const isUpvoted = upvoteBtn?.classList.contains('active') || upvoteBtn?.getAttribute('aria-pressed') === 'true';
            const isDownvoted = downvoteBtn?.classList.contains('active') || downvoteBtn?.getAttribute('aria-pressed') === 'true';
            if (isUpvoted && upvoteBtn) {
                upvoteBtn.click();
            }
            else if (isDownvoted && downvoteBtn) {
                downvoteBtn.click();
            }
            return { success: true, message: 'Vote removed' };
        }
        const result = await postJSON(params.action === 'downvote' ? '/downvote' : '/upvote', { type: params.content_type || 'answer' });
        log.info('Vote API call result', { result });
        return {
            success: true,
            message: `${params.action} successful`,
        };
    },
});
//# sourceMappingURL=upvote-content.js.map