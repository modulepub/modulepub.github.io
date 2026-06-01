---
title: spring-boot-starter-trade
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/trade/
---
# spring-boot-starter-trade

**电商/订单与支付**：商品与分类、订单与订单商品、支付回调消费与下单流程中的公开接口（微信支付能力见 `spring-boot-starter-wechat`）。

## Maven 结构

- **`spring-boot-starter-trade-api`**：`ApiTdGoodsService`、`ApiTdOrderService`；消息契约 `TradeStreamBindings`、`TdOrderGoodsDTO`。
- **`spring-boot-starter-trade-biz`**：`BizTradeAutoConfiguration`、各角色 Controller（`cus` / `mgt` / `pub` / `callback`）、`TradeOrderGoodsPaidPublisher`。

## 跨模块协作（MQ）

支付成功后，`BizTradeOrderServiceImpl` 通过 `StreamBridge` 发布 **`trade.order-goods.paid`**（消息体 `TdOrderGoodsDTO`）。各业务域按需订阅：

| 消费方 | group | 说明 |
|--------|-------|------|
| dating-biz | `dating` | 婚恋履约（`DatingTradeGoodsCategoryEnum` 路由） |
| distribution-biz | `distribution` | 分销分佣 |

绑定配置见 `application-trade-messaging.yml`（classpath，由 runner `spring.config.import` 引入）。

## 模块内扩展

- **支付渠道**：实现 `BizPayService` 并声明 `paidChannelCode()`（见 `TradePaidChannelEnum`），由 `BizPayServiceRegistry` 注入路由，勿使用 `SpringUtil.getBean` 按名称解析。

## 命名说明（历史遗留）

- 本模块部分字段含 `SysUser` 字样（如 `tdOdSysUserCode`）为**早期命名**，含义即 `userCode`。
- **新字段请勿沿用**；全库约定见根目录 [AI 编码规范](/en/dev/tg-boot/agents/) 与 [TG-boot 总览](/en/dev/tg-boot/)：**表前缀 + 字段名，省略系统层**（例：若新建表需存下单用户，应使用 `tdOdUserCode` 一类写法，而非 `tdOdSysUserCode`）。

## HTTP 概要

- **公开**：支付相关 `PubPayController`、`PubTradeOrderController`、`PubBizTradeGoodsController` 等。
- **回调**：微信支付回调已迁至 wechat 模块；trade 通过 MQ（`wx.pay.notify`）消费并调用 `paidOrder`。
- **客户端 / 管理端**：订单、商品、分类等 CRUD 与查询（微信支付配置见 `spring-boot-starter-wechat`）。

具体 URL 以 Swagger 与各 `@RequestMapping` 为准。
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`