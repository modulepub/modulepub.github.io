---
title: spring-boot-starter-verification
createTime: 2026/06/02
permalink: /dev/tg-boot/components/verification/
---

# spring-boot-starter-verification

**实名与核验能力**：手机号二要素核验、资产认证（人工审核）等；核验通过后通过 MQ 通知依赖方（如 customer 同步实名状态）。

## Maven 结构

- **`spring-boot-starter-verification-api`**：`ApiVtAssetCertService`、`ApiVtAssetCertMgtService` 等；消息契约 `PhoneTwoFactorVerifiedConsumer`。
- **`spring-boot-starter-verification-biz`**：业务实现、管理端/客户端控制器、MQ 发布（`PhoneTwoFactorVerifiedPublisher`）。

## 跨模块协作（MQ）

| Destination | 角色 | 说明 |
|-------------|------|------|
| `verification.phone-two-factor.verified` | 发布 | 二要素核验通过后广播；customer-biz 消费并更新客户实名 |

契约见 `verification-api/messaging/PhoneTwoFactorVerifiedConsumer.java`；绑定由 common 的 `MqMessagingAutoConfiguration` 自动注册。

## HTTP 概要

- **客户侧 `cus`**：资产认证提交等（`CusVtAssetCertController`）。
- **管理侧 `mgt`**：资产认证审核、核验渠道配置（`MgtVtAssetCertController`、`MgtVtNpConfigController`）。

具体路径以 Swagger 与各 `@RequestMapping` 为准。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-verification/`
