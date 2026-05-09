---
title: spring-boot-starter-wechat
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/wechat/
---

# spring-boot-starter-wechat

**WeChat integration**: web authorization and login callbacks (scopes and parameters follow code/config).

## HTTP entry points

- **`WxController`**: platform callbacks / generic WeChat endpoints.
- **`WxLoginController`**: login-related endpoints.

See Swagger and method annotations for paths and parameters.

## Maven layout

- **`spring-boot-starter-wechat-api`**: DTOs, configuration constants, contract types for WeChat IO.
- **`spring-boot-starter-wechat-biz`**: `BizWxAutoConfiguration`, controllers, services.

**Merchant payments and trade orders** primarily belong to **`spring-boot-starter-trade`** (WeChat pay settings & callbacks); this module focuses on identity and general WeChat platform bridging.

## Usage

Add **`spring-boot-starter-wechat-biz`**, configure AppId/secrets in `application*.yml`; peer modules only need `-api` for types.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-wechat/`
