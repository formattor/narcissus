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
    // todo switch
    logo: './yushi.png',
    search: {
      provider: 'local'
    },

    siteTitle: 'Narcissus',

    nav,
    sidebar,

    aside: true,
    outline: 'deep',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/formattor' }
    ],


    footer: {
      message: '我的页脚',
      copyright: 'yushi © 2024-present'
    },

    // todo
    editLink: {
      pattern: 'https://github.com/formattor/narcissus/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '往前',
      next: '往后'
    },

    // todo
    returnToTopLabel: '往上',

    externalLinkIcon: true,
  }
})
