# Platform: Bluesky (bsky.app)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://bsky.app/`
- SPA — React-based, heavy JS rendering
- Need to wait for feed to load

## Finding Relevant Discussions

### Approaches:
- Search: `https://bsky.app/search?q=lead+generation`
- Browse feeds like "What's Hot" or custom feeds
- Look for posts with engagement (replies, reposts, likes)

### CSS Selectors:
- Posts in feed: look for article elements or divs with post content
- Post text: typically within paragraph elements
- Reply input: look for a textarea or contenteditable in the post detail view
- Reply button: small icon button (usually a speech bubble icon)
- Like button: heart icon button
- Repost button: repost/reshare icon button
- Follow button: "Follow" button on user profiles

### Note on Bluesky UI:
Bluesky's DOM structure changes frequently. Use `query_elements` to discover the current selectors each session. Look for:
- `div[data-testid^='post']` patterns
- Buttons with aria-labels like "Reply", "Like", "Repost"
- Text inputs with role="textbox" or contenteditable

## Engaging on a Post

### Steps:
1. Click into a post (often opens a detail view or a flyout)
2. Read the post content and existing replies
3. Click reply button or find the reply input
4. Generate reply text
5. Type into the reply box
6. Click reply/submit button (usually a "Reply" or send button)
7. Optionally like the parent post

### Liking:
- Click the heart button on the parent post before replying

## Platform-Specific Etiquette

- Bluesky is community-driven, similar to early Twitter
- Conversations are public and threaded
- Users value authenticity and genuine interaction
- Short to medium-length replies (1-3 paragraphs)
- Hashtags work but don't overuse them
- Direct, conversational tone
- Tool mentions work if they're genuinely relevant to the discussion

## Keywords to Track
- lead generation, B2B, SaaS, growth
- finding customers, sales, marketing
- AI tools, startup, cold outreach
- social listening, community building
- product launch, growth hacking
