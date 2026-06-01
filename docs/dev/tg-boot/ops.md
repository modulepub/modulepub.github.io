---
title: TG-boot 运维说明
createTime: 2026/06/02
permalink: /dev/tg-boot/ops/
---
# TG-boot 运维说明

面向部署、监控与生产环境配置。开发联调见根目录 [TG-boot 总览](/dev/tg-boot/)；跨模块 MQ 协作见 [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/)。

---

## 1. Spring Boot Actuator（生产必读）

Runner 已引入 `spring-boot-starter-actuator`，默认在 `application.yml` 中暴露：

| 端点 | 路径示例 | 说明 |
|------|----------|------|
| health | `/actuator/health` | 健康检查 |
| info | `/actuator/info` | 应用信息 |
| metrics | `/actuator/metrics` | 指标（可能含内部细节） |

业务 HTTP 与 Actuator **共用应用端口**（如 dev 配置为 `9999`），路径前缀为 `/actuator/**`。

### 1.1 硬性要求：禁止对公网暴露

**生产环境不得将 Actuator 路径暴露到公网或不可信网络。**

原因包括但不限于：

- `metrics` 等端点可能泄露 JVM、线程、依赖组件等内部信息；
- 误配置 `management.endpoints.web.exposure.include: '*'` 时会开放 `env`、`heapdump`、`shutdown` 等高危端点；
- 即使 Spring Security 对 `/actuator/**` 要求认证（未登录返回 401），仍不应把「靠账号密码挡在公网」当作唯一防线——凭证泄露、弱口令、漏洞都会导致运维面被突破。

### 1.2 推荐做法

| 层级 | 建议 |
|------|------|
| **网关 / 负载均衡** | 只转发业务路径（如 `/cus/**`、`/mgt/**`、`/pub/**`）；**不要**配置 `/actuator` 的公网路由。 |
| **网络** | 应用部署在内网；监控采集、运维跳板机通过 VPC / 专线访问。 |
| **独立管理端口（可选）** | 使用 `management.server.port` 绑定仅内网可达端口，与业务端口分离。 |
| **暴露范围** | 生产仅保留必要端点，例如仅 `health`（供内网 LB 探活）；**禁止** `include: '*'`。 |
| **探活** | 若只需 UP/DOWN，可只暴露 `health`，并限制 `show-details`（见下）。 |

生产配置示例（按需放入 `application-prod.yml` 或配置中心，**勿提交真实密钥**）：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health   # 生产建议最小集；metrics 仅内网监控需要时再开
  endpoint:
    health:
      show-details: never   # 公网或不可信网络侧永不返回详情
  server:
    port: 19999             # 可选：管理端口仅内网监听，与 server.port 分离
```

配合防火墙 / 安全组：**19999 仅允许监控网段、跳板机访问**；业务端口同样不对公网直接开放 Actuator 路径。

### 1.3 与本项目安全策略的关系

`/actuator/**` 与业务 API **分离**：

| 路径 | 认证方式 |
|------|----------|
| `/cus/**`、`/mgt/**` 等 | 业务 **JWT**（`SecurityConfig`） |
| `/actuator/**` | 运维专用 **HTTP Basic**（`ActuatorSecurityConfig`），**不需要**业务登录 Token |

配置项（`application.yml` / 环境变量）：

```yaml
tg:
  actuator:
    enabled: true
    username: actuator
    password: ${TG_ACTUATOR_PASSWORD:please-change-me}   # 生产务必改强密码
```

开发环境默认密码见 `application-dev.yml`（`tg-actuator-dev`）。访问示例：

```bash
curl -u actuator:tg-actuator-dev http://127.0.0.1:9999/actuator/health
```

关闭独立 Actuator 认证（回退为全站 JWT）：`tg.actuator.enabled=false`。

**仍须**遵守 1.1：Basic 密码不能替代「禁止对公网暴露 `/actuator`」的网络与网关策略。

开发环境可在内网访问 Actuator；**禁止**为了省事将 dev 的 `include: health,info,metrics` 原样复制到生产且挂到公网域名下。

### 1.4 自查清单（上线前）

- [ ] 公网域名 / API 网关规则中无 `/actuator/**` 转发
- [ ] `management.endpoints.web.exposure.include` 未使用 `*`
- [ ] 未在生产启用 `env`、`heapdump`、`shutdown` 等端点
- [ ] 健康检查若走 LB，探活地址为**内网**或专用管理端口
- [ ] Swagger、`/pub/**` 等公开路径与运维路径分开评审（见各环境 `SecurityConfig.publicEndpoints`）

---

## 2. 消息队列（RabbitMQ）

- 开发：可启用嵌入式 Rabbit（`tg.messaging.embedded-rabbit.enabled=true`）。
- **生产：必须关闭嵌入式 Mock**，接入真实 RabbitMQ 集群。
- 重试、DLQ、退避基线：[application-messaging-baseline.yml](spring-boot-starter-module/spring-boot-starter-common/src/main/resources/application-messaging-baseline.yml)
- 目的地与幂等约定：[跨模块协作规范](/dev/tg-boot/cross-module-collaboration/)（含 `DLQ.*` 队列深度告警）

---

## 3. 构建与架构门禁

合并 / 发布前建议执行：

```bash
cd spring-boot-starter-module
mvn -pl spring-boot-starter-architecture-tests -am test
```

CI 参考：[.github/workflows/backend-ci.yml](.github/workflows/backend-ci.yml)。

---

## 4. 相关文件

| 用途 | 路径 |
|------|------|
| Actuator 默认暴露（开发基线） | `spring-boot-starter-runner/src/main/resources/application.yml` |
| 运行端口与中间件 | `spring-boot-starter-runner/src/main/resources/application-dev.yml` |
| MQ 运维基线 | `spring-boot-starter-common/.../application-messaging-baseline.yml` |
| Runner 打包与启动 | [spring-boot-starter-runner/README.md](spring-boot-starter-module/spring-boot-starter-runner/README.md) |