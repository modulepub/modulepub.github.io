---
title: spring-boot-starter-im
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/im/
---
# spring-boot-starter-im

**即時通訊銜接**：為應用提供 IM 相關的後端接口（會話、消息或與第三方 IM SDK 的橋接，以當前實現類為準）。

## HTTP 概要

- **客户側**：`CusImController` — 登錄用户維度的 IM 能力入口。

## Maven 結構

- **`spring-boot-starter-im-api`**：IM 契約與 DTO。
- **`spring-boot-starter-im-biz`**：`BizImAutoConfiguration`、服務與控制器。

擴展新消息類型或對接新廠商時，在 `-biz` 增加實現並保持 `-api` 穩定供其他模塊依賴。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`