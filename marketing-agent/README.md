# SplitSquad Outreach — AI Social Media Marketing System

An **opencode multi-agent system** that automates social media community marketing for [SplitSquad](https://splitsquad.qzz.io). Uses an orchestrator + 10 platform-specific sub-agents running in parallel with a 3-mode engagement strategy.

## Architecture

```
@ss-outreach (orchestrator)
  ├── task(reddit-agent) ────── parallel
  ├── task(x-agent) ──────────── parallel
  ├── task(discord-agent) ────── parallel
  ├── task(facebook-agent) ───── parallel
  ├── task(hackernews-agent) ─── parallel
  ├── task(indiehackers-agent) ─ parallel
  ├── task(quora-agent) ──────── parallel
  ├── task(bluesky-agent) ────── parallel
  ├── task(substack-agent) ───── parallel
  └── task(uneedbest-agent) ──── parallel

All share → marketing-agent/data/ss-outreach.db
```

## Quick Start

```bash
# 1. Run setup
bash marketing-agent/setup.sh

# 2. Invoke in opencode
# @ss-outreach run outreach on Reddit, X, and HN today
# @ss-outreach hit all platforms
```

## Engagement Strategy (3 Modes)

| Mode | % | Goal | Product mention? |
|------|---|------|------------------|
| Intent | 20% | Find high-intent posts, promote SplitSquad naturally | Yes |
| Ambient | 50% | Be funny/relatable/supportive — build account presence | Never |
| Soft Association | 30% | Associate with the niche (roommates, trips, expenses) | No (bio converts) |

Each agent starts in intent mode (max 3 searches), then falls back to ambient or soft.

## Requirements

- [opencode](https://opencode.ai) installed
- [OpenTabs MCP](MCP-SETUP.md) configured
- Logged into target platforms in Chrome

## Platforms

| Platform | Agent | Daily Limit |
|----------|-------|-------------|
| Reddit | `reddit-agent` | 10 |
| X | `x-agent` | 10 |
| Discord | `discord-agent` | 10 |
| Facebook | `facebook-agent` | 10 |
| Hacker News | `hackernews-agent` | 5 |
| IndieHackers | `indiehackers-agent` | 5 |
| Quora | `quora-agent` | 5 |
| Bluesky | `bluesky-agent` | 10 |
| Substack | `substack-agent` | 5 |
| uneed.best | `uneedbest-agent` | 5 |

## Structure

```
marketing-agent/
  SKILL.md                  # Orchestrator prompt (@ss-outreach)
  persona.md                # SplitSquad brand voice & product knowledge
  setup.sh                  # One-command setup
  MCP-SETUP.md              # OpenTabs MCP installation guide
  agents/
    reddit/SKILL.md         # Per-platform agent prompts (10 total)
    x/SKILL.md
    discord/SKILL.md
    facebook/SKILL.md
    hackernews/SKILL.md
    indiehackers/SKILL.md
    quora/SKILL.md
    bluesky/SKILL.md
    substack/SKILL.md
    uneedbest/SKILL.md
  voice/
    ambient.md              # Funny/relatable/supportive voice guide
    soft-association.md     # Niche association patterns
    templates.md            # 250 pre-written archetypes
  scoring/
    commentability.md       # Post scoring formula
  platforms/                # Platform navigation & etiquette guides
  database/
    schema.sql              # SQLite schema (7 tables)
    db.sh                   # CLI: log, stats, dedup, templates
  analytics/
    report.sh               # Session report with mode breakdown
  data/
    ss-outreach.db          # Shared SQLite database
```

## Database Commands

```bash
bash marketing-agent/database/db.sh stats              # Per-platform with mode breakdown
bash marketing-agent/database/db.sh recent 20          # Last 20 comments
bash marketing-agent/database/db.sh templates          # Template usage stats
bash marketing-agent/database/db.sh templates joke     # Joke templates by category
bash marketing-agent/database/db.sh export-csv         # Export all data
bash marketing-agent/analytics/report.sh               # Full session report
```

## License

MIT