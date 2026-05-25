---
name: ot-browser
description: Full browser automation using OpenTabs MCP (Chrome extension). Use for all browser tasks: navigation, clicking, typing, scraping, screenshots, form filling, and any other browser interaction. Triggers: browser, web, open tabs, navigate, click, type, scrape, screenshot, automate, form fill, login, test.
---

# ot-browser — Full Browser Automation via OpenTabs MCP

Anything a human can do in a browser, you can do with OpenTabs MCP. The browser is already running — you just find the right tab (or open one) and interact via CSS selectors.

## How it works

Every OpenTabs MCP call needs a `tabId`. You get one from `opentabs_browser_list_tabs` (find existing tabs) or `opentabs_browser_open_tab` (open a new one). Save it and reuse it for all subsequent interactions on that tab.

## Todo-Driven Execution

Every browser automation task MUST start with a `todowrite` plan. Break the goal into granular steps, track each one as I go, and never skip the screenshot verification step. Mark each step `in_progress` before executing and `completed` when verified.

Example:
- Open tab and navigate → screenshot → read page → fill email → fill password → click sign in → screenshot to verify → close tab

## Core Workflow (6-step loop)

For every browser task, follow this cycle:

### 1. Find or open a tab

```
opentabs_browser_list_tabs
```

or

```
opentabs_browser_open_tab(url: "https://example.com")
```

Save the returned `tabId`.

### 2. Screenshot to see the page

```
opentabs_browser_screenshot_tab(tabId: <tabId>)
```

Always screenshot first. I visually analyze the image to understand layout, element positions, button labels, and page structure. This drives my next decisions.

### 3. Read page content

After seeing the screenshot, read the page to discover interactive elements:

```
opentabs_browser_get_tab_content(tabId: <tabId>)
```

or for full DOM:

```
opentabs_browser_get_page_html(tabId: <tabId>)
```

or to discover elements and their selectors:

```
opentabs_browser_query_elements(tabId: <tabId>, selector: "button, a, input, select, textarea")
```

### 4. Interact

Armed with visual knowledge + the DOM structure, use CSS selectors:

```
opentabs_browser_click_element(tabId: <tabId>, selector: "#submit-btn")
opentabs_browser_type_text(tabId: <tabId>, selector: "input[name='email']", text: "user@example.com")
opentabs_browser_select_option(tabId: <tabId>, selector: "select#country", value: "US")
opentabs_browser_press_key(tabId: <tabId>, key: "Enter")
opentabs_browser_hover_element(tabId: <tabId>, selector: ".dropdown")
opentabs_browser_scroll(tabId: <tabId>, direction: "down")
opentabs_browser_execute_script(tabId: <tabId>, code: "document.title")
```

### 5. Verify with screenshot

```
opentabs_browser_screenshot_tab(tabId: <tabId>)
```

### 6. Close when done

```
opentabs_browser_close_tab(tabId: <tabId>)
```

## Tool Reference

### Tab & Window Management

| Action | Tool | Notes |
|--------|------|-------|
| Open URL in new tab | `opentabs_browser_open_tab(url)` | Returns `tabId` |
| List all open tabs | `opentabs_browser_list_tabs` | Find tabIds across all windows |
| Navigate existing tab | `opentabs_browser_navigate_tab(tabId, url)` | |
| Get tab info | `opentabs_browser_get_tab_info(tabId)` | URL, title, loading status |
| Close tab | `opentabs_browser_close_tab(tabId)` | |
| Focus (activate) tab | `opentabs_browser_focus_tab(tabId)` | Brings tab to foreground |
| Create new window | `opentabs_browser_create_window(url?, width?, height?, state?, incognito?)` | |
| Close window | `opentabs_browser_close_window(windowId)` | |
| List windows | `opentabs_browser_list_windows` | |
| Update window | `opentabs_browser_update_window(windowId, ...)` | Resize, reposition, minimize |

### Reading Page Content

