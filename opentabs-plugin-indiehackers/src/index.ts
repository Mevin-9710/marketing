import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
import { isLoggedIn } from './indiehackers-api.js';

import { getFeed } from './tools/get-feed.js';
import { searchPosts } from './tools/search-posts.js';
import { getPost } from './tools/get-post.js';
import { createPost } from './tools/create-post.js';
import { postComment } from './tools/post-comment.js';
import { upvotePost } from './tools/upvote-post.js';
import { getProduct } from './tools/get-product.js';
import { getUserProfile } from './tools/get-user-profile.js';

class IndieHackersPlugin extends OpenTabsPlugin {
  readonly name = 'indiehackers';
  readonly description = 'IndieHackers community interaction — browse feed, post, comment, upvote, view products and profiles';
  override readonly displayName = 'IndieHackers';
  readonly urlPatterns = ['*://*.indiehackers.com/*'];
  readonly tools: ToolDefinition[] = [
    getFeed,
    searchPosts,
    getPost,
    createPost,
    postComment,
    upvotePost,
    getProduct,
    getUserProfile,
  ];

  async isReady(): Promise<boolean> {
    const loggedIn = isLoggedIn();
    log.debug('IndieHackers isReady check', { loggedIn });
    return loggedIn;
  }
}

export default new IndieHackersPlugin();
