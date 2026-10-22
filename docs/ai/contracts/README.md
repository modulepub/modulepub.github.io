---
title: 跨模块契约
description: 同步 Api 与异步 MQ 的完整模板：接口、实现、调用、发布、消费与幂等。
---

<div class="doc-eyebrow">CONTRACTS · THE ONLY WAY ACROSS BOUNDARIES</div>

<p class="doc-lead">
  在 TG-boot 里，模块之间没有“顺手调一下”的捷径。
  要么声明一个 <code>Api**Service</code> 契约，要么发布一个 MQ 事件契约。
  这听起来更麻烦，但它换来的是：依赖可追踪、影响面可枚举、AI 可复用同一套模板。
</p>

## 一、先做选择：同步还是异步？

```text
需要立即拿到结果？
├─ 是 → Api**Service（同步 RPC）
└─ 否 → 有多个订阅方，或允许最终一致？
   ├─ 是 → XxxConsumer（异步事件）
   └─ 否 → 再确认是否真的需要跨模块；可能应留在本域
```

| 场景 | 选择 | 例子 |
| --- | --- | --- |
| 下单前校验用户状态 | 同步 Api | 调用 `ApiSysUserService` |
| 支付成功后通知多个域 | 异步事件 | `trade.order-goods.paid` |
| 页面实时查询订单 | 同步 Api | `ApiTdOrderService` |
| 用户注册后发欢迎消息、初始化分销 | 异步事件 | `system.user.registered` |

## 二、同步契约：Api 接口

### 2.1 定义在 `*-api/service`

```java
package pub.module.system.api.service;

import pub.module.rpc.spi.RpcApi;
import pub.module.system.api.dto.UserDTO;

@RpcApi
public interface ApiSysUserService {

    UserDTO getByUserCode(String userCode);

    void updateLastLogin(String userCode);
}
```

规则：

- 接口命名 `Api**Service`；
- 必须在 `pub.module.{module}.api.service` 包下；
- 入参 / 出参只能是 `*-api/dto`、枚举或简单类型；
- 返回业务 DTO 或 `void`，不要返回 `Result`；
- 不使用 default 方法；
- 方法粒度按用例，不按表。

### 2.2 实现在 `*-biz/service/impl`

```java
package pub.module.system.biz.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pub.module.system.api.dto.UserDTO;
import pub.module.system.api.service.ApiSysUserService;

@Service
@RequiredArgsConstructor
public class ApiSysUserServiceImpl implements ApiSysUserService {

    private final SysUserService sysUserService;

    @Override
    public UserDTO getByUserCode(String userCode) {
        return sysUserService.getDtoByCode(userCode);
    }

    @Override
    public void updateLastLogin(String userCode) {
        sysUserService.updateLastLogin(userCode);
    }
}
```

实现类只做业务编排，不写传输细节。

### 2.3 调用方直接注入

```java
@Service
@RequiredArgsConstructor
public class DatingLoginService {

    private final ApiSysUserService apiSysUserService;

    public UserDTO loadUser(String userCode) {
        return apiSysUserService.getByUserCode(userCode);
    }
}
```

注入的是 `common` 生成的代理。调用方不需要判断本地还是远程。

### 2.4 队列与路由

| 项 | 规则 |
| --- | --- |
| module 键 | 从包路径 `pub.module.{module}.api...` 推导 |
| 请求队列 | `api.rpc.{module}` |
| 应答 | Rabbit Request-Reply 临时队列 |
| 路由 | 本地 Provider 优先，否则 MQ |
| 超时 | `tg.module-call.default-timeout-ms` |

不要在 YAML 里手配队列名或 reply-prefix。

## 三、异步契约：事件

### 3.1 契约定义在 `*-api/subscribe`

```java
package pub.module.system.api.subscribe;

import lombok.Data;
import pub.module.event.spi.MqChannel;
import pub.module.event.spi.MqMessageConsumer;
import pub.module.system.api.dto.UserDTO;

import java.io.Serializable;

@MqChannel
public interface SystemUserRegisteredConsumer
        extends MqMessageConsumer<SystemUserRegisteredConsumer.Payload> {

    void onUserRegistered(Payload message);

    @Data
    class Payload implements Serializable {
        private UserDTO user;
        private String source;
        private String userRegEntryCode;
    }
}
```

默认推导：

- destination：`system.user.registered`
- producerFunction：`systemUserRegistered`
- 消费 group：消费者所在模块（如 `dating`、`distribution`）

如果显式配置了 destination / producerFunction，则以手写值为准。

### 3.2 发布：事务提交后

```java
@Service
@RequiredArgsConstructor
public class SysUserRegisterService {

    private final MqPublisher mqPublisher;

    @Transactional
    public void register(RegisterCommand command) {
        SysUser user = createUser(command);

        SystemUserRegisteredConsumer.Payload payload =
                new SystemUserRegisteredConsumer.Payload();
        payload.setUser(toDto(user));
        payload.setSource(command.getSource());

        mqPublisher.publishAfterCommit(SystemUserRegisteredConsumer.class, payload);
    }
}
```

不要写：

```java
// 错误：事务尚未提交，消息可能先被消费
mqPublisher.publish(SystemUserRegisteredConsumer.class, payload);
```

### 3.3 消费：直接实现契约

```java
@Component
@RequiredArgsConstructor
public class DatingUserRegisteredHandler implements SystemUserRegisteredConsumer {

    private final DatingCustomerService datingCustomerService;

    @Override
    public void onUserRegistered(Payload message) {
        if (!"dating".equals(message.getSource())) {
            return;
        }
        datingCustomerService.initFromUser(message.getUser());
    }
}
```

不要为了订阅再建一个中间接口。契约本身就是订阅点。

## 四、幂等：异步链路不能假设“只来一次”

每个消费者都要回答：**同一条消息重复投递时，会发生什么？**

常见幂等键：

| 事件 | 幂等键 |
| --- | --- |
| `trade.order-goods.paid` | `tdOdGdCode` |
| `wx.pay.notify` | `outTradeNo` |
| `verification.face-auth.finished` | `faRecordCode` |
| `system.user.registered` | userCode + 来源 |
| `dating.profile.updated` | cusCode + 字段版本 |

实现方式可以是唯一索引、状态机判断、去重表或 Redis 标记。重点不是技术选型，而是**在消费前就定义好重复的判定标准**。

## 五、契约变更的礼仪

- 新增字段：保持向后兼容，消费方忽略未知字段；
- 删除字段：先停止使用，再删除，至少跨一个发布周期；
- 改事件名：视为破坏性变更，必须新增 destination 并双写过渡；
- 改方法签名：同步契约直接破坏调用方，必须评估所有实现与调用点；
- 不要让 `*-api` 的 DTO 继承 `*-biz` 的实体。

## 六、测试与验收

<ul class="doc-checklist">
  <li>同步：本地有 Provider 时是否走本地，无 Provider 时是否走 MQ？</li>
  <li>同步：业务异常是否被转换为稳定的错误码，而不是泄漏堆栈？</li>
  <li>异步：事务回滚时，事件是否没有发出？</li>
  <li>异步：重复消费两次，结果是否一致？</li>
  <li>事件：destination、group、幂等键是否登记？</li>
  <li>依赖：架构测试是否仍然通过？</li>
</ul>

<div class="doc-quote">
  契约不是文档的装饰，而是模块之间唯一合法的“海关”。
  每一次跨边界，都要留下可检查的记录。
  <small>CONTRACT-FIRST</small>
</div>
