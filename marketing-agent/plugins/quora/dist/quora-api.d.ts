export declare const API_ROUTES: {
    readonly GRAPHQL: "/graphql/gql_";
    readonly SEARCH: "/search";
    readonly MAIN_FEED: "/webnode2/server/MainFeedList";
    readonly QUESTION_FEED: "/webnode2/server/QuestionMainFeedList";
    readonly ANSWER_CREATION: "/answer/logged_in_answer_creation";
    readonly UPVOTE: "/upvote";
    readonly DOWNVOTE: "/downvote";
    readonly FOLLOW_QUESTION: "/question/follow";
    readonly UNFOLLOW_QUESTION: "/question/unfollow";
    readonly FOLLOW_TOPIC: "/topic/follow";
    readonly UNFOLLOW_TOPIC: "/topic/unfollow";
    readonly FOLLOW_USER: "/user/follow";
    readonly UNFOLLOW_USER: "/user/unfollow";
    readonly COMMENT: "/answer/comment";
    readonly BOOKMARK: "/bookmark";
    readonly REMOVE_BOOKMARK: "/remove_bookmark";
    readonly SHARE: "/share";
    readonly REQUEST_ANSWER: "/answer/request";
    readonly NOTIFICATIONS: "/notifications";
    readonly RELATED_QUESTIONS: "/related_questions";
    readonly CREATE_QUESTION: "/question/create";
    readonly EDIT_ANSWER: "/answer/edit";
    readonly TOPIC_LIST: "/topics";
    readonly USER_ANSWERS: "/user/answers";
    readonly USER_QUESTIONS: "/user/questions";
};
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
export declare function extractQuestionDataFromPage(): QuestionSummary | null;
export declare function extractAnswersFromPage(): AnswerSummary[];
export declare function extractFeedFromPage(): QuoraFeedItem[];
export declare function extractCurrentUser(): string | null;
export declare function isLoggedIn(): boolean;
//# sourceMappingURL=quora-api.d.ts.map