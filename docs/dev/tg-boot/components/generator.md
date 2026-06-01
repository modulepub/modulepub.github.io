---
title: spring-boot-starter-generator（已移除）
createTime: 2026/05/09
permalink: /dev/tg-boot/components/generator/
---

# spring-boot-starter-generator（v3.6.0 已移除）

> **本模块已于 v3.6.0 下线**，不再维护低代码 / 可视化代码生成能力及配套管理端入口。

## 替代方案

本仓库定位已明确为 **面向 AI 助手与开发者的模块化单体**：请按 [TG-boot 总览](/dev/tg-boot/) 中的架构与命名约定，由 AI 或开发者**从表结构设计 → API 契约 → `*-biz` 实现**直接编写代码。

生成代码前请先阅读 [AI 编码规范](/dev/tg-boot/agents/)。

## 对开发者的影响

新功能请直接按总览「架构与代码约定」「开发风格」新增模块或扩展 `*-biz`；历史由生成器产生的 `crud` 目录可随业务改造逐步收敛为手写结构。
