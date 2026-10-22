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
    text: '人類社區',
    icon: 'icon-park-outline:people',
    link: '/zh-Hant/community/',
    activeMatch: '^/zh-Hant/community/',
  },
  {
    text: '深度手冊',
    icon: 'icon-park-outline:book-one',
    link: '/zh-Hant/dev/tg-boot/',
    activeMatch: '^/zh-Hant/dev/',
  },
])
