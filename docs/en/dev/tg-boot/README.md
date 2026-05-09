---
title: TG-boot Overview
createTime: 2026/05/09
permalink: /en/dev/tg-boot/
---

# TG-boot | Modular Monolith Low-Code Platform

This document targets **AI assistants and engineers**: it explains repository layering, responsibilities of `runner` / `*-biz` / `*-api` / `*-plugin`, naming rules, and module communication constraints. After reading it you should know how to add business modules correctly, honor the “modules talk only through APIs” rule, and understand how to evolve from a modular monolith toward multiple `runner` deployments.

For years I wanted to distill hard-earned lessons and modern ideas into a framework; today it is mature enough to share. Feedback and contributions are welcome.

#### **TG** builds on **Spring Boot**, keeps its auto-configuration & starter ergonomics, and adds a **modular monolith** shape: Maven modules carve boundaries while multiple `*-biz` artifacts still ship inside one `spring-boot-starter-runner` by default. Granularity feels like typical Spring starters—**starters you do not depend on never drag compile-time baggage**, which keeps responsibilities scalable per team size.

- **Across modules**, collaborate **only** through interfaces published in `*-api`; moving to microservices later is mostly about deployment and call chains—not rewriting tangled code.
- **Inside a module**, use **SPI** for swappable implementations, plus **plugin modules** for cross-cutting orchestration—a micro-kernel flavor.
- Conventions mirror **Spring Boot starters** (Spring Cache, Spring Data, Spring Security, …): capabilities arrive as starters with convention-over-configuration ergonomics.
- Clear boundaries reduce cognitive load; the architecture scales out or toward microservices smoothly.
- The default single process stays lightweight for delivery; the same layout fits larger programs.

## Documentation map (mirrors the repo)

Online docs aligned with the `tg-boot` tree (this page is English; Chinese lives at [/dev/tg-boot/](/dev/tg-boot/)):

| Area | What it covers |
|------|----------------|
| [Tree-Graph Architecture](/en/dev/tg-boot/tree-graph-architecture/) | Tree sets boundaries, graph models interactions (TG shaping) |
| [starter-module](/en/dev/tg-boot/starter-module/) | Maven aggregator: `components`, `business`, `runner` |
| [runner](/en/dev/tg-boot/runner/) | Default launcher `spring-boot-starter-runner` |
| [plugins](/en/dev/tg-boot/plugins/) | External `./plugins` hot-load directory |
| [components](/en/dev/tg-boot/components/) | Shared starters: system, trade, file, excel, … |
| [business](/en/dev/tg-boot/business/) | Vertical domains such as customer & dating |
| [tg-manage-vue](/en/dev/tg-boot/frontend-tg-manage-vue/) | Sample admin frontend |

# Technology stack

- Backend: Spring Boot 3.5.5, Spring Security
- Frontend samples: Vue 3, Element Plus, Vite (`tg-manage-vue` in-repo)
- Databases: MySQL, PostgreSQL, Oracle, SQL Server, Dameng, KingbaseES, …
- Domains shipped: system, payments, trade, files, IM, OCR, SMS, WeChat, mini-program hooks, CMS, …
- Thanks to Hutool and weixin-java-tools authors for indispensable libraries.

# Platform highlights

- Fast startup (~5.44s in reference measurements).
- Deep respect for Spring Boot’s design language.
- Users, roles, and departments bind together—handles secondments & multi-department duties; switching departments switches roles to reduce privilege bleed.
- Excel templates decouple styling/functions on the sheet from domain services—business feeds data, the Excel starter renders it.
- Dictionaries are consumed on the frontend using shared conventions, avoiding per-field backend translation glue.
- Chunked and single-file uploads; storage supports local disk, MinIO, Aliyun OSS, … with SPI for more backends.


# Architecture sketches

```angular2svg
springboot
├── spring-boot-starter-module (backend root)
│   ├── spring-boot-starter-business (vertical domains)
│   │   ├── domain *-biz implementations
│   │   └── spring-boot-starter-*-plugin (SPI-heavy glue; cross-module deps stay on *-api contracts)
│   ├── spring-boot-starter-components (shared starters)
│   │   └── SMS, payments, files, IM, OCR, dictionaries, cache, logging, security, MQ, identity, workflows, jobs, persistence, …
│   └── spring-boot-starter-runner (monolith launcher)
```

```angular2svg
Frontend sample
├── tg-manage-vue (Vue 3 + Element Plus + Vite admin)
```

### Architectural themes

- **Microservices mindset**: independently deployable units scale on their own and communicate through explicit remote contracts (HTTP/RPC). TG codifies “modules only talk via APIs” up front so splitting later changes deployment—not architecture wholesale.
- **Modular monolith (default)**: **many `*-biz` modules still boot inside one `spring-boot-starter-runner` JVM**—that’s the modular monolith. Source stays Maven-modular; operations stay simple. When load demands it, promote hot modules into dedicated runners or keep a fat runner—either way **gateways/routes steer traffic** to the right instance.
- **Micro-kernel + plugins**: the kernel (framework + shared starters) stays stable; variability ships as **plugin modules**—for example `spring-boot-starter-dating-plugin` orchestrates payments/customers through `*-api` without reaching into foreign `*-biz` internals. Plugins can drop into `./plugins` yet still collaborate interface-first.

### Plugins vs microservice readiness

