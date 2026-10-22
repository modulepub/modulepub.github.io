/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  {
    text: 'AI 编程框架',
    icon: 'icon-park-outline:code',
    link: '/ai/',
    activeMatch: '^/ai/',
  },
  {
    text: '人类社区',
    icon: 'icon-park-outline:people',
    link: '/community/',
    activeMatch: '^/community/',
  },
  {
    text: '深度手册',
    icon: 'icon-park-outline:book-one',
    link: '/dev/tg-boot/',
    activeMatch: '^/dev/',
  },
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  {
    text: 'AI Framework',
    icon: 'icon-park-outline:code',
    link: '/en/ai/',
    activeMatch: '^/en/ai/',
  },
  {
    text: 'Human Community',
    icon: 'icon-park-outline:people',
    link: '/en/community/',
    activeMatch: '^/en/community/',
  },
  {
    text: 'Deep Manual',
    icon: 'icon-park-outline:book-one',
    link: '/en/dev/tg-boot/',
    activeMatch: '^/en/dev/',
  },
])
