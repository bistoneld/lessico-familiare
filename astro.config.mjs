// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const isNetlify = process.env.NETLIFY === 'true';
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

const site =
  process.env.ASTRO_SITE ||
  (isNetlify && (process.env.URL || process.env.DEPLOY_PRIME_URL)) ||
  (isGitHubActions && 'https://bistoneld.github.io/lessico-familiare/') ||
  'http://localhost:4321/lessico-familiare/';

const base =
  process.env.ASTRO_BASE ||
  (isGitHubActions ? '/lessico-familiare/' : isNetlify ? '/' : '/lessico-familiare/');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
