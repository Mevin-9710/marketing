import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const upvoteTool = defineTool({
  name: 'upvote_tool',
  displayName: 'Upvote Tool',
  description: 'Upvote a tool/product on Uneed. Must be on the tool page.',
  icon: 'thumbs-up',
  group: 'Engagement',
  input: z.object({
    tool_url: z.string().optional().describe('URL of the tool to upvote. Leave empty if already on the page.'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    if (params.tool_url && !window.location.href.includes('/tool/')) {
      return { success: false, message: `Navigate to the tool page first (${params.tool_url}), then call upvote_tool without tool_url.` };
    }

    const upvoteBtn = document.querySelector(
      'button[class*="vote"], [data-testid="upvote"], [aria-label*="upvote"], button:has(svg), [class*="VoteButton"]'
    ) as HTMLElement | null;

    if (upvoteBtn) {
      upvoteBtn.click();
      log.info('Upvoted tool');
      return { success: true, message: 'Tool upvoted successfully' };
    }

    const allButtons = Array.from(document.querySelectorAll('button'));
    const voteBtn = allButtons.find(b =>
      /vote|upvote|\b214\b|upvote/i.test(b.textContent || '')
    );
    if (voteBtn) {
      voteBtn.click();
      return { success: true, message: 'Tool upvoted successfully' };
    }

    throw ToolError.notFound('Could not find upvote button on this page. Make sure you are on a tool page.');
  },
});
