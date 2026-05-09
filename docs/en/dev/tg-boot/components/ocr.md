---
title: spring-boot-starter-ocr
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/ocr/
---

# spring-boot-starter-ocr

**OCR over HTTP**: accepts uploads, delegates to a named `BizOcrService` bean, returns structured results.

## Behavior

- **`OcrController`** (`/ocr`): e.g. bank card OCR via `POST /ocr/bankOcr` (`multipart/form-data`).
- Resolution uses **`BizOcrService`** contracts from **`spring-boot-starter-ocr-api`**, selecting implementations by **bean name** (sample: `bizKsOcrService`).

## Wiring

- **`spring-boot-starter-ocr-biz`** supplies `BizOcrAutoConfiguration` and the controller; ensure a matching `BizOcrService` bean exists on the classpath.

## Dependencies

If implementations live in other modules, register appropriately named `BizOcrService` beans there or switch names via configuration.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-ocr/`
