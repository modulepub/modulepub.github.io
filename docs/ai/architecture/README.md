---
title: 架构与边界
description: 模块化单体、Api 契约、AUTO 路由与 MQ 事件：一页看懂 TG-boot 的结构和演进路线。
---

<div class="doc-eyebrow">ARCHITECTURE · ONE PROCESS, REAL BOUNDARIES</div>

<p class="doc-lead">
  TG-boot 的默认形态是“模块化单体”：源码按 Maven 模块切得很细，运行时却装配进同一个 runner。
  它用单进程换取交付效率，用契约与门禁保住未来拆分的能力。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>1<em> runner</em></strong><span>默认运行单元</span></div>
  <div class="doc-metric"><strong>2<em> 轨</em></strong><span>同步 Api / 异步 MQ</span></div>
  <div class="doc-metric"><strong>AUTO</strong><span>本地优先，远程兜底</span></div>
  <div class="doc-metric"><strong>4<em> 层</em></strong><span>common / api / biz / runner</span></div>
</div>

## 一、先看全貌

```text
tg-boot
└── spring-boot-starter-module                Maven 反应堆根
    ├── spring-boot-starter-common            内核：Result / BaseEntity / MQ / RPC
    ├── spring-boot-starter-components        通用能力域
    │   ├── spring-boot-starter-system        用户 / 组织 / 权限
    │   ├── spring-boot-starter-trade         商品 / 订单 / 支付
    │   ├── spring-boot-starter-verification  实名 / 内容审核
    │   └── ...                               文件 / CMS / IM / 短信 / Excel ...
    ├── spring-boot-starter-business          垂直业务域
    │   ├── spring-boot-starter-dating        婚恋 / 客户
    │   └── spring-boot-starter-parent-led    亲家
    ├── spring-boot-starter-runner            可执行装配壳（微内核）
    └── spring-boot-starter-architecture-tests 架构门禁
```

每个能力域再拆成两个模块：

```text
spring-boot-starter-{域}/
├── spring-boot-starter-{域}-api/    契约：Api**Service、事件、DTO、枚举
└── spring-boot-starter-{域}-biz/    实现：Controller、Service、Mapper、Consumer
```

这就是最重要的空间约束：**接口和实现，从目录上就是分开的。**

## 二、四层的职责

| 层 | 应该放什么 | 不应该放什么 |
| --- | --- | --- |
| `common` | Result、异常、BaseEntity、MQ 与 RPC 支撑、安全基础设施 | 任何业务逻辑 |
| `*-api` | 跨模块接口、DTO、事件契约、枚举、常量 | 传输代码、`crud.entity`、`Spi*` |
| `*-biz` | Controller、业务 Service、持久化、消费者、模块内 SPI | 依赖他域 `*-biz`、手写 MQ binding |
| `runner` | 按需装配 `*-biz`、启动配置 | 业务代码 |

一条经验规则：

> 如果一段代码需要被**另一个模块**调用，它才应该出现在 `*-api`；
> 如果它只服务于本域，就应该留在 `*-biz`。

## 三、三条不可越过的边界

### 3.1 跨模块只能依赖契约

```java
// 在 dating-biz 中
@Resource
private ApiSysUserService apiSysUserService; // 注入的是代理，不是 Impl

UserDTO user = apiSysUserService.getByUserCode(code);
```

禁止：

```java
// 错误：直接依赖他域实现
@Resource
private SysUserServiceImpl sysUserServiceImpl;

// 错误：跨域 Mapper / SQL JOIN
@Select("select * from sys_user where user_code = #{code}")
UserDTO selectUser(String code);
```

### 3.2 `*-api` 不依赖 `*-biz`

`*-api` 是“可被外部依赖的最小集合”。一旦它引用了实体或实现，所有调用方都会被迫拖上一整套持久化依赖。

### 3.3 模块内多实现用 SPI，不用跨模块接口

支付渠道、短信供应商、文件存储，这些是**模块内**的变化点：

