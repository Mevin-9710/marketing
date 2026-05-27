import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const createArticle = defineTool({
    name: 'create_article',
    displayName: 'Create Article',
    description: 'Write and publish a new article on DEV.to. Navigate to dev.to/new first.',
    icon: 'edit-3',
    group: 'Writing',
    input: z.object({
        title: z.string().min(1).describe('Article title'),
        content: z.string().min(1).describe('Article body in Markdown format'),
        tags: z.array(z.string()).max(4).optional().describe('Up to 4 tags for the article'),
        published: z.boolean().optional().describe('Publish immediately (default: true)'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
        url: z.string().optional(),
    }),
    async handle(params) {
        log.info('Creating DEV.to article', { title: params.title });
        if (!window.location.href.includes('/new')) {
            return { success: false, message: 'Must be on the article editor page (dev.to/new).' };
        }
        // Fill in the title
        const titleInput = document.querySelector('#article-form-title, input[name="article[title]"], [data-testid="article-form-title"]');
        if (titleInput) {
            titleInput.focus();
            titleInput.value = params.title;
            titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // Fill in the content
        const contentArea = document.querySelector('#article_body_markdown, textarea[name="article[body_markdown]"], [data-testid="article-form-body"]');
        if (contentArea) {
            contentArea.focus();
            contentArea.value = params.content;
            contentArea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        // Fill in tags
        if (params.tags && params.tags.length > 0) {
            const tagInput = document.querySelector('#tag-input, input[name="article[tag_list]"], [data-testid="tag-input"]');
            if (tagInput) {
                tagInput.focus();
                tagInput.value = params.tags.join(', ');
                tagInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        // If published, click publish button
        if (params.published !== false) {
            const publishBtn = Array.from(document.querySelectorAll('button')).find(b => /publish/i.test(b.textContent || ''));
            if (publishBtn) {
                publishBtn.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
                log.info('Article published');
                return { success: true, message: 'Article published successfully', url: window.location.href };
            }
        }
        return { success: true, message: 'Article content filled in editor. Review and publish manually.' };
    },
});
//# sourceMappingURL=create-article.js.map