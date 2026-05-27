import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getUserProfile = defineTool({
  name: 'get_user_profile',
  displayName: 'Get User Profile',
  description: 'Get a Quora user\'s profile information — display name, bio, follower/following counts, answer/question counts. Provide the profile URL or leave empty for the current user.',
  icon: 'user',
  group: 'People',
  input: z.object({
    profile_url: z.string().url().optional().describe('URL of the user profile. Leave empty for the user whose profile page you are on.'),
  }),
  output: z.object({
    display_name: z.string(),
    username: z.string(),
    bio: z.string().optional(),
    follower_count: z.number().optional(),
    following_count: z.number().optional(),
    answer_count: z.number().optional(),
    question_count: z.number().optional(),
    profile_image_url: z.string().optional(),
  }),
  async handle(params) {
    log.info('Getting user profile', { url: params.profile_url });

    const useFetch = params.profile_url && !window.location.href.includes(params.profile_url);
    let fetchedHtml: string | null = null;

    if (useFetch) {
      const response = await fetch(params.profile_url!, { credentials: 'include' });
      if (!response.ok) {
        throw ToolError.internal(`Failed to load profile: ${response.status}`);
      }
      fetchedHtml = await response.text();

      const apolloState = extractApolloFromHtml(fetchedHtml);
      if (apolloState) {
        for (const key of Object.keys(apolloState)) {
          const entry = (apolloState[key] || {}) as Record<string, unknown>;
          if ((entry.__typename === 'User' || entry.__typename === 'Viewer') && entry.id) {
            return {
              display_name: String(entry.displayName || entry.name || '') || 'Unknown',
              username: String(entry.username || (entry.url as string)?.split('/').pop() || params.profile_url?.split('/').pop()?.replace(/\/$/, '') || ''),
              bio: entry.description ? String(entry.description) : undefined,
              follower_count: typeof entry.followerCount === 'number' ? entry.followerCount : undefined,
              following_count: typeof entry.followingCount === 'number' ? entry.followingCount : undefined,
              answer_count: typeof entry.answerCount === 'number' ? entry.answerCount : undefined,
              question_count: typeof entry.questionCount === 'number' ? entry.questionCount : undefined,
              profile_image_url: entry.profileImageUrl ? String(entry.profileImageUrl) : undefined,
            };
          }
        }
      }
    }

    const doc = useFetch && fetchedHtml
      ? (() => { const d = document.createElement('div'); d.innerHTML = fetchedHtml!; return d; })()
      : null;

    const displayName = doc
      ? (doc.querySelector('.profile-header h1, [data-testid="profile_name"], h1.q-text')?.textContent?.trim()
        || document.title.replace(' - Quora', '') || 'Unknown')
      : (document.querySelector('.profile-header h1, [data-testid="profile_name"], h1.q-text')?.textContent?.trim()
        || document.title.replace(' - Quora', '') || 'Unknown');

    const bio = doc
      ? doc.querySelector('[data-testid="profile_description"], .profile-description, .q-text:not(h1 .q-text)')?.textContent?.trim() || undefined
      : document.querySelector('[data-testid="profile_description"], .profile-description, .q-text:not(h1 .q-text)')?.textContent?.trim() || undefined;

    const username = doc
      ? params.profile_url?.split('/').pop()?.replace(/\/$/, '') || displayName.toLowerCase().replace(/\s+/g, '-')
      : window.location.pathname.replace('/profile/', '').replace(/\/$/, '') || displayName.toLowerCase().replace(/\s+/g, '-');

    const root = doc || (document as unknown as Document);

    const stats: Record<string, number> = {};
    root.querySelectorAll('[data-testid="profile_stat"], .profile-stat, .q-stat, [class*="stat"]').forEach(el => {
      const text = el.textContent?.trim() || '';
      const match = text.match(/([\d.]+[KMB]?)\s*(.+)/);
      if (match) {
        const rawValue = match[1];
        const label = match[2].toLowerCase();
        const multiplier = rawValue.endsWith('K') ? 1000 : rawValue.endsWith('M') ? 1000000 : rawValue.endsWith('B') ? 1000000000 : 1;
        const value = Math.round(parseFloat(rawValue.replace(/[KMB]/g, '')) * multiplier);
        if (label.includes('follow')) stats.followers = value;
        else if (label.includes('answer')) stats.answers = value;
        else if (label.includes('question')) stats.questions = value;
      }
    });

    const profileImage = doc
      ? (root.querySelector('[data-testid="profile_photo"] img') as HTMLImageElement | null)
        || Array.from(root.querySelectorAll('img')).find(img =>
          (img.alt || '').toLowerCase().includes('profile') || (img.className || '').toLowerCase().includes('profile')
        ) as HTMLImageElement | undefined
      : (document.querySelector('[data-testid="profile_photo"] img')
        || Array.from(document.querySelectorAll('img')).find(img =>
          (img.alt || '').toLowerCase().includes('profile') || (img.className || '').toLowerCase().includes('profile')
        )) as HTMLImageElement | null;

    log.debug('Profile data extracted', { displayName, username });

    return {
      display_name: displayName,
      username,
      bio,
      follower_count: stats.followers,
      following_count: stats.followingCount,
      answer_count: stats.answers,
      question_count: stats.questions,
      profile_image_url: profileImage?.src,
    };
  },
});

function extractApolloFromHtml(html: string): Record<string, unknown> | null {
  const match = html.match(/window\.__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});/);
  if (match) {
    try {
      return JSON.parse(match[1]) as Record<string, unknown>;
    } catch {}
  }
  return null;
}
