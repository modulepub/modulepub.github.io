---
title: 多端中台
description: 基於 unibest 改進版的可複用多端中台：一套代碼支持 H5、小程序與 App，讓新模塊只寫業務。
---

<div class="doc-eyebrow">MULTI-END MIDDLE PLATFORM</div>

<p class="doc-lead">
  <code>uniapp-middle-platform</code> 是一套基於 <strong>unibest 改進版</strong> 的多端中台模板，
  也是<strong>可複用模塊通用的中台能力</strong>。
  新模塊的後端在 TG-boot 裏完成，界面層不必從零搭；以它為模板，一套頁面代碼可以同時用於後台（H5）、小程序和 App。
  登錄、權限、佈局、請求、上傳等公共能力全部複用，業務模塊只寫自己的頁面與接口。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>3<em> 端</em></strong><span>H5 / 小程序 / App</span></div>
  <div class="doc-metric"><strong>15<em> 個</em></strong><span>核心能力域</span></div>
  <div class="doc-metric"><strong>1<em> 套</em></strong><span>登錄與權限</span></div>
  <div class="doc-metric"><strong>0<em> 次</em></strong><span>重複搭殼</span></div>
</div>

## 一、名字怎麼讀

<div class="doc-grid-3">
  <article class="doc-card">
    <span class="doc-card__tag">UNI-APP</span>
    <h3>一套代碼，多端運行</h3>
    <p>基於 uni-app 的多端運行時，同一套 Vue 頁面可以編譯到 H5、微信小程序和 App。平台差異通過條件編譯與適配層處理。</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">MIDDLE</span>
    <h3>中台層，不是中間件</h3>
    <p>“middle”指位於後端業務模塊和多端界面之間的公共層：登錄、權限、請求、佈局、組件、配置、上傳都收在這裏。</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">PLATFORM</span>
    <h3>可複用的工程平台</h3>
    <p>它不是一次性項目，而是一份可複製的工程模板。新業務沿用同一套結構、規範和能力，避免每個模塊重新造一遍。</p>
  </article>
</div>

::: tip 一句話理解
**後端負責業務與契約，中台負責公共能力，業務前端只負責這個模塊自己的頁面與交互。**
:::

## 二、基於 unibest 的改進版

`uniapp-middle-platform` 的工程底座來自 **unibest**，並針對“中台 + 多業務模塊”的場景做了改造。

unibest 已經提供了紮實的 uni-app 工程基礎：

- Vue 3 + TypeScript + Vite；
- 約定式路由、layout 佈局；
- 請求封裝、請求攔截、登錄攔截；
- UnoCSS、i18n、代碼提示與統一配置；
- H5、小程序、App 的構建腳本。

在這個底座上，中台版進一步增加了：

| 能力 | unibest 基礎模板 | uniapp-middle-platform |
| --- | --- | --- |
| 工程定位 | 通用 uni-app 模板 | 可複用的多端中台模板 |
| 登錄與權限 | 基礎登錄攔截 | 獨立管理端登錄態、RBAC、功能地圖、`v-auth` |
| 後台殼 | 通用 layout | 管理端佈局、菜單、頁籤、主題、用户菜單 |
| 請求層 | 基礎封裝 | `/mgt` 管理端 API、統一錯誤與 token 處理 |
| 能力頁面 | 示例頁 | 系統、AI、CMS、IM、微信、交易等 15 個能力域 |
| 多模塊組織 | 單應用 | `manage` 殼 + `manage_ability` 能力域，按模塊擴展 |

::: info 不是“換皮 unibest”
它保留了 unibest 的開發體驗，但業務邊界、管理端殼、權限模型和能力頁面都是按中台場景重新組織的。
:::

## 三、三端如何複用

| 端 | 開發命令 | 構建產物 | 主要場景 |
| --- | --- | --- | --- |
| H5 | `pnpm dev:h5` | `dist/build/h5` | 後台、運營台、瀏覽器訪問 |
| 微信小程序 | `pnpm dev:mp` | `dist/build/mp-weixin` | 用户端、移動輕應用 |
| App | `pnpm dev:app` | `dist/build/app` | 需要原生能力的移動端 |

工程裏還保留了支付寶、百度、字節、快手等小程序構建腳本。實際交付時按目標平台啓用，不必一次全部維護。

### 平台差異放在哪裏

- 頁面與業務邏輯儘量同源；
- 平台特有 API 用條件編譯隔離：

```ts
// #ifdef H5
// 瀏覽器專屬邏輯
// #endif

// #ifdef MP-WEIXIN
// 微信小程序登錄、支付、訂閲消息
// #endif

// #ifdef APP-PLUS
// App 原生能力、文件、推送
// #endif
```

- 登錄方式、支付、分享、文件選擇等差異，收斂到適配函數或 composable，不散落在業務頁面裏；
- 每個平台都要單獨驗收，不能假設“H5 能跑，小程序和 App 就一定沒問題”。

::: warning 當前倉庫的默認形態
這個倉庫當前主要作為**中台 H5** 運行，登錄後進入核心能力控制枱。
多端構建入口和 uni-app 能力都保留着；新增業務模塊時，以它為模板建立業務前端，再按目標平台編譯。
:::

## 四、它沉澱了哪些中台能力

