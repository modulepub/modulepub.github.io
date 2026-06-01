---
title: spring-boot-starter-distribution
createTime: 2026/05/09
permalink: /dev/tg-boot/components/distribution/
---
# spring-boot-starter-distribution

**分销账单与结算**：用户账单汇总、结算记录、结算批次、分佣计算等。

## Maven 结构

- **`spring-boot-starter-distribution-api`**：`ApiDistUserBillSummaryService`、`ApiDistSettleBatchService` 等。
- **`spring-boot-starter-distribution-biz`**：业务实现、MQ 消费（`biz/messaging` 包）。

## 跨模块协作（MQ）

| Destination | 角色 | 说明 |
|-------------|------|------|
| `trade.order-goods.paid` | 消费（group=`distribution`） | 支付成功后更新账单汇总与结算记录 |
| `system.user.registered` | 消费（group=`distribution`） | 注册成功后初始化用户账单汇总 |

管理端菜单：分销系统 → 用户账单汇总 / 结算记录 / 结算批次。

绑定见 `application-distribution-messaging.yml`。
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`