# Platform: X / Twitter (x.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://x.com/`
- SPA — React-based, heavy JS rendering
- Need to wait for feed to load
- Login is required to post and interact

## Finding Relevant Discussions

### Approaches:
- Search: `https://x.com/search?q=lead%20generation&src=typed_query`
- Browse trending topics in tech/SaaS/marketing
- Look for posts with engagement (replies, retweets, likes)
- Follow relevant hashtags and accounts
- Check "Latest" tab for chronological results

### CSS Selectors:
- Posts/tweets in feed: `article[data-testid='tweet']`
- Post text: `div[data-testid='tweetText']`
- Reply button: `button[data-testid='reply']`
- Like button: `button[data-testid='like']`
- Retweet button: `button[data-testid='retweet']`
- Reply textarea: `div[data-testid='tweetTextarea_0']` (contenteditable)
- Submit reply: `button[data-testid='tweetButtonInline']`
- Follow button: `button[data-testid*='follow']`

## Engaging on a Post

### Steps:
1. Click into a post to open the detail view
2. Read the post content and existing replies
3. Click the reply button
4. Type reply into the textarea
5. Click reply/submit button
6. Optionally like the parent post

### Liking:
- Click the heart/like button on the parent post
- `button[data-testid='like']`

## Platform-Specific Etiquette

- X is fast-paced — conversations move quickly
- Short to medium replies (1-3 paragraphs max)
- Personality and authenticity are valued
- Hashtags are common but don't overuse
- Threads (multi-tweet replies) work for detailed responses
- It's acceptable to mention tools in context
- Avoid direct sales pitches — be helpful first
- Engaging with quote tweets can increase visibility
- Tone: conversational, professional but not stiff

## Keywords to Track
- lead generation, B2B, SaaS, growth
- finding customers, sales, marketing
- cold outreach, social selling
- AI tools, startup, growth hacking
- "looking for", "recommend", "best tool"
- split testing, A/B testing outreach