### 4.1 身份、權限與後台殼

- 管理端登錄、token / refreshToken、退出登錄；
- 用户信息、組織、角色、權限列表；
- 功能地圖（菜單 / 按鈕 / 接口）與角色授權；
- `v-auth` 指令按 `perUrl` 與權限 hash 控制按鈕；
- 管理端佈局、側欄菜單、頁籤、主題、用户菜單。

### 4.2 通用工程能力

- 請求封裝、攔截器、統一錯誤處理、401 跳轉；
- 文件上傳、圖片/視頻處理、配置讀取；
- 路由守衞、登錄黑白名單、頁面級鑑權；
- 表格列、字典、狀態碼、流程碼、格式化、校驗等工具；
- i18n、主題、緩存、導航與 UI 輔助。

### 4.3 核心能力域

| 能力域 | 內容 |
| --- | --- |
| `sys` | 用户、組織、角色、APP 配置、註銷、徽章 |
| `ai` | AI 智能體、接口配置、對話、會話記錄、消耗明細 |
| `cms` | 內容節點管理 |
| `im` | 消息中心、通知、IM 用户 |
| `wx` | 公眾號、小程序、微信支付、訂閲消息 |
| `trade` | 商品、分類、模板、訂單 |
| `distribution` | 分銷賬單、結算批次、業績測試 |
| `verification` | 實名、內容審核、人臉、資產認證 |
| `sms` | 短信模板、發送日誌、騰訊短信配置 |
| `file` / `config` | 文件管理、文件配置 |
| `quartz` | 定時任務 |
| `monitor` | 在線用户 / 監控 |
| `ua` | 渠道、錨點、統計 |
| `form` | 表單與素材投稿 |

這些能力不是“示例代碼”，而是新模塊可以直接複用的中台資產。

## 五、新增模塊怎麼用

### 5.1 後端仍然在 TG-boot

先按 [新增模塊實操](/zh-Hant/ai/practice/) 完成：

```text
spring-boot-starter-{module}-api
spring-boot-starter-{module}-biz
```

管理端接口使用 `/mgt/{module}/...`，用户端接口使用 `/cus/{module}/...`。
跨模塊調用只走 `*-api` 契約，前端不直接依賴後端實現。

### 5.2 前端以中台為模板

在業務前端工程中，按中台的目錄約定增加頁面：

```text
src/pages/manage_ability/{module}/
├── index.vue                 # 模塊入口 / 工作台
├── {entity}/
│   ├── index.vue             # 列表
│   └── components/           # 表單、詳情、選擇器
└── ...
src/pages/manage/api/{module}.ts   # 該模塊的 /mgt 接口
```

頁面直接複用中台的：

- 登錄態與頁面守衞；
- `MgAdminLayout` 佈局、菜單和頁籤；
- 請求封裝、錯誤處理、token 注入；
- 上傳、表格、彈窗、表單、字典等組件；
- 功能地圖與 `v-auth` 權限控制。

### 5.3 小程序與 App 只補差異

同一套業務頁面先保證 H5 跑通，再按平台補：

| 平台 | 需要重點驗證 |
| --- | --- |
| H5 | history 路由、SPA 回退、瀏覽器文件能力 |
| 微信小程序 | 登錄、支付、訂閲消息、分包、隱私協議 |
| App | 原生登錄、文件、推送、權限、離線與更新 |

平台差異寫進適配層，不把 `#ifdef` 散落到每個業務頁面。

## 六、為什麼它能“複用代碼、聚焦業務”

| 傳統做法 | 以中台為模板 |
| --- | --- |
| 每個模塊重新搭登錄、佈局、請求、權限 | 直接複用一套中台殼 |
| 每個端各寫一套頁面 | 同源頁面 + 平台適配 |
| 權限、菜單、按鈕各寫一套 | 功能地圖 + `v-auth` 統一 |
| 公共組件複製粘貼 | 中台統一維護、按需升級 |
| 業務團隊被基礎設施拖住 | 只寫本模塊的頁面、API 與業務規則 |

這就是它的目標：**把“每個項目都要再做一遍”的東西收斂到中台，把工程師的時間還給業務。**

## 七、邊界與注意事項

- 當前倉庫只承載**核心能力**，不包含婚戀、親家、路演、區塊鏈等具體業務後台；
- 新業務應以它為模板建立自己的前端工程，而不是把所有業務頁面塞回公共中台；
- 中台升級時，業務工程按需同步，不強制每次全量跟進；
- 小程序與 App 的登錄、支付、分享、文件能力必須逐端驗收；
- H5 使用 history 路由，部署時需要 SPA 回退到 `index.html`；
- 不要把管理端 token、測試賬號或平台密鑰提交到倉庫。

## 八、繼續閲讀

<div class="doc-cards">
  <a class="doc-card" href="/zh-Hant/ai/practice/">
    <span class="doc-card__tag">NEXT · HANDS-ON</span>
    <h3>新增一個模塊</h3>
    <p>先完成 TG-boot 的 api / biz / runner，再接上多端頁面。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/ai/modules/">
    <span class="doc-card__tag">BACK · MODULES</span>
    <h3>模塊地圖</h3>
    <p>後端模塊如何劃分，前端能力如何對應。</p>
  </a>
</div>
