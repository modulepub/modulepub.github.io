import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const zhConfig = defineCollection({
  // doc 类型，该类型带有侧边栏
  type: 'doc',
  // 文档集合所在目录，相对于 `docs/`
  dir: 'dev',
  // 文档标题，它将用于在页面的面包屑导航中显示
  title: 'TG开发文档',
  // 相关文章的链接前缀
  linkPrefix: '/dev',
  // 根据文件结构自动生成侧边栏
  sidebar: [
    { text: '树-图架构', link: '/dev/tg.md' },
    { text: '整体架构', link: '/dev/tgBoot.md' },
    { text: '支付模块', link: '/dev/pay.md' },
    { text: 'EXCEL导入导出模块', link: '/dev/excel.md' }
    ]
})

/**
 * 导出所有的 collections
 */
export const zhCollections = defineCollections([
  zhConfig
])

/* =================== locale: en-US ======================= */

const enConfig = defineCollection({
  // doc 类型，该类型带有侧边栏
  type: 'doc',
  // 文档集合所在目录，相对于 `docs/en/`
  dir: 'dev',
  // 文档标题，它将用于在页面的面包屑导航中显示
  title: 'Configuration Guide',
  // 相关文章的链接前缀
  linkPrefix: '/dev',
  // 根据文件结构自动生成侧边栏
  sidebar: [
    { text: '树-图架构', link: '/dev/tg.md' },
    { text: 'Overall Architecture', link: '/dev/tgBoot.md' },
    { text: 'Payment Module', link: '/dev/pay.md' },
    { text: 'Excel Import & Export Module', link: '/dev/excel.md' }
  ]
})



/**
 * 导出所有的 collections
 */
export const enCollections = defineCollections([
  enConfig
])

