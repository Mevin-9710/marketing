# Platform: Discord (discord.com)

## Authentication
Already logged in via Chrome profile and joined relevant servers.

## Navigation
- Open: `https://discord.com/app`
- SPA — Electron/React-based, heavy JS rendering
- Can't search all of Discord — must browse specific servers
- Join servers relevant to: SaaS, startups, marketing, sales, growth

## Finding Relevant Discussions

### Approaches:
- Navigate to relevant servers/channels you're already a member of
- Look for channels like: `#marketing`, `#growth`, `#sales`, `#promotion`, `#share-your-work`, `#feedback`, `#startup-talk`
- Browse recent messages in active channels
- Look for questions asking for recommendations or help
- Cannot search across servers — only within channels you can see

### CSS Selectors:
- Discord uses complex class names (CSS modules) — rely on semantic selectors
- Message list: `div[class*='messages']` or `ol[class*='messages']`
- Message input: `div[role='textbox']` (contenteditable)
- Submit: Enter key (Shift+Enter for newline) or send button
- Channel list: `div[class*='sidebar']` or `nav[class*='sidebar']`
- Server list: `div[class*='guilds']`

### Strategy for Discord:
- Discord's DOM is notoriously hard to target — use `query_elements` extensively
- Screenshot to understand the layout each session
- The message input is usually a contenteditable div at the bottom
- Sending is typically Ctrl/Cmd+Enter or clicking a send button

## Engaging in a Channel

### Steps:
1. Navigate to the relevant channel (click on it in the sidebar)
2. Read recent messages and context
3. Find the message input at the bottom
4. Generate helpful reply
5. Type into the message input
6. Press Enter (or click send) to submit

## Platform-Specific Etiquette

- Discord communities vary widely — observe each server's culture first
- Many servers have self-promotion channels — use those when available
- Focus on being helpful in general channels before promoting
- Read pinned messages and channel rules
- Don't DM users without permission
- Don't post the same message across multiple channels
- Longer, thoughtful responses in help channels are valued
- Use threaded replies when the server supports them
- Respect each server's specific rules about promotion

## Keywords to Track
- lead generation, B2B, SaaS, growth
- customer acquisition, marketing, sales
- finding clients, cold outreach
- startup advice, tool recommendations
- Discord-specific: look for "anyone know", "recommend", "what do you use"