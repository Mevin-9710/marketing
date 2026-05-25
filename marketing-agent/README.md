# Rixly Outreach — AI Social Media Marketing Agent

An **opencode subagent** that automates social media community marketing for [Rixly](https://userixly.com) — posts helpful AI-generated comments on relevant discussions across multiple platforms.

## Quick Start

```bash
# 1. Run setup (checks dependencies, initializes database)
bash marketing-agent/setup.sh

# 2. Invoke in opencode
# @rixly-outreach find lead gen discussions on Hacker News and IndieHackers today
```

## Requirements

- [opencode](https://opencode.ai) installed
- [OpenTabs MCP](MCP-SETUP.md) configured (Chrome extension + MCP server)
- Logged into target platforms in Chrome

## Platforms (v1)

| Platform | URL | Daily Limit |
|----------|-----|-------------|
| Hacker News | news.ycombinator.com | 5 |
| IndieHackers | indiehackers.com | 5 |
| Quora | quora.com | 5 |
| Bluesky | bsky.app | 10 |
| Substack | substack.com | 5 |
| uneed.best | uneed.best | 5 |

## Structure

```
marketing-agent/
  SKILL.md            # Agent system prompt (loaded by opencode)
  persona.md          # Rixly product knowledge & brand voice
  setup.sh            # One-command setup
  MCP-SETUP.md        # OpenTabs MCP installation guide
  database/
    schema.sql        # SQLite schema (6 tables)
    db.sh            # CLI: log, stats, duplicate check, rate limiting
  platforms/
    hackernews.md     # Per-platform navigation & etiquette guides
    indiehackers.md
    quora.md
    bluesky.md
    substack.md
    uneedbest.md
  analytics/
    report.sh         # Generate session reports
  data/
    rixly-outreach.db # SQLite database (auto-created)
```

## Database Commands

```bash
bash marketing-agent/database/db.sh stats         # Per-platform summary
bash marketing-agent/database/db.sh recent 10     # Last 10 comments
bash marketing-agent/database/db.sh export-csv    # Export all data
bash marketing-agent/analytics/report.sh          # Full session report
```

## Adding a Platform

```bash
# 1. Create the workflow file
touch marketing-agent/platforms/newplatform.md

# 2. Add to database
sqlite3 marketing-agent/data/rixly-outreach.db \
  "INSERT INTO platforms (name, base_url, daily_limit) VALUES ('newplatform', 'https://newplatform.com', 5);"

# 3. Write the navigation/etiquette guide in the .md file
```

## License

MIT
