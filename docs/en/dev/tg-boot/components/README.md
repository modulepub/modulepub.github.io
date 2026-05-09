---
title: spring-boot-starter-components
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/
---

# spring-boot-starter-components

**Shared capability aggregator**: starters for system administration, trade/payments, content, dictionaries, files, messaging, scheduling, and more. Most modules use `-api` (contracts/DTOs/config) + `-biz` (implementation, HTTP, auto-configuration).

## Module matrix

| Module | Summary | Docs |
|--------|---------|------|
| `spring-boot-starter-common` | `Result`, exceptions, base entities; **plugin SPI**, external JAR loading, `TgPlugin` metadata; admin plugin APIs | [common](/en/dev/tg-boot/components/common/) |
| `spring-boot-starter-system` | Login/captcha, users, orgs, roles, permissions for admin and client surfaces | [system](/en/dev/tg-boot/components/system/) |
| `spring-boot-starter-trade` | Goods/orders, WeChat pay config & callbacks, `SpiNotifyThirdPaidResultService` hooks by product category | [trade](/en/dev/tg-boot/components/trade/) |
| `spring-boot-starter-wechat` | WeChat web flows, login (`WxController` / `WxLoginController`) | [wechat](/en/dev/tg-boot/components/wechat/) |
| `spring-boot-starter-file` | Uploads and file management (`FileController`, `MgtFileController`, …) | [file](/en/dev/tg-boot/components/file/) |
| `spring-boot-starter-dict` | Dictionary items and regions; `PubDictController` / `PubDictAreaController` | [dict](/en/dev/tg-boot/components/dict/) |
| `spring-boot-starter-cms` | CMS nodes; public and admin APIs | [cms](/en/dev/tg-boot/components/cms/) |
| `spring-boot-starter-im` | IM-related client APIs | [im](/en/dev/tg-boot/components/im/) |
| `spring-boot-starter-excel` | Excel import/export (`PubExcelController`, …) | [excel](/en/dev/tg-boot/components/excel/) |
| `spring-boot-starter-ocr` | OCR HTTP endpoints; implementations resolved by bean name (e.g. `bizKsOcrService`) | [ocr](/en/dev/tg-boot/components/ocr/) |
| `spring-boot-starter-sms` | `BizSmsService` façade with swappable vendor implementations | [sms](/en/dev/tg-boot/components/sms/) |
| `spring-boot-starter-generator` | Code generator UI (`/pub/generator/index`, …) | [generator](/en/dev/tg-boot/components/generator/) |
| `spring-boot-starter-job` | XXL-Job integration | [job](/en/dev/tg-boot/components/job/) |

## Wiring

- Each `-biz` registers `Biz*AutoConfiguration` via `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`; adding the dependency enables auto-configuration.
- Cross-module collaboration should depend on **peer `-api` artifacts** (interfaces + DTOs), not concrete `-biz` types.

## Extensions

- New component: add `spring-boot-starter-xxx` here with `-api`/`-biz` and an auto-configuration class.
- Post-payment business hooks: implement `pub.module.trade.api.service.SpiNotifyThirdPaidResultService`; Spring bean names must align with order line category codes (see `trade-biz` resolution logic).

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/`
