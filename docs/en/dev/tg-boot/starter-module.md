---
title: spring-boot-starter-module
createTime: 2026/05/09
permalink: /en/dev/tg-boot/starter-module/
---

# spring-boot-starter-module

The **Maven aggregator root** for TG-boot: reusable `spring-boot-starter-*` sub-projects split by shared capabilities and vertical business domains.

## Sub-aggregators

| Directory | Purpose | Docs |
|-----------|---------|------|
| `spring-boot-starter-components` | Shared components (system, trade, file, plugin plumbing, etc.) | [Components](/en/dev/tg-boot/components/) |
| `spring-boot-starter-business` | Vertical domains (customer, dating, …) | [Business](/en/dev/tg-boot/business/) |
| `spring-boot-starter-runner` | Default monolith launcher wiring most `*-biz` and sample plugins | [Runner](/en/dev/tg-boot/runner/) |

## Suggested reading order

1. [TG-boot overview](/en/dev/tg-boot/) for architecture and how to run the repo.
2. Read **components** or **business** docs as needed; contracts vs implementations live in `-api` / `-biz` respectively, while prose is grouped at the “large module” level.
3. Plugin conventions: [spring-boot-starter-common](/en/dev/tg-boot/components/common/).
4. External plugin directory: [plugins](/en/dev/tg-boot/plugins/).

**Source**: `tg-boot/spring-boot-starter-module/`
