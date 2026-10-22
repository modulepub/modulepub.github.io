---
title: TG-boot 運維説明
createTime: 2026/06/02
permalink: /zh-Hant/dev/tg-boot/ops/
---
# TG-boot 運維説明

面向部署、監控與生產環境配置。開發聯調見根目錄 [TG-boot 總覽](/zh-Hant/dev/tg-boot/)；跨模塊 MQ 協作見 [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/)。

---

## 1. Spring Boot Actuator（生產必讀）

Runner 已引入 `spring-boot-starter-actuator`，默認在 `application.yml` 中暴露：

| 端點 | 路徑示例 | 説明 |
|------|----------|------|
| health | `/actuator/health` | 健康檢查 |
| info | `/actuator/info` | 應用信息 |
| metrics | `/actuator/metrics` | 指標（可能含內部細節） |

業務 HTTP 與 Actuator **共用應用端口**（如 dev 配置為 `9999`），路徑前綴為 `/actuator/**`。

### 1.1 硬性要求：禁止對公網暴露

**生產環境不得將 Actuator 路徑暴露到公網或不可信網絡。**

原因包括但不限於：

- `metrics` 等端點可能泄露 JVM、線程、依賴組件等內部信息；
- 誤配置 `management.endpoints.web.exposure.include: '*'` 時會開放 `env`、`heapdump`、`shutdown` 等高危端點；
- 即使 Spring Security 對 `/actuator/**` 要求認證（未登錄返回 401），仍不應把「靠賬號密碼擋在公網」當作唯一防線——憑證泄露、弱口令、漏洞都會導致運維面被突破。

### 1.2 推薦做法

| 層級 | 建議 |
|------|------|
| **網關 / 負載均衡** | 只轉發業務路徑（如 `/cus/**`、`/mgt/**`、`/pub/**`）；**不要**配置 `/actuator` 的公網路由。 |
| **網絡** | 應用部署在內網；監控採集、運維跳板機通過 VPC / 專線訪問。 |
| **獨立管理端口（可選）** | 使用 `management.server.port` 綁定僅內網可達端口，與業務端口分離。 |
| **暴露範圍** | 生產僅保留必要端點，例如僅 `health`（供內網 LB 探活）；**禁止** `include: '*'`。 |
| **探活** | 若只需 UP/DOWN，可只暴露 `health`，並限制 `show-details`（見下）。 |

生產配置示例（按需放入 `application-prod.yml` 或配置中心，**勿提交真實密鑰**）：

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health   # 生產建議最小集；metrics 僅內網監控需要時再開
  endpoint:
    health:
      show-details: never   # 公網或不可信網絡側永不返回詳情
  server:
    port: 19999             # 可選：管理端口僅內網監聽，與 server.port 分離
```

配合防火牆 / 安全組：**19999 僅允許監控網段、跳板機訪問**；業務端口同樣不對公網直接開放 Actuator 路徑。

### 1.3 與本項目安全策略的關係

`/actuator/**` 與業務 API **分離**：

| 路徑 | 認證方式 |
|------|----------|
| `/cus/**`、`/mgt/**` 等 | 業務 **JWT**（`SecurityConfig`） |
| `/actuator/**` | 運維專用 **HTTP Basic**（`ActuatorSecurityConfig`），**不需要**業務登錄 Token |

配置項（`application.yml` / 環境變量）：

```yaml
tg:
  actuator:
    enabled: true
    username: actuator
    password: ${TG_ACTUATOR_PASSWORD:please-change-me}   # 生產務必改強密碼
```

開發環境默認密碼見 `application-dev.yml`（`tg-actuator-dev`）。訪問示例：

```bash
curl -u actuator:tg-actuator-dev http://127.0.0.1:9999/actuator/health
```

關閉獨立 Actuator 認證（回退為全站 JWT）：`tg.actuator.enabled=false`。

**仍須**遵守 1.1：Basic 密碼不能替代「禁止對公網暴露 `/actuator`」的網絡與網關策略。

開發環境可在內網訪問 Actuator；**禁止**為了省事將 dev 的 `include: health,info,metrics` 原樣複製到生產且掛到公網域名下。

### 1.4 自查清單（上線前）

- [ ] 公網域名 / API 網關規則中無 `/actuator/**` 轉發
- [ ] `management.endpoints.web.exposure.include` 未使用 `*`
- [ ] 未在生產啓用 `env`、`heapdump`、`shutdown` 等端點
- [ ] 健康檢查若走 LB，探活地址為**內網**或專用管理端口
- [ ] Swagger、`/pub/**` 等公開路徑與運維路徑分開評審（見各環境 `SecurityConfig.publicEndpoints`）

---

## 2. 消息隊列（RabbitMQ）

- 開發：可啓用嵌入式 Rabbit（`tg.messaging.embedded-rabbit.enabled=true`）。
- **生產：必須關閉嵌入式 Mock**，接入真實 RabbitMQ 集羣。
- 重試、DLQ、退避基線：[application-messaging-baseline.yml](spring-boot-starter-module/spring-boot-starter-common/src/main/resources/application-messaging-baseline.yml)
- 目的地與冪等約定：[跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/)（含 `DLQ.*` 隊列深度告警）

---

## 3. 構建與架構門禁

合併 / 發佈前建議執行：

```bash
cd spring-boot-starter-module
mvn -pl spring-boot-starter-architecture-tests -am test
```

CI 參考：[.github/workflows/backend-ci.yml](.github/workflows/backend-ci.yml)。

---

## 4. 相關文件

| 用途 | 路徑 |
|------|------|
| Actuator 默認暴露（開發基線） | `spring-boot-starter-runner/src/main/resources/application.yml` |
| 運行端口與中間件 | `spring-boot-starter-runner/src/main/resources/application-dev.yml` |
| MQ 運維基線 | `spring-boot-starter-common/.../application-messaging-baseline.yml` |
| Runner 打包與啓動 | [spring-boot-starter-runner/README.md](spring-boot-starter-module/spring-boot-starter-runner/README.md) |