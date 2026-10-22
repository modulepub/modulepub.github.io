---
title: spring-boot-starter-excel
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/excel/
---
# spring-boot-starter-excel

**Excel 導入導出**：模板驅動，業務側主要提供數據接口，由本模塊完成渲染與導入解析，降低業務代碼與 POI 細節的耦合。

## 對外能力

- **HTTP**：`PubExcelController`（及 `-biz` 內其它導出/模板下載入口，見 Swagger）。
- **典型流程**：模板下載 → 用户填報 → 上傳導入 → 異步或同步校驗 → 錯誤明細下載（具體以當前 Service 實現為準）。

## Maven 結構

- **`spring-boot-starter-excel-api`**：導入導出契約與公共模型。
- **`spring-boot-starter-excel-biz`**：`BizExcelAutoConfiguration`、模板與任務實現。

## 使用説明

在業務 `pom` 中引入 **`spring-boot-starter-excel-biz`**；按項目配置模板路徑與異步線程池。前端集成方式隨管理端（如 `tg-manage-vue`）約定。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`