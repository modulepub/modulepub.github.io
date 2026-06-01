---
title: spring-boot-starter-dating
createTime: 2026/05/09
permalink: /en/dev/tg-boot/business/dating/
---
# spring-boot-starter-dating

婚恋 / 约会垂直业务：匹配与推荐、意向与联系方式申请、偏好、红娘与婚介机构、客户侧与管理端运营能力，以及与统计相关的公开接口。

## Maven 结构

- **`spring-boot-starter-dating-api`**：`pub.module.dating.api.service.*`、常量（含 `DatingTradeGoodsCategoryEnum`）、DTO，供其他模块依赖。
- **`spring-boot-starter-dating-biz`**：业务实现、持久化、`BizDatingAutoConfiguration`、REST 控制器、**MQ 消费端**（`biz/messaging` 包）。

## HTTP 能力（便于检索）

- **客户侧 `cus`**：匹配、推荐、意向、偏好、联系人、红娘关系等。
- **管理侧 `mgt`**：意向审核、匹配规则运营、红娘/门店、推荐配置等。
- **公开 `pub`**：机构/红娘展示、统计等（见 `Pub*`、`Statistic*` 控制器）。

具体路径与参数以 Swagger（`/swagger-ui/index.html`）与各 Controller 注解为准。

## 跨模块协作（MQ）

| Destination | 角色 | Function Bean | 说明 |
|-------------|------|---------------|------|
| `trade.order-goods.paid` | 消费者（group=`dating`） | `datingTradeOrderGoodsPaid` | 支付履约，`BizDatingTradeOrderPaidService` |
| `customer.profile.updated` | 消费者 | `DatingCustomerProfileUpdatedConsumer`（dating-api） | 同步客户冗余快照 |
| `distribution.promoter-role.query` | 应答方（group=`dating`） | `datingDistPromoterRoleQuery` | request-reply 解析推广人角色 |

Stream 绑定见 **`application-dating-messaging.yml`**（本模块 resources，由 runner `spring.config.import` 引入）。

## 与交易模块的协作

交易订单支付完成后，trade 模块发布 `trade.order-goods.paid`；本模块按 **`DatingTradeGoodsCategoryEnum`** 过滤并路由履约逻辑（权益、合约类等），无需再引入独立 trade 插件。
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/`