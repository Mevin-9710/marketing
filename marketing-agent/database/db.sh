#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DB_PATH="$PROJECT_DIR/data/rixly-outreach.db"
SCHEMA_PATH="$SCRIPT_DIR/schema.sql"

ensure_db() {
    mkdir -p "$(dirname "$DB_PATH")"
    if [ ! -f "$DB_PATH" ]; then
        sqlite3 "$DB_PATH" < "$SCHEMA_PATH"
    fi
}

cmd_init() {
    ensure_db
    echo "Database initialized at $DB_PATH"
}

cmd_log_comment() {
    local url="$1"
    local platform="$2"
    local title="$3"
    local author="$4"
    local comment_body="$5"
    local status="${6:-posted}"

    ensure_db

    local platform_id
    platform_id=$(sqlite3 "$DB_PATH" "SELECT id FROM platforms WHERE name='$platform'")

    local discussion_id
    discussion_id=$(sqlite3 "$DB_PATH" "SELECT id FROM discussions WHERE url='$url'")

    if [ -z "$discussion_id" ]; then
        sqlite3 "$DB_PATH" "INSERT INTO discussions (platform_id, platform_name, url, title, author) VALUES ($platform_id, '$platform', '$url', '${title//\'/\'\'}', '${author//\'/\'\'}')"
        discussion_id=$(sqlite3 "$DB_PATH" "SELECT last_insert_rowid()")
    fi

    sqlite3 "$DB_PATH" "INSERT INTO comments (discussion_id, platform_id, url, comment_body, status) VALUES ($discussion_id, $platform_id, '${url//\'/\'\'}', '${comment_body//\'/\'\'}', '$status')"

    sqlite3 "$DB_PATH" "INSERT INTO daily_metrics (date, platform_id, comments_posted) VALUES (date('now'), $platform_id, 1) ON CONFLICT(date, platform_id) DO UPDATE SET comments_posted = comments_posted + 1"

    echo "Logged comment to discussion $discussion_id on $platform"
}

cmd_log_upvote() {
    local url="$1"

    ensure_db
    sqlite3 "$DB_PATH" "UPDATE discussions SET upvoted = upvoted + 1 WHERE url='${url//\'/\'\'}'"

    local platform_name
    platform_name=$(sqlite3 "$DB_PATH" "SELECT p.name FROM discussions d JOIN platforms p ON d.platform_id = p.id WHERE d.url='${url//\'/\'\'}'")
    if [ -n "$platform_name" ]; then
        local pid
        pid=$(sqlite3 "$DB_PATH" "SELECT id FROM platforms WHERE name='$platform_name'")
        sqlite3 "$DB_PATH" "INSERT INTO daily_metrics (date, platform_id, upvotes_given) VALUES (date('now'), $pid, 1) ON CONFLICT(date, platform_id) DO UPDATE SET upvotes_given = upvotes_given + 1"
    fi
    echo "Logged upvote"
}

cmd_log_reply() {
    local comment_id="$1"
    local reply_author="$2"
    local reply_body="$3"

    ensure_db

    local platform_id
    platform_id=$(sqlite3 "$DB_PATH" "SELECT c.platform_id FROM comments c WHERE c.id=$comment_id")

    sqlite3 "$DB_PATH" "INSERT INTO replies (comment_id, platform_id, reply_author, reply_body) VALUES ($comment_id, $platform_id, '${reply_author//\'/\'\'}', '${reply_body//\'/\'\'}')"

    sqlite3 "$DB_PATH" "INSERT INTO daily_metrics (date, platform_id, replies_received) VALUES (date('now'), $platform_id, 1) ON CONFLICT(date, platform_id) DO UPDATE SET replies_received = replies_received + 1"

    echo "Logged reply to comment $comment_id"
}

cmd_stats() {
    ensure_db
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
}

cmd_recent() {
    local limit="${1:-10}"
    ensure_db
    sqlite3 -header -column "$DB_PATH" "
        SELECT c.created_at, p.name AS platform, d.title, substr(c.comment_body, 1, 60) AS comment_preview, c.status
        FROM comments c
        JOIN discussions d ON c.discussion_id = d.id
        JOIN platforms p ON c.platform_id = p.id
        ORDER BY c.created_at DESC
        LIMIT $limit
    "
}

cmd_is_duplicate_url() {
    local url="$1"
    ensure_db
    local exists
    exists=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM discussions WHERE url='${url//\'/\'\'}'")
    if [ "$exists" -gt 0 ]; then
        echo "true"
    else
        echo "false"
    fi
}

cmd_is_duplicate_comment() {
    local text="$1"
    ensure_db
    local exists
    exists=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM comments WHERE comment_body='${text//\'/\'\'}'")
    if [ "$exists" -gt 0 ]; then
        echo "true"
    else
        echo "false"
    fi
}

cmd_daily_count() {
    local platform="$1"
    ensure_db
    local pid
    pid=$(sqlite3 "$DB_PATH" "SELECT id FROM platforms WHERE name='$platform'")
    local count
    count=$(sqlite3 "$DB_PATH" "SELECT COALESCE(comments_posted, 0) FROM daily_metrics WHERE date=date('now') AND platform_id=$pid")
    echo "$count"
}

cmd_export_csv() {
    local file="${1:-$PROJECT_DIR/data/export-$(date +%Y%m%d).csv}"
    ensure_db
    sqlite3 -csv "$DB_PATH" "
        SELECT c.created_at, p.name AS platform, d.url, d.title, c.comment_body, c.status
        FROM comments c
        JOIN discussions d ON c.discussion_id = d.id
        JOIN platforms p ON c.platform_id = p.id
        ORDER BY c.created_at DESC
    " > "$file"
    echo "Exported to $file"
}

cmd_log_guardrail() {
    local action="$1"
    local reason="$2"
    local url="${3:-}"
    ensure_db
    sqlite3 "$DB_PATH" "INSERT INTO guardrails_log (action, reason, discussion_url) VALUES ('${action//\'/\'\'}', '${reason//\'/\'\'}', '${url//\'/\'\'}')"
    echo "Logged guardrail: $action — $reason"
}

case "${1:-help}" in
    init) cmd_init ;;
    log-comment) shift; cmd_log_comment "$@" ;;
    log-upvote) shift; cmd_log_upvote "$@" ;;
    log-reply) shift; cmd_log_reply "$@" ;;
    log-guardrail) shift; cmd_log_guardrail "$@" ;;
    stats) cmd_stats ;;
    recent) shift; cmd_recent "$@" ;;
    is-duplicate-url) shift; cmd_is_duplicate_url "$@" ;;
    is-duplicate-comment) shift; cmd_is_duplicate_comment "$@" ;;
    daily-count) shift; cmd_daily_count "$@" ;;
    export-csv) shift; cmd_export_csv "$@" ;;
    *)
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  init                        Create database and schema"
        echo "  log-comment <url> <platform> <title> <author> <body> [status]"
        echo "  log-upvote <url>"
        echo "  log-reply <comment_id> <author> <body>"
        echo "  log-guardrail <action> <reason> [url]"
        echo "  stats                       Show per-platform summary"
        echo "  recent [limit]              Show recent comments"
        echo "  is-duplicate-url <url>      Check if URL was already engaged"
        echo "  is-duplicate-comment <text> Check if comment text was already used"
        echo "  daily-count <platform>      Comments posted today on platform"
        echo "  export-csv [file]           Export all comments to CSV"
        ;;
esac
