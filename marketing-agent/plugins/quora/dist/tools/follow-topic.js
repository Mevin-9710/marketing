import { defineTool, log } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const followTopic = defineTool({
    name: 'follow_topic',
    displayName: 'Follow / Unfollow Topic',
    description: 'Follow or unfollow a Quora topic. Requires being on the topic page or providing a topic URL.',
    icon: 'tag',
    group: 'Interaction',
    input: z.object({
        topic_url: z.string().url().optional().describe('URL of the topic page. Leave empty to use the current page.'),
        topic_name: z.string().optional().describe('Topic name (alternative to URL). Example: "Artificial-Intelligence"'),
        action: z.enum(['follow', 'unfollow']).describe('Whether to follow or unfollow'),
    }),
    output: z.object({
        success: z.boolean(),
        message: z.string(),
    }),
    async handle(params) {
        log.info(`${params.action}ing topic`, { topicName: params.topic_name });
        let targetUrl = params.topic_url;
        if (params.topic_name && !targetUrl) {
            targetUrl = `https://www.quora.com/topic/${params.topic_name}`;
        }
        if (targetUrl && !window.location.href.includes(targetUrl)) {
            return { success: false, message: `Navigate to the topic page (${targetUrl}) in your browser first, then call follow_topic without the URL parameters.` };
        }
        const followBtn = (document.querySelector('[data-testid="topic_follow_button"], .puppeteer_test_follow_topic')
            || Array.from(document.querySelectorAll('button')).find(b => /follow(ing)?/i.test(b.textContent || '')));
        if (!followBtn) {
            return { success: false, message: 'Could not find follow button. Navigate to a topic page first.' };
        }
        const isFollowing = followBtn.textContent?.toLowerCase().includes('following');
        if (params.action === 'follow' && !isFollowing) {
            followBtn.click();
            return { success: true, message: 'Now following this topic' };
        }
        if (params.action === 'unfollow' && isFollowing) {
            followBtn.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            const confirmBtn = (Array.from(document.querySelectorAll('button')).find(b => /unfollow/i.test(b.textContent || '')));
            if (confirmBtn)
                confirmBtn.click();
            return { success: true, message: 'Unfollowed this topic' };
        }
        return { success: true, message: isFollowing ? 'Already following' : 'Not currently following' };
    },
});
//# sourceMappingURL=follow-topic.js.map