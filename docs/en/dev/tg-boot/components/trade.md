---
title: spring-boot-starter-trade
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/trade/
---

# spring-boot-starter-trade

**E-commerce / orders / payments**: catalog & categories, orders & line items, WeChat pay configuration, callbacks, and public checkout-facing endpoints.

## Maven layout

- **`spring-boot-starter-trade-api`**: `ApiTdGoodsService`, `ApiTdOrderService`, `ApiTdWxPayConfigService`, plus **`SpiNotifyThirdPaidResultService`** (post-payment hooks; see `TdOrderGoodsDTO`).
- **`spring-boot-starter-trade-biz`**: `BizTradeAutoConfiguration`, controllers for `cus` / `mgt` / `pub` / `callback`.

## Extension points

- **`SpiNotifyThirdPaidResultService`**: register Spring beans whose **names match order line category codes** (`tdGdCgyCode`, etc.); `BizTradeOrderServiceImpl` resolves them after payment succeeds.
- Dating sample implementations live in **`spring-boot-starter-dating-plugin`** (multiple beans for multiple categories).

## HTTP overview

- **Public**: `PubPayController`, `PubTradeOrderController`, `PubBizTradeGoodsController`, …
- **Callbacks**: `WxPayCallbackController`.
- **Client/admin**: CRUD & queries for orders, goods, categories, WeChat pay configs.

Confirm exact URLs in Swagger/`@RequestMapping`.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-trade/`
