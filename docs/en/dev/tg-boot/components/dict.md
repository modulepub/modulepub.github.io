---
title: spring-boot-starter-dict
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/dict/
---

# spring-boot-starter-dict

**Dictionaries & administrative divisions**: maintain platform-wide enumerations and expose dictionary queries tailored for frontends.

## HTTP overview

- **Public**: `PubDictController`, `PubDictAreaController`.
- **Admin**: `MgtDictItemController`; generic CRUD-style controllers under `curd` (`DictController`, `DictItemController`, …).

## Maven layout

- **`spring-boot-starter-dict-api`**: domain contracts and optional cache/query SPIs.
- **`spring-boot-starter-dict-biz`**: `BizDictAutoConfiguration`, controllers, persistence.

Business columns frequently store dictionary codes; cross-module usage should go through `-api` types or public HTTP endpoints.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-dict/`
