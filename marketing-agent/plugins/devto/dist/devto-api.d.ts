export interface DEVArticle {
    id: number;
    title: string;
    description: string;
    url: string;
    slug: string;
    readable_publish_date?: string;
    tag_list: string[];
    comments_count: number;
    public_reactions_count: number;
    reading_time_minutes?: number;
    cover_image?: string;
    user: {
        name: string;
        username: string;
        profile_image?: string;
    };
}
export interface DEVComment {
    id: number;
    body_html: string;
    created_at: string;
    user: {
        name: string;
        username: string;
        profile_image?: string;
    };
    children: DEVComment[];
}
export interface DEVUser {
    id: number;
    username: string;
    name: string;
    summary?: string;
    profile_image?: string;
    joined_at?: string;
    location?: string;
    website_url?: string;
}
export declare function isLoggedIn(): boolean;
export declare function fetchArticles(params?: {
    tag?: string;
    top?: number;
    state?: string;
    per_page?: number;
    page?: number;
}): Promise<DEVArticle[]>;
export declare function fetchArticle(idOrSlug: string): Promise<DEVArticle & {
    body_html?: string;
    body_markdown?: string;
}>;
export declare function fetchArticleComments(idOrSlug: string): Promise<DEVComment[]>;
export declare function searchArticles(query: string, perPage?: number): Promise<DEVArticle[]>;
export declare function fetchUser(username: string): Promise<DEVUser>;
//# sourceMappingURL=devto-api.d.ts.map