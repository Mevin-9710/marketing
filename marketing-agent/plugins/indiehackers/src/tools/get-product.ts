import { defineTool, log, ToolError } from '@opentabs-dev/plugin-sdk';
import { z } from 'zod';

export const getProduct = defineTool({
  name: 'get_product',
  displayName: 'Get Product',
  description: 'Get details about an IndieHackers product page — name, description, revenue, metrics.',
  icon: 'package',
  group: 'Discovery',
  input: z.object({
    product_url: z.string().optional().describe('URL of the product page. Leave empty if already on it.'),
  }),
  output: z.object({
    name: z.string(),
    description: z.string().optional(),
    url: z.string().optional(),
    revenue: z.string().optional(),
    maker: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
  async handle(params) {
    const targetUrl = params.product_url || window.location.href;

    if (params.product_url && !window.location.href.includes(params.product_url)) {
      const response = await fetch(targetUrl, { credentials: 'include' });
      if (!response.ok) {
        throw ToolError.internal(`Failed to load product page: ${response.status}`);
      }
      const html = await response.text();
      const doc = document.createElement('div');
      doc.innerHTML = html;
      document.body.innerHTML = doc.innerHTML;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const name = document.querySelector('.product-page__name, h1, [class*="product-name"], [class*="product-title"]')?.textContent?.trim() || '';
    const description = document.querySelector('.product-page__description, [class*="description"], meta[name="description"]')?.textContent?.trim()
      || (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content
      || '';
    const revenue = document.querySelector('[class*="revenue"], [class*="mrr"]')?.textContent?.trim();
    const maker = document.querySelector('[class*="maker"] a, [class*="founder"] a')?.textContent?.trim();

    const tagEls = document.querySelectorAll('[class*="tag"], [class*="badge"]');
    const tags = Array.from(tagEls).map(t => t.textContent?.trim()).filter(Boolean) as string[];

    log.info('Got product', { name });
    return { name, description: description.substring(0, 1000), url: targetUrl, revenue, maker, tags };
  },
});
