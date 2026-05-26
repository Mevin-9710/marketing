# Platform: Quora (quora.com)

## Authentication
Already logged in via Chrome profile.

## Navigation
- Open: `https://www.quora.com/`
- SPA with heavy JS rendering — use `wait_for_element` liberally
- Quora requires login to see full content and comment

## Finding Relevant Discussions

### Approaches:
- Search: `https://www.quora.com/search?q=lead+generation`
- Follow spaces like "SaaS Marketing", "B2B Sales", "Startup Advice"
- Browse topics: `https://www.quora.com/topic/Lead-Generation`
- Browse questions in the feed

### CSS Selectors:
- Questions in search results: look for `a[href*='/']` within question cards
- Question page titles: typically `h1` elements
- Answer input: look for a contenteditable div or textarea
- Submit button: `button` with "Submit" or an SVG icon
- Upvote: look for upvote arrows or buttons
- Follow: look for "Follow" buttons

## Engaging on a Post

### Steps:
1. Open the question URL
2. Read the question details and existing answers
3. Scroll to the answer box (usually below existing answers)
4. Generate answer text
5. Type into the answer input
6. Click submit/post button
7. Optionally upvote the question

### Upvoting:
- Quora has upvote arrows on each answer and the question itself
- Upvote the question (not individual answers) to show engagement

## Platform-Specific Etiquette

- Quora values detailed, well-structured answers
- Answers should be genuinely helpful first
- Subtle tool mentions work well in context (e.g., "We use SplitSquad to run outreach split-tests")
- Avoid link dropping — Quora flags spam aggressively
- Use formatting (bold, lists) for readability
- Longer answers (300-800 words) tend to perform better

## Keywords to Track
- "How to generate leads for SaaS"
- "Best B2B lead generation strategies"
- "How to find customers for startup"
- "Cold email vs social selling"
- "Reddit for business"
- "Best tools for lead generation"
- "Marketing automation for small business"
- "How to get first 100 customers"
