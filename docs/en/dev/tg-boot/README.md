---
title: TG-boot Overview
createTime: 2026/05/09
permalink: /en/dev/tg-boot/
---

# TG-boot | Modular Monolith Low-Code Platform

This document targets **AI assistants and developers**: it explains repository layering, and the roles of `runner`, `*-biz`, `*-api`, and `*-plugin`, plus naming rules and cross-module communication. After reading it you should know how to add business modules correctly, honor the “modules only talk through `*-api`” rule, and understand how to evolve from a modular monolith to multiple `runner` deployments.

The goal for a long time has been to turn hard-won practices and proven ideas into a reusable framework; it is now mature enough to share. Feedback and contributions are welcome.

#### **TG** is built on **Spring Boot**, continues its auto-configuration and Starter model, and adds a **modular monolith**: Maven modules define boundaries; under the repo root `spring-boot-starter-module` aggregates **common**, **components**, **business**, and **runner**; by default multiple `*-biz` (and optional `*-plugin`) ship in one `spring-boot-starter-runner` process. Granularity matches typical Spring starters—**a Starter you do not depend on does not pull unrelated compile-time dependencies**, which helps teams split work by scope.

- **Across modules**, collaborate **only** through interfaces in `*-api`; after contracts stabilize, moving to microservices is mainly deployment and call-chain change—not a rewrite.
- **Inside a module**, use **SPI** for interchangeable implementations, together with **plugin modules** for cross-module orchestration—a micro-kernel style.
- Conventions align with **Spring Boot starters** (Spring Cache, Spring Data, Spring Security, …): capabilities arrive as starters with convention over configuration.
- Clear boundaries reduce cognitive load; the design scales toward multiple instances / microservices.
- The default monolith process stays lightweight and fast to deliver; the layout also fits larger programs.

## Documentation map (mirrors the repo)

Online docs aligned with the `tg-boot` tree (this page is English; Chinese lives at [/dev/tg-boot/](/dev/tg-boot/)):

| Area | What it covers |
|------|----------------|
| [Tree-Graph Architecture](/en/dev/tg-boot/tree-graph-architecture/) | Tree sets boundaries, graph models relationships (TG naming & module split) |
| [starter-module](/en/dev/tg-boot/starter-module/) | Maven aggregator: `components` / `business` / `runner` |
| [runner](/en/dev/tg-boot/runner/) | Default launcher `spring-boot-starter-runner` |
| [plugins](/en/dev/tg-boot/plugins/) | External `./plugins` directory |
| [components](/en/dev/tg-boot/components/) | Shared starters: system, trade, file, excel, … |
| [business](/en/dev/tg-boot/business/) | Vertical domains: customer, dating, … |
| [tg-manage-vue](/en/dev/tg-boot/frontend-tg-manage-vue/) | Sample admin frontend |

# Technology stack

- Backend: Spring Boot 3.5.5, Spring Security
- Frontend: Vue 3, Element Plus, Vite (admin UI in separate repo **`tg-manage-vue`**, can iterate with this backend)
- Databases: MySQL, PostgreSQL, Oracle, SQL Server, Dameng, KingbaseES, …
- Components & domains (evolve with the repo; see `pom` files under `spring-boot-starter-module`): system, customer, dating, trade, files, IM, OCR, SMS, WeChat, CMS, dictionaries, Excel, codegen, scheduler jobs, …
- Thanks to **Hutool** and **WxJava (weixin-java-tools)** authors.

# Platform highlights

- Fast cold start (~5.44s depending on environment and hardware).
- Stays idiomatic to Spring Boot design and extension habits.
- Users, roles, and departments are bound together—covers secondments and multi-department roles; switching department switches roles to reduce privilege bleed.
- Excel template import/export: sheets can use styles and functions; business modules only supply data and the Excel starter renders by template—loosely coupled.
- Dictionary-like fields use the `*Code` convention: the frontend loads options by contract; the backend stores and branches on codes, reducing per-field translation glue.
- Chunked and single-file uploads; storage: local, MinIO, Aliyun OSS, … extensible via SPI.

# Architecture & code layout

Top to bottom: **Maven module tree** (actual aggregation), **sample front-end repos**, and **`*-biz` / `*-api` package layout** (using `system` as an example). The **Runner** subsection explains which runnable artifact to use.

