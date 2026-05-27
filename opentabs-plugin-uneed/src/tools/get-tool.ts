import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getTool = defineTool({
  name: 'get_tool',
  displayName: 'Get Tool Details',
  description: 'Get details about a specific tool/product on Uneed — description, votes, maker, comments.',
  icon: 'info',
  group: 'Discovery',
  input: z.object({
    tool_url: z.string().optional().describe('URL of the tool page. Leave empty if already on it.'),
  }),
  output: z.object({
    name: z.string(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    voteCount: z.number().optional(),
    maker: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  async handle(params) {
    if (params.tool_url && !window.location.href.includes('/tool/')) {
      return { name: 'Navigate to the tool page first', description: `Open ${params.tool_url} in your browser, then call get_tool without tool_url.`, url: params.tool_url };
    }

    const name = document.querySelector('h1')?.textContent?.trim()
      || document.title.replace(/ — (Marketing|Development|Design|Productivity).*$/, '').trim() || '';
    const tagline = document.querySelector('[class*="tagline"], meta[name="description"]')?.textContent?.trim()
      || (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content?.split('.')[0];
    const description = document.querySelector('[class*="description"] p, [class*="about"]')?.textContent?.trim()
      || (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content;
    const voteText = document.title.match(/\((\d+)\)/)?.[1]
      || document.body.textContent?.match(/(\d+)\s*Upvotes?/)?.[1];
    const voteCount = voteText ? parseInt(voteText, 10) : undefined;
    const maker = document.body.textContent?.match(/Publisher\s*\n+([^\n]+)/)?.[1]?.trim()
      || document.querySelector('[class*="maker"], [class*="author"]')?.textContent?.trim();

    const bodyText = document.body.textContent || '';
    const tagSection = bodyText.match(/Tags?\s*\n+([^\n]+)/)?.[1] || '';
    const tags = tagSection.split('#').map(t => t.trim()).filter(Boolean);

    log.info('Got tool details', { name });
    return { name, tagline, description: description?.substring(0, 1000), url: window.location.href, voteCount, maker, tags: tags.length ? tags : undefined };
  },
});
