---
title: spring-boot-starter-runner
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/runner/
---
# spring-boot-starter-runner

**默認單體應用啓動模塊**：`StartApplication` 為 `@SpringBootApplication` 入口，聚合引入多個 `*-biz`，用於開箱演示完整鏈路。

## 職責

- 打包可執行 Spring Boot 應用（胖 JAR）。
- 通過 `spring.config.import` 引入 MQ 運維基線（`application-messaging-baseline.yml`）。
- 控制枱打印 Swagger 地址（見 `StartApplication#getString`）。

## 消息配置

- `spring.config.import`：僅引入 **messaging 基線**（重試 / DLQ / 退避）。
- `spring.cloud.stream.default-binder: rabbit`
- `spring.rabbitmq.*`：broker 連接（見 `application-dev.yml`）。
- 渠道 binding 由 common 掃描 `XxxConsumer` 契約自動註冊，**無需在 runner 維護 binding 列表**。

裁剪 runner 時：刪除不需要的 biz 依賴即可；未引入的消費者 Handler 不會註冊訂閲。

## 運維與安全

- **生產環境**：Actuator（`/actuator/**`）**不得**對公網或不可信網絡暴露；須通過網關、防火牆或獨立內網管理端口收斂訪問面。詳見倉庫根 [運維説明](/zh-Hant/dev/tg-boot/ops/)。
- Runner 已引入 `spring-boot-starter-actuator`；默認暴露 `health`、`info`、`metrics`（見 `application.yml`），生產請按 OPS 收緊 `management.*` 配置。
- Actuator 使用 **獨立 HTTP Basic**（`tg.actuator.username` / `password`），**免業務 JWT**；dev 默認密碼 `tg-actuator-dev`，生產請設環境變量 `TG_ACTUATOR_PASSWORD`。

## 相關文檔

- 運維（Actuator、MQ、上線自查）：[運維説明](/zh-Hant/dev/tg-boot/ops/)
- 模塊總覽：[starter-module](/zh-Hant/dev/tg-boot/starter-module/)
- MQ 目的地總表：倉庫根 [TG-boot 總覽](/zh-Hant/dev/tg-boot/)
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-runner/`