- 接口定义在 `*-biz/service`，命名为 `Spi**Service`；
- 多个实现通过注册表或 `List<实现>` 路由；
- 不要把 SPI 放到 `*-api`，否则它会被误认为跨模块契约。

## 四、两条协作轨道

### 4.1 同步轨：像 Feign 一样调用

```text
调用方
  @Resource ApiXxxService
        │
        ▼
  ModuleApiProxy（JDK 动态代理）
        │
        ├─ 本 JVM 有 Provider ──► 本地直调
        │
        └─ 没有 Provider ──────► MQ Request-Reply
                                  队列 api.rpc.{module}
```

关键点：

- 路由固定 **AUTO**，不需要配置“单体 / 微服务”模式；
- 接口必须标注 `@RpcApi`，并位于 `pub.module.{module}.api.service`；
- 返回值是业务 DTO 或 `void`，不要返回 HTTP 层的 `Result`；
- 方法粒度按用例设计，便于未来远程化与事务编排。

### 4.2 异步轨：事件在事务提交后出发

```java
// 发布方：只依赖事件契约
mqPublisher.publishAfterCommit(SystemUserLoginConsumer.class, payload);
```

```java
// 消费方：直接实现契约
@Component
public class ParentLedSystemUserLoginHandler implements SystemUserLoginConsumer {
    @Override
    public void onUserLogin(Payload message) {
        if (!accepts(message)) {
            return;
        }
        // 幂等处理
    }
}
```

约束：

- **禁止**在 `@Transactional` 内直接 `publish`，必须 `publishAfterCommit`；
- 禁止在业务模块里直接使用 `RabbitTemplate` 做跨模块调用；
- 消费者必须说明幂等键；
- 事件名遵循 `{域}.{实体}.{动作}`，例如 `trade.order-goods.paid`。

## 五、数据与事务

- 实体继承 `BaseEntity`，统一审计字段；
- 技术主键 `id`，业务主键 `xxxCode`；
- 表前缀按域划分（`sys_`、`td_`、`dt_`、`pl_`、`vt_` 等）；
- 跨表冗余字段与来源字段同名语义，前缀随本表变化；
- 同步链路的事务边界在用例层；
- 异步链路采用“本地事务 + 提交后事件 + 幂等消费”，不把 MQ 放进 2PC。

## 六、从单体到多 runner

| 阶段 | 形态 | 主要改动 |
| --- | --- | --- |
| Phase 1 | 一个 runner，全部 `*-biz` | 默认状态，交付最快 |
| Phase 2 | 按域拆多个 runner，共享 Broker | 新建 runner 的 POM 与启动配置 |
| Phase 3 | 独立数据域 | 拆分 schema / 数据库，处理跨域查询 |
| Phase 4 | 分布式事务与可观测性 | 在 RPC 拦截链上引入事务传播、追踪与治理 |

关键结论：**业务代码不需要为拆分重写。** 调用方仍然注入 `Api**Service`，只是本 JVM 没有 Provider 时，代理自动改走 MQ。

## 七、常见误解

| 误解 | 实际情况 |
| --- | --- |
| “模块化单体就是普通单体换个目录” | 不是。它有契约、模块依赖规则和架构门禁 |
| “拆微服务时要把 Api 改成 HTTP 客户端” | 不需要。调用方仍然面向接口 |
| “用了 MQ 就一定是微服务” | 不是。单进程内也可以使用 MQ 做解耦 |
| “所有跨模块调用都应该异步” | 不是。需要立即返回结果的用例仍走同步 Api |
| “架构测试只是形式” | 它会在 CI 中直接失败，阻止越界合并 |

## 八、验收这份架构的四句话

<div class="doc-quote">
  能在一个进程里交付，<br>
  能在不改业务的前提下拆分，<br>
  能在编译期发现依赖越界，<br>
  能让 AI 只看目录就知道代码该放哪里。
  <small>ARCHITECTURE ACCEPTANCE</small>
</div>

下一步建议阅读 [跨模块契约](/ai/contracts/)，把这两条轨道落到可复制的代码模板。
