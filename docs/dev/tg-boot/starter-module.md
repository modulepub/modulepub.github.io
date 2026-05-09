---
title: spring-boot-starter-module
createTime: 2026/05/09
permalink: /dev/tg-boot/starter-module/
---

# spring-boot-starter-module

TG-boot 的 **Maven 模块聚合根**：按通用能力与垂直业务拆分为可复用的 `spring-boot-starter-*` 子工程。

## 子聚合说明

| 目录 | 说明 | 在线文档 |
|------|------|----------|
| `spring-boot-starter-components` | 通用组件（系统、交易、文件、插件底座等） | [组件总览](/dev/tg-boot/components/) |
| `spring-boot-starter-business` | 垂直业务（客户、婚恋等） | [业务模块](/dev/tg-boot/business/) |
| `spring-boot-starter-runner` | 默认单体启动器（装配多数 biz 与示例插件） | [runner](/dev/tg-boot/runner/) |

## 阅读顺序建议

1. [TG-boot 总览](/dev/tg-boot/) 了解整体架构与运行方式。
2. 按需阅读 **components** 或 **business** 下各模块文档；契约与实现分别在 `-api` / `-biz`，文档按「大模块」聚合呈现。
3. 插件与扩展约定见 [spring-boot-starter-common](/dev/tg-boot/components/common/)。
4. 外置插件目录说明见 [plugins](/dev/tg-boot/plugins/)。

**源码路径**：`tg-boot/spring-boot-starter-module/`
