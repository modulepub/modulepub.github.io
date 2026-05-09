---
title: spring-boot-starter-common
createTime: 2026/05/09
permalink: /dev/tg-boot/components/common/
---

# spring-boot-starter-common

跨模块 **公共内核**：统一返回体 `Result`、业务异常 `BizException`、基础实体字段约定、简易日志与查询工具等。

## 插件扩展（对外能力）

- **`TgPlugin`**（`pub.module.common.plugin.spi`）：插件元数据 SPI，实现类需在 **同一 JAR** 内提供 Spring Boot 3 自动配置清单，便于管理端列举 classpath 插件。
- **`PluginsBizAutoConfiguration`**：插件相关 Bean 装配。
- **`ExternalPluginBootstrap`**：从配置目录扫描 **外置 `*.jar`**，读取 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`，将其中配置类并入 `SpringApplication` 的 primary sources。
- **`EmbeddedClasspathPluginRegistrar`**：扫描 classpath 上实现了 `TgPlugin` 的类并关联其 JAR 内 AutoConfiguration 清单。
- **`MgtPluginInstallController`**：管理端插件安装状态/列表类接口（具体路径见控制器）。

配置项见 **`TgPluginsProperties`**（插件目录等）。

## 使用建议

- 业务 starter **仅依赖 common**，不要反向依赖某一 `-biz`。
- 编写可与婚恋 `dating-plugin` 并列的外挂模块时：提供 `@AutoConfiguration`、`.imports` 清单，并实现 `TgPlugin` 以便运维侧可见。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-common/`
