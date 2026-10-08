// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Auth runs as a Pages Function (functions/api/auth/*) — the site stays fully static.
export default defineConfig({
  site: 'https://openmac.dev',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
