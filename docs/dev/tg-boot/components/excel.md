---
title: spring-boot-starter-excel
createTime: 2026/05/09
permalink: /dev/tg-boot/components/excel/
---

# spring-boot-starter-excel

**Excel 导入导出**：模板驱动，业务侧主要提供数据接口，由本模块完成渲染与导入解析，降低业务代码与 POI 细节的耦合。

## 对外能力

- **HTTP**：`PubExcelController`（及 `-biz` 内其它导出/模板下载入口，见 Swagger）。
- **典型流程**：模板下载 → 用户填报 → 上传导入 → 异步或同步校验 → 错误明细下载（具体以当前 Service 实现为准）。

## Maven 结构

- **`spring-boot-starter-excel-api`**：导入导出契约与公共模型。
- **`spring-boot-starter-excel-biz`**：`BizExcelAutoConfiguration`、模板与任务实现。

## 使用说明

在业务 `pom` 中引入 **`spring-boot-starter-excel-biz`**；按项目配置模板路径与异步线程池。前端集成方式随管理端（如 `tg-manage-vue`）约定。

站内专题：[EXCEL 导入导出模块](/dev/excel.md)。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-excel/`
