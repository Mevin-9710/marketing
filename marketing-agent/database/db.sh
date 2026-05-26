#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DB_PATH="$PROJECT_DIR/data/ss-outreach.db"
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
    local mode="${6:-intent}"
    local template_id="${7:-}"
    local status="${8:-posted}"

    ensure_db

    local platform_id
    platform_id=$(sqlite3 "$DB_PATH" "SELECT id FROM platforms WHERE name='$platform'")

    local discussion_id
    discussion_id=$(sqlite3 "$DB_PATH" "SELECT id FROM discussions WHERE url='$url'")

    if [ -z "$discussion_id" ]; then
        sqlite3 "$DB_PATH" "INSERT INTO discussions (platform_id, platform_name, url, title, author) VALUES ($platform_id, '$platform', '$url', '${title//\'/\'\'}', '${author//\'/\'\'}')"
        discussion_id=$(sqlite3 "$DB_PATH" "SELECT last_insert_rowid()")
    fi

    sqlite3 "$DB_PATH" "INSERT INTO comments (discussion_id, platform_id, url, comment_body, engagement_mode, template_id, status) VALUES ($discussion_id, $platform_id, '${url//\'/\'\'}', '${comment_body//\'/\'\'}', '$mode', $( [ -n "$template_id" ] && echo "$template_id" || echo "NULL" ), '$status')"

    sqlite3 "$DB_PATH" "INSERT INTO daily_metrics (date, platform_id, comments_posted, ${mode}_comments) VALUES (date('now'), $platform_id, 1, 1) ON CONFLICT(date, platform_id) DO UPDATE SET comments_posted = comments_posted + 1, ${mode}_comments = ${mode}_comments + 1"

    echo "Logged $mode comment to discussion $discussion_id on $platform"
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

cmd_log_template_use() {
    local template_id="$1"
    ensure_db
    sqlite3 "$DB_PATH" "UPDATE templates SET times_used = times_used + 1 WHERE id=$template_id"
    echo "Logged template use: $template_id"
}

cmd_import_templates() {
    local file="${1:-$PROJECT_DIR/voice/templates.md}"
    ensure_db
    local count=0
    local category=""
    local archetype=""

    while IFS= read -r line; do
        if echo "$line" | grep -q "^### "; then
            category=$(echo "$line" | sed 's/^### //' | tr '[:upper:]' '[:lower:]' | sed 's/ /_/g')
        elif echo "$line" | grep -qE "^[0-9]+\. "; then
            archetype=$(echo "$line" | sed 's/^[0-9]*\. //')
            sqlite3 "$DB_PATH" "INSERT OR IGNORE INTO templates (category, archetype, body) VALUES ('$category', '${archetype//\'/\'\'}', '${archetype//\'/\'\'}')"
            count=$((count + 1))
        fi
    done < "$file"
    echo "Imported $count templates from $file"
}

cmd_stats() {
    ensure_db
    sqlite3 -header -column "$DB_PATH" "
        SELECT
            p.name AS platform,
            COUNT(DISTINCT d.id) AS discussions,
            COUNT(c.id) AS comments,
            COALESCE(SUM(CASE WHEN c.engagement_mode='intent' THEN 1 ELSE 0 END), 0) AS intent,
            COALESCE(SUM(CASE WHEN c.engagement_mode='ambient' THEN 1 ELSE 0 END), 0) AS ambient,
            COALESCE(SUM(CASE WHEN c.engagement_mode='soft_association' THEN 1 ELSE 0 END), 0) AS soft,
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
        SELECT c.created_at, p.name AS platform, c.engagement_mode, d.title, substr(c.comment_body, 1, 60) AS comment_preview, c.status
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

cmd_templates() {
    local category="${1:-}"
    ensure_db
    if [ -n "$category" ]; then
        sqlite3 -header -column "$DB_PATH" "
            SELECT id, category, substr(archetype, 1, 80) AS archetype, times_used
            FROM templates
            WHERE category = '$category'
            ORDER BY times_used ASC
        "
    else
        sqlite3 -header -column "$DB_PATH" "
            SELECT category, COUNT(*) AS count, SUM(times_used) AS total_used
            FROM templates
            GROUP BY category
            ORDER BY count DESC
        "
    fi
}

cmd_export_csv() {
    local file="${1:-$PROJECT_DIR/data/export-$(date +%Y%m%d).csv}"
    ensure_db
    sqlite3 -csv "$DB_PATH" "
        SELECT c.created_at, p.name AS platform, c.engagement_mode, d.url, d.title, c.comment_body, c.status
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
    local mode="${4:-}"
    ensure_db
    sqlite3 "$DB_PATH" "INSERT INTO guardrails_log (action, reason, discussion_url, engagement_mode) VALUES ('${action//\'/\'\'}', '${reason//\'/\'\'}', '${url//\'/\'\'}', '${mode//\'/\'\'}')"
    echo "Logged guardrail: $action — $reason"
}

case "${1:-help}" in
    init) cmd_init ;;
    log-comment) shift; cmd_log_comment "$@" ;;
    log-upvote) shift; cmd_log_upvote "$@" ;;
    log-reply) shift; cmd_log_reply "$@" ;;
    log-template-use) shift; cmd_log_template_use "$@" ;;
    log-guardrail) shift; cmd_log_guardrail "$@" ;;
    import-templates) shift; cmd_import_templates "$@" ;;
    stats) cmd_stats ;;
    recent) shift; cmd_recent "$@" ;;
    templates) shift; cmd_templates "$@" ;;
    is-duplicate-url) shift; cmd_is_duplicate_url "$@" ;;
    is-duplicate-comment) shift; cmd_is_duplicate_comment "$@" ;;
    daily-count) shift; cmd_daily_count "$@" ;;
    export-csv) shift; cmd_export_csv "$@" ;;
    *)
        echo "Usage: $0 <command> [args]"
        echo ""
        echo "Commands:"
        echo "  init                        Create database and schema"
        echo "  log-comment <url> <platform> <title> <author> <body> [mode] [template_id] [status]"
        echo "  log-upvote <url>"
        echo "  log-reply <comment_id> <author> <body>"
        echo "  log-template-use <template_id>"
        echo "  log-guardrail <action> <reason> [url] [mode]"
        echo "  import-templates [file]     Import templates from templates.md"
        echo "  stats                       Show per-platform summary with mode breakdown"
        echo "  recent [limit]              Show recent comments"
        echo "  templates [category]        List templates by category"
        echo "  is-duplicate-url <url>      Check if URL was already engaged"
        echo "  is-duplicate-comment <text> Check if comment text was already used"
        echo "  daily-count <platform>      Comments posted today on platform"
        echo "  export-csv [file]           Export all comments to CSV"
        ;;
esac