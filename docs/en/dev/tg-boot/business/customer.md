---
title: spring-boot-starter-customer
createTime: 2026/05/09
permalink: /en/dev/tg-boot/business/customer/
---

# spring-boot-starter-customer

**Customer & growth operations**: customer master data, contact trails, promotion tasks, source/employee dashboards, plus anonymous/C-facing public endpoints.

## Maven layout

- **`spring-boot-starter-customer-api`**: `ApiCustomerService`, `ApiCustomerContactRecordService`, … for cross-starter calls.
- **`spring-boot-starter-customer-biz`**: `BizCustomerAutoConfiguration`, controllers, services.

## HTTP overview

- **`cus`**: authenticated customer-scoped info, campaigns, contact follow-ups.
- **`mgt`**: back-office customer ops, trails, campaigns, dashboards (sources, employee metrics).
- **`pub`**: public acquisition endpoints such as `PubCustomerController`.

When extending sources or task types, evolve `-api` first, implement in `-biz`, and keep controller prefixes consistent.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-business/spring-boot-starter-customer/`
