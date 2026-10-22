---
title: spring-boot-starter-trade
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/trade/
---
# spring-boot-starter-trade

**電商/訂單與支付**：商品與分類、訂單與訂單商品、支付回調消費與下單流程中的公開接口（微信支付能力見 `spring-boot-starter-wechat`）。

## Maven 結構

- **`spring-boot-starter-trade-api`**：`ApiTdGoodsService`、`ApiTdOrderService`；消息契約 `TradeStreamBindings`、`TdOrderGoodsDTO`。
- **`spring-boot-starter-trade-biz`**：`BizTradeAutoConfiguration`、各角色 Controller（`cus` / `mgt` / `pub` / `callback`）、`TradeOrderGoodsPaidPublisher`。

## 跨模塊協作（MQ）

支付成功後，`BizTradeOrderServiceImpl` 通過 `StreamBridge` 發佈 **`trade.order-goods.paid`**（消息體 `TdOrderGoodsDTO`）。各業務域按需訂閲：

| 消費方 | group | 説明 |
|--------|-------|------|
| dating-biz | `dating` | 婚戀履約（`DatingTradeGoodsCategoryEnum` 路由） |
| distribution-biz | `distribution` | 分銷分傭 |

綁定配置見 `application-trade-messaging.yml`（classpath，由 runner `spring.config.import` 引入）。

## 模塊內擴展

- **支付渠道**：實現 `BizPayService` 並聲明 `paidChannelCode()`（見 `TradePaidChannelEnum`），由 `BizPayServiceRegistry` 注入路由，勿使用 `SpringUtil.getBean` 按名稱解析。

## 命名説明（歷史遺留）

- 本模塊部分字段含 `SysUser` 字樣（如 `tdOdSysUserCode`）為**早期命名**，含義即 `userCode`。
- **新字段請勿沿用**；全庫約定見根目錄 [AI 編碼規範](/zh-Hant/dev/tg-boot/agents/) 與 [TG-boot 總覽](/zh-Hant/dev/tg-boot/)：**表前綴 + 字段名，省略系統層**（例：若新建表需存下單用户，應使用 `tdOdUserCode` 一類寫法，而非 `tdOdSysUserCode`）。

## HTTP 概要

- **公開**：支付相關 `PubPayController`、`PubTradeOrderController`、`PubBizTradeGoodsController` 等。
- **回調**：微信支付回調已遷至 wechat 模塊；trade 通過 MQ（`wx.pay.notify`）消費並調用 `paidOrder`。
- **客户端 / 管理端**：訂單、商品、分類等 CRUD 與查詢（微信支付配置見 `spring-boot-starter-wechat`）。

具體 URL 以 Swagger 與各 `@RequestMapping` 為準。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`