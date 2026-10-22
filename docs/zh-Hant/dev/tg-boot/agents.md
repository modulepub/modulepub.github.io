---
title: TG-boot AI 編碼規範
createTime: 2026/06/02
permalink: /zh-Hant/dev/tg-boot/agents/
---
# TG-boot AI 編碼規範（必讀）

> 面向 Cursor / Copilot 等 AI 助手。**生成或修改本倉庫 Java / Vue 代碼前，請先閲讀本文**；詳細背景見 [TG-boot 總覽](/zh-Hant/dev/tg-boot/)，跨模塊規則見 [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/)。

---

## 1. 閲讀順序

1. 本文（硬性約定 + 正反例）
2. [TG-boot 總覽](/zh-Hant/dev/tg-boot/)（架構、字典/狀態機、模塊樹）
3. 目標子模塊 `README.md`（如 `spring-boot-starter-sms/README.md`）
4. 同域**已有** `crud/entity`、`biz/controller` 作為模板（優先 `Customer`、`SysUser`、`DtMatchmaker`）

---

## 2. 持久層實體（`crud/entity`）— 最高頻錯誤

### 2.1 必須繼承 `BaseEntity`

```java
// ✅ 正確
@Data
@EqualsAndHashCode(callSuper = false)
@Schema(description = "客户")
public class Customer extends BaseEntity {
    private String cusCode;  // 業務編碼，不是 @TableId
    // 僅寫本表業務字段
}

// ❌ 禁止：手寫 createTime/updateBy/deleted 且 implements Serializable 不繼承 BaseEntity
public class SmsSendLog implements Serializable {
    @TableId(value = "sms_send_log_code", type = IdType.ASSIGN_ID)
    private String smsSendLogCode;
    private String createBy;
    private LocalDateTime createTime;
    // ...
}
```

`BaseEntity`（`pub.module.common.model.po.BaseEntity`）已包含：

| 字段 | 説明 |
|------|------|
| `id` | **MyBatis-Plus 主鍵**（`@TableId(type = IdType.ASSIGN_ID)`），映射列 `id` |
| `createBy` / `createTime` / `updateBy` / `updateTime` | 審計字段 |
| `orgCode` / `version` / `seqNo` | 組織、版本、序號 |
| `deleted` | 邏輯刪除（`@TableLogic`） |

### 2.2 雙主鍵模型（技術主鍵 + 業務主鍵）

| 層級 | 字段 | 註解 | 説明 |
|------|------|------|------|
| 技術主鍵 | `id` | 在 `BaseEntity`，**不要**在子類重複 `@TableId` | 表 `PRIMARY KEY (id)` |
| 業務主鍵 | `xxxCode`（如 `userCode`、`smsTemplateCode`） | **無** `@TableId` | 表列 `xxx_code`，對外關聯、展示用語義編碼 |

- 表 DDL 中同時有 `id` 與 `sms_template_code` 時：MP 只認 `id` 為 PK；`sms_template_code` 是普通業務列。
- **禁止**把 `sms_template_code` 標成 `@TableId`，否則 `id` 列長期為空、與全庫約定不一致。

### 2.3 Service 層配套（`crud/service/impl`）

參考 `SysUserServiceImpl` / `DtMatchmakerServiceImpl`：

- `getByCode(String code)`：按業務編碼查詢（列名用 `StrUtil.toUnderlineCase("xxxCode")`）。
- `save`：若業務編碼允許為空則 `IdUtil.getSnowflakeNextIdStr()` 自動生成；若用户必填（如 `loginSms`）則校驗唯一。
- `updateById`：先 `getByCode` 取已有行，把 `entity.setId(existing.getId())` 再 `updateById`。
- 管理端按**業務編碼**刪除：提供 `removeByBizCodes(Collection<String>)`，**不要**對 `xxxCode` 調 `removeByIds`（那是刪 `id`）。

### 2.4 參考實體（複製前先打開看）

- `pub.module.customer.crud.entity.Customer`
- `pub.module.system.crud.entity.SysUser`
- `pub.module.dating.crud.entity.DtMatchmaker`
- `pub.module.sms.crud.entity.SmsTemplate`（短信模塊已對齊）

---

## 3. 模塊與包結構（`*-api` / `*-biz`）

