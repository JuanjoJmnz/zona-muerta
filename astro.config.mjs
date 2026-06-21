// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://zona-muerta.vercel.app',
  adapter: vercel(),
});