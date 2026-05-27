import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
import { isLoggedIn } from './uneed-api.js';
import { getFeed } from './tools/get-feed.js';
import { searchTools } from './tools/search-tools.js';
import { getTool } from './tools/get-tool.js';
import { upvoteTool } from './tools/upvote-tool.js';
import { postCommentTool } from './tools/post-comment.js';
import { getCollections } from './tools/get-collections.js';
import { getUserProfile } from './tools/get-user-profile.js';
class UneedPlugin extends OpenTabsPlugin {
    name = 'uneed';
    description = 'Uneed community interaction — browse the community feed, post, comment, like, view tool profiles and collections';
    displayName = 'Uneed';
    urlPatterns = ['*://*.uneed.best/*'];
    tools = [
        getFeed,
        searchTools,
        getTool,
        upvoteTool,
        postCommentTool,
        getCollections,
        getUserProfile,
    ];
    async isReady() {
        const loggedIn = isLoggedIn();
        log.debug('Uneed isReady check', { loggedIn });
        return loggedIn;
    }
}
export default new UneedPlugin();
//# sourceMappingURL=index.js.map