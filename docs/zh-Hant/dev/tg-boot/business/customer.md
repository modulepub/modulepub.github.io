---
title: spring-boot-starter-customer
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/business/customer/
---

# spring-boot-starter-customer

**客户與營銷運營**相關業務：客户主數據、跟進記錄、推廣任務、來源/員工業績看板，以及面向匿名或 C 端的公開客户接口。

## Maven 結構

- **`spring-boot-starter-customer-api`**：`ApiCustomerService`、`ApiCustomerContactRecordService` 等，供其他 starter 調用客户領域能力。
- **`spring-boot-starter-customer-biz`**：`BizCustomerAutoConfiguration`、控制器與服務實現。

## HTTP 能力概要

- **`cus`**：當前客户維度的客户信息、推廣任務、聯繫人跟進等。
- **`mgt`**：後台客户管理、跟進記錄、推廣任務、儀表盤（員工業績、來源等）。
- **`pub`**：公開客户相關入口（如 `PubCustomerController`）。

擴展新客户來源或任務類型時，優先在 `-api` 增補契約，在 `-biz` 實現並保持 Controller 分層前綴一致。

**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/spring-boot-starter-customer/`
