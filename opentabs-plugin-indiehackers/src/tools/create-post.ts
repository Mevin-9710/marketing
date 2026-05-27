import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const createPost = defineTool({
  name: 'create_post',
  displayName: 'Create Post',
  description: 'Create a new post on IndieHackers. Supports text content with optional links.',
  icon: 'plus-square',
  group: 'Writing',
  input: z.object({
    content: z.string().min(1).describe('Post content text'),
    title: z.string().optional().describe('Optional post title (some post types require it)'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    log.info('Creating IndieHackers post');

    if (!window.location.href.includes('/submit') && !window.location.href.includes('/new')) {
      const submitBtn = document.querySelector('a[href*="/submit"], .ctas a, button:has-text("Submit a post")') as HTMLElement | null;
      if (submitBtn) {
        submitBtn.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const titleInput = document.querySelector('[class*="post-title"] input, input[name*="title"], [class*="title-input"]') as HTMLInputElement | null;
    if (titleInput && params.title) {
      titleInput.focus();
      titleInput.value = params.title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const editor = document.querySelector('[contenteditable="true"], textarea, [class*="editor"], [class*="composer"]') as HTMLElement | null;
    if (editor) {
      editor.focus();
      if (editor.tagName === 'TEXTAREA' || editor.tagName === 'INPUT') {
        (editor as HTMLTextAreaElement).value = params.content;
      } else {
        editor.innerHTML = params.content.replace(/\n/g, '<br>');
      }
      editor.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise(resolve => setTimeout(resolve, 500));

      const submitBtn = Array.from(document.querySelectorAll('button')).find(b =>
        /post|submit|publish|create/i.test(b.textContent || '')
      ) as HTMLElement | undefined;

      if (submitBtn) {
        submitBtn.click();
        log.info('Post submitted via click');
        return { success: true, message: 'Post created successfully' };
      }
    }

    throw ToolError.internal('Could not find post composer. Navigate to indiehackers.com/submit first or make sure you are logged in.');
  },
});
