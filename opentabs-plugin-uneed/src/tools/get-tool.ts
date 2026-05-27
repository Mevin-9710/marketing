import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';
import { extractNuxtData } from '../nuxt-utils.js';

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
    votesSum: z.number().optional(),
    maker: z.string().optional(),
    tags: z.array(z.string()).optional(),
    pricing: z.string().optional(),
    category: z.string().optional(),
  }),
  async handle(params) {
    let html = '';
    let toolData: Record<string, any> | null = null;

    if (params.tool_url) {
      const url = params.tool_url.startsWith('http') ? params.tool_url : `https://www.uneed.best${params.tool_url}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) {
        throw ToolError.internal(`Failed to load tool page: ${response.status}`);
      }
      html = await response.text();
      const slug = url.split('/tool/')[1]?.split('?')[0]?.split('#')[0] || '';
      toolData = extractNuxtData(html, `tool-${slug}`) as Record<string, any> | null;
    } else {
      toolData = {
        name: document.querySelector('h1')?.textContent?.trim() || document.title.replace(/ — .*$/, '').trim() || '',
        tagline: document.querySelector('[class*="tagline"], meta[name="description"]')?.textContent?.trim()
          || (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content?.split('.')[0],
        description: document.querySelector('[class*="description"] p, [class*="about"]')?.textContent?.trim()
          || (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content,
        voteCount: undefined,
        url: window.location.href,
      } as any;
    }

    if (!toolData) {
      throw ToolError.notFound('Could not find tool data. Make sure the tool URL is correct.');
    }

    const tags = toolData.Tags?.map((t: any) => t.name || t) || [];

    log.info('Got tool details', { name: toolData.name });
    return {
      name: toolData.name || '',
      tagline: toolData.description || (typeof toolData.richDescription === 'string' ? toolData.richDescription.replace(/<[^>]*>/g, '').substring(0, 200) : undefined),
      description: typeof toolData.richDescription === 'string' ? toolData.richDescription.replace(/<[^>]*>/g, '').substring(0, 1000) : toolData.description,
      url: toolData.url || params.tool_url,
      voteCount: toolData.votesCount ?? toolData.votes_count,
      votesSum: toolData.votesSum ?? toolData.votes_sum,
      maker: toolData.author?.username,
      tags: tags.length ? tags : undefined,
      pricing: toolData.pricing,
      category: toolData.category,
    };
  },
});
