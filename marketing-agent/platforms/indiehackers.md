# Platform: IndieHackers (indiehackers.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://www.indiehackers.com/`
- SPA — content loads after initial page load, may need `wait_for_element`
- Sign in is required to comment (but you're already logged in)

## Finding Relevant Discussions

### Approaches:
- Browse the feed at `https://www.indiehackers.com/`
- Browse specific topics: `https://www.indiehackers.com/topics/marketing`
- Browse `https://www.indiehackers.com/topics/sales`
- Browse `https://www.indiehackers.com/topics/growth`

### CSS Selectors:
- Feed items: usually `a[href*='/post/']` within feed cards
- Post titles: look for heading elements inside post cards
- Like/upvote button: look for SVG icons or buttons with like text

## Engaging on a Post

### Steps:
1. Open a post URL
2. Read content + existing comments — scroll down to comments section
3. Generate comment
4. Find comment input — typically a textarea or contenteditable div
5. Type and submit
6. Look for a submit/comment button

### Upvoting:
- IndieHackers has heart/like buttons on posts
- Click the heart/like icon on the parent post before commenting

## Platform-Specific Etiquette

- Community is bootstrapper/indie-founder focused
- Very welcome to SaaS tools and growth discussions
- People share what's working for them — data and honest stories resonate
- It's normal to mention your own product if it's relevant
- Tone: peer-to-peer, collaborative
- Avoid hyper-salesy language

## Keywords to Track
- lead generation, finding customers, customer acquisition
- cold email, outreach, growth, marketing
- SaaS metrics, conversion, sales
- bootstrapping, monetization, revenue
