import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const getRelatedQuestions = defineTool({
    name: 'get_related_questions',
    displayName: 'Get Related Questions',
    description: 'Get related/suggested questions for the current question page. Useful for discovering related content.',
    icon: 'git-branch',
    group: 'Discovery',
    input: z.object({
        question_url: z.string().url().optional().describe('URL of the question. Leave empty to use current page.'),
        limit: z.number().int().min(1).max(30).optional().describe('Maximum related questions to return (default 10)'),
    }),
    output: z.object({
        questions: z.array(z.object({
            title: z.string(),
            url: z.string(),
        })),
        total: z.number(),
    }),
    async handle(params) {
        log.info('Getting related questions');
        let html = '';
        if (params.question_url && !window.location.href.includes(params.question_url)) {
            const response = await fetch(params.question_url, { credentials: 'include' });
            if (!response.ok) {
                throw ToolError.internal(`Failed to fetch question page: ${response.status}`);
            }
            html = await response.text();
        }
        const relatedLinks = html
            ? parseRelatedFromHtml(html)
            : extractRelatedFromDom();
        const limit = params.limit ?? 10;
        const finalQuestions = relatedLinks.slice(0, limit);
        if (finalQuestions.length === 0) {
            throw ToolError.notFound('No related questions found on this page');
        }
        log.debug('Related questions found', { count: finalQuestions.length });
        return { questions: finalQuestions, total: finalQuestions.length };
    },
});
function parseRelatedFromHtml(html) {
    const doc = document.createElement('div');
    doc.innerHTML = html;
    const seen = new Set();
    const questions = [];
    doc.querySelectorAll('a[href*="/question/"]').forEach(el => {
        const anchor = el;
        const href = anchor.href.includes('quora.com') ? anchor.href : `https://www.quora.com${anchor.getAttribute('href')}`;
        if (seen.has(href))
            return;
        seen.add(href);
        const title = anchor.textContent?.trim();
        if (title && title.length > 5 && !title.includes('quora.com')) {
            questions.push({ title, url: href });
        }
    });
    return questions;
}
function extractRelatedFromDom() {
    const relatedLinks = document.querySelectorAll('a[href*="/question/"][class*="related"], a[href*="/question/"]:not([class*="header"])');
    const seen = new Set();
    const questions = [];
    relatedLinks.forEach(el => {
        const anchor = el;
        const href = anchor.href;
        if (seen.has(href))
            return;
        seen.add(href);
        const title = anchor.textContent?.trim();
        if (title && title.length > 5) {
            questions.push({ title, url: href });
        }
    });
    return questions;
}
//# sourceMappingURL=get-related-questions.js.map