---
title: spring-boot-starter-cms
createTime: 2026/05/09
permalink: /dev/tg-boot/components/cms/
---

# spring-boot-starter-cms

**内容节点（CMS）**：树形或层级内容节点的维护与前台读取。

## HTTP 概要

- **公开**：`PubCmsNodeController` — 站点或 App 端读取内容。
- **管理端**：`MgtCmsNodeController` — 节点编辑、排序与发布相关操作。

## Maven 结构

- **`spring-boot-starter-cms-api`**：节点模型与契约。
- **`spring-boot-starter-cms-biz`**：`BizCmsAutoConfiguration`、实现与控制器。

与运营后台、静态页或小程序文案配置等场景对接时，优先走 `-api` 类型定义。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-cms/`