| Action | Tool | Notes |
|--------|------|-------|
| Visible text content | `opentabs_browser_get_tab_content(tabId, selector?, maxLength?)` | Good for reading articles, text |
| Full HTML source | `opentabs_browser_get_page_html(tabId, selector?, maxLength?)` | Full DOM including attributes, data-*, scripts |
| Discover elements | `opentabs_browser_query_elements(tabId, selector, limit?, attributes?)` | Returns tag, text, attributes — use this to find CSS selectors |
| Element styles | `opentabs_browser_get_element_styles(tabId, selector)` | Computed + matched CSS rules |
| Screenshot | `opentabs_browser_screenshot_tab(tabId)` | Visual feedback — use after every significant step |
| List page resources | `opentabs_browser_list_resources(tabId, type?)` | JS, CSS, images, fonts loaded by the page |
| Read resource content | `opentabs_browser_get_resource_content(tabId, url)` | Read a JS/CSS file from browser cache |

### Interaction (CSS Selectors)

| Action | Tool | Notes |
|--------|------|-------|
| Click element | `opentabs_browser_click_element(tabId, selector)` | Dispatches trusted mouse events (mousedown+mouseup) |
| Type into input | `opentabs_browser_type_text(tabId, selector, text, clear?)` | Clears field by default (set `clear: false` to append) |
| Select dropdown | `opentabs_browser_select_option(tabId, selector, value|label)` | Provide `value` (option attribute) or `label` (visible text) |
| Hover over element | `opentabs_browser_hover_element(tabId, selector)` | Reveals tooltips, dropdown menus, popovers |
| Press keyboard key | `opentabs_browser_press_key(tabId, key, selector?, modifiers?)` | Enter, Escape, Tab, ArrowDown, etc. Supports Ctrl/Meta/Shift/Alt |
| Scroll | `opentabs_browser_scroll(tabId, direction|position|selector?)` | Scroll page or specific scrollable container |
| Execute JavaScript | `opentabs_browser_execute_script(tabId, code)` | Full access to page globals, DOM, localStorage. Must return JSON |
| Wait for element | `opentabs_browser_wait_for_element(tabId, selector, timeout?, visible?)` | Essential for SPAs and dynamic content |
| Force CSS pseudo-state | `opentabs_browser_force_pseudo_state(tabId, selector, pseudoClasses)` | Inspect:hover/:focus/:active styles |

### Network & Console

| Action | Tool | Notes |
|--------|------|-------|
| Start network capture | `opentabs_browser_enable_network_capture(tabId, urlFilter?, maxRequests?, maxConsoleLogs?)` | Filter by `/api` to reduce noise |
| Get captured requests | `opentabs_browser_get_network_requests(tabId, clear?)` | Includes request/response headers, bodies, timing |
| Get console logs | `opentabs_browser_get_console_logs(tabId, level?, clear?)` | Filter: all, log, warn, error, info, debug |
| Clear console logs | `opentabs_browser_clear_console_logs(tabId)` | |
| Export as HAR | `opentabs_browser_export_har(tabId, includeWebSocketFrames?, clear?)` | Standard HAR format for DevTools |
| Throttle network | `opentabs_browser_throttle_network(tabId, preset?)` | offline, slow-3g, 3g, 4g, wifi or custom latency/throughput |
| Clear network throttle | `opentabs_browser_clear_network_throttle(tabId)` | |
| Stop network capture | `opentabs_browser_disable_network_capture(tabId)` | Releases the CDP debugger |

### Request Interception

| Action | Tool | Notes |
|--------|------|-------|
| Start intercepting | `opentabs_browser_intercept_requests(tabId, urlPatterns?)` | Pause matching requests (default: all) |
| Fulfill with custom response | `opentabs_browser_fulfill_request(tabId, requestId, status, headers?, body?)` | Return mock data |
| Fail with error | `opentabs_browser_fail_request(tabId, requestId, errorReason?)` | Simulate network failures, timeouts, DNS errors |
| Stop intercepting | `opentabs_browser_stop_intercepting(tabId)` | Releases all paused requests |

### Storage & Site Data

| Action | Tool | Notes |
|--------|------|-------|
| Read web storage | `opentabs_browser_get_storage(tabId, storageType?, key?)` | localStorage or sessionStorage |
| Get cookies | `opentabs_browser_get_cookies(url, name?)` | Includes HttpOnly cookies |
| Set cookie | `opentabs_browser_set_cookie(url, name, value, domain?, path?, secure?, httpOnly?, expirationDate?)` | |
| Delete cookie | `opentabs_browser_delete_cookies(url, name)` | |
| Clear site data | `opentabs_browser_clear_site_data(origin, cookies?, localStorage?, cache?, indexedDB?, serviceWorkers?)` | Selective clearing |

