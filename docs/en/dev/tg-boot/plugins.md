---
title: plugins (external plugin directory)
createTime: 2026/05/09
permalink: /en/dev/tg-boot/plugins/
---

# plugins (external plugin directory)

The **`plugins`** folder at the repository root holds **runtime-attached** plugin JARs. At startup the host scans `*.jar` in this directory and loads auto-configuration classes according to Spring Boot conventions—**without baking plugins into `spring-boot-starter-runner` artifacts**.

## Packaging conventions

- Plugins should be built from **`spring-boot-starter-*-plugin`** (or equivalent) Maven modules and packaged like ordinary Spring Boot starters.
- Each JAR must ship the Boot 3 auto-configuration imports file:  
  **`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`**  
  listing `@AutoConfiguration` (or equivalent) classes. The host parses these via `ImportCandidates` and merges them into the application **primarySources**, consistent with built-in starters.
- Optionally provide **`META-INF/services/pub.module.common.plugin.spi.TgPlugin`** implementing `TgPlugin` for plugin code/name/description (admin UI and install registry). If omitted, placeholder metadata may be inferred from the file name.

Loading logic lives in **`ExternalPluginBootstrap`** under **`spring-boot-starter-common`**.

## Directory and configuration

- Default scan directory is **`./plugins`** under the process working directory (this folder).
- Override order (highest first): CLI `--tg.plugins.directory=` → JVM system property `tg.plugins.directory` → env `TG_PLUGINS_DIRECTORY` → `tg.plugins.directory` in `application*.yml`.

If the directory is missing or empty, external plugin loading is skipped; normal startup continues.

## Relationship to `*-plugin` Maven modules

Maven **`spring-boot-starter-*-plugin`** modules author and package plugins. The resulting JAR can be copied into **`plugins`** (or an equivalent path in deployment) for **self-loading** by the runner. The same plugin can alternatively be declared as a normal Maven dependency on the runner—choose per delivery model or combine both.

**Source**: `tg-boot/plugins/` (documentation) and each `*-plugin` module.
