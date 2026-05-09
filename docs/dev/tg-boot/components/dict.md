---
title: spring-boot-starter-dict
createTime: 2026/05/09
permalink: /dev/tg-boot/components/dict/
---

# spring-boot-starter-dict

**数据字典与行政区域**：平台级枚举/字典项维护，及对前端友好的字典查询接口。

## HTTP 概要

- **公开**：`PubDictController`、`PubDictAreaController`。
- **管理端**：`MgtDictItemController`；另有通用 CRUD 风格的 `DictController` / `DictItemController`（`curd` 包）。

## Maven 结构

- **`spring-boot-starter-dict-api`**：字典领域契约与缓存/查询相关 SPI（若有）。
- **`spring-boot-starter-dict-biz`**：`BizDictAutoConfiguration`、控制器与持久化。

业务表中的「编码」字段常与字典类型联动；跨模块引用字典时依赖 `-api` 类型或通过公开接口拉取。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-dict/`
