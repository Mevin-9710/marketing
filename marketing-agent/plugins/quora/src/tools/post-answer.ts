import { defineTool, postJSON, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractQuestionDataFromPage } from '../quora-api.js';

export const postAnswer = defineTool({
  name: 'post_answer',
  displayName: 'Post Answer',
  description: 'Write and submit an answer to a Quora question. Navigate to the question page first, or provide a question URL. Supports rich text content.',
  icon: 'pen-square',
  group: 'Writing',
  input: z.object({
    question_url: z.string().url().optional().describe('URL of the question to answer. Leave empty if already on the question page.'),
    content: z.string().min(1).describe('Answer content/text. Can include basic formatting.'),
    is_anonymous: z.boolean().optional().describe('Post as anonymous (default: false)'),
  }),
  output: z.object({
    success: z.boolean(),
    answer_url: z.string().optional().describe('URL to the posted answer'),
    message: z.string().describe('Status message'),
  }),
  async handle(params) {
    const targetUrl = params.question_url || window.location.href;
    log.info('Posting answer', { url: targetUrl, anonymous: params.is_anonymous });

    let question = extractQuestionDataFromPage();

    if (!question && params.question_url) {
      const response = await fetch(params.question_url, { credentials: 'include' });
      if (response.ok) {
        const html = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = html;
        const apolloScript = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});/);
        if (apolloScript) {
          try {
            const apolloState = JSON.parse(apolloScript[1]);
            for (const key of Object.keys(apolloState)) {
              const entry = apolloState[key] || {};
              if (entry.__typename === 'Question' && entry.id) {
                question = {
                  id: String(entry.id),
                  title: String(entry.title || ''),
                  url: String(entry.url || ''),
                };
                break;
              }
            }
          } catch {}
        }
      }
    }

    if (!question) {
      if (params.question_url) {
        return { success: false, message: `Navigate to ${params.question_url} in your browser first, then call post_answer without the question_url parameter.` };
      }
      throw ToolError.notFound('Could not find a question on this page. Make sure you are on a Quora question page.');
    }

    if (!params.question_url || window.location.href.includes(params.question_url)) {
      const answerButton = document.querySelector('button[class*="Answer"], a[href*="answer"], [data-testid="answer_button"]') as HTMLElement | null;
      if (answerButton) {
        answerButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const editor = document.querySelector('[contenteditable="true"], div.ql-editor, div[data-testid="answer_editor"]') as HTMLElement | null;
      if (editor) {
        editor.focus();
        editor.innerHTML = params.content.replace(/\n/g, '<br>');
        const inputEvent = new Event('input', { bubbles: true });
        editor.dispatchEvent(inputEvent);

        await new Promise(resolve => setTimeout(resolve, 500));

        const submitButton = (Array.from(document.querySelectorAll('button')).find(b =>
          b.type === 'submit' || /submit|post|add.?answer/i.test(b.textContent || '')
        ) || document.querySelector('[data-testid="submit_answer_button"], .puppeteer_test_submit_answer')) as HTMLElement | null;

        if (submitButton) {
          submitButton.click();
          log.info('Answer submitted via click');
          return {
            success: true,
            answer_url: window.location.href,
            message: 'Answer posted successfully',
          };
        }
      }
    }

    const result = await postJSON<{ id?: string; success?: boolean }>(
      '/answer/logged_in_answer_creation',
      {
        question_id: question.id,
        content: params.content,
        anonymous: params.is_anonymous ?? false,
      },
    );

    if (!result) {
      throw ToolError.internal('Failed to post answer - no response from API');
    }

    log.info('Answer posted successfully via API', { questionId: question.id });

    return {
      success: true,
      answer_url: `https://www.quora.com${question.url || targetUrl}`,
      message: 'Answer posted successfully',
    };
  },
});
