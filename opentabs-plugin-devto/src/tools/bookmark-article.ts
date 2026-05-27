import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const bookmarkArticle = defineTool({
  name: 'bookmark_article',
  displayName: 'Bookmark Article',
  description: 'Save a DEV.to article to your reading list. Must be on the article page.',
  icon: 'bookmark',
  group: 'Engagement',
  input: z.object({}),
  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  async handle() {
    log.info('Bookmarking DEV.to article');

    const bookmarkBtn = document.querySelector(
      '[aria-label*="reading list"], [class*="readinglist"]'
    ) as HTMLElement | null;

    if (bookmarkBtn) {
      bookmarkBtn.click();
      log.info('Article bookmarked');
      return { success: true, message: 'Article saved to reading list' };
    }

    return { success: false, message: 'Could not find save button. Navigate to an article page first.' };
  },
});