```text
*-api/                     # 對外契約，被其他模塊依賴
├── api/constants/         # XxxCodeEnum
├── api/dto/               # DTO / VO（跨模塊傳輸）
├── api/service/           # Api**Service 接口
└── api/messaging/         # MQ 契約

*-biz/                     # 實現層，僅 runner 聚合
├── biz/
│   ├── controller/{cus|mgt|pub}/
│   ├── service/
│   │   ├── impl/          # Api**Service 實現、SPI 實現
│   │   └── Spi**Service   # 僅模塊內多實現（短信渠道、支付等）
├── crud/
│   ├── entity/            # 必須 extends BaseEntity
│   ├── mapper/
│   └── service/impl/      # MyBatis-Plus Service，可含 getByCode
└── Biz*AutoConfiguration.java
```

### 3.1 `*-api` 禁止依賴 `*-biz`（最高頻架構錯誤）

**Maven 與 Java 包兩層約束：**

| 層級 | 規則 |
|------|------|
| **Maven** | `*-api` 的 `pom.xml` **只能**依賴 `common` 或他域 `*-api`；**禁止**依賴同域或他域 `*-biz` |
| **Java 包** | `*-api` 內 **禁止** `import` 任意 `crud.entity`、`crud.mapper`、`crud.service`、`biz.service.impl`（含本模塊 `*-biz` 包） |

**`Api**Service` 接口約定：**

- 入參 / 返回值 **必須**使用 `*-api` 內的 `*DTO` / `*VO` / `*CodeEnum`
- **禁止**在 `Api**Service` 中直接引用 `crud.entity.*` 作為參數或返回類型

```java
// ❌ 禁止：api 模塊 import biz/crud 實體
package pub.module.verification.api.service;
import pub.module.verification.crud.entity.VtAssetCertRecord;

public interface ApiVtAssetCertService {
    VtAssetCertRecord submitApply(...);  // 編譯/架構均錯誤
}

// ✅ 正確：api 模塊只用 api/dto
package pub.module.verification.api.service;
import pub.module.verification.api.dto.VtAssetCertRecordDTO;

public interface ApiVtAssetCertService {
    VtAssetCertRecordDTO submitApply(...);
}
```

**`*-biz` 實現層：**

- `Api**ServiceImpl` 內部可使用 `crud.entity`，在邊界處 `BeanUtil.copyProperties` 轉為 DTO 再返回
- `biz/controller` 管理端列表可直接返回 entity（同模塊 HTTP 層）；用户端 / 跨模塊調用走 `Api**Service` + DTO
- **跨模塊**：只依賴他域 `*-api` 的 `Api**Service`、DTO；禁止 `*-biz` 依賴其他域 `*-biz`，禁止 import 他域 `crud.*`
- **模塊內多實現**：`Spi**Service` + 註冊表路由（如 `SmsProviderRegistry`）

參考：`SysUserCancellationApplyDTO` + `ApiSysUserCancellationService`（system-api 不引用 system-biz 實體）。

---

## 4. 命名與字典（摘要）

- **目錄式命名**：**表前綴 + 字段名**（如 `smsTemplateCode`、`cusName`、`distUserCode`），避免裸 `code`。
- **省略系統層**：目錄式命名只寫到**當前表前綴 + 業務字段**即可，**不要**把模塊/實體類名（如 `SysUser`、`Sys`）再疊進字段名。關聯用户時存的是 `userCode`，字段應命名為 `xxxUserCode`（如 `distUserCode`、`distPayerUserCode`），**禁止** `xxxSysUserCode`。
- **歷史遺留**：`trade` 模塊中 `tdOdSysUserCode` 等為舊寫法，**新代碼勿模仿**；以 `Customer`、`SysUser` 實體及 `distribution` 域內 `dist*UserCode` 為準。
- **字典/枚舉字段**：以 `Code` 結尾；枚舉放 `*-api/constants`，類名 `XxxCodeEnum`。
- **`*StatusCode`**：僅 0/1（否/是），`null` 視同否；**禁止**放「審核中」等流程態。
- **`*ProcessCode`**：多步流程（0 待提交、1 審核中…）；終態通過時同步對應 `*StatusCode = 1`。
- **已廢棄**：通用字典表 / `spring-boot-starter-dict`；勿新增字典 HTTP 依賴。

---

## 5. 管理端 Vue（`tg-vue`）

- 列表刪除：優先傳 **`row.id`**（技術主鍵）；若接口約定按業務編碼刪，後端用 `removeByBizCodes`，前端 `primaryKey` 可為 `xxxCode`。
- `useCrud` 默認 `primaryKey: 'id'`；與 Customer 模塊保持一致。
- 接口路徑：`/mgt/{域}/{資源}/list|add|edit|delete`。

