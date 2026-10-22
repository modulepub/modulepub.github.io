---
title: spring-boot-starter-ocr
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/ocr/
---
# spring-boot-starter-ocr

**OCR 識別 HTTP 能力**：接收上傳文件，調用底層 OCR 服務 Bean 完成識別並返回結構化結果。

## 行為説明

- **`OcrController`**（`/ocr`）：如銀行卡識別 `POST /ocr/bankOcr`（`multipart/form-data`）。
- 實現通過 **`BizOcrService`**（契約在 **`spring-boot-starter-ocr-api`**）按 **Bean 名稱**獲取具體廠商實現（示例中使用 `bizKsOcrService`）。

## 裝配

- **`spring-boot-starter-ocr-biz`** 提供 `BizOcrAutoConfiguration` 與上述控制器；需同時保證 classpath 中存在對應的 `BizOcrService` 實現 Bean。

## 依賴建議

若 OCR 實現放在其他模塊，請在該模塊註冊命名一致的 `BizOcrService` Bean，或通過配置約定切換實現名稱。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`