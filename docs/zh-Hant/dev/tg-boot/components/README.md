---
title: spring-boot-starter-components
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/
---

# spring-boot-starter-components

**通用能力聚合**：為業務模塊提供系統管理、交易支付、內容、文件、消息、核驗、任務調度等可裝配 starter；多數能力採用 `-api`（契約/DTO/配置）+ `-biz`（實現、HTTP、自動配置）分層。

`spring-boot-starter-common`（統一響應、異常、基礎實體、MQ 基礎設施等）已作為 [starter-module](/zh-Hant/dev/tg-boot/starter-module/) 的直接子模塊，見其 [common](/zh-Hant/dev/tg-boot/components/common/)。

## 子模塊一覽（與 `pom.xml` 一致）

| 模塊 | 業務與職責摘要 | 文檔 |
|------|------------------|------|
| `spring-boot-starter-system` | 登錄/驗證碼、用户組織角色權限等後台與用户端能力 | [system](/zh-Hant/dev/tg-boot/components/system/) |
| `spring-boot-starter-trade` | 商品訂單、微信支付；支付成功後 MQ 發佈 `trade.order-goods.paid` | [trade](/zh-Hant/dev/tg-boot/components/trade/) |
| `spring-boot-starter-distribution` | 分銷分傭、錢包；MQ 消費支付事件、request-reply 查詢推廣角色 | [distribution](/zh-Hant/dev/tg-boot/components/distribution/) |
| `spring-boot-starter-verification` | 二要素核驗、資產認證；核驗通過後 MQ 通知 customer 等 | [verification](/zh-Hant/dev/tg-boot/components/verification/) |
| `spring-boot-starter-wechat` | 微信網頁能力、登錄等（`WxController` / `WxLoginController`） | [wechat](/zh-Hant/dev/tg-boot/components/wechat/) |
| `spring-boot-starter-file` | 上傳與文件管理（`FileController`、`MgtFileController` 等） | [file](/zh-Hant/dev/tg-boot/components/file/) |
| `spring-boot-starter-cms` | CMS 節點；公開與管理端接口 | [cms](/zh-Hant/dev/tg-boot/components/cms/) |
| `spring-boot-starter-im` | IM 相關用户端接口 | [im](/zh-Hant/dev/tg-boot/components/im/) |
| `spring-boot-starter-excel` | Excel 導入導出（如 `PubExcelController`） | [excel](/zh-Hant/dev/tg-boot/components/excel/) |
| `spring-boot-starter-ocr` | OCR HTTP（銀行卡等），底層實現通過命名 Bean（如 `bizKsOcrService`） | [ocr](/zh-Hant/dev/tg-boot/components/ocr/) |
| `spring-boot-starter-sms` | 短信發送門面，多廠商 SPI 實現可切換 | [sms](/zh-Hant/dev/tg-boot/components/sms/) |

> **v3.6.0 起已移除**：`spring-boot-starter-dict`（通用字典）、`spring-boot-starter-generator`（代碼生成）、`spring-boot-starter-job`（XXL-Job 集成説明模塊）。詳見 [TG-boot 總覽 · 版本變更](/zh-Hant/dev/tg-boot/#版本變更歷史)。

## 裝配方式

- 各 `-biz` 模塊通過 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 註冊 `Biz*AutoConfiguration`，引入對應依賴後即參與 Spring Boot 自動配置。
- 跨模塊協作優先依賴 **對方 `-api` 模塊** 中的接口與 DTO，避免直連 `-biz` 實現類。

## 擴展建議

- 新增組件：在本聚合下新建 `spring-boot-starter-xxx`（含 `-api`/`-biz`），並實現自動配置類。
- 跨模塊事件：在 `-api/messaging` 定義 `XxxConsumer` 契約與消息 DTO，在 `-biz/messaging` 實現發佈/消費；binding 由 common 自動註冊。

**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`
