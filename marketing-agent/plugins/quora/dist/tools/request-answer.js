import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const requestAnswer = defineTool({
    name: 'request_answer',
    displayName: 'Request Answer',
    description: 'Request an answer to a Quora question from specific users. Navigate to the question page first.',
    icon: 'mail',
    group: 'Interaction',
    input: z.object({
        question_url: z.string().url().optional().describe('URL of the question. Leave empty to use current page.'),
        user_identifier: z.string().min(1).describe('Username or profile URL of the person to request an answer from'),
        message: z.string().max(500).optional().describe('Optional personal message to include with the request'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info('Requesting answer', { user: params.user_identifier });
        if (params.question_url && !window.location.href.includes(params.question_url)) {
            return { success: false, message: `Navigate to ${params.question_url} in your browser first, then call request_answer without the question_url parameter.` };
        }
        const requestBtn = (Array.from(document.querySelectorAll('button')).find(b => /request/i.test(b.textContent || '')) || document.querySelector('[data-testid="request_answer_button"]'));
        if (!requestBtn) {
            return { success: false, message: 'Could not find request answer button. Navigate to a question page first.' };
        }
        requestBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        const userInput = document.querySelector('input[placeholder*="name"], [data-testid="answer_request_input"]');
        if (userInput) {
            if (userInput instanceof HTMLInputElement) {
                userInput.value = params.user_identifier;
            }
            else {
                userInput.textContent = params.user_identifier;
            }
            userInput.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        if (params.message) {
            const msgInput = document.querySelector('textarea, [contenteditable="true"]:not([data-testid="answer_request_input"])');
            if (msgInput) {
                if (msgInput instanceof HTMLTextAreaElement) {
                    msgInput.value = params.message;
                }
                else {
                    msgInput.textContent = params.message;
                }
                msgInput.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }
        const sendBtn = (Array.from(document.querySelectorAll('button')).find(b => /send|request|invite/i.test(b.textContent || '')));
        if (sendBtn) {
            sendBtn.click();
            return { success: true, message: 'Answer request sent' };
        }
        return { success: true, message: 'Answer request submitted (send button not found, may have auto-submitted)' };
    },
});
//# sourceMappingURL=request-answer.js.map