---

## 6. 新增表 / 新模塊檢查清單

生成代碼後自檢：

- [ ] 已執行過的 `create_*.sql` / 首版 `alter_*.sql` **勿再改內容**；新增字段另寫 `alter_*.sql` 增量腳本
- [ ] `Api**Service` 接口的入參/返回值均為 `*-api/dto` 或枚舉，**無** `crud.entity` 引用
- [ ] `*-api/pom.xml` 未依賴任何 `*-biz`
- [ ] `crud/entity/*` 全部 `extends BaseEntity`，無重複審計字段
- [ ] 無 `@TableId` 標在 `xxxCode` 上
- [ ] `ServiceImpl` 含 `getByCode`（或説明僅用 `id` 的純日誌表）
- [ ] `Api**` / Controller 按業務編碼查詢時用 `getByCode`，不是 `getById(業務編碼)`
- [ ] 枚舉與 `*StatusCode` / `*ProcessCode` 符合 README 約定
- [ ] 未在 `*-biz` 直接依賴其他域 `*-biz`
- [ ] 子模塊 README 已補充對外 API 説明（若新增組件）
- [ ] 跨模塊寫庫後發 MQ 使用 `MqPublisher.publishAfterCommit`（或 `TransactionAfterCommit.runAfterCommit`）
- [ ] 新增業務域後已在 `spring-boot-starter-architecture-tests/pom.xml` 補充 `*-api` 與 `*-biz` 依賴

### 6.1 跨模塊 MQ 發佈（硬性）

- **須**在事務提交後投遞：`mqPublisher.publishAfterCommit(consumerClass, payload)`。
- 工具類：`pub.module.common.messaging.TransactionAfterCommit`（非 MQ 副作用同理）。
- **禁止**在 `@Transactional` 寫庫方法內直接 `mqPublisher.publish`（無事務的只讀/回調場景除外）。

---

## 7. 為何會出現「未繼承 BaseEntity」的代碼？

常見原因（短信模塊 `SmsSendLog` / `SmsTemplate` / `SmsTencentConfig` 即屬此類）：

1. **未加載規範**：會話未引用 `README.md` / `AGENTS.md`，模型按通用 MyBatis 樣板生成「單 @TableId 實體」。
2. **子模塊 README 過簡**：`spring-boot-starter-sms/README.md` 僅描述 SPI，**未寫明實體必須繼承 BaseEntity**（已在本次補充引用本文）。
3. **歷史反例干擾**：倉庫內仍有少量舊代碼（如 `DistRule`、`NpConfig`）未繼承 `BaseEntity`，AI 可能誤學；**以 Customer / SysUser 為準**。
4. **v3.6 移除代碼生成器**：README 寫明改由 AI 手寫，若缺少本文檔級檢查清單，易漏掉 `BaseEntity`。

---

## 8. 認證與會話（common）

- 短時 KV：`pub.module.common.cache.TgEphemeralCache`（單區域 `tgEphemeral`，業務用 `namespace::key`，禁止自建 `sysVerification` 等區域名）。
- 登錄會話：`AuthSessionStore`（`auth:session`）；登錄寫 `AuthSessionSnapshot`（含權限列表），`TgJwtAuthenticationFilter` **只讀緩存、不查庫**。
- 權限變更後需用户重新登錄或調用登出踢會話。
- Security / JWT / Actuator Basic 在 `spring-boot-starter-common` 的 `pub.module.common.security.*`。

---

## 9. 相關文件路徑

| 用途 | 路徑 |
|------|------|
| 基礎實體 | `spring-boot-starter-common/.../BaseEntity.java` |
| 架構與 MQ | `CROSS_MODULE_COLLABORATION.md` |
| 架構測試 | `mvn -pl spring-boot-starter-architecture-tests -am test`（含 BaseEntity / Api 契約 / 模塊邊界） |
| MQ 提交後發佈 | `common/.../MqPublisher.publishAfterCommit` |
| CI | `.github/workflows/backend-ci.yml` |
| 運維 / Actuator | [運維説明](/zh-Hant/dev/tg-boot/ops/)（生產禁止公網暴露 `/actuator/**`） |
| 管理端前端 | `tg-vue/` |

*文檔版本隨倉庫演進；與 `README.md` 衝突時以實際 `pom` 與參考實體為準。*