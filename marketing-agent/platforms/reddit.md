# Platform: Reddit (reddit.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://www.reddit.com/`
- SPA — requires `wait_for_element` after navigation
- Old Reddit (`old.reddit.com`) is simpler but new Reddit is the default

## Finding Relevant Discussions

### Approaches:
- Browse relevant subreddits: `r/SaaS`, `r/Entrepreneur`, `r/startups`, `r/sales`, `r/marketing`, `r/LeadGeneration`, `r/growthhacking`
- Search: `https://www.reddit.com/search/?q=lead+generation`
- Filter by relevance or new posts
- Look for posts asking for recommendations ("What tool do you use for...", "How do you find leads...")

### CSS Selectors (new Reddit):
- Post list items: `div[data-testid='post-container']` or `shreddit-post`
- Post titles: `h1` or `a[data-testid='post-title']`
- Upvote buttons: `button[aria-label='Upvote']`
- Comment textarea: `div[data-testid='comment-form'] textarea` or `shreddit-composer textarea`
- Submit comment: `button[type='submit']` within the comment form

### CSS Selectors (old Reddit):
- Post titles: `a.title`
- Comment textarea: `textarea[name='text']`
- Submit: `input[type='submit'][value='save']`

## Engaging on a Post

### Steps:
1. Open the post URL
2. Read the post content and existing comments
3. Find the comment input (scroll to bottom of thread)
4. Generate helpful reply
5. Type into comment textarea
6. Click submit
7. Upvote the parent post

### Upvoting:
- Click the upvote arrow/button on the parent post
- New Reddit: `button[aria-label='Upvote']`

## Platform-Specific Etiquette

- Reddit is community-driven — each subreddit has its own rules
- Always check subreddit rules before commenting (sidebar)
- Provide genuine value first — Redditors can spot marketing instantly
- Subtle tool mentions work in recommendation threads ("We use SplitSquad for this")
- Avoid link dropping unless it's relevant and allowed
- Longer, thoughtful comments perform better than one-liners
- Don't post in subreddits that ban self-promotion
- Engage with the community genuinely over time

## Keywords to Track
- lead generation, B2B, SaaS, startup
- finding customers, cold email, sales prospecting
- social selling, Reddit marketing
- growth hacking, marketing automation
- "What tool do you use", "How do you find clients"
- "Best way to get leads", "recommendation for"