---
title: 深度手冊索引
description: TG-boot 全量文檔、組件手冊、業務模塊、運維與共識算法研究索引。
---

<div class="doc-eyebrow">REFERENCE · GO DEEPER</div>

<p class="doc-lead">
  前面的十篇文檔負責建立主線。這一頁是“按需查閲”的深層資料庫：
  組件接口、模塊實現、樹圖架構、運維細節與共識算法研究。
</p>

::: warning 版本提示
深度手冊來自倉庫不同階段的文檔，部分頁面可能落後於當前代碼。
涉及具體接口、配置與表結構時，以源碼和模塊 README 為準。
:::

## 一、框架與規範

<div class="doc-cards">
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/">
    <span class="doc-card__tag">OVERVIEW</span>
    <h3>TG-boot 總覽</h3>
    <p>整體架構、技術棧、模塊結構、內置運行環境與框架特點。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/agents/">
    <span class="doc-card__tag">AI CODING</span>
    <h3>AI 編碼規範</h3>
    <p>BaseEntity、雙主鍵、命名、狀態字段與檢查清單。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/architecture-tests/">
    <span class="doc-card__tag">GUARDRAIL</span>
    <h3>架構測試門禁</h3>
    <p>ArchUnit 規則、POM 依賴規則與生效時機。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/cross-module-collaboration/">
    <span class="doc-card__tag">CONTRACT</span>
    <h3>跨模塊協作</h3>
    <p>MQ 異步、Api 同步、模塊內 SPI 的完整邊界説明。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/tree-graph-architecture/">
    <span class="doc-card__tag">ARCHITECTURE</span>
    <h3>樹-圖架構</h3>
    <p>從分層到樹圖合一的架構表達，以及適用場景。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/tg-boot/ops/">
    <span class="doc-card__tag">OPERATIONS</span>
    <h3>運維説明</h3>
    <p>Actuator、MQ、構建門禁與生產安全。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/ai/uniapp-middle-platform/">
    <span class="doc-card__tag">MULTI-END</span>
    <h3>多端中台</h3>
    <p>基於 unibest 改進版，一套代碼複用到 H5、小程序與 App。</p>
  </a>
</div>

## 二、組件手冊

| 組件 | 關注點 |
| --- | --- |
| [common](/zh-Hant/dev/tg-boot/components/common/) | 內核、消息、認證、緩存 |
| [system](/zh-Hant/dev/tg-boot/components/system/) | 用户、組織、權限 |
| [trade](/zh-Hant/dev/tg-boot/components/trade/) | 商品、訂單、支付 |
| [distribution](/zh-Hant/dev/tg-boot/components/distribution/) | 分銷、分傭、賬單 |
| [verification](/zh-Hant/dev/tg-boot/components/verification/) | 實名、內容審核、人臉 |
| [wechat](/zh-Hant/dev/tg-boot/components/wechat/) | 公眾號、小程序、支付 |
| [file](/zh-Hant/dev/tg-boot/components/file/) | 文件與配置 |
| [cms](/zh-Hant/dev/tg-boot/components/cms/) | 內容節點 |
| [im](/zh-Hant/dev/tg-boot/components/im/) | 即時通訊 |
| [excel](/zh-Hant/dev/tg-boot/components/excel/) | 模板導入導出 |
| [ocr](/zh-Hant/dev/tg-boot/components/ocr/) | OCR 門面 |
| [sms](/zh-Hant/dev/tg-boot/components/sms/) | 短信 SPI |

更多組件與業務模塊見左側「深度手冊」導航。

## 三、業務模塊

- [business 總覽](/zh-Hant/dev/tg-boot/business/)：垂直業務的對外能力形態；
- [dating](/zh-Hant/dev/tg-boot/business/dating/)：婚戀 / 客户域；
- [customer](/zh-Hant/dev/tg-boot/business/customer/)：客户域歷史説明；
- [tg-manage-vue](/zh-Hant/dev/tg-boot/frontend-tg-manage-vue/)：管理端前端工程。

## 四、研究檔案

<div class="doc-cards">
  <a class="doc-card" href="/zh-Hant/dev/consensus/time-based-consensus-design/">
    <span class="doc-card__tag">CONSENSUS</span>
    <h3>基於時間特性的共識算法（V1）</h3>
    <p>時間節點、權重與共識流程的設計文檔。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/TRC/">
    <span class="doc-card__tag">TIME RIVER</span>
    <h3>時間長河共識算法</h3>
    <p>核心機制、時間節點作用、優勢與侷限性。</p>
  </a>
  <a class="doc-card" href="/zh-Hant/dev/excel/">
    <span class="doc-card__tag">EXCEL</span>
    <h3>Excel 導入導出</h3>
    <p>模板驅動的零侵入導入導出方案。</p>
  </a>
</div>

## 五、倉庫與運行環境

| 資源 | 地址 |
| --- | --- |
| 開源倉庫 | <https://gitee.com/pub_module/tg-boot.git> |
| 文檔站點 | <https://module.pub> |
| 本地後端 | `http://127.0.0.1:9999` |
| 本地中台 | `http://127.0.0.1:9100` |
| Swagger | `http://127.0.0.1:9999/swagger-ui/index.html` |

<div class="doc-quote">
  文檔的終點不是“讀完”，而是“能定位到源碼裏的那一行”。
  <small>READ → LOCATE → VERIFY</small>
</div>
