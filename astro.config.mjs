// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeRaw from 'rehype-raw';
import { remarkTwoColumn } from '@mcoster/astro-local-package/utils/remark-two-column';
import { remarkSectionWrapper } from '@mcoster/astro-local-package/utils/remark-section-wrapper';
import remarkShortcodes from '@mcoster/astro-local-package/utils/remark-shortcodes';
import { getTemplateVariables } from '@mcoster/astro-local-package/utils/config-loader';

// Get template variables from business.yaml
const shortcodeValues = getTemplateVariables();

// https://astro.build/config
export default defineConfig({
  // Site URL is required for sitemap generation
  site: 'https://www.goldcoastroofcleaningpros.com.au',
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