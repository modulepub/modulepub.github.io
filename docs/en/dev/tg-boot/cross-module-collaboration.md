---
title: Cross-Module Collaboration
createTime: 2026/06/02
permalink: /en/dev/tg-boot/cross-module-collaboration/
---
# 跨模块协作规范

本文档约定 TG-boot **模块化单体**下模块间如何协作：何时用 MQ、何时用同步 `Api**Service`，以及如何保证消息可靠性与幂等。

## 设计目标

跨模块协作遵循两条原则：

1. **避免耦合**：模块只依赖 `*-api` 契约，不依赖他域 `*-biz` 实现；发布方不应感知、更不应硬编码订阅方列表。
2. **保持独立性**：各业务域可独立演进、按需订阅或退订；新增消费者时，发布方代码与契约通常无需改动。

## 协作模式总览

TG-boot 将模块分为 **公共通用组件**（`spring-boot-starter-components`，如 system、verification、sms、trade）与 **业务域模块**（`spring-boot-starter-business`，如 customer、dating、distribution）。二者协作方式如下：

```
┌─────────────────────────────────────────────────────────────────┐
│  业务模块  ──同步 Api**Service──▶  公共通用组件 / 其他业务模块   │
│           （需立即结果：查用户、发短信、强一致编排）              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  公共通用组件  ──MQ 发布-订阅──▶  各依赖它的业务模块（0～N 个）  │
│              （异步通知：登录、资料变更、支付成功等副作用）        │
└─────────────────────────────────────────────────────────────────┘
```

| 方式 | 方向与模式 | 适用场景 | 契约位置 | 典型调用方 |
|------|------------|----------|----------|------------|
| **MQ（发布-订阅）** | 公共组件 → 业务模块；Pub/Sub 广播 | 异步通知、多订阅方广播、解耦副作用、跨 runner / 未来拆服务 | `*-api/messaging/XxxConsumer.java` | 发布：`MqPublisher`；消费：实现 `XxxConsumer.{Slot}` |
| **同步 `Api**Service`** | 任意模块 → 任意模块；请求-响应 | 同进程内强一致编排、需立即得到结果（含业务模块调用公共组件） | `*-api/service` | `@Resource ApiXxxService` 注入 |

**要点**

- **公共通用组件的异步通知** → 走 **MQ 发布-订阅**：发布方只负责投递事件，不关心有多少订阅方；各业务域在自身 `*-api` 声明订阅槽位，在 `*-biz` 实现消费逻辑。
- **业务模块使用公共组件能力**（查用户、发短信、支付等）→ 走 **同步 `Api**Service`**：需要立即返回结果，不走 MQ。
- **不要**用 Spring `ApplicationEvent` 做跨模块协作（仅限模块内）。
- **不要**在 `*-biz` 的 Maven 依赖中引入其他域的 `*-biz`（仅允许 `*-api` + `common`）。
- **不要**在 `*-api` 的 Maven 依赖或 Java 源码中引用 `*-biz`（含本模块 `crud.entity`、`crud.service`）；`Api**Service` 契约必须使用 `*-api/dto`。
- **不要**在 `*-api` 中定义 `Spi*` 接口（模块内多实现 SPI 只在 `*-biz/service`）。
- MQ 消费者内若需调用其他模块，**优先注入 `Api**Service`**（接口在 api、实现在对方 biz），而不是引用对方 `crud` 或 `biz.impl`。
- **不要**在 yml 中声明 domain binding；渠道契约统一在 `XxxConsumer` 接口，由 common 自动注册。
- **跨模块写库后发 MQ** 须使用 `MqPublisher.publishAfterCommit`（实现见 `common` 的 `TransactionAfterCommit`），禁止在 `@Transactional` 写库流程中直接 `publish`。

## 链路分类总表

### 一、MQ 异步链路（发布-订阅，跨模块副作用）

以下链路均为 **单向广播或单向投递**：发布方在公共/业务组件的 `*-biz` 中调用 `MqPublisher`，订阅方各自独立消费，互不影响。

| Destination | 模式 | 发布方 | 消费方 group | 幂等键 / 策略 | 说明 |
|-------------|------|--------|--------------|---------------|------|
| `trade.order-goods.paid` | 发布-订阅 | trade-biz | `dating` / `distribution` | `tdOdGdCode`（充值类由 customer 侧记录表保证） | 支付成功后履约 / 分佣 |
| `customer.profile.updated` | 发布-订阅 | customer-biz | 各订阅域自定 group | `cusCode` + 字段比对跳过 | 通用广播；槽位在订阅方 api（如 dating-api） |
| `system.user.login` | 发布-订阅 | system-biz | `customer` | `user.userCode` 查重 | 登录后初始化客户档案 |
| `system.user-info.updated` | 发布-订阅 | system-biz | `customer` | `userCode` + 昵称相同则跳过 | 同步客户昵称 |
| `system.user.registered` | 发布-订阅 | system-biz | `distribution` | 业务侧按推荐关系查重 | 注册后绑定推荐 |
| `verification.phone-two-factor.verified` | 发布-订阅 | verification-biz | `customer` | 实名状态幂等更新 | 二要素通过后更新客户 |
| `distribution.promoter-role.query` | request-reply | distribution-biz | `dating`（应答） | 读查询，无写幂等 | 分佣前查推广人角色（例外：需一问一答时用 request-reply） |

