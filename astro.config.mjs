// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeRaw from 'rehype-raw';
import { remarkTwoColumn } from './src/lib/remark-two-column';
import { remarkSectionWrapper } from './src/lib/remark-section-wrapper';
import remarkShortcodes from './src/lib/remark-shortcodes';
import { getTemplateVariables } from './src/lib/config-loader.js';

// Get template variables from business.yaml
const shortcodeValues = getTemplateVariables();

// https://astro.build/config
export default defineConfig({
  // Site URL is required for sitemap generation
  site: 'https://www.adelaideroofcleaning.com.au',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [
      remarkSectionWrapper, 
      remarkTwoColumn,
      [remarkShortcodes, shortcodeValues]
    ],
    rehypePlugins: [rehypeRaw]
  },
  vite: {
    plugins: [tailwindcss()]
  }
});