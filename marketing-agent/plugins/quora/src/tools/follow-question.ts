import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const followQuestion = defineTool({
  name: 'follow_question',
  displayName: 'Follow / Unfollow Question',
  description: 'Follow or unfollow a Quora question. When you follow a question, you get notified of new answers.',
  icon: 'bell-plus',
  group: 'Interaction',
  input: z.object({
    question_url: z.string().url().optional().describe('URL of the question. Leave empty to use the current page.'),
    action: z.enum(['follow', 'unfollow']).describe('Whether to follow or unfollow'),
  }),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle(params) {
    log.info(`${params.action}ing question`);

    const followButton = (document.querySelector('[data-testid="follow_button"], .puppeteer_test_follow_question')
      || Array.from(document.querySelectorAll('button')).find(b => /follow/i.test(b.textContent || ''))) as HTMLElement | null;

    if (followButton) {
      const isFollowing = followButton.textContent?.toLowerCase().includes('following');
      if (params.action === 'follow' && !isFollowing) {
        followButton.click();
        log.info('Followed question via click');
        return { success: true, message: 'Now following this question' };
      }
      if (params.action === 'unfollow' && isFollowing) {
        followButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        const confirmBtn = (Array.from(document.querySelectorAll('button')).find(b => /unfollow/i.test(b.textContent || ''))) as HTMLElement | null;
        if (confirmBtn) confirmBtn.click();
        log.info('Unfollowed question via click');
        return { success: true, message: 'Unfollowed this question' };
      }
      return { success: true, message: isFollowing ? 'Already following' : 'Not currently following' };
    }

    throw ToolError.notFound('Could not find the follow button on this page');
  },
});
