---
title: spring-boot-starter-runner
createTime: 2026/05/09
permalink: /en/dev/tg-boot/runner/
---

# spring-boot-starter-runner

**Default monolith launcher**: `StartApplication` is the `@SpringBootApplication` entry point. It pulls in multiple `*-biz` modules plus the sample **`spring-boot-starter-dating-plugin`** for an end-to-end demo.

## Responsibilities

- Produce an executable Spring Boot fat JAR.
- Merge **external plugin** primary sources at startup via `ExternalPluginBootstrap.resolveExtraPrimarySources`, aligned with the external JAR plugin directory configuration in `common`.
- Print generator and Swagger URLs to the console (see `StartApplication#getString`).

## Dependencies

Every `*-biz` explicitly listed in `pom.xml` is enabled by default in this repo. For trimmed apps, create another runner module and keep only the `*-biz` dependencies you need.

## Related docs

- [Starter module overview](/en/dev/tg-boot/starter-module/)
- [Plugin mechanics (common)](/en/dev/tg-boot/components/common/)
- [External `plugins` folder](/en/dev/tg-boot/plugins/)

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-runner/`
