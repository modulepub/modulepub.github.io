---
title: spring-boot-starter-runner
createTime: 2026/05/09
permalink: /dev/tg-boot/runner/
---
# spring-boot-starter-runner

**默认单体应用启动模块**：`StartApplication` 为 `@SpringBootApplication` 入口，聚合引入多个 `*-biz`，用于开箱演示完整链路。

## 职责

- 打包可执行 Spring Boot 应用（胖 JAR）。
- 通过 `spring.config.import` 引入 MQ 运维基线（`application-messaging-baseline.yml`）。
- 控制台打印 Swagger 地址（见 `StartApplication#getString`）。

## 消息配置

- `spring.config.import`：仅引入 **messaging 基线**（重试 / DLQ / 退避）。
- `spring.cloud.stream.default-binder: rabbit`
- `spring.rabbitmq.*`：broker 连接（见 `application-dev.yml`）。
- 渠道 binding 由 common 扫描 `XxxConsumer` 契约自动注册，**无需在 runner 维护 binding 列表**。

裁剪 runner 时：删除不需要的 biz 依赖即可；未引入的消费者 Handler 不会注册订阅。

## 运维与安全

- **生产环境**：Actuator（`/actuator/**`）**不得**对公网或不可信网络暴露；须通过网关、防火墙或独立内网管理端口收敛访问面。详见仓库根 [运维说明](/dev/tg-boot/ops/)。
- Runner 已引入 `spring-boot-starter-actuator`；默认暴露 `health`、`info`、`metrics`（见 `application.yml`），生产请按 OPS 收紧 `management.*` 配置。
- Actuator 使用 **独立 HTTP Basic**（`tg.actuator.username` / `password`），**免业务 JWT**；dev 默认密码 `tg-actuator-dev`，生产请设环境变量 `TG_ACTUATOR_PASSWORD`。

## 相关文档

- 运维（Actuator、MQ、上线自查）：[运维说明](/dev/tg-boot/ops/)
- 模块总览：[starter-module](/dev/tg-boot/starter-module/)
- MQ 目的地总表：仓库根 [TG-boot 总览](/dev/tg-boot/)
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-runner/`