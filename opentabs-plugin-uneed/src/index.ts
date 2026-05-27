import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
import { isLoggedIn } from './uneed-api.js';

import { getFeed } from './tools/get-feed.js';
import { searchTools } from './tools/search-tools.js';
import { getTool } from './tools/get-tool.js';
import { upvoteTool } from './tools/upvote-tool.js';
import { postCommentTool } from './tools/post-comment.js';
import { getCollections } from './tools/get-collections.js';
import { getUserProfile } from './tools/get-user-profile.js';

class UneedPlugin extends OpenTabsPlugin {
  readonly name = 'uneed';
  readonly description = 'Uneed community interaction — browse the community feed, post, comment, like, view tool profiles and collections';
  override readonly displayName = 'Uneed';
  readonly urlPatterns = ['*://*.uneed.best/*'];
  readonly tools: ToolDefinition[] = [
    getFeed,
    searchTools,
    getTool,
    upvoteTool,
    postCommentTool,
    getCollections,
    getUserProfile,
  ];

  async isReady(): Promise<boolean> {
    const loggedIn = isLoggedIn();
    log.debug('Uneed isReady check', { loggedIn });
    return loggedIn;
  }
}

export default new UneedPlugin();
