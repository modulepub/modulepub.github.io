---
title: spring-boot-starter-generator
createTime: 2026/05/09
permalink: /dev/tg-boot/components/generator/
---

# spring-boot-starter-generator

**低代码代码生成**：基于数据库表结构与模板，生成实体、Mapper、Service、Controller 等脚手架。

## 对外能力

- **Web**：`GeneratorController` 提供生成入口；单体默认启动后控制台提示 **`/pub/generator/index`**。
- **契约**：`-api` 中存放生成相关的请求/响应模型与接口定义（若扩展前端或其他调用方，依赖 `-api` 即可）。

## Maven 结构

- **`spring-boot-starter-generator-api`**：契约与公共模型。
- **`spring-boot-starter-generator-biz`**：`BizGenerateAutoConfiguration`、模板资源与生成逻辑。

引入 **`spring-boot-starter-generator-biz`** 参与自动配置；数据库连接与生成路径等按项目 `application` 配置。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-generator/`
