import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractNuxtData } from '../nuxt-utils.js';
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
        let profileData = null;
        let username = params.username || '';
        let displayName = '';
        if (params.username) {
            const profileUrl = `https://www.uneed.best/profile/${params.username}`;
            const response = await fetch(profileUrl, { credentials: 'include' });
            if (!response.ok) {
                return { username: params.username, displayName: params.username, bio: `Profile not found (status ${response.status})` };
            }
            const html = await response.text();
            profileData = extractNuxtData(html, `profile-${params.username}`, 'profile');
            if (profileData) {
                displayName = profileData.display_name || profileData.username || params.username;
                username = profileData.username || params.username;
            }
        }
        else {
            const NuxtScript = document.querySelector('script[data-nuxt-data]');
            if (NuxtScript) {
                try {
                    const data = JSON.parse(NuxtScript.textContent || '[]');
                    if (Array.isArray(data) && data.length > 3) {
                        const routeData = data[3];
                        if (routeData && typeof routeData === 'object') {
                            for (const key of Object.keys(routeData)) {
                                if (key.startsWith('profile-') || key === 'profile') {
                                    profileData = extractNuxtData(NuxtScript.textContent || '', key);
                                    break;
                                }
                            }
                        }
                    }
                }
                catch { }
            }
            if (!profileData) {
                displayName = document.querySelector('h1')?.textContent?.trim() || '';
                username = window.location.pathname.replace('/profile/', '').replace('/', '') || displayName;
            }
        }
        if (!profileData) {
            return { username, displayName: displayName || username, bio: 'Could not find profile data. Make sure the username is correct.' };
        }
        log.info('Got user profile', { username });
        return {
            username: profileData.username || username,
            displayName: profileData.display_name || profileData.username || username,
            bio: profileData.bio || '',
            followerCount: profileData.followers_count ?? profileData.follower_count,
            followingCount: profileData.following_count,
            toolsSubmitted: profileData.tools?.length ?? profileData.tool_count,
        };
    },
});
//# sourceMappingURL=get-user-profile.js.map