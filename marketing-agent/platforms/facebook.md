# Platform: Facebook (facebook.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://www.facebook.com/`
- Heavy SPA — React-based, lots of JS rendering
- Login is required for most functionality

## Finding Relevant Discussions

### Approaches:
- Browse Facebook Groups relevant to: SaaS, startups, marketing, sales, entrepreneurship
- Search: `https://www.facebook.com/search/posts/?q=lead%20generation`
- Look for group posts asking for recommendations, advice, or tool suggestions
- Focus on groups that allow promotion or sharing tools

### CSS Selectors (highly variable — use query_elements):
- Post containers: `div[data-ad-preview]` or `div[role='article']`
- Post text: look for paragraph elements within post containers
- Comment input: `div[role='textbox']` or `form textarea`
- Submit comment: press Enter or click the submit button
- Like/reaction button: look for `div[aria-label='Like']` or reaction buttons
- Group sidebar: `div[role='navigation']`

### Note on Facebook's DOM:
Facebook's DOM structure changes very frequently and is heavily obfuscated. Use `query_elements` and `screenshot` every session to understand the current layout.

## Engaging on a Post

### Steps:
1. Open a group or search for posts
2. Click on a post to open it
3. Read the post content and existing comments
4. Scroll to the comment input (usually at the bottom of the post)
5. Generate helpful reply
6. Type into the comment box
7. Press Enter to submit
8. Like/react to the parent post

## Platform-Specific Etiquette

- Facebook Groups have their own rules — always check them
- Some groups allow promotion, others don't
- Be genuinely helpful in groups before promoting your tool
- Many groups have specific days/times for promotion
- Don't post links unless the group allows it
- Engage authentically — build presence over time
- Comments should be contextual and valuable
- Avoid spamming the same message across multiple groups
- Groups focused on "SaaS marketing", "Growth Hacking", and "Entrepreneurship" tend to be more open to tool discussions

## Keywords to Track
- lead generation, B2B, SaaS, startup
- finding customers, marketing, sales
- cold email, social selling, growth hacking
- tool recommendations, "what do you use"
- small business marketing, entrepreneurship
- digital marketing, Facebook ads