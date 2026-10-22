---
title: spring-boot-starter-generator（已移除）
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/generator/
---

# spring-boot-starter-generator（v3.6.0 已移除）

> **本模塊已於 v3.6.0 下線**，不再維護低代碼 / 可視化代碼生成能力及配套管理端入口。

## 替代方案

本倉庫定位已明確為 **面向 AI 助手與開發者的模塊化單體**：請按 [TG-boot 總覽](/zh-Hant/dev/tg-boot/) 中的架構與命名約定，由 AI 或開發者**從表結構設計 → API 契約 → `*-biz` 實現**直接編寫代碼。

生成代碼前請先閲讀 [AI 編碼規範](/zh-Hant/dev/tg-boot/agents/)。

## 對開發者的影響

新功能請直接按總覽「架構與代碼約定」「開發風格」新增模塊或擴展 `*-biz`；歷史由生成器產生的 `crud` 目錄可隨業務改造逐步收斂為手寫結構。