### Device & Emulation

| Action | Tool | Notes |
|--------|------|-------|
| Emulate device | `opentabs_browser_emulate_device(tabId, width, height, deviceScaleFactor?, mobile?, userAgent?)` | Viewport + UA + mobile flag |
| Override geolocation | `opentabs_browser_set_geolocation(tabId, latitude, longitude, accuracy?)` | |
| Override media features | `opentabs_browser_set_media_features(tabId, features)` | prefers-color-scheme (light/dark), prefers-reduced-motion, etc. |
| Simulate vision deficiency | `opentabs_browser_emulate_vision_deficiency(tabId, type)` | blurredVision, deuteranopia, protanopia, etc. |
| Clear all emulation | `opentabs_browser_clear_emulation(tabId)` | Resets device, UA, geolocation, media features, vision |

### Dialogs, Downloads, History

| Action | Tool | Notes |
|--------|------|-------|
| Handle JS dialog | `opentabs_browser_handle_dialog(tabId, action, promptText?)` | Accept/dismiss alert, confirm, prompt |
| Download file | `opentabs_browser_download_file(url, filename?, saveAs?)` | Returns download ID |
| Check download status | `opentabs_browser_get_download_status(downloadId)` | progress, bytes, state |
| List downloads | `opentabs_browser_list_downloads(query?, state?, limit?)` | |
| Search history | `opentabs_browser_search_history(query, maxResults?, startTime?, endTime?)` | |
| Get visit details | `opentabs_browser_get_visits(url)` | Visit timestamps and transition types |
| Recently closed tabs | `opentabs_browser_get_recently_closed(maxResults?)` | |
| Restore closed tab/window | `opentabs_browser_restore_session(sessionId)` | |

### Bookmarks & Tab Groups

| Action | Tool | Notes |
|--------|------|-------|
| Create bookmark | `opentabs_browser_create_bookmark(title, url, parentId?)` | |
| List bookmark tree | `opentabs_browser_list_bookmark_tree(parentId?, maxDepth?)` | |
| Search bookmarks | `opentabs_browser_search_bookmarks(query)` | |
| Create tab group | `opentabs_browser_create_tab_group(tabIds, title?, color?)` | grey, blue, red, yellow, green, pink, purple, cyan, orange |
| Update tab group | `opentabs_browser_update_tab_group(groupId, title?, color?, collapsed?)` | |
| List tab groups | `opentabs_browser_list_tab_groups(windowId?)` | |
| List tabs in group | `opentabs_browser_list_tabs_in_group(groupId)` | |
| Add tabs to group | `opentabs_browser_add_tabs_to_group(groupId, tabIds)` | |
| Remove from group | `opentabs_browser_remove_tabs_from_group(tabIds)` | Ungroup tabs |

### WebSocket Capture

| Action | Tool | Notes |
|--------|------|-------|
| Get WebSocket frames | `opentabs_browser_get_websocket_frames(tabId, clear?)` | Sent/received frames with payloads. Enable capture first. |

## Screenshot-Driven Interaction

The screenshots give me visual understanding of the page. Here is how I combine visual + DOM knowledge:

1. **Take a screenshot** — I see the page layout, button labels, input positions
2. **Query elements** to find CSS selectors — `opentabs_browser_query_elements(tabId, selector: "button, input, a, select")` returns tag names, text, and attributes
3. **Match visual to DOM** — I use the screenshot to know what I'm looking for, then use the exact CSS selector from `query_elements` output
4. **Interact** — click, type, or select with the confirmed selector
5. **Screenshot again** — confirm the result visually

## Practical Workflows

### Extract data from a page

```
opentabs_browser_open_tab(url: "https://example.com/list")
opentabs_browser_wait_for_element(tabId, selector: ".content", visible: true)
opentabs_browser_screenshot_tab(tabId)
opentabs_browser_get_tab_content(tabId)
opentabs_browser_close_tab(tabId)
```