```text
Maven (tg-boot → spring-boot-starter-module)
tg-boot
└── spring-boot-starter-module
    ├── spring-boot-starter-common (shared base, jar)
    ├── spring-boot-starter-components (capabilities; often *-api + *-biz)
    │   ├── spring-boot-starter-generator
    │   ├── spring-boot-starter-file
    │   ├── spring-boot-starter-cms
    │   ├── spring-boot-starter-dict
    │   ├── spring-boot-starter-im
    │   ├── spring-boot-starter-ocr
    │   ├── spring-boot-starter-trade
    │   ├── spring-boot-starter-wechat
    │   ├── spring-boot-starter-sms
    │   ├── spring-boot-starter-excel
    │   ├── spring-boot-starter-system
    │   └── spring-boot-starter-job
    ├── spring-boot-starter-business (vertical domains; *-api / *-biz / *-plugin)
    │   ├── spring-boot-starter-dating
    │   │   ├── spring-boot-starter-dating-api
    │   │   ├── spring-boot-starter-dating-biz
    │   │   └── spring-boot-starter-dating-plugin
    │   └── spring-boot-starter-customer
    │       ├── spring-boot-starter-customer-api
    │       ├── spring-boot-starter-customer-biz
    │       └── spring-boot-starter-customer-plugin
    └── spring-boot-starter-runner (runnable monolith; pom pulls *-biz / *-plugin)

Front-end (examples)
└── tg-vue (admin: Vue 3 + Element Plus + Vite)
└── tg-uniapp (mini-program, based on unibest; this repo only adapts backend integration; https://unibest.tech/)

*-biz layout (example spring-boot-starter-system-biz, Java root pub.module.system)
├── biz (hand-written: Controller, Api*Impl, config, …)
│   ├── controller (cus / mgt / pub: client / admin / public)
│   ├── service / impl (implement Api* from *-api)
│   └── config (Web, Security, Swagger, …)
├── curd (generator output: Mapper, Entity, base services)
└── Biz*AutoConfiguration.java (module auto-config entry)

*-api layout (example spring-boot-starter-system-api, root pub.module.system.api)
└── api
    ├── service (Api*Service)
    ├── service/dto, vo
    ├── constants, event, …
    └── … (e.g. util per module)
```

