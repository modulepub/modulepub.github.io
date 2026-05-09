---
title: spring-boot-starter-file
createTime: 2026/05/09
permalink: /dev/tg-boot/components/file/
---

# spring-boot-starter-file

**文件上传与回查**：封装上传结果实体供前端展示 URL；支持分片上传、秒传等策略（以当前实现为准）。

## 对外 API（契约）

- **`BizUploadService`**：上传门面。
- **`ApiConfigService`**：与存储/上传相关的配置读取。

（另有 OCR 相关契约位于 **`spring-boot-starter-ocr-api`** 包路径下的 `BizOcrService`，与 OCR 控制器配合使用。）

## HTTP

- **`FileController`**：通用上传（如文档注释中的 `generic/upload`：可分片，`sliceIndex` / `totalPieces` 等）。
- **`MgtFileController`**：管理端文件维护。

## Maven 结构

- **`spring-boot-starter-file-api`**：上述接口与模型。
- **`spring-boot-starter-file-biz`**：`BizFileAutoConfiguration`、控制器与存储适配。

Spring Boot 版本以根 BOM / 父 `pom.xml` 为准。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-file/`
