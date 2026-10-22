/**
 * Plume 主题配置。
 * 站点文案、导航与集合在这里统一维护。
 */

import { defineThemeConfig } from 'vuepress-theme-plume'
import { enCollections, zhCollections } from './collections'
import { zhHantCollections } from './collections.zh-Hant'
import { enNavbar, zhNavbar } from './navbar'
import { zhHantNavbar } from './navbar.zh-Hant'

export default defineThemeConfig({
  logo: '/logo.svg',
  logoDark: '/logo.svg',

  // 全站使用深色科技主题，避免首页视觉与文档阅读体验割裂
  appearance: 'force-dark',
  home: '/',

  outline: [2, 3],
  aside: true,
  prevPage: true,
  nextPage: true,

  transition: {
    page: true,
    appearance: 'fade',
  },

  locales: {
    '/': {
      selectLanguageName: '简体中文',
      selectLanguageText: '选择语言',
      home: '/',
      profile: {
        avatar: '/logo.svg',
        name: 'module.pub',
        description: '开放 · 包容 · 共赢',
        organization: 'module.pub',
        layout: 'right',
      },
      navbar: zhNavbar,
      collections: zhCollections,
      sidebarMenuLabel: '目录',
      outlineLabel: '此页内容',
      returnToTopLabel: '返回顶部',
      prevPageLabel: '上一篇',
      nextPageLabel: '下一篇',
      homeText: '首页',
    },
    '/zh-Hant/': {
      selectLanguageName: '繁體中文（港澳）',
      selectLanguageText: '選擇語言',
      home: '/zh-Hant/',
      profile: {
        avatar: '/logo.svg',
        name: 'module.pub',
        description: '開放 · 包容 · 共贏',
        organization: 'module.pub',
        layout: 'right',
      },
      navbar: zhHantNavbar,
      collections: zhHantCollections,
      sidebarMenuLabel: '目錄',
      outlineLabel: '此頁內容',
      returnToTopLabel: '返回頂部',
      prevPageLabel: '上一篇',
      nextPageLabel: '下一篇',
      homeText: '首頁',
    },
    '/en/': {
      selectLanguageName: 'English',
      selectLanguageText: 'Select language',
      home: '/en/',
      profile: {
        avatar: '/logo.svg',
        name: 'module.pub',
        description: 'Open · Inclusive · Win-win',
        organization: 'module.pub',
        layout: 'right',
      },
      navbar: enNavbar,
      collections: enCollections,
      sidebarMenuLabel: 'Menu',
      outlineLabel: 'On this page',
      returnToTopLabel: 'Back to top',
      prevPageLabel: 'Previous',
      nextPageLabel: 'Next',
      homeText: 'Home',
    },
  },
})
