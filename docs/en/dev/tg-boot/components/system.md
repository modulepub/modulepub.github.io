---
title: spring-boot-starter-system
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/system/
---

# spring-boot-starter-system

**System administration foundation**: organizations, users, roles, permissions, captcha, and login flows—REST endpoints for both admin and client apps.

## HTTP overview

- **Public**: `PubLoginController`, `PubCaptchaController`, etc.
- **Admin `mgt`**: CRUD and associations for users, orgs, roles, permissions, validation helpers.
- **Client `cus`**: `CusSysUserController`, `CusPermissionController`, user/org projections, etc.

## Maven layout

- **`spring-boot-starter-system-api`**: contracts and DTOs.
- **`spring-boot-starter-system-biz`**: `BizSystemAutoConfiguration`, controllers, services.

Other domains that need the platform identity model should depend on `-api` for types or integrate via HTTP; customize login by extending `-biz` implementations.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-system/`
