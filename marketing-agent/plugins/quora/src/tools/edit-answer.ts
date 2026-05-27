import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const editAnswer = defineTool({
  name: 'edit_answer',
  displayName: 'Edit Answer',
  description: 'Edit one of your existing Quora answers. Provide the answer ID or navigate to the answer page.',
  icon: 'edit',
  group: 'Writing',
  input: z.object({
    answer_url: z.string().url().optional().describe('URL of the answer to edit'),
    content: z.string().min(1).describe('New content for the answer'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    log.info('Editing answer', { url: params.answer_url });

    if (params.answer_url && !window.location.href.includes(params.answer_url)) {
      return { success: false, message: `Navigate to ${params.answer_url} in your browser first, then call edit_answer without the answer_url parameter.` };
    }

    const editButton = (Array.from(document.querySelectorAll('button')).find(b =>
      /edit/i.test(b.getAttribute('aria-label') || b.textContent || '')
    ) || document.querySelector('.puppeteer_test_edit_answer_button, [data-testid="edit_answer"]')) as HTMLElement | null;

    if (!editButton) {
      throw ToolError.notFound('Could not find an edit button. Make sure you are on your own answer page.');
    }

    editButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));

    const editor = document.querySelector('[contenteditable="true"], div.ql-editor') as HTMLElement | null;
    if (!editor) {
      throw ToolError.notFound('Could not find the answer editor after clicking edit');
    }

    editor.focus();
    editor.innerHTML = params.content.replace(/\n/g, '<br>');
    const inputEvent = new Event('input', { bubbles: true });
    editor.dispatchEvent(inputEvent);

    await new Promise(resolve => setTimeout(resolve, 500));

    const saveButton = (Array.from(document.querySelectorAll('button')).find(b =>
      /save|submit/i.test(b.textContent || '') || b.type === 'submit'
    )) as HTMLElement | null;
    if (saveButton) {
      saveButton.click();
    }

    log.info('Answer edited successfully');

    return {
      success: true,
      message: 'Answer updated successfully',
    };
  },
});
