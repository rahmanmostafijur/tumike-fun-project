/// <reference types="vitest/config" />
import { existsSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { DEFAULT_PACK_ID } from './src/config'

/**
 * Preloads the default pack's painted background (src/packs/<id>/background.webp)
 * with its final hashed URL, so it starts downloading before the JS runs.
 */
function preloadPackBackground(packId: string): Plugin {
  const source = `src/packs/${packId}/background.webp`
  let base = '/'
  return {
    name: 'preload-pack-background',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        let href: string | undefined
        if (ctx.bundle) {
          const asset = Object.values(ctx.bundle).find(
            (o) => o.type === 'asset' && (o.originalFileNames ?? []).some((n) => n.replace(/\\/g, '/').endsWith(source)),
          )
          href = asset ? `${base}${asset.fileName}` : undefined
        } else if (existsSync(source)) {
          href = `/${source}`
        }
        if (!href) return html
        return {
          html,
          tags: [{ tag: 'link', attrs: { rel: 'preload', as: 'image', type: 'image/webp', href, fetchpriority: 'high' }, injectTo: 'head' }],
        }
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadPackBackground(DEFAULT_PACK_ID)],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
