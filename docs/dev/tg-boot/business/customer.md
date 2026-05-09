---
title: spring-boot-starter-customer
createTime: 2026/05/09
permalink: /dev/tg-boot/business/customer/
---

# spring-boot-starter-customer

**客户与营销运营**相关业务：客户主数据、跟进记录、推广任务、来源/员工业绩看板，以及面向匿名或 C 端的公开客户接口。

## Maven 结构

- **`spring-boot-starter-customer-api`**：`ApiCustomerService`、`ApiCustomerContactRecordService` 等，供其他 starter 调用客户领域能力。
- **`spring-boot-starter-customer-biz`**：`BizCustomerAutoConfiguration`、控制器与服务实现。

## HTTP 能力概要

- **`cus`**：当前客户维度的客户信息、推广任务、联系人跟进等。
- **`mgt`**：后台客户管理、跟进记录、推广任务、仪表盘（员工业绩、来源等）。
- **`pub`**：公开客户相关入口（如 `PubCustomerController`）。

扩展新客户来源或任务类型时，优先在 `-api` 增补契约，在 `-biz` 实现并保持 Controller 分层前缀一致。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/spring-boot-starter-customer/`