**发布-订阅契约约定**

- 根契约定义在 **发布方** `*-api/messaging/XxxConsumer.java`（含 `@MqChannel`、消息体、发布方法）。
- **订阅方**在 **自身** `*-api` 中声明嵌套 `@MqSubscribe` 子接口（如 `SystemUserLoginConsumer.Customer`），在 `*-biz` 中 `@Component implements XxxConsumer.{Slot}`。
- 通用广播事件（如 `customer.profile.updated`）仅在 producer api 定义根契约；各订阅方按需新增槽位，发布方零改动。

契约：`pub.module.*.api.messaging.*Consumer`；运维基线：`application-messaging-baseline.yml`（common）。

### 二、同步 `Api**Service` 链路（同进程强一致）

以下场景 **故意保留同步调用**：在 HTTP 请求链路或 MQ 消费者内部，需要同一事务/立即结果，暂不拆 RPC。

| 调用方（biz） | 被调接口（api） | 触发上下文 | 说明 |
|---------------|-----------------|------------|------|
| dating-biz | `ApiCustomerService` | MQ 消费者履约内 | 充值会员权益等 |
| dating-biz | `ApiDtCusMatchmakerRelService` | 同上 | 合约类商品关联红娘 |
| dating-biz | `ApiSysUserService` / `ApiCustomerService` 等 | HTTP 业务接口 | 编排查询与写操作 |
| 各 biz | `ApiSmsSendService` / `ApiSysUserService` 等 | HTTP 业务接口 | **业务模块调用公共组件**，同步获取结果 |
| distribution-biz | `ApiSysUserService` | 分佣 / 用户相关 | 读取用户信息 |
| customer-biz | `ApiSysUserService` | 客户资料与系统用户同步 | 双向昵称/实名同步 |
| 各 biz | 本域或他域 `Api**Service` | Controller / Service | 仅依赖 `*-api`，不依赖他域 `-biz` |

**演进**：拆分为独立服务时，上表「同步 Api」行应改为 Feign/gRPC 或改为 Saga + MQ；MQ 表中的契约可保持不变。

### 三、模块内 SPI（非跨模块）

| 机制 | 定义位置 | 路由方式 | 示例 |
|------|----------|----------|------|
| `Spi**Service` | `*-biz/service` | 注册表或 `List<实现>` | 短信、文件、支付渠道、二要素渠道 |

## 新增跨模块 MQ 能力检查清单

1. 调用方是否需要 **立即返回结果**？是 → `Api**Service`；否 → MQ。
2. 是否为 **公共组件向依赖方异步通知**？是 → MQ **发布-订阅**；发布方不得依赖具体订阅方。
3. 是否 **多订阅方广播**？是 → MQ 单向 Pub/Sub；通用事件仅在 producer api 定义根契约，各订阅方在自身 api 声明 `@MqSubscribe` 子接口。
4. 是否 **一问一答**？是 → `@MqChannel(mode=REQUEST_REPLY)` + `MqRequestReplyClient`（少数读查询场景）。
5. 消费者是否 **幂等**？必须声明幂等键（表唯一键 / 状态比对 / 业务编码查重）。
6. `*-biz/pom.xml` 是否 **只新增 `-api` 依赖**？
7. 消费者 biz 是否 **`@Component implements XxxConsumer.{Slot}`**（勿直接实现根接口）？

## MQ 运维基线

详见 [application-messaging-baseline.yml](spring-boot-starter-module/spring-boot-starter-common/src/main/resources/application-messaging-baseline.yml) 与 [common/README.md](spring-boot-starter-module/spring-boot-starter-common/README.md)。

- **重试**：默认 `max-attempts: 3`，指数退避。
- **DLQ**：消费失败后进入 `DLQ.{destination}.{group}`，交换机 `DLX`。
- **监控**：生产环境对 `DLQ.*` 队列深度告警；日志关键字 `婚恋履约失败`、`推广人角色查询失败` 等需接入日志平台。
- **嵌入式 Rabbit**：仅开发环境（`tg.messaging.embedded-rabbit.enabled=true`）；生产关闭并配置真实 broker。