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
    // nav: [
    //   { text: '前端', link: '/front-end/' },
    //   { text: '后端', link: '/back-end/' },
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/formattor' }
    ],
    footer: {
      message: '我的页脚',
      copyright: 'yushi © 2024-present'
    }
  }
})
