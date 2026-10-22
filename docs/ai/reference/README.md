---
title: 深度手册索引
description: TG-boot 全量文档、组件手册、业务模块、运维与共识算法研究索引。
---

<div class="doc-eyebrow">REFERENCE · GO DEEPER</div>

<p class="doc-lead">
  前面的十篇文档负责建立主线。这一页是“按需查阅”的深层资料库：
  组件接口、模块实现、树图架构、运维细节与共识算法研究。
</p>

::: warning 版本提示
深度手册来自仓库不同阶段的文档，部分页面可能落后于当前代码。
涉及具体接口、配置与表结构时，以源码和模块 README 为准。
:::

## 一、框架与规范

<div class="doc-cards">
  <a class="doc-card" href="/dev/tg-boot/">
    <span class="doc-card__tag">OVERVIEW</span>
    <h3>TG-boot 总览</h3>
    <p>整体架构、技术栈、模块结构、内置运行环境与框架特点。</p>
  </a>
  <a class="doc-card" href="/dev/tg-boot/agents/">
    <span class="doc-card__tag">AI CODING</span>
    <h3>AI 编码规范</h3>
    <p>BaseEntity、双主键、命名、状态字段与检查清单。</p>
  </a>
  <a class="doc-card" href="/dev/tg-boot/architecture-tests/">
    <span class="doc-card__tag">GUARDRAIL</span>
    <h3>架构测试门禁</h3>
    <p>ArchUnit 规则、POM 依赖规则与生效时机。</p>
  </a>
  <a class="doc-card" href="/dev/tg-boot/cross-module-collaboration/">
    <span class="doc-card__tag">CONTRACT</span>
    <h3>跨模块协作</h3>
    <p>MQ 异步、Api 同步、模块内 SPI 的完整边界说明。</p>
  </a>
  <a class="doc-card" href="/dev/tg-boot/tree-graph-architecture/">
    <span class="doc-card__tag">ARCHITECTURE</span>
    <h3>树-图架构</h3>
    <p>从分层到树图合一的架构表达，以及适用场景。</p>
  </a>
  <a class="doc-card" href="/dev/tg-boot/ops/">
    <span class="doc-card__tag">OPERATIONS</span>
    <h3>运维说明</h3>
    <p>Actuator、MQ、构建门禁与生产安全。</p>
  </a>
  <a class="doc-card" href="/ai/uniapp-middle-platform/">
    <span class="doc-card__tag">MULTI-END</span>
    <h3>多端中台</h3>
    <p>基于 unibest 改进版，一套代码复用到 H5、小程序与 App。</p>
  </a>
</div>

## 二、组件手册

| 组件 | 关注点 |
| --- | --- |
| [common](/dev/tg-boot/components/common/) | 内核、消息、认证、缓存 |
| [system](/dev/tg-boot/components/system/) | 用户、组织、权限 |
| [trade](/dev/tg-boot/components/trade/) | 商品、订单、支付 |
| [distribution](/dev/tg-boot/components/distribution/) | 分销、分佣、账单 |
| [verification](/dev/tg-boot/components/verification/) | 实名、内容审核、人脸 |
| [wechat](/dev/tg-boot/components/wechat/) | 公众号、小程序、支付 |
| [file](/dev/tg-boot/components/file/) | 文件与配置 |
| [cms](/dev/tg-boot/components/cms/) | 内容节点 |
| [im](/dev/tg-boot/components/im/) | 即时通讯 |
| [excel](/dev/tg-boot/components/excel/) | 模板导入导出 |
| [ocr](/dev/tg-boot/components/ocr/) | OCR 门面 |
| [sms](/dev/tg-boot/components/sms/) | 短信 SPI |

更多组件与业务模块见左侧「深度手册」导航。

## 三、业务模块

- [business 总览](/dev/tg-boot/business/)：垂直业务的对外能力形态；
- [dating](/dev/tg-boot/business/dating/)：婚恋 / 客户域；
- [customer](/dev/tg-boot/business/customer/)：客户域历史说明；
- [tg-manage-vue](/dev/tg-boot/frontend-tg-manage-vue/)：管理端前端工程。

## 四、研究档案

<div class="doc-cards">
  <a class="doc-card" href="/dev/consensus/time-based-consensus-design/">
    <span class="doc-card__tag">CONSENSUS</span>
    <h3>基于时间特性的共识算法（V1）</h3>
    <p>时间节点、权重与共识流程的设计文档。</p>
  </a>
  <a class="doc-card" href="/dev/TRC/">
    <span class="doc-card__tag">TIME RIVER</span>
    <h3>时间长河共识算法</h3>
    <p>核心机制、时间节点作用、优势与局限性。</p>
  </a>
  <a class="doc-card" href="/dev/excel/">
    <span class="doc-card__tag">EXCEL</span>
    <h3>Excel 导入导出</h3>
    <p>模板驱动的零侵入导入导出方案。</p>
  </a>
</div>

## 五、仓库与运行环境

| 资源 | 地址 |
| --- | --- |
| 开源仓库 | <https://gitee.com/pub_module/tg-boot.git> |
| 文档站点 | <https://module.pub> |
| 本地后端 | `http://127.0.0.1:9999` |
| 本地中台 | `http://127.0.0.1:9100` |
| Swagger | `http://127.0.0.1:9999/swagger-ui/index.html` |

<div class="doc-quote">
  文档的终点不是“读完”，而是“能定位到源码里的那一行”。
  <small>READ → LOCATE → VERIFY</small>
</div>
