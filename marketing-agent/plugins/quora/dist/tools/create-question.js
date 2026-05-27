import { defineTool, postJSON, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const createQuestion = defineTool({
    name: 'create_question',
    displayName: 'Create Question',
    description: 'Ask a new question on Quora. Provide a title and optional details/topics.',
    icon: 'help-circle',
    group: 'Writing',
    input: z.object({
        title: z.string().min(5).max(200).describe('Question title — should be a clear, specific question'),
        details: z.string().max(5000).optional().describe('Additional details or context for the question'),
        topics: z.array(z.string()).max(5).optional().describe('Topic names to add (e.g., ["Artificial-Intelligence", "Machine-Learning"])'),
        is_anonymous: z.boolean().optional().describe('Ask anonymously (default: false)'),
    }),
    output: z.object({
        success: z.boolean(),
        question_url: z.string().optional().describe('URL of the created question'),
        message: z.string(),
    }),
    async handle(params) {
        log.info('Creating question', { title: params.title });
        const addQuestionBtn = (document.querySelector('[data-testid="add_question_button"], a[href*="/add"]')
            || Array.from(document.querySelectorAll('button')).find(b => /add.?question/i.test(b.textContent || '')));
        if (addQuestionBtn) {
            addQuestionBtn.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const titleInput = document.querySelector('[data-testid="question_title_input"], input[placeholder*="question" i], textarea[placeholder*="question" i]');
            if (titleInput) {
                titleInput.value = params.title;
                titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            if (params.details) {
                const detailsInput = document.querySelector('[contenteditable="true"], [data-testid="question_details_input"], textarea');
                if (detailsInput) {
                    if (detailsInput instanceof HTMLTextAreaElement) {
                        detailsInput.value = params.details;
                    }
                    else {
                        detailsInput.innerHTML = params.details.replace(/\n/g, '<br>');
                    }
                    detailsInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            const submitBtn = (Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit' || /add.?question|post|ask/i.test(b.textContent || '')));
            if (submitBtn) {
                submitBtn.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
                return {
                    success: true,
                    question_url: window.location.href,
                    message: 'Question created successfully',
                };
            }
        }
        const result = await postJSON('/question/create', {
            title: params.title,
            details: params.details || '',
            topics: params.topics || [],
            anonymous: params.is_anonymous ?? false,
        });
        if (!result) {
            throw ToolError.internal('Failed to create question');
        }
        log.info('Question created', { id: result.id });
        return {
            success: true,
            question_url: result.url || `https://www.quora.com/${result.id}`,
            message: 'Question created successfully',
        };
    },
});
//# sourceMappingURL=create-question.js.map