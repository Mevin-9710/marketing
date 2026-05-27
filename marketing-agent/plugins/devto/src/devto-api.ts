import {
  postJSON,
  getPageGlobal,
  getCurrentUrl,
  getTextContent,
  log,
  ToolError,
} from '@opentabs-dev/plugin-sdk';

export interface DEVArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  slug: string;
  readable_publish_date?: string;
  tag_list: string[];
  comments_count: number;
  public_reactions_count: number;
  reading_time_minutes?: number;
  cover_image?: string;
  user: {
    name: string;
    username: string;
    profile_image?: string;
  };
}

export interface DEVComment {
  id: number;
  body_html: string;
  created_at: string;
  user: {
    name: string;
    username: string;
    profile_image?: string;
  };
  children: DEVComment[];
}

export interface DEVUser {
  id: number;
  username: string;
  name: string;
  summary?: string;
  profile_image?: string;
  joined_at?: string;
  location?: string;
  website_url?: string;
}

const API_BASE = 'https://dev.to/api';

export function isLoggedIn(): boolean {
  const loginBtn = document.querySelector('a[href*="enter"], a[data-testid="login-link"]');
  if (loginBtn) return false;

  const userMenu = document.querySelector('[data-testid="profile-dropdown"], .top-bar__menu-avatar, a[href*="/settings"]');
  if (userMenu) return true;

  return false;
}

export async function fetchArticles(params: {
  tag?: string;
  top?: number;
  state?: string;
  per_page?: number;
  page?: number;
} = {}): Promise<DEVArticle[]> {
  const searchParams = new URLSearchParams();
  if (params.tag) searchParams.set('tag', params.tag);
  if (params.top) searchParams.set('top', String(params.top));
  if (params.state) searchParams.set('state', params.state);
  searchParams.set('per_page', String(params.per_page || 20));
  searchParams.set('page', String(params.page || 1));

  const url = `${API_BASE}/articles?${searchParams}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw ToolError.internal(`Failed to fetch articles: ${response.status}`);
  }
  return response.json() as Promise<DEVArticle[]>;
}

export async function fetchArticle(idOrSlug: string): Promise<DEVArticle & { body_html?: string; body_markdown?: string }> {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const url = isNumeric ? `${API_BASE}/articles/${idOrSlug}` : `${API_BASE}/articles/by_slug?slug=${idOrSlug}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw ToolError.internal(`Failed to fetch article: ${response.status}`);
  }
  return response.json() as Promise<DEVArticle & { body_html?: string; body_markdown?: string }>;
}

export async function fetchArticleComments(idOrSlug: string): Promise<DEVComment[]> {
  const url = `${API_BASE}/comments?a_id=${idOrSlug}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw ToolError.internal(`Failed to fetch comments: ${response.status}`);
  }
  return response.json() as Promise<DEVComment[]>;
}

export async function searchArticles(query: string, perPage = 20): Promise<DEVArticle[]> {
  const url = `${API_BASE}/articles?per_page=${perPage}&tag=${encodeURIComponent(query)}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw ToolError.internal(`Search failed: ${response.status}`);
  }
  return response.json() as Promise<DEVArticle[]>;
}

export async function fetchUser(username: string): Promise<DEVUser> {
  const url = `${API_BASE}/users/by_username?url=${encodeURIComponent(username)}`;
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw ToolError.internal(`Failed to fetch user: ${response.status}`);
  }
  return response.json() as Promise<DEVUser>;
}
