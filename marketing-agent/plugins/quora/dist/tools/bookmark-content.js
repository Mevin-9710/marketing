import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const bookmarkContent = defineTool({
    name: 'bookmark_content',
    displayName: 'Bookmark / Save',
    description: 'Bookmark (save) or remove a bookmark from Quora content (answers, questions).',
    icon: 'bookmark',
    group: 'Interaction',
    input: z.object({
        content_url: z.string().url().optional().describe('URL of the content to bookmark. Leave empty to use current page.'),
        action: z.enum(['bookmark', 'remove']).describe('Whether to bookmark or remove bookmark'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info(`${params.action === 'bookmark' ? 'Bookmarking' : 'Removing bookmark'} content`);
        if (params.content_url && !window.location.href.includes(params.content_url)) {
            return { success: false, message: `Navigate to ${params.content_url} in your browser first, then call bookmark_content without the content_url parameter.` };
        }
        const bookmarkBtn = (document.querySelector('[data-testid="bookmark_button"], .puppeteer_test_bookmark')
            || Array.from(document.querySelectorAll('button')).find(b => /bookmark/i.test(b.getAttribute('aria-label') || b.textContent || '')
                || (b.querySelector('svg')?.getAttribute('aria-label') || '').toLowerCase().includes('bookmark')));
        if (!bookmarkBtn) {
            return { success: false, message: 'Could not find bookmark button on this page' };
        }
        const isBookmarked = bookmarkBtn.getAttribute('aria-pressed') === 'true'
            || bookmarkBtn.classList.contains('active')
            || (bookmarkBtn.querySelector('svg')?.getAttribute('fill') === 'currentColor');
        if (params.action === 'bookmark' && !isBookmarked) {
            bookmarkBtn.click();
            return { success: true, message: 'Content bookmarked' };
        }
        if (params.action === 'remove' && isBookmarked) {
            bookmarkBtn.click();
            return { success: true, message: 'Bookmark removed' };
        }
        return { success: true, message: isBookmarked ? 'Already bookmarked' : 'Not bookmarked' };
    },
});
//# sourceMappingURL=bookmark-content.js.map