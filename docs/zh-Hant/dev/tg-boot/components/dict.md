---
title: spring-boot-starter-dict（已移除）
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/dict/
---

# spring-boot-starter-dict（v3.6.0 已移除）

> **本模塊已於 v3.6.0 下線**，不再維護通用字典表、字典 HTTP 接口及前端統一字典渲染鏈路。

## 替代方案

請按 [TG-boot 總覽 · 關於捨棄字典模塊的新約定](/zh-Hant/dev/tg-boot/#關於捨棄字典模塊的新約定) 執行：

- **業務常量 / 狀態機**：在 `*-api` 用枚舉或常量類定義。
- **複雜選項**：獨立業務表或專屬管理功能。
- **標準化公共數據**：獨立表或受控同步。

## 遷移説明

字段仍遵循 `*Code` 存編碼、前端按編碼展示；**數據來源**從「平台字典服務」改為「模塊內契約 + 業務數據」。升級時請清理對字典 Starter、字典 HTTP 接口的依賴。
