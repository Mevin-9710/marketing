import { ToolError, } from '@opentabs-dev/plugin-sdk';
const API_BASE = 'https://dev.to/api';
export function isLoggedIn() {
    const loginBtn = document.querySelector('a[href*="enter"], a[data-testid="login-link"]');
    if (loginBtn)
        return false;
    const userMenu = document.querySelector('[data-testid="profile-dropdown"], .top-bar__menu-avatar, a[href*="/settings"]');
    if (userMenu)
        return true;
    return false;
}
export async function fetchArticles(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.tag)
        searchParams.set('tag', params.tag);
    if (params.top)
        searchParams.set('top', String(params.top));
    if (params.state)
        searchParams.set('state', params.state);
    searchParams.set('per_page', String(params.per_page || 20));
    searchParams.set('page', String(params.page || 1));
    const url = `${API_BASE}/articles?${searchParams}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Failed to fetch articles: ${response.status}`);
    }
    return response.json();
}
export async function fetchArticle(idOrSlug) {
    const isNumeric = /^\d+$/.test(idOrSlug);
    const url = isNumeric ? `${API_BASE}/articles/${idOrSlug}` : `${API_BASE}/articles/by_slug?slug=${idOrSlug}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Failed to fetch article: ${response.status}`);
    }
    return response.json();
}
export async function fetchArticleComments(idOrSlug) {
    const url = `${API_BASE}/comments?a_id=${idOrSlug}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Failed to fetch comments: ${response.status}`);
    }
    return response.json();
}
export async function searchArticles(query, perPage = 20) {
    const url = `${API_BASE}/articles?per_page=${perPage}&tag=${encodeURIComponent(query)}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Search failed: ${response.status}`);
    }
    return response.json();
}
export async function fetchUser(username) {
    const url = `${API_BASE}/users/by_username?url=${encodeURIComponent(username)}`;
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) {
        throw ToolError.internal(`Failed to fetch user: ${response.status}`);
    }
    return response.json();
}
//# sourceMappingURL=devto-api.js.map