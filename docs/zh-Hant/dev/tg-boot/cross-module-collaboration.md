---
title: 跨模塊協作規範
createTime: 2026/06/02
permalink: /zh-Hant/dev/tg-boot/cross-module-collaboration/
---
# 跨模塊協作規範

本文檔約定 TG-boot **模塊化單體**下模塊間如何協作：何時用 MQ、何時用同步 `Api**Service`，以及如何保證消息可靠性與冪等。

## 設計目標

跨模塊協作遵循兩條原則：

1. **避免耦合**：模塊只依賴 `*-api` 契約，不依賴他域 `*-biz` 實現；發佈方不應感知、更不應硬編碼訂閲方列表。
2. **保持獨立性**：各業務域可獨立演進、按需訂閲或退訂；新增消費者時，發佈方代碼與契約通常無需改動。

## 協作模式總覽

TG-boot 將模塊分為 **公共通用組件**（`spring-boot-starter-components`，如 system、verification、sms、trade）與 **業務域模塊**（`spring-boot-starter-business`，如 customer、dating、distribution）。二者協作方式如下：

```
┌─────────────────────────────────────────────────────────────────┐
│  業務模塊  ──同步 Api**Service──▶  公共通用組件 / 其他業務模塊   │
│           （需立即結果：查用户、發短信、強一致編排）              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  公共通用組件  ──MQ 發佈-訂閲──▶  各依賴它的業務模塊（0～N 個）  │
│              （異步通知：登錄、資料變更、支付成功等副作用）        │
└─────────────────────────────────────────────────────────────────┘
```

| 方式 | 方向與模式 | 適用場景 | 契約位置 | 典型調用方 |
|------|------------|----------|----------|------------|
| **MQ（發佈-訂閲）** | 公共組件 → 業務模塊；Pub/Sub 廣播 | 異步通知、多訂閲方廣播、解耦副作用、跨 runner / 未來拆服務 | `*-api/messaging/XxxConsumer.java` | 發佈：`MqPublisher`；消費：實現 `XxxConsumer.{Slot}` |
| **同步 `Api**Service`** | 任意模塊 → 任意模塊；請求-響應 | 同進程內強一致編排、需立即得到結果（含業務模塊調用公共組件） | `*-api/service` | `@Resource ApiXxxService` 注入 |

**要點**

- **公共通用組件的異步通知** → 走 **MQ 發佈-訂閲**：發佈方只負責投遞事件，不關心有多少訂閲方；各業務域在自身 `*-api` 聲明訂閲槽位，在 `*-biz` 實現消費邏輯。
- **業務模塊使用公共組件能力**（查用户、發短信、支付等）→ 走 **同步 `Api**Service`**：需要立即返回結果，不走 MQ。
- **不要**用 Spring `ApplicationEvent` 做跨模塊協作（僅限模塊內）。
- **不要**在 `*-biz` 的 Maven 依賴中引入其他域的 `*-biz`（僅允許 `*-api` + `common`）。
- **不要**在 `*-api` 的 Maven 依賴或 Java 源碼中引用 `*-biz`（含本模塊 `crud.entity`、`crud.service`）；`Api**Service` 契約必須使用 `*-api/dto`。
- **不要**在 `*-api` 中定義 `Spi*` 接口（模塊內多實現 SPI 只在 `*-biz/service`）。
- MQ 消費者內若需調用其他模塊，**優先注入 `Api**Service`**（接口在 api、實現在對方 biz），而不是引用對方 `crud` 或 `biz.impl`。
- **不要**在 yml 中聲明 domain binding；渠道契約統一在 `XxxConsumer` 接口，由 common 自動註冊。
- **跨模塊寫庫後發 MQ** 須使用 `MqPublisher.publishAfterCommit`（實現見 `common` 的 `TransactionAfterCommit`），禁止在 `@Transactional` 寫庫流程中直接 `publish`。

## 鏈路分類總表

### 一、MQ 異步鏈路（發佈-訂閲，跨模塊副作用）

以下鏈路均為 **單向廣播或單向投遞**：發佈方在公共/業務組件的 `*-biz` 中調用 `MqPublisher`，訂閲方各自獨立消費，互不影響。

| Destination | 模式 | 發佈方 | 消費方 group | 冪等鍵 / 策略 | 説明 |
|-------------|------|--------|--------------|---------------|------|
| `trade.order-goods.paid` | 發佈-訂閲 | trade-biz | `dating` / `distribution` | `tdOdGdCode`（充值類由 customer 側記錄表保證） | 支付成功後履約 / 分傭 |
| `customer.profile.updated` | 發佈-訂閲 | customer-biz | 各訂閲域自定 group | `cusCode` + 字段比對跳過 | 通用廣播；槽位在訂閲方 api（如 dating-api） |
| `system.user.login` | 發佈-訂閲 | system-biz | `customer` | `user.userCode` 查重 | 登錄後初始化客户檔案 |
| `system.user-info.updated` | 發佈-訂閲 | system-biz | `customer` | `userCode` + 暱稱相同則跳過 | 同步客户暱稱 |
| `system.user.registered` | 發佈-訂閲 | system-biz | `distribution` | 業務側按推薦關係查重 | 註冊後綁定推薦 |
| `verification.phone-two-factor.verified` | 發佈-訂閲 | verification-biz | `customer` | 實名狀態冪等更新 | 二要素通過後更新客户 |
| `distribution.promoter-role.query` | request-reply | distribution-biz | `dating`（應答） | 讀查詢，無寫冪等 | 分傭前查推廣人角色（例外：需一問一答時用 request-reply） |

