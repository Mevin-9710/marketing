#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DB_PATH="$PROJECT_DIR/data/rixly-outreach.db"

if [ ! -f "$DB_PATH" ]; then
    echo "No database found. Run 'db.sh init' first."
    exit 1
fi

echo "# Rixly Outreach — Session Report"
echo ""
echo "Generated: $(date)"
echo ""

echo "## Per-Platform Summary"
echo ""
sqlite3 -header -column "$DB_PATH" "
    SELECT
        p.name AS platform,
        COUNT(DISTINCT d.id) AS discussions,
        COUNT(c.id) AS comments,
        COALESCE(SUM(d.upvoted), 0) AS upvotes,
        COUNT(r.id) AS replies
    FROM platforms p
    LEFT JOIN discussions d ON d.platform_id = p.id
    LEFT JOIN comments c ON c.platform_id = p.id
    LEFT JOIN replies r ON r.platform_id = p.id
    WHERE p.enabled = 1
    GROUP BY p.name
    ORDER BY comments DESC
"
echo ""

echo "## Today's Activity"
echo ""
sqlite3 -header -column "$DB_PATH" "
    SELECT
        date,
        p.name AS platform,
        comments_posted,
        upvotes_given,
        replies_received
    FROM daily_metrics dm
    JOIN platforms p ON dm.platform_id = p.id
    WHERE dm.date = date('now')
    ORDER BY comments_posted DESC
"
echo ""

echo "## Most Recent Comments"
echo ""
sqlite3 -header -column "$DB_PATH" "
    SELECT
        c.created_at,
        p.name AS platform,
        substr(d.title, 1, 50) AS title,
        substr(c.comment_body, 1, 80) AS comment_preview,
        c.status
    FROM comments c
    JOIN discussions d ON c.discussion_id = d.id
    JOIN platforms p ON c.platform_id = p.id
    ORDER BY c.created_at DESC
    LIMIT 15
"
echo ""

echo "## Guardrails Triggered"
echo ""
sqlite3 -header -column "$DB_PATH" "
    SELECT created_at, action, substr(reason, 1, 60) AS reason
    FROM guardrails_log
    WHERE date(created_at) = date('now')
    ORDER BY created_at DESC
"
echo ""

echo "---"
echo "Total comments all-time: $(sqlite3 "$DB_PATH" 'SELECT COUNT(*) FROM comments')"
echo "Total discussions engaged: $(sqlite3 "$DB_PATH" 'SELECT COUNT(*) FROM discussions')"
echo "Total replies received: $(sqlite3 "$DB_PATH" 'SELECT COUNT(*) FROM replies')"
echo "Guardrails triggered today: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM guardrails_log WHERE date(created_at) = date('now')")"
