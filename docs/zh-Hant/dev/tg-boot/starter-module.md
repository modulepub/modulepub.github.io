---
title: spring-boot-starter-module
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/starter-module/
---

# spring-boot-starter-module

TG-boot 的 **Maven 模塊聚合根**：按通用能力與垂直業務拆分為可複用的 `spring-boot-starter-*` 子工程。

## 子聚合説明

| 目錄 | 説明 | 詳細文檔 |
|------|------|----------|
| `spring-boot-starter-common` | 公共內核、MQ 基線配置 | [common](/zh-Hant/dev/tg-boot/components/common/) |
| `spring-boot-starter-components` | 通用組件（系統、交易、文件等） | [components](/zh-Hant/dev/tg-boot/components/) |
| `spring-boot-starter-business` | 垂直業務（客户、婚戀等） | [business](/zh-Hant/dev/tg-boot/business/) |
| `spring-boot-starter-runner` | 默認單體啓動器 | [runner](/zh-Hant/dev/tg-boot/runner/) |
| `spring-boot-starter-architecture-tests` | 模塊邊界守護（構建期門禁，非運行時代碼） | [architecture-tests](/zh-Hant/dev/tg-boot/architecture-tests/) |

## 運維

**[運維説明](/zh-Hant/dev/tg-boot/ops/)**：生產部署、**Actuator 禁止對公網暴露**、MQ 與上線自查。

## 跨模塊協作

**[跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/)**：MQ 與同步 `Api**Service` 選用規則、鏈路分類表、冪等鍵約定。

## 給 AI / 開發者的閲讀順序

1. [AI 編碼規範](/zh-Hant/dev/tg-boot/agents/)（**實體、Service、命名硬性約定**，生成代碼前必讀）。
2. [TG-boot 總覽](/zh-Hant/dev/tg-boot/) 瞭解整體與運行方式。
3. [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/) 瞭解跨模塊邊界。
4. 進入 **components** 或 **business** 下各模塊文檔；契約與實現分別在 `-api` / `-biz`。

## 架構測試

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

**源碼路徑**：`tg-boot/spring-boot-starter-module/`
