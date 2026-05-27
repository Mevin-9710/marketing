import { ToolError } from '@opentabs-dev/plugin-sdk';
export function isLoggedIn() {
    const loginBtn = document.querySelector('a[href*="login"]');
    if (loginBtn)
        return false;
    const userMenu = document.querySelector('[data-testid="user-menu"], .user-avatar, a[href*="/profile"], button:has(svg.bell), [class*="avatar"]');
    if (userMenu)
        return true;
    return false;
}
export async function fetchPosts(limit = 20) {
    const response = await fetch(`https://www.uneed.best/api/posts?limit=${limit}`, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Failed to fetch posts: ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=uneed-api.js.map