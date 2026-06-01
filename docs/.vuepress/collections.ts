import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const zhTgBootItems = [
  { text: '总览', link: '/dev/tg-boot/' },
  { text: 'AI 编码规范', link: '/dev/tg-boot/agents/' },
  { text: '运维说明', link: '/dev/tg-boot/ops/' },
  { text: '跨模块协作', link: '/dev/tg-boot/cross-module-collaboration/' },
  { text: '架构测试门禁', link: '/dev/tg-boot/architecture-tests/' },
  { text: '树-图架构', link: '/dev/tg-boot/tree-graph-architecture/' },
  { text: 'starter-module', link: '/dev/tg-boot/starter-module/' },
  { text: 'runner', link: '/dev/tg-boot/runner/' },
  { text: 'plugins', link: '/dev/tg-boot/plugins/' },
  { text: 'components · 总览', link: '/dev/tg-boot/components/' },
  { text: 'common', link: '/dev/tg-boot/components/common/' },
  { text: 'system', link: '/dev/tg-boot/components/system/' },
  { text: 'trade', link: '/dev/tg-boot/components/trade/' },
  { text: 'distribution', link: '/dev/tg-boot/components/distribution/' },
  { text: 'verification', link: '/dev/tg-boot/components/verification/' },
  { text: 'wechat', link: '/dev/tg-boot/components/wechat/' },
  { text: 'file', link: '/dev/tg-boot/components/file/' },
  { text: 'cms', link: '/dev/tg-boot/components/cms/' },
  { text: 'im', link: '/dev/tg-boot/components/im/' },
  { text: 'excel', link: '/dev/tg-boot/components/excel/' },
  { text: 'ocr', link: '/dev/tg-boot/components/ocr/' },
  { text: 'sms', link: '/dev/tg-boot/components/sms/' },
  { text: 'business · 总览', link: '/dev/tg-boot/business/' },
  { text: 'customer', link: '/dev/tg-boot/business/customer/' },
  { text: 'dating', link: '/dev/tg-boot/business/dating/' },
  { text: 'tg-manage-vue', link: '/dev/tg-boot/frontend-tg-manage-vue/' },
]

const enTgBootItems = [
  { text: 'Overview', link: '/en/dev/tg-boot/' },
  { text: 'AI Coding Guide', link: '/en/dev/tg-boot/agents/' },
  { text: 'Operations', link: '/en/dev/tg-boot/ops/' },
  { text: 'Cross-Module Collaboration', link: '/en/dev/tg-boot/cross-module-collaboration/' },
  { text: 'Architecture Tests', link: '/en/dev/tg-boot/architecture-tests/' },
  { text: 'Tree-Graph Architecture', link: '/en/dev/tg-boot/tree-graph-architecture/' },
  { text: 'starter-module', link: '/en/dev/tg-boot/starter-module/' },
  { text: 'runner', link: '/en/dev/tg-boot/runner/' },
  { text: 'plugins', link: '/en/dev/tg-boot/plugins/' },
  { text: 'components · hub', link: '/en/dev/tg-boot/components/' },
  { text: 'common', link: '/en/dev/tg-boot/components/common/' },
  { text: 'system', link: '/en/dev/tg-boot/components/system/' },
  { text: 'trade', link: '/en/dev/tg-boot/components/trade/' },
  { text: 'distribution', link: '/en/dev/tg-boot/components/distribution/' },
  { text: 'verification', link: '/en/dev/tg-boot/components/verification/' },
  { text: 'wechat', link: '/en/dev/tg-boot/components/wechat/' },
  { text: 'file', link: '/en/dev/tg-boot/components/file/' },
  { text: 'cms', link: '/en/dev/tg-boot/components/cms/' },
  { text: 'im', link: '/en/dev/tg-boot/components/im/' },
  { text: 'excel', link: '/en/dev/tg-boot/components/excel/' },
  { text: 'ocr', link: '/en/dev/tg-boot/components/ocr/' },
  { text: 'sms', link: '/en/dev/tg-boot/components/sms/' },
  { text: 'business · hub', link: '/en/dev/tg-boot/business/' },
  { text: 'customer', link: '/en/dev/tg-boot/business/customer/' },
  { text: 'dating', link: '/en/dev/tg-boot/business/dating/' },
  { text: 'tg-manage-vue', link: '/en/dev/tg-boot/frontend-tg-manage-vue/' },
]

const zhConfig = defineCollection({
  type: 'doc',
  dir: 'dev',
  title: '技术文档',
  linkPrefix: '/dev',
  sidebar: [
    {
      text: 'TG-boot',
      collapsed: false,
      items: zhTgBootItems,
    },
    {
      text: '共识算法',
      collapsed: false,
      items: [
        {
          text: '基于时间特性的共识算法设计（V1）',
          link: '/dev/consensus/time-based-consensus-design/',
        },
      ],
    },
    { text: 'EXCEL导入导出模块', link: '/dev/excel.md' },
  ],
})

export const zhCollections = defineCollections([zhConfig])

const enConfig = defineCollection({
  type: 'doc',
  dir: 'dev',
  title: 'Technical Documentation',
  linkPrefix: '/dev',
  sidebar: [
    {
      text: 'TG-boot',
      collapsed: false,
      items: enTgBootItems,
    },
    {
      text: 'Consensus Algorithms',
      collapsed: false,
      items: [
        {
          text: 'Time-Based Consensus Design (V1)',
          link: '/en/dev/consensus/time-based-consensus-design/',
        },
      ],
    },
    { text: 'Excel Import & Export', link: '/en/dev/excel/' },
  ],
})

export const enCollections = defineCollections([enConfig])
