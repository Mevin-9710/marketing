import { OpenTabsPlugin } from '@opentabs-dev/plugin-sdk';
import type { ToolDefinition } from '@opentabs-dev/plugin-sdk';
declare class QuoraPlugin extends OpenTabsPlugin {
    readonly name = "quora";
    readonly description = "Full Quora interaction through the browser \u2014 search questions, read/write answers, upvote, follow, comment, bookmark, and more";
    readonly displayName = "Quora";
    readonly urlPatterns: string[];
    readonly tools: ToolDefinition[];
    isReady(): Promise<boolean>;
}
declare const _default: QuoraPlugin;
export default _default;
//# sourceMappingURL=index.d.ts.map