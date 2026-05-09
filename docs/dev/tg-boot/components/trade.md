---
title: spring-boot-starter-trade
createTime: 2026/05/09
permalink: /dev/tg-boot/components/trade/
---

# spring-boot-starter-trade

**电商/订单与支付**：商品与分类、订单与订单商品、微信支付配置、支付回调与下单流程中的公开接口。

## Maven 结构

- **`spring-boot-starter-trade-api`**：`ApiTdGoodsService`、`ApiTdOrderService`、`ApiTdWxPayConfigService`，以及扩展点 **`SpiNotifyThirdPaidResultService`**（支付成功后通知第三方业务，参数见 `TdOrderGoodsDTO`）。
- **`spring-boot-starter-trade-biz`**：`BizTradeAutoConfiguration`、各角色 Controller（`cus` / `mgt` / `pub` / `callback`）。

## 扩展点（重要）

- **`SpiNotifyThirdPaidResultService`**：实现类需注册为 Spring Bean，**Bean 名称**与订单商品上的 **品类编码**（如 `tdGdCgyCode`）一致；交易核心在支付完成后按名称 `getBean` 分发（见 `BizTradeOrderServiceImpl`）。
- 婚恋场景下的示例实现位于 **`spring-boot-starter-dating-plugin`**（多个品类对应多个实现类）。

## HTTP 概要

- **公开**：支付相关 `PubPayController`、`PubTradeOrderController`、`PubBizTradeGoodsController` 等。
- **回调**：`WxPayCallbackController`。
- **客户端 / 管理端**：订单、商品、分类、微信支付配置等 CRUD 与查询。

具体 URL 以 Swagger 与各 `@RequestMapping` 为准。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-trade/`
