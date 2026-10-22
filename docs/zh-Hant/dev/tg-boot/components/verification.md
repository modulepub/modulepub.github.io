---
title: spring-boot-starter-verification
createTime: 2026/06/02
permalink: /zh-Hant/dev/tg-boot/components/verification/
---

# spring-boot-starter-verification

**實名與核驗能力**：手機號二要素核驗、資產認證（人工審核）等；核驗通過後通過 MQ 通知依賴方（如 customer 同步實名狀態）。

## Maven 結構

- **`spring-boot-starter-verification-api`**：`ApiVtAssetCertService`、`ApiVtAssetCertMgtService` 等；消息契約 `PhoneTwoFactorVerifiedConsumer`。
- **`spring-boot-starter-verification-biz`**：業務實現、管理端/客户端控制器、MQ 發佈（`PhoneTwoFactorVerifiedPublisher`）。

## 跨模塊協作（MQ）

| Destination | 角色 | 説明 |
|-------------|------|------|
| `verification.phone-two-factor.verified` | 發佈 | 二要素核驗通過後廣播；customer-biz 消費並更新客户實名 |

契約見 `verification-api/messaging/PhoneTwoFactorVerifiedConsumer.java`；綁定由 common 的 `MqMessagingAutoConfiguration` 自動註冊。

## HTTP 概要

- **客户側 `cus`**：資產認證提交等（`CusVtAssetCertController`）。
- **管理側 `mgt`**：資產認證審核、核驗渠道配置（`MgtVtAssetCertController`、`MgtVtNpConfigController`）。

具體路徑以 Swagger 與各 `@RequestMapping` 為準。

**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-verification/`
