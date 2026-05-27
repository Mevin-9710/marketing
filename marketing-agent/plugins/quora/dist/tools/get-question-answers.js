import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractAnswersFromPage, extractQuestionDataFromPage } from '../quora-api.js';
export const getQuestionAnswers = defineTool({
    name: 'get_question_answers',
    displayName: 'Get Question Answers',
    description: 'Get answers for a Quora question. Provide a question URL or the tool will read answers from the currently open question page. Returns answers with author, content preview, and upvote counts.',
    icon: 'messages-square',
    group: 'Reading',
    input: z.object({
        question_url: z.string().url().optional().describe('Full URL to the Quora question (e.g., https://www.quora.com/What-is-X). Leave empty to use the current page.'),
        limit: z.number().int().min(1).max(50).optional().describe('Maximum answers to return (default 10)'),
        sort: z.enum(['default', 'recent', 'upvotes']).optional().describe('Sort order for answers'),
    }),
    output: z.object({
        question: z.object({
            id: z.string(),
            title: z.string(),
            url: z.string(),
        }),
        answers: z.array(z.object({
            id: z.string(),
            author: z.string(),
            author_url: z.string().optional(),
            content: z.string(),
            upvote_count: z.number(),
            timestamp: z.string().optional(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        const targetUrl = params.question_url || window.location.href;
        log.info('Getting answers', { url: targetUrl });
        let questionInfo = null;
        let rawAnswers = [];
        if (params.question_url && !window.location.href.includes(params.question_url)) {
            const response = await fetch(targetUrl, { credentials: 'include' });
            if (!response.ok) {
                throw ToolError.internal(`Failed to load question page: ${response.status}`);
            }
            const html = await response.text();
            const apolloState = extractApolloFromHtml(html);
            if (apolloState) {
                for (const key of Object.keys(apolloState)) {
                    const entry = (apolloState[key] || {});
                    if (entry.__typename === 'Question' && entry.id && !questionInfo) {
                        questionInfo = {
                            id: String(entry.id),
                            title: String(entry.title || ''),
                            url: String(entry.url || targetUrl),
                        };
                    }
                    if (entry.__typename === 'Answer' || entry.__typename === 'AnswerWithDraft') {
                        let authorName = '';
                        const authorRef = entry.author;
                        if (authorRef?.__ref) {
                            const authorData = apolloState[authorRef.__ref];
                            if (authorData) {
                                authorName = String(authorData.name || authorData.displayName || '');
                            }
                        }
                        rawAnswers.push({
                            id: String(entry.id || ''),
                            author: authorName,
                            content: String((entry.content || entry.text || entry.answer || '')).substring(0, 500),
                            upvoteCount: Number((entry.upvoteCount || entry.votes || 0)),
                            timestamp: entry.creationTime ? String(entry.creationTime) : undefined,
                        });
                    }
                }
            }
        }
        else {
            questionInfo = extractQuestionDataFromPage();
            rawAnswers = extractAnswersFromPage();
        }
        if (!questionInfo || rawAnswers.length === 0) {
            throw ToolError.notFound('Could not find answers on this page. Navigate to a Quora question page first.');
        }
        const limit = params.limit ?? 10;
        const answers = rawAnswers.slice(0, limit).map(a => ({
            id: a.id,
            author: a.author,
            author_url: a.author ? `https://www.quora.com/profile/${a.author.replace(/\s+/g, '-')}` : undefined,
            content: a.content.substring(0, 1000),
            upvote_count: a.upvoteCount,
            timestamp: a.timestamp,
        }));
        log.debug('Answers extracted', { question: questionInfo.title, count: answers.length });
        return {
            question: {
                id: questionInfo.id,
                title: questionInfo.title,
                url: questionInfo.url,
            },
            answers,
            total: answers.length,
        };
    },
});
function extractApolloFromHtml(html) {
    const match = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});/);
    if (match) {
        try {
            return JSON.parse(match[1]);
        }
        catch { }
    }
    return null;
}
//# sourceMappingURL=get-question-answers.js.map