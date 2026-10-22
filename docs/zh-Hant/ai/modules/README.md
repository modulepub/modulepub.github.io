---
title: 模塊地圖
description: TG-boot 的能力域、表前綴、依賴方向與模塊選型方法。
---

<div class="doc-eyebrow">MODULE MAP · KNOW WHERE IT BELONGS</div>

<p class="doc-lead">
  模塊地圖不是一份“功能清單”，而是一張<strong>歸屬決策表</strong>。
  當 AI 問你“這段代碼放哪裏”時，答案應該能從這張表裏推出來，而不是靠感覺。
</p>

## 一、模塊樹

```text
spring-boot-starter-module
├── spring-boot-starter-common
├── spring-boot-starter-architecture-tests
├── spring-boot-starter-runner
├── spring-boot-starter-components
│   ├── system            sys_    用户 / 組織 / 角色 / 權限
│   ├── trade             td_     商品 / 訂單 / 支付
│   ├── distribution      dist_   分銷 / 分傭 / 賬單
│   ├── wechat            wx_     公眾號 / 小程序 / 微信支付
│   ├── file              —       文件 / 配置
│   ├── cms               cms_    內容節點
│   ├── im                im_     即時通訊 / STOMP
│   ├── ocr               —       OCR 門面
│   ├── sms               sms_    短信 SPI
│   ├── excel             —       模板 Excel
│   ├── verification      vt_     實名 / 內容審核 / 人臉
│   ├── quartz            qz_     定時任務
│   ├── ai                ai_     AI 對話
│   └── form              form_   表單材料
└── spring-boot-starter-business
    ├── dating            dt_     婚戀 / 客户
    ├── parent-led        pl_     親家
    └── project           pm_     項目管理（文檔階段）
```

::: info 版本説明
模塊數量會隨倉庫演進變化，以 `spring-boot-starter-runner/pom.xml` 和各子模塊 README 為準。
上表描述的是當前代碼中已出現的能力域，不代表每個模塊都已達到同等成熟度。
:::

## 二、兩類模塊，兩種判斷

### 2.1 components：可複用的能力

`system`、`trade`、`file`、`sms` 這類模塊，提供的往往是**其他業務域也會用到的能力**。

判斷標準：

- 是否被兩個以上業務域使用？
- 是否具有獨立的技術邊界（支付、短信、對象存儲）？
- 是否可以獨立演進、替換供應商？

如果答案是“是”，優先考慮放進 `components`。

### 2.2 business：垂直業務

`dating`、`parent-led` 這類模塊，圍繞一個具體業務場景組織：

- 有獨立的領域語言（會員、配對、親家、孩子檔案）；
- 有自己的表、頁面、流程；
- 不一定被其他域複用。

判斷標準：

- 它是不是一個“業務產品”，而不是“技術能力”？
- 它的變化是否主要由業務策略驅動？

如果是，優先放進 `business`。

## 三、表前綴與命名

| 域 | 表前綴 | Java 包 |
| --- | --- | --- |
| system | `sys_` | `pub.module.system` |
| trade | `td_` | `pub.module.trade` |
| distribution | `dist_` | `pub.module.distribution` |
| wechat | `wx_` | `pub.module.wx` |
| cms | `cms_` | `pub.module.cms` |
| im | `im_` | `pub.module.im` |
| verification | `vt_` | `pub.module.verification` |
| dating | `dt_` | `pub.module.dating` |
| parent-led | `pl_` | `pub.module.parentled` |

命名遵循“表前綴 + 字段名”，並省略系統層：

```text
正確：dist_user_bill_summary.dist_user_code
錯誤：dist_user_bill_summary.dist_sys_user_code
```

業務主鍵使用 `xxxCode`，對外關聯不暴露技術主鍵 `id`。

## 四、新增能力放哪裏？

### 決策樹

```text
新需求需要新的數據與流程
│
├─ 是否只是現有域的一個新用例？
│  ├─ 是 → 放在現有 *-biz，不新建模塊
│  └─ 否 ↓
│
├─ 是否是可被多個業務域複用的技術能力？
│  ├─ 是 → components 下新增 {能力} 模塊
│  └─ 否 ↓
│
└─ 是否是獨立業務產品？
   ├─ 是 → business 下新增 {業務} 模塊
   └─ 否 → 先回到需求，確認邊界是否真的成立
```

### 三個反例

| 反例 | 為什麼錯 | 更好的做法 |
| --- | --- | --- |
| 把“活動報名”塞進 `system` | 系統域被業務污染，權限與業務耦合 | 新建 `campaign` 或放入對應業務域 |
| 為每個 CRUD 建一個 Maven 模塊 | 模塊爆炸，編譯與維護成本上升 | 同一業務域內按聚合組織 |
| 把短信、支付實現寫進業務模塊 | 供應商變化會污染業務代碼 | 使用現有 components 的 SPI 擴展 |

## 五、裝配：runner 是微內核

`spring-boot-starter-runner` 只做兩件事：

1. 按需引入 `*-biz`；
2. 提供啓動配置與基礎設施。

加依賴，模塊自動裝配；減依賴，對應的 Controller、Service、Consumer 自然消失。這就是“可裁剪的交付”。

```xml
<dependency>
  <groupId>pub.module</groupId>
  <artifactId>spring-boot-starter-system-biz</artifactId>
</dependency>
<dependency>
  <groupId>pub.module</groupId>
  <artifactId>spring-boot-starter-parent-led-biz</artifactId>
</dependency>
```

不同產品線可以使用不同組合：

| 組合 | 場景 |
| --- | --- |
| system + verification + parent-led | 親家版 |
| system + trade + dating + verification | 婚戀版 |
| 全部 biz | 全功能開發環境 |

## 六、界面層：多端中台

後端模塊解決“業務與契約”，界面層同樣需要邊界。TG-boot 的配套前端模板是
[`uniapp-middle-platform`](/zh-Hant/ai/uniapp-middle-platform/)。

它基於 **unibest 改進版**，是一套可複用的多端中台：

- 支持 **H5、微信小程序、App**，同一套頁面按平台編譯；
- 沉澱登錄、權限、佈局、請求、上傳、字典、表格、配置等公共能力；
- 內置系統、AI、CMS、IM、微信、交易、分銷、核驗等 15 個核心能力域；
- 新模塊只寫自己的頁面與 API，不再重複搭後台殼。

```text
TG-boot 後端模塊                   uniapp-middle-platform
spring-boot-starter-x-api   ←→    src/pages/manage_ability/x/
spring-boot-starter-x-biz         src/pages/manage/api/x.ts
                                  複用登錄 / 權限 / 佈局 / 請求
```

這就是“複用代碼、聚焦業務”的完整閉環：**後端按模塊切，前端按中台模板複用。**

## 七、模塊自檢清單

<ul class="doc-checklist">
  <li>新增的類是否能明確歸入 api / biz / common / runner 之一？</li>
  <li>跨模塊調用是否只使用 *-api 契約？</li>
  <li>是否避免了 *-biz 依賴他域 *-biz？</li>
  <li>表前綴與包名是否與域一致？</li>
  <li>新增事件是否登記了 destination、group 與冪等鍵？</li>
  <li>runner 的依賴是否確實需要？能否按產品線裁剪？</li>
</ul>
