---
title: spring-boot-starter-cms
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/cms/
---
# spring-boot-starter-cms

**內容節點（CMS）**：樹形或層級內容節點的維護與前台讀取。

## HTTP 概要

- **公開**：`PubCmsNodeController` — 站點或 App 端讀取內容。
- **管理端**：`MgtCmsNodeController` — 節點編輯、排序與發佈相關操作。

## Maven 結構

- **`spring-boot-starter-cms-api`**：節點模型與契約。
- **`spring-boot-starter-cms-biz`**：`BizCmsAutoConfiguration`、實現與控制器。

與運營後台、靜態頁或小程序文案配置等場景對接時，優先走 `-api` 類型定義。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`