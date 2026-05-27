import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
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
    name = 'devto';
    description = 'DEV.to community interaction — browse articles, search by tag, write posts, comment, bookmark, follow users';
    displayName = 'DEV.to';
    urlPatterns = ['*://*.dev.to/*'];
    tools = [
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
    async isReady() {
        const loggedIn = isLoggedIn();
        log.debug('DEV.to isReady check', { loggedIn });
        return loggedIn;
    }
}
export default new DevtoPlugin();
//# sourceMappingURL=index.js.map