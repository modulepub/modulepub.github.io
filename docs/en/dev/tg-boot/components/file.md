---
title: spring-boot-starter-file
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/file/
---

# spring-boot-starter-file

**Uploads and lookups**: wraps upload results for frontend URLs; supports chunked uploads, deduped uploads, etc. (per current implementation).

## Public APIs

- **`BizUploadService`**: upload façade.
- **`ApiConfigService`**: storage/upload-related configuration reads.

(OCR contracts such as **`BizOcrService`** live under **`spring-boot-starter-ocr-api`** and pair with OCR controllers.)

## HTTP

- **`FileController`**: generic uploads (e.g. documented `generic/upload` with `sliceIndex` / `totalPieces`).
- **`MgtFileController`**: admin file maintenance.

## Maven layout

- **`spring-boot-starter-file-api`**: interfaces and models above.
- **`spring-boot-starter-file-biz`**: `BizFileAutoConfiguration`, controllers, storage adapters.

Spring Boot version follows the root BOM/parent `pom.xml`.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-file/`
