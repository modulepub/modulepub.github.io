---
title: 多端中台
description: 基于 unibest 改进版的可复用多端中台：一套代码支持 H5、小程序与 App，让新模块只写业务。
---

<div class="doc-eyebrow">MULTI-END MIDDLE PLATFORM</div>

<p class="doc-lead">
  <code>uniapp-middle-platform</code> 是一套基于 <strong>unibest 改进版</strong> 的多端中台模板，
  也是<strong>可复用模块通用的中台能力</strong>。
  新模块的后端在 TG-boot 里完成，界面层不必从零搭；以它为模板，一套页面代码可以同时用于后台（H5）、小程序和 App。
  登录、权限、布局、请求、上传等公共能力全部复用，业务模块只写自己的页面与接口。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>3<em> 端</em></strong><span>H5 / 小程序 / App</span></div>
  <div class="doc-metric"><strong>15<em> 个</em></strong><span>核心能力域</span></div>
  <div class="doc-metric"><strong>1<em> 套</em></strong><span>登录与权限</span></div>
  <div class="doc-metric"><strong>0<em> 次</em></strong><span>重复搭壳</span></div>
</div>

## 一、名字怎么读

<div class="doc-grid-3">
  <article class="doc-card">
    <span class="doc-card__tag">UNI-APP</span>
    <h3>一套代码，多端运行</h3>
    <p>基于 uni-app 的多端运行时，同一套 Vue 页面可以编译到 H5、微信小程序和 App。平台差异通过条件编译与适配层处理。</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">MIDDLE</span>
    <h3>中台层，不是中间件</h3>
    <p>“middle”指位于后端业务模块和多端界面之间的公共层：登录、权限、请求、布局、组件、配置、上传都收在这里。</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">PLATFORM</span>
    <h3>可复用的工程平台</h3>
    <p>它不是一次性项目，而是一份可复制的工程模板。新业务沿用同一套结构、规范和能力，避免每个模块重新造一遍。</p>
  </article>
</div>

::: tip 一句话理解
**后端负责业务与契约，中台负责公共能力，业务前端只负责这个模块自己的页面与交互。**
:::

## 二、基于 unibest 的改进版

`uniapp-middle-platform` 的工程底座来自 **unibest**，并针对“中台 + 多业务模块”的场景做了改造。

unibest 已经提供了扎实的 uni-app 工程基础：

- Vue 3 + TypeScript + Vite；
- 约定式路由、layout 布局；
- 请求封装、请求拦截、登录拦截；
- UnoCSS、i18n、代码提示与统一配置；
- H5、小程序、App 的构建脚本。

在这个底座上，中台版进一步增加了：

| 能力 | unibest 基础模板 | uniapp-middle-platform |
| --- | --- | --- |
| 工程定位 | 通用 uni-app 模板 | 可复用的多端中台模板 |
| 登录与权限 | 基础登录拦截 | 独立管理端登录态、RBAC、功能地图、`v-auth` |
| 后台壳 | 通用 layout | 管理端布局、菜单、页签、主题、用户菜单 |
| 请求层 | 基础封装 | `/mgt` 管理端 API、统一错误与 token 处理 |
| 能力页面 | 示例页 | 系统、AI、CMS、IM、微信、交易等 15 个能力域 |
| 多模块组织 | 单应用 | `manage` 壳 + `manage_ability` 能力域，按模块扩展 |

::: info 不是“换皮 unibest”
它保留了 unibest 的开发体验，但业务边界、管理端壳、权限模型和能力页面都是按中台场景重新组织的。
:::

## 三、三端如何复用

| 端 | 开发命令 | 构建产物 | 主要场景 |
| --- | --- | --- | --- |
| H5 | `pnpm dev:h5` | `dist/build/h5` | 后台、运营台、浏览器访问 |
| 微信小程序 | `pnpm dev:mp` | `dist/build/mp-weixin` | 用户端、移动轻应用 |
| App | `pnpm dev:app` | `dist/build/app` | 需要原生能力的移动端 |

工程里还保留了支付宝、百度、字节、快手等小程序构建脚本。实际交付时按目标平台启用，不必一次全部维护。

### 平台差异放在哪里

- 页面与业务逻辑尽量同源；
- 平台特有 API 用条件编译隔离：

```ts
// #ifdef H5
// 浏览器专属逻辑
// #endif

// #ifdef MP-WEIXIN
// 微信小程序登录、支付、订阅消息
// #endif

// #ifdef APP-PLUS
// App 原生能力、文件、推送
// #endif
```

- 登录方式、支付、分享、文件选择等差异，收敛到适配函数或 composable，不散落在业务页面里；
- 每个平台都要单独验收，不能假设“H5 能跑，小程序和 App 就一定没问题”。

::: warning 当前仓库的默认形态
这个仓库当前主要作为**中台 H5** 运行，登录后进入核心能力控制台。
多端构建入口和 uni-app 能力都保留着；新增业务模块时，以它为模板建立业务前端，再按目标平台编译。
:::

## 四、它沉淀了哪些中台能力

