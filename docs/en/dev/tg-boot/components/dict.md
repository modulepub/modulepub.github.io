---
title: spring-boot-starter-dict (removed)
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/dict/
---

# spring-boot-starter-dict（v3.6.0 已移除）

> **本模块已于 v3.6.0 下线**，不再维护通用字典表、字典 HTTP 接口及前端统一字典渲染链路。

## 替代方案

请按 [TG-boot 总览 · 关于舍弃字典模块的新约定](/en/dev/tg-boot/#关于舍弃字典模块的新约定) 执行：

- **业务常量 / 状态机**：在 `*-api` 用枚举或常量类定义。
- **复杂选项**：独立业务表或专属管理功能。
- **标准化公共数据**：独立表或受控同步。

## 迁移说明

字段仍遵循 `*Code` 存编码、前端按编码展示；**数据来源**从「平台字典服务」改为「模块内契约 + 业务数据」。升级时请清理对字典 Starter、字典 HTTP 接口的依赖。