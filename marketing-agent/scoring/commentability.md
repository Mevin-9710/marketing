# Commentability Score — Post Ranking System

Stop searching endlessly. Use this scoring system to rank posts from your feed and pick the best one to engage with.

## The Score Formula

```
commentability_score =
    humor_potential * 0.3 +
    emotionality * 0.2 +
    relatability * 0.2 +
    reply_count * 0.2 +
    freshness * 0.1
```

## Scoring Dimensions (Rate each 0.0 to 1.0)

### humor_potential
Can you be funny in response?
- 1.0 — Post is clearly humorous/absurd
- 0.7 — Post has a funny angle
- 0.3 — Post is neutral, could add humor
- 0.0 — Post is serious/tragic

### emotionality
Does the post make people feel something?
- 1.0 — Strong emotion (frustration, joy, venting)
- 0.7 — Mild emotion (complaint, excitement)
- 0.3 — Neutral/unemotional
- 0.0 — Pure information/fact

### relatability
Can most people in the niche relate?
- 1.0 — Universal experience (roommate drama, trip chaos)
- 0.7 — Common experience for target audience
- 0.3 — Niche/specific experience
- 0.0 — Irrelevant to the space

### reply_count
How much existing engagement (normalized)?
- 1.0 — 5-20 replies (sweet spot — room to add value)
- 0.7 — 20-50 replies (still visible)
- 0.5 — 0-5 replies (early, good for visibility)
- 0.3 — 50-100 replies (crowded)
- 0.0 — 100+ replies (burying)

### freshness
How recent is the post?
- 1.0 — < 1 hour old
- 0.7 — 1-3 hours old
- 0.3 — 3-6 hours old
- 0.1 — 6-12 hours old
- 0.0 — > 12 hours old

## Decision Framework

```
score >= 0.7  →  STRONG engage
score 0.4-0.7 →  GOOD engage
score < 0.4   →  SKIP, find another
```

## Mode Selection Based on Score

After MAX_SEARCHES (3) intent-specific searches with no results:

```python
searches_done = 0
max_searches = 3

if mode == "intent" and searches_done >= max_searches:
    # No high-intent posts found — switch modes
    if random() < 0.6:
        mode = "ambient"  # 60% chance
    else:
        mode = "soft_association"  # 40% chance
```

## Feed-First Approach

Instead of searching:

1. Open the platform's feed/homepage/trending
2. Score the first 20 visible posts using the formula
3. Pick the highest-scoring post
4. If no post scores >= 0.4, scroll and score 20 more
5. If still nothing after 40 posts, switch platforms

This replaces the "search → maybe find something" pattern with "feed → score → engage".

## Intent Mode Scoring (Override)

When explicitly in intent mode, override the scoring:

```
intent_score =
    keyword_relevance * 0.5 +
    buying_signal * 0.3 +
    freshness * 0.2
```

Where:
- keyword_relevance: how well the post matches target keywords
- buying_signal: is the person asking for a recommendation/solution
- freshness: as above

Only engage in intent mode if `intent_score >= 0.6`.
