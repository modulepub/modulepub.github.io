---
title: spring-boot-starter-sms
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/sms/
---
# spring-boot-starter-sms

**短信發送組件**：對上游暴露統一 **`ApiSmsSendService`**（`spring-boot-starter-sms-api`），具體廠商（創藍、玄武等）在 `-biz` 中通過 SPI/實現類切換，**換短信平台只需改配置，不必改業務代碼**。

> **AI / 開發者**：新增或修改本模塊 `crud/entity` 前必讀倉庫根目錄 [AI 編碼規範](/zh-Hant/dev/tg-boot/agents/)（實體必須 `extends BaseEntity`，業務主鍵為 `smsXxxCode`，技術主鍵為 `id`）。

## 對外 API

- **`BizSmsService.sendSms(String mobile, String content)`** 等（以接口定義為準）。

## Maven 結構

- **`spring-boot-starter-sms-api`**：配置屬性 `SmsProperties`、發送器工具類、常量枚舉。
- **`spring-boot-starter-sms-biz`**：`BizSmsAutoConfiguration`、默認業務實現與各廠商 `Spi*SmsServiceImpl`。

引入 **`spring-boot-starter-sms-biz`** 即可獲得自動配置與實現；僅契約依賴可單獨引入 `-api`。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`