---
title: spring-boot-starter-im
createTime: 2026/05/09
permalink: /dev/tg-boot/components/im/
---

# spring-boot-starter-im

**即时通讯衔接**：为应用提供 IM 相关的后端接口（会话、消息或与第三方 IM SDK 的桥接，以当前实现类为准）。

## HTTP 概要

- **客户侧**：`CusImController` — 登录用户维度的 IM 能力入口。

## Maven 结构

- **`spring-boot-starter-im-api`**：IM 契约与 DTO。
- **`spring-boot-starter-im-biz`**：`BizImAutoConfiguration`、服务与控制器。

扩展新消息类型或对接新厂商时，在 `-biz` 增加实现并保持 `-api` 稳定供其他模块依赖。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-im/`
