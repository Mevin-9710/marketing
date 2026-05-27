import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getUserProfile = defineTool({
  name: 'get_user_profile',
  displayName: 'Get User Profile',
  description: 'Get an IndieHackers user profile — bio, follower count, products, and recent posts.',
  icon: 'user',
  group: 'Discovery',
  input: z.object({
    username: z.string().optional().describe('Username to look up. Leave empty if already on their profile page.'),
  }),
  output: z.object({
    username: z.string(),
    displayName: z.string().optional(),
    bio: z.string().optional(),
    followerCount: z.number().optional(),
    followingCount: z.number().optional(),
    products: z.array(z.object({
      name: z.string(),
      url: z.string().optional(),
    })).optional(),
  }),
  async handle(params) {
    if (params.username) {
      const profileUrl = `https://www.indiehackers.com/${params.username}`;
      if (!window.location.href.includes(params.username)) {
        const response = await fetch(profileUrl, { credentials: 'include' });
        if (!response.ok) {
          throw ToolError.internal(`Failed to load profile: ${response.status}`);
        }
        const html = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = html;
        document.body.innerHTML = doc.innerHTML;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const displayName = document.querySelector('[class*="profile-name"], h1, [class*="display-name"]')?.textContent?.trim() || '';
    const bio = document.querySelector('[class*="user-bio"], [class*="bio"], [class*="about"]')?.textContent?.trim();
    const followerText = document.querySelector('[class*="followers"]')?.textContent?.trim();
    const followerCount = followerText ? parseInt(followerText.replace(/\D/g, ''), 10) : undefined;

    const productEls = document.querySelectorAll('[class*="product-card"], [class*="product-item"]');
    const products = Array.from(productEls).map(el => ({
      name: el.querySelector('[class*="name"], h3, h2')?.textContent?.trim() || '',
      url: (el.querySelector('a') as HTMLAnchorElement)?.href,
    })).filter(p => p.name);

    const username = params.username || window.location.pathname.replace(/^\//, '').split('/')[0] || '';

    log.info('Got user profile', { username });
    return { username, displayName, bio, followerCount, products };
  },
});
