#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(pwd)"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Rixly Outreach Agent — Setup ===${NC}"
echo ""

# 1. Check opencode exists
if ! command -v opencode &>/dev/null; then
    echo -e "${YELLOW}opencode not found in PATH. Install it first:${NC}"
    echo "  curl -fsSL https://opencode.ai/install | bash"
    echo ""
    echo "Or install via npm: npm install -g opencode-ai"
    exit 1
fi
echo -e "${GREEN}✓${NC} opencode found: $(which opencode)"

# 2. Check opencode.json
CONFIG_FILE="$PROJECT_DIR/opencode.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}No opencode.json found in $PROJECT_DIR${NC}"
    echo -e "Run 'opencode' first to initialize the project, or create opencode.json manually."
    exit 1
fi
echo -e "${GREEN}✓${NC} Config found: $CONFIG_FILE"

# 3. Install the agent files
echo ""
echo -e "${YELLOW}Installing agent files...${NC}"

AGENT_DIR="$PROJECT_DIR/marketing-agent"
if [ "$SCRIPT_DIR" != "$AGENT_DIR" ]; then
    if [ -d "$AGENT_DIR" ]; then
        echo -e "${YELLOW}  marketing-agent/ already exists at $AGENT_DIR — skipping copy${NC}"
        echo -e "  ${YELLOW}To update: cp -r $SCRIPT_DIR/* $AGENT_DIR/${NC}"
    else
        cp -r "$SCRIPT_DIR" "$AGENT_DIR"
        echo -e "${GREEN}  ✓${NC} Copied to $AGENT_DIR"
    fi
else
    echo -e "${GREEN}  ✓${NC} Already at $AGENT_DIR"
fi

# 4. Initialize database
echo ""
echo -e "${YELLOW}Initializing database...${NC}"
bash "$AGENT_DIR/database/db.sh" init
echo -e "${GREEN}  ✓${NC} Database initialized"

# 5. Check if MCP (opentabs) is configured
echo ""
echo -e "${YELLOW}Checking MCP configuration...${NC}"
MCP_CONFIGURED=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
print('yes' if 'mcp' in cfg and 'opentabs' in cfg['mcp'] else 'no')
")
if [ "$MCP_CONFIGURED" = "yes" ]; then
    echo -e "${GREEN}  ✓${NC} OpenTabs MCP already configured"
else
    echo -e "${RED}  ✗${NC} OpenTabs MCP not configured!"
    echo ""
    echo "  You need to add the OpenTabs MCP server to $CONFIG_FILE:"
    echo ""
    echo '  "mcp": {'
    echo '    "opentabs": {'
    echo '      "type": "remote",'
    echo '      "url": "http://127.0.0.1:9515/mcp",'
    echo '      "headers": {'
    echo '        "Authorization": "Bearer <YOUR_AUTH_TOKEN>"'
    echo '      }'
    echo '    }'
    echo '  }'
fi

# 6. Check if rixly-outreach agent is configured
echo ""
echo -e "${YELLOW}Checking agent configuration...${NC}"
AGENT_CONFIGURED=$(python3 -c "
import json
with open('$CONFIG_FILE') as f:
    cfg = json.load(f)
print('yes' if 'agent' in cfg and 'rixly-outreach' in cfg['agent'] else 'no')
")
if [ "$AGENT_CONFIGURED" = "yes" ]; then
    echo -e "${GREEN}  ✓${NC} rixly-outreach agent already in opencode.json"
else
    echo -e "${RED}  ✗${NC} rixly-outreach agent not configured!"
    echo "  Add this to the 'agent' section of $CONFIG_FILE:"
    echo ""
    cat << 'AGENTCFG'
  "rixly-outreach": {
    "description": "Social media community marketing agent for Rixly — finds relevant discussions on HN, IndieHackers, Quora, Bluesky, Substack, uneed.best and posts helpful AI-generated comments",
    "mode": "subagent",
    "prompt": "{file:./marketing-agent/SKILL.md}",
    "permission": {
      "bash": "allow",
      "webfetch": "allow",
      "websearch": "allow",
      "opentabs_browser_*": "allow"
    }
  }
AGENTCFG
fi

# 7. Summary
echo ""
echo -e "${GREEN}=== Setup Complete ===${NC}"
echo ""
echo "Next steps:"
echo "  1. Open opencode and run:  @rixly-outreach find lead gen discussions on HN today"
echo "  2. Make sure you're logged into target platforms in Chrome"
echo "  3. To uninstall, just delete:"
echo "     - marketing-agent/ directory"
echo "     - The 'rixly-outreach' entry from opencode.json"
echo ""
echo "Database:  $AGENT_DIR/data/rixly-outreach.db"
echo "Logs:      bash $AGENT_DIR/database/db.sh stats"
echo "Report:    bash $AGENT_DIR/analytics/report.sh"