**Runner**: which `*-biz` / `*-plugin` artifacts are packaged is defined in [`spring-boot-starter-runner/pom.xml`](https://gitee.com/pub_module/tg-boot/blob/master/spring-boot-starter-module/spring-boot-starter-runner/pom.xml); add or remove capabilities there—usually no need to reshuffle the upper module tree.

**Configuration habits**: add a Starter dependency → `application*.yml` → write business code. Wire DB / Redis / caches through starters and config (plus a little `@Configuration`); **avoid piling vendor dialects or duplicate infra shims inside business modules**. Declare datasources in the right starter’s configuration for sharding; when a monolith is not enough, split runners and steer traffic with routing / gateway.

### Architectural themes

- **Microservices mindset**: services scale independently; collaboration uses explicit remote contracts (HTTP/RPC). The framework bakes in “only talk via APIs” so extraction later changes deployment and transport—not tangled code.
- **Modular monolith (default here)**: **many `*-biz` modules boot inside one `spring-boot-starter-runner` JVM**—same process, one deployable. Sources stay Maven-modular; ops stay simple. You can later **package hot modules into dedicated runners** or **keep one fat runner**; either way **gateways/routes distribute traffic** to the right instance.
- **Micro-kernel + plugins**: the kernel (framework + shared starters) stays stable; variability ships as **plugin modules**—e.g. `spring-boot-starter-dating-plugin`, `spring-boot-starter-customer-plugin` orchestrate through `*-api` without reaching into other `*-biz`. Plugins can ship separately (e.g. `./plugins`) yet still collaborate through interfaces.

### Plugins vs microservice readiness

Plugin modules embody the micro-kernel idea: **implement extensions in separate artifacts, integrate vertically via SPI, call sideways only through published APIs**. Even when deployed as a monolith, collaboration already matches microservice-style contracts; when an `*-api` implementation moves remote, plugin code can switch to a remote client with minimal churn.

### Benefits (summary)

- **Delivery + evolution**: default single runner is quick to collaborate on; split runners or stay fat—routing makes the path clear.
- **Governable dependencies**: plugins and domains depend on contracts, not concrete peers.
- **Flexible extension**: stable core, swappable extensions—open/closed friendly.
- **Team-friendly**: APIs (cross-module), SPI (in-module), plugins (cross-module orchestration) align with the repo layout.

### Benefits (plain language)

If “micro-kernel” or “modular monolith” sounds vague, remember: **(1)** by default one Java process (`runner`) hosts many modules—simple ops; **(2)** modules behave like remote services and only know `*-api` contracts, so future machine splits stay manageable; **(3)** heavy or isolated domains can get their own runner while gateways route traffic—fast delivery without adopting full microservice ops on day one.

```text
Table design (sketch) ├── system root fields (abstract) id, create_time, update_time, create_by, update_by, deleted, version, seq_no
├── business fields
│   ├── table_prefix + field name (directory naming)
│   └── redundant fields (same names as sources; often stable, cross-module, for display or query)

Ideas:
- System columns: from a virtual or real “system root table”—audit, version, ordering, multi-tenant isolation, etc.
- Business columns: directory naming keeps uniqueness, redundancy rules, and team style consistent.
```

# Engineering style

## Naming

- **Directory naming** prefixes the child with ancestors (“surname + given name”). Names should reveal structure: AB, BC, ABC; deep trees may use the last three levels (BCD). **Avoid >3 levels** without a design check; uniqueness usually needs ≥2 levels. Fixed abbreviations (e.g. `IM`) stay consistent when composed.
- **Uniqueness principle**: speech drops adjectives; code collisions multiply when objects relate—use fully qualified meanings (e.g. “user education **code**” not a bare `code`); mappers/copiers keep boilerplate short.
- Example: Instant Messaging → `IM`; table `im_channel`; keys such as `im_cl_code` with unique table prefixes.
- Associations use **business primary keys**, named **`TABLE` + `CODE`**, e.g. `USER_CODE` for users.
- Dictionary **codes** align with business fields; add module/domain prefixes when cross-table confusion is likely (same as directory naming).

## Module rules

- **Cross-module work uses only `*-api` interfaces**; implementations live in `*-biz` (or agreed modules). Maven: children may depend on parents; **parents must not depend on children**. Child capability ceilings inherit from upstream aggregators.
- **Never stitch foreign tables with cross-module SQL**; use sync tables, views, or API assembly when you need joined views.

## Dictionaries & status fields

### Dictionary fields (`*Code`)

- **Naming**: fields drawn from dictionaries / enums / fixed code tables end with `xxCode`, distinct from display names / labels.
- **Sources**: platform dictionary rows **or** module-local code tables—consumers always pass and store **codes**.
- **Why code, not name**: branching, persistence, and APIs use **codes**—not localized labels that can change or duplicate. Especially important for **i18n**.
- **Frontend**: load options (code + label for current locale); submit codes.

### Boolean-style state machine (`*StatusCode`)

When a state is mostly yes/no with few transitions, use a **small, explicit convention**:

| Value | Meaning |
|------|--------|
| `1` | yes / pass / affirmative |
| `0` | no / reject / negative |
| `null` | unset / undecided |
| `2` | transitional (optional) |

- **Naming**: suffix `StatusCode`, e.g. `passedStatusCode` for “whether approved”.
- **Why**: avoids combinatorial explosion; simple enums often need **no separate dictionary rows**—docs and code are the contract.

# Acknowledgements

Heartfelt thanks to open-source pioneers and teams behind Jeecg and many other frameworks—their work made this possible.

Years in the community shaped TG; open-sourcing it is both a tribute and a small pay-it-forward. Entries below are unordered—open an issue at the repo link if credit is missing.

## Spring Boot

**Spring Boot** dramatically lowered the bar for shipping Java services.

## Jeecg

Three years shipping **100+** gov/edu systems; **Jeecg** remains a major benchmark in this space.

## RuoYi

**RuoYi** is widely known for clarity and approachability.

## Maku

Early-career favorite for code style.

## Activiti

A classic in workflow engines.

## Hutool

Ubiquitous utilities that keep everyday Java concise.

## WxJava (weixin-java-tools)

WeChat integrations became far easier with **WxJava**.

## Excel import/export

Ideas borrowed from an author whose project link I lost—please reach out to be listed.

## Vue

A front-end framework the community can be proud of; **Vue** names an era of mainstream UI work.

## Element Plus

Admin UIs often build on **Element Plus** (successor spirit to Element UI)—one of the most productive UI sets for back-office apps.

## Unibest

A strong mini-program / uni-app starter; AI-assisted flows are smooth and output looks great—looking forward to uni-app x support.

# Repository & demos

- Gitee: [https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
- Docs: [http://docs.module.pub](http://docs.module.pub)
- Demo: [http://tg.module.pub](http://tg.module.pub)
