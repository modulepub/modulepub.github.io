---
title: plugins（外置插件目录）
createTime: 2026/05/09
permalink: /dev/tg-boot/plugins/
---

# plugins（外部插件目录）

仓库根目录下的 **`plugins`** 用于存放**运行时外挂**的插件 JAR：宿主应用启动时会扫描该目录中的 `*.jar`，按 Spring Boot 自动装配约定加载其中的配置类，**无需把插件打进 `spring-boot-starter-runner` 再发布**。

## 形态约定

- 插件应由 **`spring-boot-starter-*-plugin` 一类 Starter 工程**（或等价 Maven 模块）打包产出，结构上与普通 Spring Boot Starter 一致。
- JAR 内须包含 Boot 3 约定的自动装配清单：  
  **`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`**  
  列出需要注册的 `@AutoConfiguration`（或等价配置类）。宿主通过 `ImportCandidates` 解析清单，并将这些类并入 Spring 应用的 **primarySources**，与内置 Starter 的加载方式对齐。
- 可选：在 JAR 中提供 **`META-INF/services/pub.module.common.plugin.spi.TgPlugin`**，实现 `TgPlugin` SPI，用于声明插件编码、名称与描述（管理端与安装登记表展示）；未提供时则由文件名推导占位信息。

装载逻辑见 **`spring-boot-starter-common`** 中的 `pub.module.common.plugin.bootstrap.ExternalPluginBootstrap`。

## 目录与配置

- 默认扫描目录为**进程工作目录下的 `./plugins`**（与本文件夹对应）。
- 可通过以下方式覆盖（优先级从高到低）：  
  命令行 `--tg.plugins.directory=` → JVM 系统属性 `tg.plugins.directory` → 环境变量 `TG_PLUGINS_DIRECTORY` → `application*.yml` 中的 `tg.plugins.directory`。

若目录不存在或为空，宿主会跳过外部插件装载，不影响正常启动。

## 与源码中的 `*-plugin` 模块的关系

Maven 工程里的 **`spring-boot-starter-*-plugin`** 负责编写与打包插件；构建得到的 JAR 可复制到本 **`plugins`** 目录（或部署环境的等价路径），由线上 runner **自加载**。同一插件也可作为普通 Maven 依赖编入 runner，二者按交付方式择一或组合使用。

**源码路径**：`tg-boot/plugins/`（说明文档）及各 `*-plugin` 模块。
