import { postJSON, getPageGlobal, getCurrentUrl, getTextContent, log, ToolError, } from '@opentabs-dev/plugin-sdk';
export const API_ROUTES = {
    GRAPHQL: '/graphql/gql_',
    SEARCH: '/search',
    MAIN_FEED: '/webnode2/server/MainFeedList',
    QUESTION_FEED: '/webnode2/server/QuestionMainFeedList',
    ANSWER_CREATION: '/answer/logged_in_answer_creation',
    UPVOTE: '/upvote',
    DOWNVOTE: '/downvote',
    FOLLOW_QUESTION: '/question/follow',
    UNFOLLOW_QUESTION: '/question/unfollow',
    FOLLOW_TOPIC: '/topic/follow',
    UNFOLLOW_TOPIC: '/topic/unfollow',
    FOLLOW_USER: '/user/follow',
    UNFOLLOW_USER: '/user/unfollow',
    COMMENT: '/answer/comment',
    BOOKMARK: '/bookmark',
    REMOVE_BOOKMARK: '/remove_bookmark',
    SHARE: '/share',
    REQUEST_ANSWER: '/answer/request',
    NOTIFICATIONS: '/notifications',
    RELATED_QUESTIONS: '/related_questions',
    CREATE_QUESTION: '/question/create',
    EDIT_ANSWER: '/answer/edit',
    TOPIC_LIST: '/topics',
    USER_ANSWERS: '/user/answers',
    USER_QUESTIONS: '/user/questions',
};
async function fetchGraphQL(operationName, variables, extensions) {
    const body = {
        operationName,
        variables,
        query: '',
    };
    if (extensions) {
        body.extensions = extensions;
    }
    const result = await postJSON(`${API_ROUTES.GRAPHQL}${operationName}`, body, { headers: { 'Content-Type': 'application/json' } });
    if (!result) {
        throw ToolError.internal('GraphQL returned no response');
    }
    if (result.errors) {
        log.warn('GraphQL errors', { errors: result.errors });
    }
    return result.data;
}
export function extractQuestionDataFromPage() {
    try {
        const apolloState = getPageGlobal('__APOLLO_STATE__');
        if (apolloState) {
            for (const key of Object.keys(apolloState)) {
                const entry = apolloState[key] || {};
                if (entry.__typename === 'Question' && entry.id) {
                    return {
                        id: String(entry.id),
                        title: String(entry.title || ''),
                        url: String(entry.url || getCurrentUrl()),
                        answerCount: entry.answerCount,
                        followerCount: entry.followerCount,
                    };
                }
            }
        }
    }
    catch {
        log.debug('Could not extract question data from Apollo state');
    }
    const title = getTextContent('h1.q-text') || getTextContent('.puppeteer_test_question_title') || getTextContent('title');
    if (title) {
        return {
            id: getCurrentUrl().match(/\/questions\/(\d+)/)?.[1] || '',
            title: title.replace(' - Quora', ''),
            url: getCurrentUrl(),
        };
    }
    return null;
}
export function extractAnswersFromPage() {
    const answers = [];
    try {
        const apolloState = getPageGlobal('__APOLLO_STATE__');
        if (apolloState) {
            const answerMap = new Map();
            for (const key of Object.keys(apolloState)) {
                const entry = apolloState[key] || {};
                if (entry.__typename === 'Answer' || entry.__typename === 'AnswerWithDraft') {
                    answerMap.set(key, entry);
                }
            }
            for (const [, entry] of answerMap) {
                let authorName = '';
                let content = '';
                const authorRef = entry.author;
                if (authorRef?.__ref) {
                    const authorKey = String(authorRef.__ref);
                    const authorData = apolloState[authorKey];
                    if (authorData) {
                        authorName = String(authorData.name || authorData.displayName || '');
                    }
                }
                content = String(entry.content || entry.text || entry.answer || '');
                answers.push({
                    id: String(entry.id || ''),
                    author: authorName,
                    content: content.substring(0, 500),
                    upvoteCount: Number(entry.upvoteCount || entry.votes || 0),
                    timestamp: entry.creationTime ? String(entry.creationTime) : undefined,
                });
            }
        }
    }
    catch {
        log.debug('Could not extract answers from Apollo state');
    }
    if (answers.length === 0) {
        const answerElements = document.querySelectorAll('.puppeteer_test_answer_content, div[data-testid="answer_content"], .q-text.puppeteer_test_qtext');
        answerElements.forEach((el, i) => {
            answers.push({
                id: `answer-${i + 1}`,
                author: '',
                content: (el.textContent || '').substring(0, 500),
                upvoteCount: 0,
            });
        });
    }
    return answers;
}
export function extractFeedFromPage() {
    const items = [];
    try {
        const apolloState = getPageGlobal('__APOLLO_STATE__');
        if (apolloState) {
            const rootKey = Object.keys(apolloState).find(k => {
                const entry = apolloState[k];
                return entry?.__typename === 'MainFeed' || entry?.__typename === 'FeedConnection';
            });
            if (rootKey) {
                const feed = apolloState[rootKey];
                const edges = feed?.edges;
                if (edges) {
                    for (const edge of edges) {
                        const node = edge.node;
                        if (!node)
                            continue;
                        const typename = String(node.__typename || '');
                        if (typename === 'FeedStory' || typename === 'Story') {
                            const story = node;
                            const actors = story.actors;
                            const questionsData = story.questionsData;
                            const question = questionsData?.[0];
                            items.push({
                                id: String(story.id || ''),
                                type: 'question',
                                title: String(question?.title || ''),
                                preview: String(story.summary?.text || ''),
                                url: question?.url ? String(question.url) : undefined,
                                author: actors?.[0] ? String(actors[0].name || '') : undefined,
                            });
                        }
                        else if (typename === 'Question') {
                            items.push({
                                id: String(node.id || ''),
                                type: 'question',
                                title: String(node.title || ''),
                                url: node.url ? String(node.url) : undefined,
                                answerCount: node.answerCount,
                            });
                        }
                    }
                }
            }
        }
    }
    catch {
        log.debug('Could not extract feed from Apollo state');
    }
    if (items.length === 0) {
        const feedCards = document.querySelectorAll('.q-box.qu-borderAll, div[data-testid="feed_card"]');
        feedCards.forEach((card, i) => {
            const titleEl = card.querySelector('.q-text');
            items.push({
                id: `feed-${i + 1}`,
                type: 'unknown',
                title: titleEl?.textContent || undefined,
                preview: card.textContent?.substring(0, 200) || undefined,
            });
        });
    }
    return items;
}
export function extractCurrentUser() {
    try {
        const apolloState = getPageGlobal('__APOLLO_STATE__');
        if (apolloState) {
            const viewerKey = Object.keys(apolloState).find(k => {
                const entry = apolloState[k];
                return entry?.__typename === 'Viewer' || entry?.__typename === 'User';
            });
            if (viewerKey) {
                const viewer = apolloState[viewerKey];
                return String(viewer?.id || '');
            }
        }
    }
    catch {
        log.debug('Could not extract current user');
    }
    return null;
}
export function isLoggedIn() {
    // Check for user profile elements (multiple selectors for robustness)
    const hasUserMenu = document.querySelector('[data-testid="header_profile"], .q-image.QuoraIcon, .sessionless, .header_profile_icon, img[class*="profile_photo"], [class*="NavProfile"]');
    if (hasUserMenu)
        return true;
    // Check for visible login/signup buttons (must be visible, not just in DOM)
    const loginBtn = document.querySelector('a[href*="login"][class*="Button"], button[class*="login"], [data-testid="login-button"]');
    if (loginBtn && loginBtn.offsetParent !== null)
        return false;
    // Check Apollo state for viewer
    const apolloState = getPageGlobal('__APOLLO_STATE__');
    if (apolloState) {
        for (const key of Object.keys(apolloState)) {
            const entry = apolloState[key];
            if (entry?.__typename === 'Viewer' && entry.id)
                return true;
        }
    }
    // If no login button found and no explicit indicators, assume logged in
    // (Quora redirects to login page if not logged in, so being on the site = likely logged in)
    const url = getCurrentUrl();
    if (url.includes('quora.com') && !url.includes('/login') && !url.includes('/signup')) {
        return true;
    }
    return false;
}
//# sourceMappingURL=quora-api.js.map