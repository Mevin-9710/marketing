import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const shareContent = defineTool({
    name: 'share_content',
    displayName: 'Share Content',
    description: 'Share Quora content (questions/answers) by generating a shareable link. Optionally copy to clipboard.',
    icon: 'share-2',
    group: 'Interaction',
    input: z.object({
        content_url: z.string().url().optional().describe('URL of the content to share. Leave empty to share the current page.'),
        platform: z.enum(['link', 'twitter', 'facebook', 'copy']).optional().describe('Share destination: "link" for a direct link, "copy" to copy to clipboard, or a social platform (default: link)'),
    }),
    output: z.object({
        success: z.boolean(),
        share_url: z.string().describe('The shareable URL'),
        message: z.string(),
    }),
    async handle(params) {
        const url = params.content_url || window.location.href;
        log.info('Sharing content', { url, platform: params.platform });
        let shareUrl = url;
        const shareButton = document.querySelector('[data-testid="share_button"], button:has(svg.fa-share), .puppeteer_test_share');
        if (shareButton) {
            shareButton.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            if (params.platform === 'copy') {
                const copyBtn = (Array.from(document.querySelectorAll('button')).find(b => /copy/i.test(b.textContent || b.getAttribute('aria-label') || '')));
                if (copyBtn) {
                    copyBtn.click();
                    return { success: true, share_url: shareUrl, message: 'Link copied to clipboard' };
                }
            }
            const linkInput = document.querySelector('input[readonly], input[type="url"]');
            if (linkInput) {
                shareUrl = linkInput.value;
            }
            const closeBtn = (Array.from(document.querySelectorAll('button')).find(b => /close/i.test(b.getAttribute('aria-label') || '')
                || (b.querySelector('svg')?.getAttribute('aria-label') || '').toLowerCase().includes('xmark')));
            if (closeBtn)
                closeBtn.click();
        }
        return {
            success: true,
            share_url: shareUrl,
            message: `Shareable link: ${shareUrl}`,
        };
    },
});
//# sourceMappingURL=share-content.js.map