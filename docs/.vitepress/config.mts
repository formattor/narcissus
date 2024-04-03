import { defineConfig } from 'vitepress'
import nav from './nav.mts'
import sidebar from './sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Narcissus",
  description: "Note",
  base: "/narcissus/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: './yushi.png',
    search: {
      provider: 'local'
    },

    nav,
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/formattor' }
    ],
    footer: {
      message: '我的页脚',
      copyright: 'yushi © 2024-present'
    }
  }
})