**發佈-訂閲契約約定**

- 根契約定義在 **發佈方** `*-api/messaging/XxxConsumer.java`（含 `@MqChannel`、消息體、發佈方法）。
- **訂閲方**在 **自身** `*-api` 中聲明嵌套 `@MqSubscribe` 子接口（如 `SystemUserLoginConsumer.Customer`），在 `*-biz` 中 `@Component implements XxxConsumer.{Slot}`。
- 通用廣播事件（如 `customer.profile.updated`）僅在 producer api 定義根契約；各訂閲方按需新增槽位，發佈方零改動。

契約：`pub.module.*.api.messaging.*Consumer`；運維基線：`application-messaging-baseline.yml`（common）。

### 二、同步 `Api**Service` 鏈路（同進程強一致）

以下場景 **故意保留同步調用**：在 HTTP 請求鏈路或 MQ 消費者內部，需要同一事務/立即結果，暫不拆 RPC。

| 調用方（biz） | 被調接口（api） | 觸發上下文 | 説明 |
|---------------|-----------------|------------|------|
| dating-biz | `ApiCustomerService` | MQ 消費者履約內 | 充值會員權益等 |
| dating-biz | `ApiDtCusMatchmakerRelService` | 同上 | 合約類商品關聯紅娘 |
| dating-biz | `ApiSysUserService` / `ApiCustomerService` 等 | HTTP 業務接口 | 編排查詢與寫操作 |
| 各 biz | `ApiSmsSendService` / `ApiSysUserService` 等 | HTTP 業務接口 | **業務模塊調用公共組件**，同步獲取結果 |
| distribution-biz | `ApiSysUserService` | 分傭 / 用户相關 | 讀取用户信息 |
| customer-biz | `ApiSysUserService` | 客户資料與系統用户同步 | 雙向暱稱/實名同步 |
| 各 biz | 本域或他域 `Api**Service` | Controller / Service | 僅依賴 `*-api`，不依賴他域 `-biz` |

**演進**：拆分為獨立服務時，上表「同步 Api」行應改為 Feign/gRPC 或改為 Saga + MQ；MQ 表中的契約可保持不變。

### 三、模塊內 SPI（非跨模塊）

| 機制 | 定義位置 | 路由方式 | 示例 |
|------|----------|----------|------|
| `Spi**Service` | `*-biz/service` | 註冊表或 `List<實現>` | 短信、文件、支付渠道、二要素渠道 |

## 新增跨模塊 MQ 能力檢查清單

1. 調用方是否需要 **立即返回結果**？是 → `Api**Service`；否 → MQ。
2. 是否為 **公共組件向依賴方異步通知**？是 → MQ **發佈-訂閲**；發佈方不得依賴具體訂閲方。
3. 是否 **多訂閲方廣播**？是 → MQ 單向 Pub/Sub；通用事件僅在 producer api 定義根契約，各訂閲方在自身 api 聲明 `@MqSubscribe` 子接口。
4. 是否 **一問一答**？是 → `@MqChannel(mode=REQUEST_REPLY)` + `MqRequestReplyClient`（少數讀查詢場景）。
5. 消費者是否 **冪等**？必須聲明冪等鍵（表唯一鍵 / 狀態比對 / 業務編碼查重）。
6. `*-biz/pom.xml` 是否 **只新增 `-api` 依賴**？
7. 消費者 biz 是否 **`@Component implements XxxConsumer.{Slot}`**（勿直接實現根接口）？

## MQ 運維基線

詳見 [application-messaging-baseline.yml](spring-boot-starter-module/spring-boot-starter-common/src/main/resources/application-messaging-baseline.yml) 與 [common/README.md](spring-boot-starter-module/spring-boot-starter-common/README.md)。

- **重試**：默認 `max-attempts: 3`，指數退避。
- **DLQ**：消費失敗後進入 `DLQ.{destination}.{group}`，交換機 `DLX`。
- **監控**：生產環境對 `DLQ.*` 隊列深度告警；日誌關鍵字 `婚戀履約失敗`、`推廣人角色查詢失敗` 等需接入日誌平台。
- **嵌入式 Rabbit**：僅開發環境（`tg.messaging.embedded-rabbit.enabled=true`）；生產關閉並配置真實 broker。