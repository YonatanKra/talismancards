import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: 'src',
  devtools: { enabled: true },

  devServer: {
    host: 'localhost',
    port: 4200,
  },

  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json', // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    },
  },

  imports: {
    autoImport: true,
  },

  css: [
    '~/assets/css/styles.css', 
    '@vonage/vivid/styles/core/all.css', 
    '@vonage/vivid/styles/tokens/theme-light.css', 
    '@vonage/vivid/styles/fonts/spezia-variable.css'
  ],

  vite: {
    plugins: [nxViteTsPaths()],
  },

  plugins: [
    '~/plugins/vivid.client.ts', // only in client side
  ],

  nitro: {
    preset: 'vercel',
    output: {
      dir: '../../.vercel/output',
    },
  },

  compatibilityDate: '2024-09-10',
});