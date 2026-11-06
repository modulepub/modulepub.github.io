import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhHantNavbar = defineNavbarConfig([
  { text: '首頁', link: '/zh-Hant/' },
  {
    text: 'AI 編程框架',
    icon: 'icon-park-outline:code',
    link: '/zh-Hant/ai/',
    activeMatch: '^/zh-Hant/ai/',
  },
  {
    text: '自研大模型',
    icon: 'icon-park-outline:robot-one',
    link: '/zh-Hant/models/',
    activeMatch: '^/zh-Hant/models/',
  },
  {
    text: '人類社區',
    icon: 'icon-park-outline:people',
    link: '/zh-Hant/community/',
    activeMatch: '^/zh-Hant/community/',
  },
  {
    text: '區塊鏈核心',
    icon: 'icon-park-outline:thinking-problem',
    link: '/zh-Hant/blockchain/',
    activeMatch: '^/zh-Hant/blockchain/',
  },
  {
    text: '深度手冊',
    icon: 'icon-park-outline:book-one',
    link: '/zh-Hant/dev/tg-boot/',
    activeMatch: '^/zh-Hant/dev/',
  },
])
