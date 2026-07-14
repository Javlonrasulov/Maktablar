declare module './server/vitePlugin.mjs' {
  import type { Plugin } from 'vite'
  export function authApiPlugin(): Plugin
}
