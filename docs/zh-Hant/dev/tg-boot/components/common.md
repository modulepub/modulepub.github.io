---
title: spring-boot-starter-common
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/common/
---
# spring-boot-starter-common

跨模塊 **公共內核**：統一返回體 `Result`、業務異常 `BizException`、基礎實體字段約定、簡易日誌與查詢工具等。

## 消息基礎設施

- **`EmbeddedRabbitAutoConfiguration`**：開發環境嵌入式 Rabbit（`rabbitmq-mock`），免外部安裝；生產關閉 `tg.messaging.embedded-rabbit` 並配置真實 broker。
- **`application-messaging-baseline.yml`**：Stream 消費 **重試 / DLQ / 退避** 統一基線；runner 通過 `spring.config.import` 引入。
- **`MqMessagingAutoConfiguration`**：掃描 `XxxConsumer` 契約與槽位實現，自動註冊 Stream binding 與 Function。
- **`MqPublisher`** / **`MqRequestReplyClient`**：發佈與 request-reply，業務側傳入 `XxxConsumer.class`。
- **`MqPublisher.publishAfterCommit`** / **`TransactionAfterCommit`**：事務提交後再投遞 MQ 或執行副作用，避免回滾後仍發消息。
- **依賴**：`spring-cloud-stream`、`spring-cloud-stream-binder-rabbit`、`spring-boot-starter-amqp` 在本模塊統一聲明。

## MQ 契約約定（v3.2）

生產者 `*-api/messaging/XxxConsumer.java` 單文件定義：

- `@MqChannel`：destination、producerFunction
- 業務方法 + 嵌套 `@MqSubscribe` 槽位子接口（如 `.Dating`、`.Customer`）

消費者 `*-biz`：`@Component implements XxxConsumer.{Slot}`，無需 yml binding。

生產環境 Actuator、網關與網絡隔離見倉庫根 [運維説明](/zh-Hant/dev/tg-boot/ops/)。

## MQ 運維基線（摘要）

| 項 | 默認值 | 説明 |
|----|--------|------|
| 消費重試 | `max-attempts: 3` | `spring.cloud.stream.default.consumer` |
| DLQ 隊列 | `DLQ.{destination}.{group}` | Rabbit `auto-bind-dlq` + `republish-to-dlq` |
| 死信交換機 | `DLX` | 生產需監控隊列深度並告警 |
| 退避 | 1s → 10s，×2 | `back-off-*` |

新增消費者須在 [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/) 登記 **冪等鍵**。

## 認證與短時緩存

- **`TgEphemeralCache`**：全站單 Cache 區域（默認 `tgEphemeral`），`namespace::key` 隔離；驗證碼/短信等用 `sys:captcha`、`sys:sms`。
- **`AuthSessionStore`**：登錄寫入 `AuthSessionSnapshot`（含權限）；`TgJwtAuthenticationFilter` 只讀緩存。
- **`TgSecurityConfig` / `TgActuatorSecurityConfig`**：業務 JWT 鏈 + Actuator HTTP Basic（`tg.actuator.*`）。
- 配置：`tg.cache.*`、`tg.security.jwt.*`；權限變更需重新登錄或登出踢會話。

## 使用建議

- 業務 starter **僅依賴 common**，不要反向依賴某一 `-biz`。
- **跨模塊**協作規則見 [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/)。
- **模塊內**多實現在 **`*-biz/service`** 定義 SPI，由註冊表或 Spring 注入 `List<實現>` 路由。

## 架構測試

模塊邊界由 [架構測試門禁](/zh-Hant/dev/tg-boot/architecture-tests/) 在 **Maven 測試階段** 守護（ArchUnit + POM 掃描）；該模塊不屬於系統運行時代碼，不參與 Spring Boot 啓動。

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-common/`