---
title: spring-boot-starter-business
createTime: 2026/05/09
permalink: /en/dev/tg-boot/business/
---

# spring-boot-starter-business

**Vertical business aggregator**: industry-specific capabilities built on shared components (identity, payments, files, dictionaries, …).

## Submodules

| Module | Summary | Docs |
|--------|---------|------|
| `spring-boot-starter-customer` | Customers, follow-ups, campaigns, dashboards, public acquisition endpoints | [customer](/en/dev/tg-boot/business/customer/) |
| `spring-boot-starter-dating` | Dating domain: matching, intents, matchmakers/stores, statistics; optional **dating-plugin** for trade SPI hooks | [dating](/en/dev/tg-boot/business/dating/) |

## Exposure patterns

- **HTTP**: controllers under `-biz` (`cus` / `mgt` / `pub` prefixes for client, admin, anonymous/public).
- **Inter-module APIs**: `pub.module.<domain>.api.service.*` interfaces inside `-api` artifacts.
- **Plugins**: e.g. `spring-boot-starter-dating-plugin` implements `SpiNotifyThirdPaidResultService` for post-payment dating workflows tied to product categories.

## Usage

Pull the relevant `-biz` (and `-api` if you only need contracts) into custom apps; configuration follows each module’s `application` conventions and parent BOM dependency management.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-business/`
