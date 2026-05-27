import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
import { isLoggedIn } from './devto-api.js';

import { getFeed } from './tools/get-feed.js';
import { searchArticles } from './tools/search-articles.js';
import { getArticle } from './tools/get-article.js';
import { createArticle } from './tools/create-article.js';
import { postComment } from './tools/post-comment.js';
import { bookmarkArticle } from './tools/bookmark-article.js';
import { followUser } from './tools/follow-user.js';
import { getUserProfile } from './tools/get-user-profile.js';
import { likeArticle } from './tools/like-article.js';

class DevtoPlugin extends OpenTabsPlugin {
  readonly name = 'devto';
  readonly description = 'DEV.to community interaction — browse articles, search by tag, write posts, comment, bookmark, follow users';
  override readonly displayName = 'DEV.to';
  readonly urlPatterns = ['*://*.dev.to/*'];
  readonly tools: ToolDefinition[] = [
    getFeed,
    searchArticles,
    getArticle,
    createArticle,
    postComment,
    bookmarkArticle,
    followUser,
    getUserProfile,
    likeArticle,
  ];

  async isReady(): Promise<boolean> {
    const loggedIn = isLoggedIn();
    log.debug('DEV.to isReady check', { loggedIn });
    return loggedIn;
  }
}

export default new DevtoPlugin();
