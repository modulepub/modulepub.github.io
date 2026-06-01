---
title: spring-boot-starter-business
createTime: 2026/05/09
permalink: /en/dev/tg-boot/business/
---

# spring-boot-starter-business

**垂直业务聚合**：面向具体行业的业务能力，依赖 `spring-boot-starter-components` 中的通用能力（用户、支付、文件等）。

## 子模块

| 模块 | 业务摘要 | 文档 |
|------|----------|------|
| `spring-boot-starter-customer` | 客户与跟进、推广任务、员工看板、公开客户接口等 | [customer](/en/dev/tg-boot/business/customer/) |
| `spring-boot-starter-dating` | 婚恋/约会：匹配、意向、红娘与门店、统计；MQ 订阅交易支付与客户资料 | [dating](/en/dev/tg-boot/business/dating/) |

## 对外能力形态

- **HTTP**：由各 `-biz` 下 `controller` 暴露（常见前缀 `cus` / `mgt` / `pub` 区分客户端、管理端、匿名或公开接口）。
- **模块间 API**：各 `-api` 中的 `pub.module.<domain>.api.service.*` 接口供其他 starter 依赖与注入实现。
- **模块间 MQ**：契约在 `*-api/messaging`，发布/消费实现在各 `-biz/messaging`；binding 由 common 自动注册。

## 使用说明

在自定义应用中按需引入对应 `-biz`（或同时引入 `-api` 若仅需契约）。配置遵循各模块 messaging 约定与 runner `spring.config.import`。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/`