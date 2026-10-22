---
title: spring-boot-starter-business
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/business/
---

# spring-boot-starter-business

**垂直業務聚合**：面向具體行業的業務能力，依賴 `spring-boot-starter-components` 中的通用能力（用户、支付、文件等）。

## 子模塊

| 模塊 | 業務摘要 | 文檔 |
|------|----------|------|
| `spring-boot-starter-customer` | 客户與跟進、推廣任務、員工看板、公開客户接口等 | [customer](/zh-Hant/dev/tg-boot/business/customer/) |
| `spring-boot-starter-dating` | 婚戀/約會：匹配、意向、紅娘與門店、統計；MQ 訂閲交易支付與客户資料 | [dating](/zh-Hant/dev/tg-boot/business/dating/) |

## 對外能力形態

- **HTTP**：由各 `-biz` 下 `controller` 暴露（常見前綴 `cus` / `mgt` / `pub` 區分客户端、管理端、匿名或公開接口）。
- **模塊間 API**：各 `-api` 中的 `pub.module.<domain>.api.service.*` 接口供其他 starter 依賴與注入實現。
- **模塊間 MQ**：契約在 `*-api/messaging`，發佈/消費實現在各 `-biz/messaging`；binding 由 common 自動註冊。

## 使用説明

在自定義應用中按需引入對應 `-biz`（或同時引入 `-api` 若僅需契約）。配置遵循各模塊 messaging 約定與 runner `spring.config.import`。

**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/`
