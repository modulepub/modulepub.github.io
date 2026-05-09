---
title: spring-boot-starter-generator
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/generator/
---

# spring-boot-starter-generator

**Low-code scaffolding**: generates entities, mappers, services, controllers, etc. from database metadata and templates.

## Surface area

- **Web**: `GeneratorController`; default console banner mentions **`/pub/generator/index`**.
- **Contracts**: `-api` hosts request/response models for generator APIs when extending callers.

## Maven layout

- **`spring-boot-starter-generator-api`**: shared models/interfaces.
- **`spring-boot-starter-generator-biz`**: `BizGenerateAutoConfiguration`, templates, generation pipeline.

Add **`spring-boot-starter-generator-biz`**; configure datasource and output paths through `application*.yml`.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-generator/`
