import { OpenTabsPlugin } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
declare class DevtoPlugin extends OpenTabsPlugin {
    readonly name = "devto";
    readonly description = "DEV.to community interaction \u2014 browse articles, search by tag, write posts, comment, bookmark, follow users";
    readonly displayName = "DEV.to";
    readonly urlPatterns: string[];
    readonly tools: ToolDefinition[];
    isReady(): Promise<boolean>;
}
declare const _default: DevtoPlugin;
export default _default;
//# sourceMappingURL=index.d.ts.map