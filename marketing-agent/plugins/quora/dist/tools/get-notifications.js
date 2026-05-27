import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
export const getNotifications = defineTool({
    name: 'get_notifications',
    displayName: 'Get Notifications',
    description: 'Get recent Quora notifications — new answers, upvotes, comments, follows, and answer requests.',
    icon: 'bell',
    group: 'Account',
    input: z.object({
        limit: z.number().int().min(1).max(50).optional().describe('Maximum notifications to return (default 10)'),
        mark_read: z.boolean().optional().describe('Mark retrieved notifications as read (default: false)'),
    }),
    output: z.object({
        notifications: z.array(z.object({
            id: z.string().describe('Notification ID'),
            text: z.string().describe('Notification text/description'),
            url: z.string().optional().describe('Related content URL'),
            type: z.string().optional().describe('Notification type (upvote, answer, comment, follow, etc.)'),
            time: z.string().optional().describe('Relative time string'),
            unread: z.boolean().describe('Whether the notification is unread'),
        })),
        total: z.number(),
        unread_count: z.number().optional().describe('Total unread notification count'),
    }),
    async handle(params) {
        log.info('Getting notifications');
        const response = await fetch('https://www.quora.com/notifications', { credentials: 'include' });
        if (!response.ok) {
            throw ToolError.internal(`Failed to load notifications: ${response.status}`);
        }
        const html = await response.text();
        const doc = document.createElement('div');
        doc.innerHTML = html;
        const notificationElements = doc.querySelectorAll('[data-testid="notification_item"], .notification-item, .q-box.notification');
        const notifications = [];
        notificationElements.forEach((el, index) => {
            const textEl = el.querySelector('.q-text:not(.timestamp), .notification-text, [class*="text"]');
            const timeEl = el.querySelector('.timestamp, [class*="time"], [class*="date"]');
            const link = el.querySelector('a');
            const isUnread = el.classList.contains('unread') || el.getAttribute('data-unread') === 'true';
            const text = textEl?.textContent?.trim() || '';
            if (text) {
                const type = text.includes('upvote') || text.includes('upvoted') ? 'upvote'
                    : text.includes('answer') ? 'answer'
                        : text.includes('comment') ? 'comment'
                            : text.includes('follow') ? 'follow'
                                : text.includes('request') ? 'request'
                                    : text.includes('share') ? 'share'
                                        : 'other';
                notifications.push({
                    id: `notif-${index + 1}`,
                    text: text.substring(0, 300),
                    url: link?.href || undefined,
                    type,
                    time: timeEl?.textContent?.trim() || undefined,
                    unread: isUnread,
                });
            }
        });
        const limit = params.limit ?? 10;
        const finalNotifications = notifications.slice(0, limit);
        const unreadCount = notifications.filter(n => n.unread).length;
        log.debug('Notifications fetched', { count: finalNotifications.length, unread: unreadCount });
        return {
            notifications: finalNotifications,
            total: finalNotifications.length,
            unread_count: unreadCount,
        };
    },
});
//# sourceMappingURL=get-notifications.js.map