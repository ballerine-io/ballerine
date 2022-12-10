import { defineConfig } from 'astro/config';

// https://astro.build/config
import solidJs from '@astrojs/solid-js';

// https://astro.build/config
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [
    // Enable React for the Algolia search component.
    // react(),
    solidJs(),
    mdx(),
  ],
  site: `https://ballerine.io`,
  markdown: {
    shikiConfig: {
      wrap: true,
      langs: [`typescript`, `bash`, `html`, `json`],
    },
  },
});
