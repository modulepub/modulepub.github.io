---
title: spring-boot-starter-ocr
createTime: 2026/05/09
permalink: /dev/tg-boot/components/ocr/
---

# spring-boot-starter-ocr

**OCR 识别 HTTP 能力**：接收上传文件，调用底层 OCR 服务 Bean 完成识别并返回结构化结果。

## 行为说明

- **`OcrController`**（`/ocr`）：如银行卡识别 `POST /ocr/bankOcr`（`multipart/form-data`）。
- 实现通过 **`BizOcrService`**（契约在 **`spring-boot-starter-ocr-api`**）按 **Bean 名称**获取具体厂商实现（示例中使用 `bizKsOcrService`）。

## 装配

- **`spring-boot-starter-ocr-biz`** 提供 `BizOcrAutoConfiguration` 与上述控制器；需同时保证 classpath 中存在对应的 `BizOcrService` 实现 Bean。

## 依赖建议

若 OCR 实现放在其他模块，请在该模块注册命名一致的 `BizOcrService` Bean，或通过配置约定切换实现名称。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-ocr/`
