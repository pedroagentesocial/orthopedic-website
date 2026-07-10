// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://orthopedicpi.com',

  // Pages stay static (prerendered); only routes that opt out with
  // `export const prerender = false` — e.g. the /api/lead endpoint — run
  // on-demand on Vercel's serverless runtime, keeping the CRM webhook server-side.
  output: 'static',
  adapter: vercel(),

  // Behind Vercel's proxy, Astro only trusts the forwarded Host when the domain
  // is allow-listed here; otherwise `url.origin` falls back to localhost and the
  // CSRF origin check (security.checkOrigin, default true) can 403 form POSTs.
  // The lead endpoint uses JSON (exempt from that check) but we list the hosts
  // defensively so any future server route behaves correctly.
  security: {
    allowedDomains: [
      { protocol: 'https', hostname: 'orthopedicpi.com' },
      { protocol: 'https', hostname: 'www.orthopedicpi.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
    fallback: {
      es: 'en',
    },
  },

  integrations: [react()],

  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
