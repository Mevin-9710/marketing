import {
  postJSON,
  getPageGlobal,
  getCurrentUrl,
  getTextContent,
  log,
  ToolError,
  type FetchFromPageOptions,
} from '@opentabs-dev/plugin-sdk';

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
} as const;

export interface QuestionSummary {
  id: string;
  title: string;
  url: string;
  answerCount?: number;
  followerCount?: number;
  topic?: string;
}

export interface AnswerSummary {
  id: string;
  author: string;
  authorUrl?: string;
  content: string;
  upvoteCount: number;
  timestamp?: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  answerCount?: number;
  questionCount?: number;
  profileImageUrl?: string;
}

export interface QuoraFeedItem {
  id: string;
  type: 'question' | 'answer' | 'ad' | 'unknown';
  title?: string;
  preview?: string;
  url?: string;
  author?: string;
  answerCount?: number;
}

async function fetchGraphQL<T>(
  operationName: string,
  variables: Record<string, unknown>,
  extensions?: Record<string, unknown>,
): Promise<T> {
  const body = {
    operationName,
    variables,
    query: '',
  };
  if (extensions) {
    (body as Record<string, unknown>).extensions = extensions;
  }

  const result = await postJSON<{ data?: T; errors?: Array<{ message: string }> }>(
    `${API_ROUTES.GRAPHQL}${operationName}`,
    body,
    { headers: { 'Content-Type': 'application/json' } } as FetchFromPageOptions,
  );

  if (!result) {
    throw ToolError.internal('GraphQL returned no response');
  }

  if (result.errors) {
    log.warn('GraphQL errors', { errors: result.errors });
  }

  return result.data as T;
}

export function extractQuestionDataFromPage(): QuestionSummary | null {
  try {
    const apolloState = getPageGlobal('__APOLLO_STATE__') as Record<string, unknown> | undefined;
    if (apolloState) {
      for (const key of Object.keys(apolloState)) {
        const entry = (apolloState[key] as Record<string, unknown>) || {};
        if (entry.__typename === 'Question' && (entry as Record<string, unknown>).id) {
          return {
            id: String((entry as Record<string, unknown>).id),
            title: String((entry as Record<string, unknown>).title || ''),
            url: String((entry as Record<string, unknown>).url || getCurrentUrl()),
            answerCount: (entry as Record<string, unknown>).answerCount as number | undefined,
            followerCount: (entry as Record<string, unknown>).followerCount as number | undefined,
          };
        }
      }
    }
  } catch {
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

export function extractAnswersFromPage(): AnswerSummary[] {
  const answers: AnswerSummary[] = [];

  try {
    const apolloState = getPageGlobal('__APOLLO_STATE__') as Record<string, unknown> | undefined;
    if (apolloState) {
      const answerMap = new Map<string, Record<string, unknown>>();
      for (const key of Object.keys(apolloState)) {
        const entry = (apolloState[key] as Record<string, unknown>) || {};
        if (entry.__typename === 'Answer' || entry.__typename === 'AnswerWithDraft') {
          answerMap.set(key, entry);
        }
      }

      for (const [, entry] of answerMap) {
        let authorName = '';
        let content = '';
        const authorRef = entry.author as Record<string, unknown> | undefined;
        if (authorRef?.__ref) {
          const authorKey = String(authorRef.__ref);
          const authorData = apolloState[authorKey] as Record<string, unknown> | undefined;
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
  } catch {
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

export function extractFeedFromPage(): QuoraFeedItem[] {
  const items: QuoraFeedItem[] = [];

  try {
    const apolloState = getPageGlobal('__APOLLO_STATE__') as Record<string, unknown> | undefined;
    if (apolloState) {
      const rootKey = Object.keys(apolloState).find(k => {
        const entry = apolloState[k] as Record<string, unknown> | undefined;
        return entry?.__typename === 'MainFeed' || entry?.__typename === 'FeedConnection';
      });
      if (rootKey) {
        const feed = apolloState[rootKey] as Record<string, unknown> | undefined;
        const edges = feed?.edges as Array<Record<string, unknown>> | undefined;
        if (edges) {
          for (const edge of edges) {
            const node = edge.node as Record<string, unknown> | undefined;
            if (!node) continue;
            const typename = String(node.__typename || '');
            if (typename === 'FeedStory' || typename === 'Story') {
              const story = node;
              const actors = story.actors as Array<Record<string, unknown>> | undefined;
              const questionsData = story.questionsData as Array<Record<string, unknown>> | undefined;
              const question = questionsData?.[0] as Record<string, unknown> | undefined;
              items.push({
                id: String(story.id || ''),
                type: 'question',
                title: String(question?.title || ''),
                preview: String((story.summary as Record<string, unknown>)?.text || ''),
                url: question?.url ? String(question.url) : undefined,
                author: actors?.[0] ? String(actors[0].name || '') : undefined,
              });
            } else if (typename === 'Question') {
              items.push({
                id: String(node.id || ''),
                type: 'question',
                title: String(node.title || ''),
                url: node.url ? String(node.url) : undefined,
                answerCount: node.answerCount as number,
              });
            }
          }
        }
      }
    }
  } catch {
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

export function extractCurrentUser(): string | null {
  try {
    const apolloState = getPageGlobal('__APOLLO_STATE__') as Record<string, unknown> | undefined;
    if (apolloState) {
      const viewerKey = Object.keys(apolloState).find(k => {
        const entry = apolloState[k] as Record<string, unknown> | undefined;
        return entry?.__typename === 'Viewer' || entry?.__typename === 'User';
      });
      if (viewerKey) {
        const viewer = apolloState[viewerKey] as Record<string, unknown> | undefined;
        return String(viewer?.id || '');
      }
    }
  } catch {
    log.debug('Could not extract current user');
  }
  return null;
}

export function isLoggedIn(): boolean {
  // Check for user profile elements (multiple selectors for robustness)
  const hasUserMenu = document.querySelector(
    '[data-testid="header_profile"], .q-image.QuoraIcon, .sessionless, .header_profile_icon, img[class*="profile_photo"], [class*="NavProfile"]'
  );
  if (hasUserMenu) return true;

  // Check for visible login/signup buttons (must be visible, not just in DOM)
  const loginBtn = document.querySelector(
    'a[href*="login"][class*="Button"], button[class*="login"], [data-testid="login-button"]'
  );
  if (loginBtn && (loginBtn as HTMLElement).offsetParent !== null) return false;

  // Check Apollo state for viewer
  const apolloState = getPageGlobal('__APOLLO_STATE__') as Record<string, unknown> | undefined;
  if (apolloState) {
    for (const key of Object.keys(apolloState)) {
      const entry = apolloState[key] as Record<string, unknown> | undefined;
      if (entry?.__typename === 'Viewer' && entry.id) return true;
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
