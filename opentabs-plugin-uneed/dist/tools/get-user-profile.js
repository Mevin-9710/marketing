import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const getUserProfile = defineTool({
    name: 'get_user_profile',
    displayName: 'Get User Profile',
    description: 'Get a Uneed user profile — username, bio, follower count, tools submitted.',
    icon: 'user',
    group: 'Discovery',
    input: z.object({
        username: z.string().optional().describe('Username to look up. Leave empty if already on their profile.'),
    }),
    output: z.object({
        username: z.string(),
        displayName: z.string().optional(),
        bio: z.string().optional(),
        followerCount: z.number().optional(),
        followingCount: z.number().optional(),
        toolsSubmitted: z.number().optional(),
    }),
    async handle(params) {
        let displayName = '';
        let bio = '';
        let followerCount;
        let username = params.username || '';
        if (params.username && !window.location.href.includes('/@')) {
            const profileUrl = `https://www.uneed.best/@${params.username}`;
            const response = await fetch(profileUrl, { credentials: 'include' });
            if (response.ok) {
                const html = await response.text();
                const doc = document.createElement('div');
                doc.innerHTML = html;
                displayName = doc.querySelector('h1, [class*="display-name"], [class*="username"]')?.textContent?.trim() || '';
                bio = doc.querySelector('[class*="bio"], [class*="about"]')?.textContent?.trim() || '';
                const followerText = doc.querySelector('[class*="followers"]')?.textContent?.trim();
                followerCount = followerText ? parseInt(followerText.replace(/\D/g, ''), 10) : undefined;
            }
            else {
                return { username, displayName: params.username, bio: 'Profile not found' };
            }
        }
        else {
            displayName = document.querySelector('h1, [class*="display-name"], [class*="username"]')?.textContent?.trim() || '';
            bio = document.querySelector('[class*="bio"], [class*="about"]')?.textContent?.trim() || '';
            const followerText = document.querySelector('[class*="followers"]')?.textContent?.trim();
            followerCount = followerText ? parseInt(followerText.replace(/\D/g, ''), 10) : undefined;
            username = username || window.location.pathname.replace('/@', '').replace('/', '') || displayName;
        }
        log.info('Got user profile', { username });
        return { username, displayName, bio, followerCount };
    },
});
//# sourceMappingURL=get-user-profile.js.map