# OpenTabs MCP — Setup Guide

The `@rixly-outreach` agent needs the **OpenTabs MCP server** to control the browser. This guide covers setup on all platforms.

## What is OpenTabs?

OpenTabs is a Chrome extension + MCP server that gives opencode (and other AI tools) direct browser control via the Chrome DevTools Protocol. It's what powers all the `opentabs_browser_*` tools.

## Installation

### 1. Install the OpenTabs Chrome Extension

1. Go to the [Chrome Web Store](https://chromewebstore.google.com/detail/opentabs) and add OpenTabs to Chrome
2. Pin the extension for easy access

### 2. Install the OpenTabs MCP Server

```bash
npm install -g opentabs
```

Verify it's installed:
```bash
opentabs --version
```

### 3. Get Your Auth Token

1. Click the OpenTabs extension icon in Chrome
2. Go to Settings / Connection
3. Copy your **Auth Token**

### 4. Configure opencode.json

Add the MCP server to your project's `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "opentabs": {
      "type": "remote",
      "url": "http://127.0.0.1:9515/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_AUTH_TOKEN_HERE"
      }
    }
  }
}
```

### 5. Start the MCP Server

In a terminal (keep it running):
```bash
opentabs start
```

## Launcher Scripts

For convenience, launcher scripts are included that start everything at once:

| Platform | Script | What it does |
|----------|--------|-------------|
| Linux | `opencode-launcher.sh` | Launches Chrome, starts `opentabs start`, opens opencode |
| macOS | `opencode-launcher.sh` + `.plist` | Same as Linux, auto-start on login via launchd |
| Windows | `opencode-launcher.ps1` | Launches Chrome, starts `opentabs start`, opens opencode |

### Linux

Run directly:
```bash
bash opencode-launcher.sh
```

### macOS

For auto-start on login:
```bash
cp com.user.opencode-launcher.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.user.opencode-launcher.plist
```

### Windows

Run in PowerShell:
```powershell
.\opencode-launcher.ps1
```

## Verification

Once the MCP server is running and configured, verify by listing browser tabs in opencode:

```
opentabs_browser_list_tabs
```

If you see your open Chrome tabs, everything is working.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Connection refused` when starting | Make sure the OpenTabs Chrome extension is installed and enabled |
| `401 Unauthorized` | Your auth token is wrong — regenerate it in the extension settings |
| No tabs returned | Make sure Chrome is running and the extension is active |
| Token rotation | Auth tokens expire periodically — check the extension for a new one |
