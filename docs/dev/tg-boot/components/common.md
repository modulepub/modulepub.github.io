---
title: spring-boot-starter-common
createTime: 2026/05/09
permalink: /dev/tg-boot/components/common/
---
# spring-boot-starter-common

跨模块 **公共内核**：统一返回体 `Result`、业务异常 `BizException`、基础实体字段约定、简易日志与查询工具等。

## 消息基础设施

- **`EmbeddedRabbitAutoConfiguration`**：开发环境嵌入式 Rabbit（`rabbitmq-mock`），免外部安装；生产关闭 `tg.messaging.embedded-rabbit` 并配置真实 broker。
- **`application-messaging-baseline.yml`**：Stream 消费 **重试 / DLQ / 退避** 统一基线；runner 通过 `spring.config.import` 引入。
- **`MqMessagingAutoConfiguration`**：扫描 `XxxConsumer` 契约与槽位实现，自动注册 Stream binding 与 Function。
- **`MqPublisher`** / **`MqRequestReplyClient`**：发布与 request-reply，业务侧传入 `XxxConsumer.class`。
- **`MqPublisher.publishAfterCommit`** / **`TransactionAfterCommit`**：事务提交后再投递 MQ 或执行副作用，避免回滚后仍发消息。
- **依赖**：`spring-cloud-stream`、`spring-cloud-stream-binder-rabbit`、`spring-boot-starter-amqp` 在本模块统一声明。

## MQ 契约约定（v3.2）

生产者 `*-api/messaging/XxxConsumer.java` 单文件定义：

- `@MqChannel`：destination、producerFunction
- 业务方法 + 嵌套 `@MqSubscribe` 槽位子接口（如 `.Dating`、`.Customer`）

消费者 `*-biz`：`@Component implements XxxConsumer.{Slot}`，无需 yml binding。

生产环境 Actuator、网关与网络隔离见仓库根 [运维说明](/dev/tg-boot/ops/)。

## MQ 运维基线（摘要）

| 项 | 默认值 | 说明 |
|----|--------|------|
| 消费重试 | `max-attempts: 3` | `spring.cloud.stream.default.consumer` |
| DLQ 队列 | `DLQ.{destination}.{group}` | Rabbit `auto-bind-dlq` + `republish-to-dlq` |
| 死信交换机 | `DLX` | 生产需监控队列深度并告警 |
| 退避 | 1s → 10s，×2 | `back-off-*` |

新增消费者须在 [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/) 登记 **幂等键**。

## 认证与短时缓存

- **`TgEphemeralCache`**：全站单 Cache 区域（默认 `tgEphemeral`），`namespace::key` 隔离；验证码/短信等用 `sys:captcha`、`sys:sms`。
- **`AuthSessionStore`**：登录写入 `AuthSessionSnapshot`（含权限）；`TgJwtAuthenticationFilter` 只读缓存。
- **`TgSecurityConfig` / `TgActuatorSecurityConfig`**：业务 JWT 链 + Actuator HTTP Basic（`tg.actuator.*`）。
- 配置：`tg.cache.*`、`tg.security.jwt.*`；权限变更需重新登录或登出踢会话。

## 使用建议

- 业务 starter **仅依赖 common**，不要反向依赖某一 `-biz`。
- **跨模块**协作规则见 [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/)。
- **模块内**多实现在 **`*-biz/service`** 定义 SPI，由注册表或 Spring 注入 `List<实现>` 路由。

## 架构测试

模块边界由 [架构测试门禁](/dev/tg-boot/architecture-tests/) 在 **Maven 测试阶段** 守护（ArchUnit + POM 扫描）；该模块不属于系统运行时代码，不参与 Spring Boot 启动。

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-common/`