---
title: spring-boot-starter-module
createTime: 2026/05/09
permalink: /dev/tg-boot/starter-module/
---

# spring-boot-starter-module

TG-boot 的 **Maven 模块聚合根**：按通用能力与垂直业务拆分为可复用的 `spring-boot-starter-*` 子工程。

## 子聚合说明

| 目录 | 说明 | 详细文档 |
|------|------|----------|
| `spring-boot-starter-common` | 公共内核、MQ 基线配置 | [common](/dev/tg-boot/components/common/) |
| `spring-boot-starter-components` | 通用组件（系统、交易、文件等） | [components](/dev/tg-boot/components/) |
| `spring-boot-starter-business` | 垂直业务（客户、婚恋等） | [business](/dev/tg-boot/business/) |
| `spring-boot-starter-runner` | 默认单体启动器 | [runner](/dev/tg-boot/runner/) |
| `spring-boot-starter-architecture-tests` | 模块边界守护（构建期门禁，非运行时代码） | [architecture-tests](/dev/tg-boot/architecture-tests/) |

## 运维

**[运维说明](/dev/tg-boot/ops/)**：生产部署、**Actuator 禁止对公网暴露**、MQ 与上线自查。

## 跨模块协作

**[跨模块协作规范](/dev/tg-boot/cross-module-collaboration/)**：MQ 与同步 `Api**Service` 选用规则、链路分类表、幂等键约定。

## 给 AI / 开发者的阅读顺序

1. [AI 编码规范](/dev/tg-boot/agents/)（**实体、Service、命名硬性约定**，生成代码前必读）。
2. [TG-boot 总览](/dev/tg-boot/) 了解整体与运行方式。
3. [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/) 了解跨模块边界。
4. 进入 **components** 或 **business** 下各模块文档；契约与实现分别在 `-api` / `-biz`。

## 架构测试

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

**源码路径**：`tg-boot/spring-boot-starter-module/`
