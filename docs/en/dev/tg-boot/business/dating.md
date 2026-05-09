---
title: spring-boot-starter-dating
createTime: 2026/05/09
permalink: /en/dev/tg-boot/business/dating/
---

# spring-boot-starter-dating

Dating / matchmaking vertical features: recommendations, intents, contact requests, preferences, matchmakers & agencies, client/admin operations, and statistics-oriented public endpoints.

## Maven layout

- **`spring-boot-starter-dating-api`**: `pub.module.dating.api.service.*` interfaces/DTOs for other modules (including trade plugins).
- **`spring-boot-starter-dating-biz`**: persistence, `BizDatingAutoConfiguration`, REST controllers.
- **`spring-boot-starter-dating-plugin`** (optional): trade extension wiring (`TradeDatingPluginAutoConfiguration`, `TradeDatingTgPlugin` metadata) plus multiple `SpiNotifyThirdPaidResultService` beans keyed by virtual goods/contract categories.

## HTTP map

- **`cus`**: matching, recommendations, intents, preferences, contacts, matchmaker relationships.
- **`mgt`**: intent review, recommendation tuning, matchmaker/store administration.
- **`pub`**: agency/showcase/statistics controllers (`Pub*`, `Statistic*`, …).

Confirm paths/parameters in Swagger (`/swagger-ui/index.html`) and controller annotations.

## Working with trade

- Adding **`spring-boot-starter-dating-plugin`** lets the trade core invoke the proper `SpiNotifyThirdPaidResultService` bean after payment, based on merchandise category codes, to fulfill dating-side obligations (benefits, contracts, …).
- Plugin discovery participates in **common** registrars for classpath/external JAR deployments—see [common](/en/dev/tg-boot/components/common/).

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-business/spring-boot-starter-dating/`
