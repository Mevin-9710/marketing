import { OpenTabsPlugin, log } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
import { isLoggedIn } from './quora-api.js';

import { searchQuestions } from './tools/search-questions.js';
import { getFeed } from './tools/get-feed.js';
import { getQuestionAnswers } from './tools/get-question-answers.js';
import { getQuestionDetails } from './tools/get-question-details.js';
import { postAnswer } from './tools/post-answer.js';
import { editAnswer } from './tools/edit-answer.js';
import { upvoteContent } from './tools/upvote-content.js';
import { followQuestion } from './tools/follow-question.js';
import { followTopic } from './tools/follow-topic.js';
import { followUser } from './tools/follow-user.js';
import { getUserProfile } from './tools/get-user-profile.js';
import { commentOnAnswer } from './tools/comment-on-answer.js';
import { bookmarkContent } from './tools/bookmark-content.js';
import { shareContent } from './tools/share-content.js';
import { requestAnswer } from './tools/request-answer.js';
import { getRelatedQuestions } from './tools/get-related-questions.js';
import { getTopics } from './tools/get-topics.js';
import { getNotifications } from './tools/get-notifications.js';
import { getUserContent } from './tools/get-user-content.js';
import { createQuestion } from './tools/create-question.js';

class QuoraPlugin extends OpenTabsPlugin {
  readonly name = 'quora';
  readonly description = 'Full Quora interaction through the browser — search questions, read/write answers, upvote, follow, comment, bookmark, and more';
  override readonly displayName = 'Quora';
  readonly urlPatterns = ['*://*.quora.com/*'];
  readonly tools: ToolDefinition[] = [
    searchQuestions,
    getFeed,
    getQuestionDetails,
    getQuestionAnswers,
    postAnswer,
    editAnswer,
    upvoteContent,
    followQuestion,
    followTopic,
    followUser,
    getUserProfile,
    commentOnAnswer,
    bookmarkContent,
    shareContent,
    requestAnswer,
    getRelatedQuestions,
    getTopics,
    getNotifications,
    getUserContent,
    createQuestion,
  ];

  async isReady(): Promise<boolean> {
    const loggedIn = isLoggedIn();
    log.debug('Quora isReady check', { loggedIn });
    return loggedIn;
  }
}

export default new QuoraPlugin();
