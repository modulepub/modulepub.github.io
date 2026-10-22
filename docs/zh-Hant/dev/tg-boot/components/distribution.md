---
title: spring-boot-starter-distribution
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/distribution/
---
# spring-boot-starter-distribution

**分銷賬單與結算**：用户賬單彙總、結算記錄、結算批次、分傭計算等。

## Maven 結構

- **`spring-boot-starter-distribution-api`**：`ApiDistUserBillSummaryService`、`ApiDistSettleBatchService` 等。
- **`spring-boot-starter-distribution-biz`**：業務實現、MQ 消費（`biz/messaging` 包）。

## 跨模塊協作（MQ）

| Destination | 角色 | 説明 |
|-------------|------|------|
| `trade.order-goods.paid` | 消費（group=`distribution`） | 支付成功後更新賬單彙總與結算記錄 |
| `system.user.registered` | 消費（group=`distribution`） | 註冊成功後初始化用户賬單彙總 |

管理端菜單：分銷系統 → 用户賬單彙總 / 結算記錄 / 結算批次。

綁定見 `application-distribution-messaging.yml`。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`