import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const followUser = defineTool({
    name: 'follow_user',
    displayName: 'Follow / Unfollow User',
    description: 'Follow or unfollow a Quora user. Requires being on their profile page.',
    icon: 'user-plus',
    group: 'Interaction',
    input: z.object({
        profile_url: z.string().url().optional().describe('URL of the user profile. Leave empty to use the current page.'),
        action: z.enum(['follow', 'unfollow']).describe('Whether to follow or unfollow'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info(`${params.action}ing user`);
        if (params.profile_url && !window.location.href.includes(params.profile_url)) {
            return { success: false, message: `Navigate to ${params.profile_url} in your browser first, then call follow_user without the profile_url parameter.` };
        }
        const followBtn = (document.querySelector('[data-testid="profile_follow_button"], .puppeteer_test_follow_user')
            || Array.from(document.querySelectorAll('button')).find(b => /follow(ing)?/i.test(b.textContent || '')));
        if (!followBtn) {
            return { success: false, message: 'Could not find follow button. Navigate to a user profile first.' };
        }
        const isFollowing = followBtn.textContent?.toLowerCase().includes('following');
        if (params.action === 'follow' && !isFollowing) {
            followBtn.click();
            return { success: true, message: 'Now following this user' };
        }
        if (params.action === 'unfollow' && isFollowing) {
            followBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            const confirmBtn = (Array.from(document.querySelectorAll('button')).find(b => /unfollow/i.test(b.textContent || '')));
            if (confirmBtn)
                confirmBtn.click();
            return { success: true, message: 'Unfollowed this user' };
        }
        return { success: true, message: isFollowing ? 'Already following' : 'Not currently following' };
    },
});
//# sourceMappingURL=follow-user.js.map