Plugin modules embody the micro-kernel idea: **extend behavior in separate artifacts, integrate vertically via SPI, and call sideways only through published APIs**. Even in monolith mode the collaboration style matches microservices; when an `*-api` implementation becomes remote, plugin code switches to a remote client with minimal churn.

### Benefits (summary)

- **Delivery + evolution**: default single runner is fast to run locally; scale-out paths (multiple runners vs fat jar) stay explicit.
- **Governable dependencies**: plugins and domains depend on contracts, not concrete peers—fewer cycles and surprises.
- **Flexible extension**: stable core, swappable extensions; multiple implementations honor open/closed design.
- **Team-friendly layering**: APIs (cross-module), SPI (internal extension), plugins (cross-module orchestration) match repo layout.

### Benefits (plain language)

If buzzwords feel fuzzy, remember three ideas: **(1)** multiple business modules share one Java process by default—easy ops; **(2)** modules behave like services that only know each other’s interfaces (`*-api`), so physical splitting later stays orderly; **(3)** heavy domains can move into their own runner while gateways route requests appropriately—fast initial delivery without instantly adopting full microservice complexity.

### Engineering conventions

- **Stay idiomatic to Spring Boot**: add starters, configure `application*.yml`, implement domain code—AI assistants and humans share the same playbook.
- **Infrastructure via starters & config**: databases, Redis, caches integrate through starters and declarative configuration; **avoid bespoke vendor shims inside business modules** so swaps or extractions stay localized.

```angular2svg
Sample package layout
├── spring-boot-starter-system-biz
│   ├── biz (custom business packages)
│   │   ├── service
│   │   │   ├── SpiSysUserServiceImpl.java   // SPI-style hooks inside the module
│   │   │   ├── ApiSysRoleServiceImpl.java   // cross-module API implementations
│   ├── controller
│   │   │   ├── CusSysUserController.java    // cus = client-facing
│   │   │   ├── PubSysRoleController.java    // pub = public/anonymous
│   │   │   ├── MgtSysRoleController.java    // mgt = admin console
│   ├── websocket
│   ├── grpc
│   ├── curd (generator-produced CRUD; may host consistency services)
│   │   ├── mapper …
│   │   ├── entity …
│   │   ├── service …

API module
├── spring-boot-starter-system-api
│   ├── api
│   │   ├── service
│   │   │   ├── ApiXXXService.java   // inter-module contracts
│   │   │   ├── SpiXXXService.java   // intra-module plugin hooks


Sharding:
Configure datasources inside each business starter’s configuration classes.

Microservice extraction:
When monolith limits are hit, package busy `*-biz` modules into dedicated runners (alone or grouped) while others remain; **routing layers** map traffic to the correct deployment unit regardless of granularity.
```

```angular2svg
Table design sketch
├── System columns (abstract root): id, create_time, update_time, create_by, update_by, deleted, version, seq_no
├── Business columns
│   ├── table_prefix + field name (directory naming)
│   ├── redundant columns copied from foreign keys (stable, cross-module, query-friendly)
Rationale:
System columns emulate a virtual system table for auditing, versioning, ordering, logging, data permissions, multi-tenancy, etc.
Directory-style business columns reinforce uniqueness, predictable redundancy, and shared mental models.
```

# Engineering style

## Naming

- **Directory naming** prefixes child concepts with parents—like surname + given name—so names reveal ancestry (AB, BC, ABC, trailing triples such as BCD when depth grows). **Avoid >3 levels** without redesign; uniqueness typically needs ≥2 segments; use agreed abbreviations (e.g. IM) consistently.
- **Uniqueness principle**: spoken language omits adjectives, but code collides quickly—write fully qualified meanings (“user education code” vs bare `code`) and lean on mappers to stay terse mechanically.
- Example: Instant Messaging → module `IM`, table `im_channel`, keys like `im_cl_code` with unique table prefixes.
- Business primary keys follow `TABLE_NAME + CODE` (e.g. `USER_CODE` for users).
- Dictionary codes align with business fields; prefix with module names on collisions.

## Module rules

- **Cross-module work happens only through `*-api` interfaces**; implementations live in `*-biz`. Maven allows child→parent dependencies; **parents must not depend on children**. Child capability ceilings inherit from upstream aggregators.
- **Never stitch foreign tables via cross-module SQL**; replicate, expose views, or assemble via APIs when you must display joined data.

# Acknowledgements

Heartfelt thanks to every open-source pioneer and to teams behind Jeecg and countless other frameworks—their work shaped how I build systems.
Years of learning from the community crystallized into TG; publishing it is both a tribute and a small pay-it-forward. Entries below are unordered—open an issue if credit is missing.

## Spring Boot

The backbone of modern Java services.

## Jeecg

Three intense years shipping 100+ gov/edu systems on top of it—a true framework star.

## RuoYi

Known for clarity; widely deployed patterns.

## Maku

Personal favorite early-career codebase style.

## Activiti

The workflow engine benchmark.

## Hutool

Makes Java feel as concise as scripting for daily chores.

## weixin-java-tools (Bin Wang)

WeChat integrations became approachable thanks to this ecosystem.

## Excel import/export utilities

Borrowed ideas from an author whose repo link I’ve lost—reach out to be credited.

## Vue & Element Plus

Powers countless shipping admin consoles.

# Repository & demos

- Gitee: [https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
- Docs: [http://docs.module.pub](http://docs.module.pub)
- Demo: [http://tg.module.pub](http://tg.module.pub)
