---
title: spring-boot-starter-im
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/im/
---

# spring-boot-starter-im

**Instant messaging bridge**: backend endpoints for conversations/messages or bridging third-party IM SDKs (see concrete classes).

## HTTP overview

- **Client**: `CusImController` — authenticated-user IM entry points.

## Maven layout

- **`spring-boot-starter-im-api`**: IM contracts/DTOs.
- **`spring-boot-starter-im-biz`**: `BizImAutoConfiguration`, services, controllers.

When adding message types or vendors, extend `-biz` while keeping `-api` stable for dependents.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-im/`
