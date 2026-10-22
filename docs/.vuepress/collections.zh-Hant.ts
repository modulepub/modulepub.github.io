import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const aiSidebar = [
  {
    text: '開始',
    collapsed: false,
    items: [
      { text: '總覽 · 為什麼是 TG-boot', link: '/zh-Hant/ai/' },
      { text: '設計動機', link: '/zh-Hant/ai/why/' },
      { text: '讓 AI 啓動項目', link: '/zh-Hant/ai/quickstart/' },
    ],
  },
  {
    text: '理解框架',
    collapsed: false,
    items: [
      { text: '架構與邊界', link: '/zh-Hant/ai/architecture/' },
      { text: '模塊地圖', link: '/zh-Hant/ai/modules/' },
      { text: '多端中台 · uniapp', link: '/zh-Hant/ai/uniapp-middle-platform/' },
      { text: '跨模塊契約', link: '/zh-Hant/ai/contracts/' },
    ],
  },
  {
    text: '動手實踐',
    collapsed: false,
    items: [
      { text: 'AI 協作工作流', link: '/zh-Hant/ai/ai-workflow/' },
      { text: '實操 · 新增一個模塊', link: '/zh-Hant/ai/practice/' },
      { text: '質量與上線', link: '/zh-Hant/ai/quality/' },
    ],
  },
  {
    text: '資料',
    collapsed: false,
    items: [{ text: '深度手冊索引', link: '/zh-Hant/ai/reference/' }],
  },
]

const communitySidebar = [
  {
    text: '總覽',
    collapsed: false,
    items: [{ text: '人類社區項目', link: '/zh-Hant/community/' }],
  },
  {
    text: '白皮書',
    collapsed: false,
    items: [
      { text: '機制總覽', link: '/zh-Hant/community/whitepaper/' },
      { text: '執行與邊界', link: '/zh-Hant/community/whitepaper/execution/' },
    ],
  },
  {
    text: '項目與價值',
    collapsed: false,
    items: [
      { text: '明星項目', link: '/zh-Hant/community/projects/' },
      { text: '如何實現資本向善', link: '/zh-Hant/community/capital-for-good/' },
      { text: '共創財富後轉公益', link: '/zh-Hant/community/wealth-to-public/' },
      { text: '重塑價值', link: '/zh-Hant/community/value-reset/' },
    ],
  },
]

const devSidebar = [
  {
    text: 'TG-boot',
    collapsed: false,
    items: [
      { text: '總覽', link: '/zh-Hant/dev/tg-boot/' },
      { text: 'AI 編碼規範', link: '/zh-Hant/dev/tg-boot/agents/' },
      { text: '架構測試門禁', link: '/zh-Hant/dev/tg-boot/architecture-tests/' },
      { text: '跨模塊協作', link: '/zh-Hant/dev/tg-boot/cross-module-collaboration/' },
      { text: '樹-圖架構', link: '/zh-Hant/dev/tg-boot/tree-graph-architecture/' },
      { text: '運維説明', link: '/zh-Hant/dev/tg-boot/ops/' },
      { text: 'components · 總覽', link: '/zh-Hant/dev/tg-boot/components/' },
      { text: 'business · 總覽', link: '/zh-Hant/dev/tg-boot/business/' },
      { text: 'tg-manage-vue', link: '/zh-Hant/dev/tg-boot/frontend-tg-manage-vue/' },
    ],
  },
  {
    text: '研究檔案',
    collapsed: false,
    items: [
      { text: '時間長河共識算法', link: '/zh-Hant/dev/TRC/' },
      { text: '基於時間特性的共識算法', link: '/zh-Hant/dev/consensus/time-based-consensus-design/' },
      { text: 'Excel 導入導出', link: '/zh-Hant/dev/excel/' },
    ],
  },
]

const aiConfig = defineCollection({
  type: 'doc',
  dir: 'ai',
  title: 'AI 編程框架',
  linkPrefix: '/ai',
  sidebar: aiSidebar,
})

const communityConfig = defineCollection({
  type: 'doc',
  dir: 'community',
  title: '人類社區項目',
  linkPrefix: '/community',
  sidebar: communitySidebar,
})

const devConfig = defineCollection({
  type: 'doc',
  dir: 'dev',
  title: '深度手冊',
  linkPrefix: '/dev',
  sidebar: devSidebar,
})

export const zhHantCollections = defineCollections([aiConfig, communityConfig, devConfig])
