import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const followUser = defineTool({
  name: 'follow_user',
  displayName: 'Follow User',
  description: 'Follow a user on DEV.to. Must be on their profile page.',
  icon: 'user-plus',
  group: 'Engagement',
  input: z.object({}),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle() {
    log.info('Following DEV.to user');

    const followBtn = document.querySelector(
      'button[data-testid="follow-button"], button[class*="follow-user"], [aria-label*="Follow"]'
    ) as HTMLElement | null;

    if (followBtn) {
      followBtn.click();
      log.info('User followed');
      return { success: true, message: 'User followed successfully' };
    }

    return { success: false, message: 'Could not find follow button. Navigate to a user profile first.' };
  },
});
