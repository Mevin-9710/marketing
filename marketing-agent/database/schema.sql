CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    base_url TEXT NOT NULL,
    enabled INTEGER NOT NULL DEFAULT 1,
    daily_limit INTEGER NOT NULL DEFAULT 10,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS discussions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    platform_name TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    title TEXT,
    author TEXT,
    content_snapshot TEXT,
    keywords_matched TEXT,
    intent_score INTEGER DEFAULT 0,
    upvoted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (platform_id) REFERENCES platforms(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discussion_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    comment_body TEXT NOT NULL,
    ai_generated INTEGER NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'posted',
    error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (discussion_id) REFERENCES discussions(id),
    FOREIGN KEY (platform_id) REFERENCES platforms(id)
);

CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    reply_author TEXT,
    reply_body TEXT,
    handled INTEGER NOT NULL DEFAULT 0,
    notified INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (comment_id) REFERENCES comments(id),
    FOREIGN KEY (platform_id) REFERENCES platforms(id)
);

CREATE TABLE IF NOT EXISTS daily_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    platform_id INTEGER NOT NULL,
    comments_posted INTEGER NOT NULL DEFAULT 0,
    upvotes_given INTEGER NOT NULL DEFAULT 0,
    replies_received INTEGER NOT NULL DEFAULT 0,
    follows_done INTEGER NOT NULL DEFAULT 0,
    UNIQUE(date, platform_id),
    FOREIGN KEY (platform_id) REFERENCES platforms(id)
);

CREATE TABLE IF NOT EXISTS guardrails_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    reason TEXT NOT NULL,
    discussion_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO platforms (name, base_url, daily_limit) VALUES
    ('hackernews', 'https://news.ycombinator.com', 5),
    ('indiehackers', 'https://www.indiehackers.com', 5),
    ('quora', 'https://www.quora.com', 5),
    ('bluesky', 'https://bsky.app', 10),
    ('substack', 'https://substack.com', 5),
    ('uneedbest', 'https://uneed.best', 5);