### 4.1 身份、权限与后台壳

- 管理端登录、token / refreshToken、退出登录；
- 用户信息、组织、角色、权限列表；
- 功能地图（菜单 / 按钮 / 接口）与角色授权；
- `v-auth` 指令按 `perUrl` 与权限 hash 控制按钮；
- 管理端布局、侧栏菜单、页签、主题、用户菜单。

### 4.2 通用工程能力

- 请求封装、拦截器、统一错误处理、401 跳转；
- 文件上传、图片/视频处理、配置读取；
- 路由守卫、登录黑白名单、页面级鉴权；
- 表格列、字典、状态码、流程码、格式化、校验等工具；
- i18n、主题、缓存、导航与 UI 辅助。

### 4.3 核心能力域

| 能力域 | 内容 |
| --- | --- |
| `sys` | 用户、组织、角色、APP 配置、注销、徽章 |
| `ai` | AI 智能体、接口配置、对话、会话记录、消耗明细 |
| `cms` | 内容节点管理 |
| `im` | 消息中心、通知、IM 用户 |
| `wx` | 公众号、小程序、微信支付、订阅消息 |
| `trade` | 商品、分类、模板、订单 |
| `distribution` | 分销账单、结算批次、业绩测试 |
| `verification` | 实名、内容审核、人脸、资产认证 |
| `sms` | 短信模板、发送日志、腾讯短信配置 |
| `file` / `config` | 文件管理、文件配置 |
| `quartz` | 定时任务 |
| `monitor` | 在线用户 / 监控 |
| `ua` | 渠道、锚点、统计 |
| `form` | 表单与素材投稿 |

这些能力不是“示例代码”，而是新模块可以直接复用的中台资产。

## 五、新增模块怎么用

### 5.1 后端仍然在 TG-boot

先按 [新增模块实操](/ai/practice/) 完成：

```text
spring-boot-starter-{module}-api
spring-boot-starter-{module}-biz
```

管理端接口使用 `/mgt/{module}/...`，用户端接口使用 `/cus/{module}/...`。
跨模块调用只走 `*-api` 契约，前端不直接依赖后端实现。

### 5.2 前端以中台为模板

在业务前端工程中，按中台的目录约定增加页面：

```text
src/pages/manage_ability/{module}/
├── index.vue                 # 模块入口 / 工作台
├── {entity}/
│   ├── index.vue             # 列表
│   └── components/           # 表单、详情、选择器
└── ...
src/pages/manage/api/{module}.ts   # 该模块的 /mgt 接口
```

页面直接复用中台的：

- 登录态与页面守卫；
- `MgAdminLayout` 布局、菜单和页签；
- 请求封装、错误处理、token 注入；
- 上传、表格、弹窗、表单、字典等组件；
- 功能地图与 `v-auth` 权限控制。

### 5.3 小程序与 App 只补差异

同一套业务页面先保证 H5 跑通，再按平台补：

| 平台 | 需要重点验证 |
| --- | --- |
| H5 | history 路由、SPA 回退、浏览器文件能力 |
| 微信小程序 | 登录、支付、订阅消息、分包、隐私协议 |
| App | 原生登录、文件、推送、权限、离线与更新 |

平台差异写进适配层，不把 `#ifdef` 散落到每个业务页面。

## 六、为什么它能“复用代码、聚焦业务”

| 传统做法 | 以中台为模板 |
| --- | --- |
| 每个模块重新搭登录、布局、请求、权限 | 直接复用一套中台壳 |
| 每个端各写一套页面 | 同源页面 + 平台适配 |
| 权限、菜单、按钮各写一套 | 功能地图 + `v-auth` 统一 |
| 公共组件复制粘贴 | 中台统一维护、按需升级 |
| 业务团队被基础设施拖住 | 只写本模块的页面、API 与业务规则 |

这就是它的目标：**把“每个项目都要再做一遍”的东西收敛到中台，把工程师的时间还给业务。**

## 七、边界与注意事项

- 当前仓库只承载**核心能力**，不包含婚恋、亲家、路演、区块链等具体业务后台；
- 新业务应以它为模板建立自己的前端工程，而不是把所有业务页面塞回公共中台；
- 中台升级时，业务工程按需同步，不强制每次全量跟进；
- 小程序与 App 的登录、支付、分享、文件能力必须逐端验收；
- H5 使用 history 路由，部署时需要 SPA 回退到 `index.html`；
- 不要把管理端 token、测试账号或平台密钥提交到仓库。

## 八、继续阅读

<div class="doc-cards">
  <a class="doc-card" href="/ai/practice/">
    <span class="doc-card__tag">NEXT · HANDS-ON</span>
    <h3>新增一个模块</h3>
    <p>先完成 TG-boot 的 api / biz / runner，再接上多端页面。</p>
  </a>
  <a class="doc-card" href="/ai/modules/">
    <span class="doc-card__tag">BACK · MODULES</span>
    <h3>模块地图</h3>
    <p>后端模块如何划分，前端能力如何对应。</p>
  </a>
</div>
