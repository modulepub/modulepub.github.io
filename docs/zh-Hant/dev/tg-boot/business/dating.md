---
title: spring-boot-starter-dating
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/business/dating/
---
# spring-boot-starter-dating

婚戀 / 約會垂直業務：匹配與推薦、意向與聯繫方式申請、偏好、紅娘與婚介機構、客户側與管理端運營能力，以及與統計相關的公開接口。

## Maven 結構

- **`spring-boot-starter-dating-api`**：`pub.module.dating.api.service.*`、常量（含 `DatingTradeGoodsCategoryEnum`）、DTO，供其他模塊依賴。
- **`spring-boot-starter-dating-biz`**：業務實現、持久化、`BizDatingAutoConfiguration`、REST 控制器、**MQ 消費端**（`biz/messaging` 包）。

## HTTP 能力（便於檢索）

- **客户側 `cus`**：匹配、推薦、意向、偏好、聯繫人、紅娘關係等。
- **管理側 `mgt`**：意向審核、匹配規則運營、紅娘/門店、推薦配置等。
- **公開 `pub`**：機構/紅娘展示、統計等（見 `Pub*`、`Statistic*` 控制器）。

具體路徑與參數以 Swagger（`/swagger-ui/index.html`）與各 Controller 註解為準。

## 跨模塊協作（MQ）

| Destination | 角色 | Function Bean | 説明 |
|-------------|------|---------------|------|
| `trade.order-goods.paid` | 消費者（group=`dating`） | `datingTradeOrderGoodsPaid` | 支付履約，`BizDatingTradeOrderPaidService` |
| `customer.profile.updated` | 消費者 | `DatingCustomerProfileUpdatedConsumer`（dating-api） | 同步客户冗餘快照 |
| `distribution.promoter-role.query` | 應答方（group=`dating`） | `datingDistPromoterRoleQuery` | request-reply 解析推廣人角色 |

Stream 綁定見 **`application-dating-messaging.yml`**（本模塊 resources，由 runner `spring.config.import` 引入）。

## 與交易模塊的協作

交易訂單支付完成後，trade 模塊發佈 `trade.order-goods.paid`；本模塊按 **`DatingTradeGoodsCategoryEnum`** 過濾並路由履約邏輯（權益、合約類等），無需再引入獨立 trade 插件。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/`