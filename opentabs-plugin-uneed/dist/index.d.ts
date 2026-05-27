import { OpenTabsPlugin } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
declare class UneedPlugin extends OpenTabsPlugin {
    readonly name = "uneed";
    readonly description = "Uneed community interaction \u2014 browse the community feed, post, comment, like, view tool profiles and collections";
    readonly displayName = "Uneed";
    readonly urlPatterns: string[];
    readonly tools: ToolDefinition[];
    isReady(): Promise<boolean>;
}
declare const _default: UneedPlugin;
export default _default;
//# sourceMappingURL=index.d.ts.map