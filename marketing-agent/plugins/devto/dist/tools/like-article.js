import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const likeArticle = defineTool({
    name: 'like_article',
    displayName: 'Like Article',
    description: 'Add a Like reaction to a DEV.to article. Must be on the article page.',
    icon: 'heart',
    group: 'Engagement',
    input: z.object({}),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle() {
        log.info('Liking DEV.to article');
        const likeBtn = document.querySelector('[aria-label="Like"], .crayons-reaction--like');
        if (!likeBtn) {
            throw ToolError.notFound('Could not find Like button. Make sure you are on an article page and logged in.');
        }
        const isAlreadyLiked = likeBtn.classList.contains('activated');
        if (isAlreadyLiked) {
            return { success: true, message: 'Already liked this article' };
        }
        likeBtn.click();
        log.info('Article liked');
        return { success: true, message: 'Article liked successfully' };
    },
});
//# sourceMappingURL=like-article.js.map