### Form filling with visual verification

```
opentabs_browser_open_tab(url: "https://example.com/signup")
opentabs_browser_screenshot_tab(tabId)
opentabs_browser_query_elements(tabId, selector: "input, select, button")
-- match inputs by their labels/placeholders from the screenshot
opentabs_browser_type_text(tabId, selector: "input#name", text: "John")
opentabs_browser_type_text(tabId, selector: "input#email", text: "john@example.com")
opentabs_browser_type_text(tabId, selector: "input#password", text: "s3cret")
opentabs_browser_click_element(tabId, selector: "button[type='submit']")
opentabs_browser_screenshot_tab(tabId)
opentabs_browser_close_tab(tabId)
```

### Login to a service (already logged in via Chrome profile)

```
opentabs_browser_open_tab(url: "https://app.example.com")
opentabs_browser_screenshot_tab(tabId)
-- if login page appears instead of dashboard:
opentabs_browser_query_elements(tabId, selector: "input, button")
opentabs_browser_type_text(tabId, selector: "input[name='email']", text: "...")
opentabs_browser_type_text(tabId, selector: "input[name='password']", text: "...")
opentabs_browser_click_element(tabId, selector: "button:has-text('Sign In')")
opentabs_browser_screenshot_tab(tabId)
```

### API debugging

```
opentabs_browser_enable_network_capture(tabId, urlFilter: "/api")
opentabs_browser_click_element(tabId, selector: ".load-data")
opentabs_browser_get_network_requests(tabId)
opentabs_browser_disable_network_capture(tabId)
```

### Mobile emulation testing

```
opentabs_browser_emulate_device(tabId, width: 375, height: 812, mobile: true, userAgent: "...iPhone...")
opentabs_browser_navigate_tab(tabId, url: "https://example.com")
opentabs_browser_screenshot_tab(tabId)
opentabs_browser_clear_emulation(tabId)
```

### Multi-tab workflow

```
opentabs_browser_open_tab(url: "https://example.com/page1")
opentabs_browser_open_tab(url: "https://example.com/page2")
opentabs_browser_list_tabs
opentabs_browser_get_tab_content(tabId: <id1>)
opentabs_browser_get_tab_content(tabId: <id2>)
opentabs_browser_close_tab(tabId: <id1>)
opentabs_browser_close_tab(tabId: <id2>)
```

### CSS coverage analysis

```
opentabs_browser_get_css_coverage(tabId)
```

### Keyboard shortcut automation

```
opentabs_browser_press_key(tabId, key: "k", selector: "body", modifiers: { ctrl: true })
-- Ctrl+K to open command palette
```

## CSS Selector Tips

Since this skill uses CSS selectors directly, here are effective patterns:

| Goal | Selector |
|------|----------|
| By ID | `#submit-btn` |
| By class | `.btn-primary` |
| By attribute | `[name="email"]`, `[type="submit"]`, `[data-testid="login"]` |
| By tag and attribute | `button[type="submit"]` |
| By text (if supported) | `button:has-text('Sign In')` |
| Nested | `form.login input[type="email"]` |
| Multiple | `button, a.btn, input[type="submit"]` |
| Placeholder | `[placeholder="Search..."]` |
| Partial attribute | `[href*="/product/"]`, `[class*="btn-"]` |

## Key Rules

1. **Screenshot first, always** — I need to see the page visually before I can interact intelligently
2. **Save the tabId** — every interaction needs it. Assign it to a variable like `tabId` or `page1`
3. **`query_elements` to discover selectors** — get the exact CSS selectors for interactive elements
4. **Screenshot after every significant step** — verify visually that the action took effect
5. **Use `wait_for_element` for dynamic content** — SPAs, lazy-loaded data, modals
6. **Close tabs when done** — free browser resources
7. **`execute_script` for advanced extraction** — when `get_tab_content` isn't enough, use JS to return structured data
8. **Network capture has a buffer limit** — set `maxRequests` high enough, or read and clear periodically
9. **Handle dialogs promptly** — `alert()`, `confirm()`, `prompt()` freeze the page. Use `handle_dialog` to dismiss them
10. **Use `clear_emulation` after device/geolocation testing** — otherwise the overrides persist across navigations
