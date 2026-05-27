import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { fetchUser } from '../devto-api.js';
export const getUserProfile = defineTool({
    name: 'get_user_profile',
    displayName: 'Get User Profile',
    description: 'Get a DEV.to user profile — name, bio, location, website, join date.',
    icon: 'user',
    group: 'Discovery',
    input: z.object({
        username: z.string().min(1).describe('DEV.to username to look up'),
    }),
    output: z.object({
        id: z.number(),
        username: z.string(),
        name: z.string(),
        summary: z.string().optional(),
        location: z.string().optional(),
        websiteUrl: z.string().optional(),
        joinedAt: z.string().optional(),
        profileImage: z.string().optional(),
    }),
    async handle(params) {
        log.info('Getting DEV.to user profile', { username: params.username });
        const user = await fetchUser(params.username);
        return {
            id: user.id,
            username: user.username,
            name: user.name,
            summary: user.summary,
            location: user.location,
            websiteUrl: user.website_url,
            joinedAt: user.joined_at,
            profileImage: user.profile_image,
        };
    },
});
//# sourceMappingURL=get-user-profile.js.map