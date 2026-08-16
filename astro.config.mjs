// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Your live URL. Update this after Cloudflare gives you the real .pages.dev
  // address — it is used to build absolute links for SEO and social previews.
  site: 'https://jack-friesen.pages.dev',

  vite: {
    resolve: {
      alias: {
        // Lets any page do:  import { site } from '@config'
        '@config': fileURLToPath(new URL('./site.config.ts', import.meta.url)),
      },
    },
  },
});
