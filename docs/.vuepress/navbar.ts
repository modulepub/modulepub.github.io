/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  {
    text: 'TG开发文档',
    icon: 'icon-park-outline:setting-two',
    link: '/dev/tgBoot.md',
    activeMatch: '^/dev/',
  }
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  {
    text: 'TG Development Document',
    icon: 'icon-park-outline:setting-two',
    link: '/en/dev/tg.md',
    activeMatch: '^/dev/'
  }
])

