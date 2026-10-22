---
title: spring-boot-starter-file
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/file/
---
# spring-boot-starter-file

**文件上傳與回查**：封裝上傳結果實體供前端展示 URL；支持分片上傳、秒傳等策略（以當前實現為準）。

## 對外 API（契約）

- **`BizUploadService`**：上傳門面。
- **`ApiConfigService`**：與存儲/上傳相關的配置讀取。

（另有 OCR 相關契約位於 **`spring-boot-starter-ocr-api`** 包路徑下的 `BizOcrService`，與 OCR 控制器配合使用。）

## HTTP

- **`FileController`**：通用上傳（如文檔註釋中的 `generic/upload`：可分片，`sliceIndex` / `totalPieces` 等）。
- **`MgtFileController`**：管理端文件維護。

## Maven 結構

- **`spring-boot-starter-file-api`**：上述接口與模型。
- **`spring-boot-starter-file-biz`**：`BizFileAutoConfiguration`、控制器與存儲適配。

Spring Boot 版本以根 BOM / 父 `pom.xml` 為準。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`