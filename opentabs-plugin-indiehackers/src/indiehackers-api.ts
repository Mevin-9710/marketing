import {
  getPageGlobal,
  getCurrentUrl,
  log,
  ToolError,
} from '@opentabs-dev/plugin-sdk';

export interface IHPost {
  id: string;
  title: string;
  body: string;
  author: string;
  authorUrl?: string;
  upvoteCount: number;
  commentCount: number;
  url: string;
  type: 'post' | 'milestone' | 'question' | 'link';
}

export interface IHComment {
  id: string;
  body: string;
  author: string;
}

export interface IHUser {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  postCount?: number;
  products?: Array<{ name: string; url: string }>;
}

export function isLoggedIn(): boolean {
  const headerAvatar = document.querySelector('.site-header__user-link, .site-header__right .user-avatar, .site-header__right picture.user-avatar');
  if (headerAvatar) return true;

  const userMenu = document.querySelector('.user-menu, a[href*="/settings"], a[href*="/history"], a[href*="/bookmarks"], a[href*="/notifications"]');
  if (userMenu) return true;

  const userAvatar = document.querySelector('.user-avatar img, img[class*="avatar"], .header__avatar');
  if (userAvatar) return true;

  const userPageLink = document.querySelector('a[href*="/me"], [class*="user-menu"], .ember-view.header__user');
  if (userPageLink) return true;

  return false;
}

export function extractPostsFromPage(): IHPost[] {
  const posts: IHPost[] = [];
  const postCards = document.querySelectorAll('.story.homepage-post, div.story.homepage-post, .story[class*="ember-view"]');

  postCards.forEach((card, i) => {
    const titleEl = card.querySelector('h3.story__title');
    const linkEl = card.querySelector('a.story__text-link') as HTMLAnchorElement | null;

    const upvoteEl = card.querySelector('.story__count--likes .story__count-number');
    const commentEl = card.querySelector('.story__count--comments .story__count-number');

    const href = linkEl?.href || linkEl?.getAttribute('href') || '';
    const id = href.match(/\/post\/([^?/]+)/)?.[1] || href.match(/post=([^&]+)/)?.[1] || `post-${i + 1}`;

    const title = titleEl?.textContent?.trim() || linkEl?.textContent?.trim() || '';

    let type: IHPost['type'] = 'post';
    if (href.includes('/product/')) type = 'link';
    if (href.includes('/milestone')) type = 'milestone';
    if (href.includes('/question')) type = 'question';

    posts.push({
      id,
      title,
      body: '',
      author: card.querySelector('.user-link__name--username')?.textContent?.trim() || '',
      upvoteCount: parseInt(upvoteEl?.textContent?.trim() || '0', 10) || 0,
      commentCount: parseInt(commentEl?.textContent?.trim() || '0', 10) || 0,
      url: href.startsWith('http') ? href : (href.startsWith('/') ? `https://www.indiehackers.com${href}` : href),
      type,
    });
  });

  return posts;
}
