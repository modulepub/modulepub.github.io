---
title: spring-boot-starter-wechat
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/wechat/
---
# spring-boot-starter-wechat

**微信集成**：網頁授權、登錄回調等與微信平台對接的能力（具體 scope 以代碼與配置為準）。

## HTTP 入口（檢索用）

- **`WxController`**：微信側回調或通用微信接口。
- **`WxLoginController`**：登錄流程相關接口。

路徑與參數見 Swagger 與各方法註解。

## Maven 結構

- **`spring-boot-starter-wechat-api`**：DTO、配置常量、與微信交互所需的契約類型。
- **`spring-boot-starter-wechat-biz`**：`BizWxAutoConfiguration`、上述控制器與服務實現。

**支付與商户訂單**主要在 **`spring-boot-starter-trade`**（微信支付配置、支付回調）；本模塊側重身份與微信開放平台能力銜接。

## 使用説明

引入 **`spring-boot-starter-wechat-biz`**，在配置文件中填寫微信 AppId、密鑰等；與其他模塊協作時僅依賴 `-api` 即可引用類型。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`