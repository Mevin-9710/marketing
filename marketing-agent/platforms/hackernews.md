# Platform: Hacker News (news.ycombinator.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://news.ycombinator.com/`
- Content loads server-side — no SPA delays
- Each page is a list of `tr.athing` rows

## Finding Relevant Discussions

### Search approaches:
- Browse `/front` for front-page posts about SaaS, startups, lead gen, sales, marketing
- Browse `/show` ("Show HN" — people showing their product)
- Browse `/ask` ("Ask HN" — people asking questions, high-intent)
- Use Algolia search: `https://hn.algolia.com/?query=lead%20generation&sort=byDate`

### CSS selectors:
- Post list: `span.titleline > a`
- Post titles: `span.titleline`
- Post URL attribute: `span.titleline > a[href]`
- Upvote arrow: `a[id^='up_']` (first one for the post)
- Comments link: `a:has-text('comments')` or `a[href*='item?id=']`

## Engaging on a Post

### Steps:
1. Open the post URL or click the title link to read actual content
2. Read existing comments (scroll down)
3. Generate a helpful comment
4. Type comment into the reply textarea at `textarea[name='text']`
5. Click `input[type='submit'][value='add comment']`

### Upvoting:
- Click the upvote arrow `a[id^='up_']` for the parent post
- HN requires login to upvote

## Platform-Specific Etiquette

- HN community values deep, substantive comments
- Avoid marketing speak — be genuinely useful
- It's acceptable to mention your own tool (like SplitSquad) if it directly solves the problem being discussed
- Best format: share data/experience first, mention your tool as context
- Keep comments under ~300 words
- Don't post "great post!" or other low-effort fluff

## Keywords to Track
- lead generation, B2B, SaaS, startup growth, customer acquisition
- sales prospecting, cold email, social selling
- marketing tools, finding customers, growth hacks
- product hunt, Show HN (for lead gen / sales / marketing tools)
