---
title: spring-boot-starter-common
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/common/
---

# spring-boot-starter-common

Cross-cutting **kernel**: unified `Result` wrapper, `BizException`, base entity conventions, light logging/query helpers, etc.

## Plugin extension surface

- **`TgPlugin`** (`pub.module.common.plugin.spi`): plugin metadata SPI; implementations should ship Spring Boot 3 auto-configuration imports in the **same JAR** so the admin UI can list classpath plugins.
- **`PluginsBizAutoConfiguration`**: wires plugin-related beans.
- **`ExternalPluginBootstrap`**: scans **external `*.jar`** files, reads `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`, and merges listed configuration classes into `SpringApplication` primary sources.
- **`EmbeddedClasspathPluginRegistrar`**: discovers `TgPlugin` implementations on the classpath and ties them to AutoConfiguration manifests inside their JARs.
- **`MgtPluginInstallController`**: admin endpoints for plugin install state/lists (see controller mappings).

Configuration keys live on **`TgPluginsProperties`** (plugin directories, etc.).

## Guidance

- Business starters should **depend only on common**, never the other way around toward a specific `-biz`.
- For external plugins alongside `dating-plugin`: supply `@AutoConfiguration`, an `.imports` manifest, and optionally `TgPlugin` for operational visibility.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-common/`
