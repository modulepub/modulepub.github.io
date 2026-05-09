---
title: spring-boot-starter-excel
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/excel/
---

# spring-boot-starter-excel

**Excel import/export**: template-driven flows where business modules supply data and this starter handles rendering/parsing, limiting POI coupling in domain code.

## Capabilities

- **HTTP**: `PubExcelController` plus other template/import/export endpoints (Swagger).
- **Typical flow**: download template → user fills → upload import → sync/async validation → error report download (per service implementation).

## Maven layout

- **`spring-boot-starter-excel-api`**: contracts/shared models.
- **`spring-boot-starter-excel-biz`**: `BizExcelAutoConfiguration`, templates, jobs.

Add **`spring-boot-starter-excel-biz`** to your `pom`; configure template paths and async executors in `application*.yml`. Frontend integration follows admin conventions (e.g. `tg-manage-vue`).

See also [Excel import/export](/en/dev/excel.md).

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-excel/`
