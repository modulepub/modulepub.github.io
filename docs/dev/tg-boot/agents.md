---
title: TG-boot AI 编码规范
createTime: 2026/06/02
permalink: /dev/tg-boot/agents/
---
# TG-boot AI 编码规范（必读）

> 面向 Cursor / Copilot 等 AI 助手。**生成或修改本仓库 Java / Vue 代码前，请先阅读本文**；详细背景见 [TG-boot 总览](/dev/tg-boot/)，跨模块规则见 [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/)。

---

## 1. 阅读顺序

1. 本文（硬性约定 + 正反例）
2. [TG-boot 总览](/dev/tg-boot/)（架构、字典/状态机、模块树）
3. 目标子模块 `README.md`（如 `spring-boot-starter-sms/README.md`）
4. 同域**已有** `crud/entity`、`biz/controller` 作为模板（优先 `Customer`、`SysUser`、`DtMatchmaker`）

---

## 2. 持久层实体（`crud/entity`）— 最高频错误

### 2.1 必须继承 `BaseEntity`

```java
// ✅ 正确
@Data
@EqualsAndHashCode(callSuper = false)
@Schema(description = "客户")
public class Customer extends BaseEntity {
    private String cusCode;  // 业务编码，不是 @TableId
    // 仅写本表业务字段
}

// ❌ 禁止：手写 createTime/updateBy/deleted 且 implements Serializable 不继承 BaseEntity
public class SmsSendLog implements Serializable {
    @TableId(value = "sms_send_log_code", type = IdType.ASSIGN_ID)
    private String smsSendLogCode;
    private String createBy;
    private LocalDateTime createTime;
    // ...
}
```

`BaseEntity`（`pub.module.common.model.po.BaseEntity`）已包含：

| 字段 | 说明 |
|------|------|
| `id` | **MyBatis-Plus 主键**（`@TableId(type = IdType.ASSIGN_ID)`），映射列 `id` |
| `createBy` / `createTime` / `updateBy` / `updateTime` | 审计字段 |
| `orgCode` / `version` / `seqNo` | 组织、版本、序号 |
| `deleted` | 逻辑删除（`@TableLogic`） |

### 2.2 双主键模型（技术主键 + 业务主键）

| 层级 | 字段 | 注解 | 说明 |
|------|------|------|------|
| 技术主键 | `id` | 在 `BaseEntity`，**不要**在子类重复 `@TableId` | 表 `PRIMARY KEY (id)` |
| 业务主键 | `xxxCode`（如 `userCode`、`smsTemplateCode`） | **无** `@TableId` | 表列 `xxx_code`，对外关联、展示用语义编码 |

- 表 DDL 中同时有 `id` 与 `sms_template_code` 时：MP 只认 `id` 为 PK；`sms_template_code` 是普通业务列。
- **禁止**把 `sms_template_code` 标成 `@TableId`，否则 `id` 列长期为空、与全库约定不一致。

### 2.3 Service 层配套（`crud/service/impl`）

参考 `SysUserServiceImpl` / `DtMatchmakerServiceImpl`：

- `getByCode(String code)`：按业务编码查询（列名用 `StrUtil.toUnderlineCase("xxxCode")`）。
- `save`：若业务编码允许为空则 `IdUtil.getSnowflakeNextIdStr()` 自动生成；若用户必填（如 `loginSms`）则校验唯一。
- `updateById`：先 `getByCode` 取已有行，把 `entity.setId(existing.getId())` 再 `updateById`。
- 管理端按**业务编码**删除：提供 `removeByBizCodes(Collection<String>)`，**不要**对 `xxxCode` 调 `removeByIds`（那是删 `id`）。

### 2.4 参考实体（复制前先打开看）

- `pub.module.customer.crud.entity.Customer`
- `pub.module.system.crud.entity.SysUser`
- `pub.module.dating.crud.entity.DtMatchmaker`
- `pub.module.sms.crud.entity.SmsTemplate`（短信模块已对齐）

---

## 3. 模块与包结构（`*-api` / `*-biz`）

```text
*-api/                     # 对外契约，被其他模块依赖
├── api/constants/         # XxxCodeEnum
├── api/dto/               # DTO / VO（跨模块传输）
├── api/service/           # Api**Service 接口
└── api/messaging/         # MQ 契约

*-biz/                     # 实现层，仅 runner 聚合
├── biz/
│   ├── controller/{cus|mgt|pub}/
│   ├── service/
│   │   ├── impl/          # Api**Service 实现、SPI 实现
│   │   └── Spi**Service   # 仅模块内多实现（短信渠道、支付等）
├── crud/
│   ├── entity/            # 必须 extends BaseEntity
│   ├── mapper/
│   └── service/impl/      # MyBatis-Plus Service，可含 getByCode
└── Biz*AutoConfiguration.java
```

### 3.1 `*-api` 禁止依赖 `*-biz`（最高频架构错误）

**Maven 与 Java 包两层约束：**

| 层级 | 规则 |
|------|------|
| **Maven** | `*-api` 的 `pom.xml` **只能**依赖 `common` 或他域 `*-api`；**禁止**依赖同域或他域 `*-biz` |
| **Java 包** | `*-api` 内 **禁止** `import` 任意 `crud.entity`、`crud.mapper`、`crud.service`、`biz.service.impl`（含本模块 `*-biz` 包） |

**`Api**Service` 接口约定：**

- 入参 / 返回值 **必须**使用 `*-api` 内的 `*DTO` / `*VO` / `*CodeEnum`
- **禁止**在 `Api**Service` 中直接引用 `crud.entity.*` 作为参数或返回类型

```java
// ❌ 禁止：api 模块 import biz/crud 实体
package pub.module.verification.api.service;
import pub.module.verification.crud.entity.VtAssetCertRecord;

public interface ApiVtAssetCertService {
    VtAssetCertRecord submitApply(...);  // 编译/架构均错误
}

// ✅ 正确：api 模块只用 api/dto
package pub.module.verification.api.service;
import pub.module.verification.api.dto.VtAssetCertRecordDTO;

public interface ApiVtAssetCertService {
    VtAssetCertRecordDTO submitApply(...);
}
```

**`*-biz` 实现层：**

- `Api**ServiceImpl` 内部可使用 `crud.entity`，在边界处 `BeanUtil.copyProperties` 转为 DTO 再返回
- `biz/controller` 管理端列表可直接返回 entity（同模块 HTTP 层）；用户端 / 跨模块调用走 `Api**Service` + DTO
- **跨模块**：只依赖他域 `*-api` 的 `Api**Service`、DTO；禁止 `*-biz` 依赖其他域 `*-biz`，禁止 import 他域 `crud.*`
- **模块内多实现**：`Spi**Service` + 注册表路由（如 `SmsProviderRegistry`）

参考：`SysUserCancellationApplyDTO` + `ApiSysUserCancellationService`（system-api 不引用 system-biz 实体）。

---

## 4. 命名与字典（摘要）

- **目录式命名**：**表前缀 + 字段名**（如 `smsTemplateCode`、`cusName`、`distUserCode`），避免裸 `code`。
- **省略系统层**：目录式命名只写到**当前表前缀 + 业务字段**即可，**不要**把模块/实体类名（如 `SysUser`、`Sys`）再叠进字段名。关联用户时存的是 `userCode`，字段应命名为 `xxxUserCode`（如 `distUserCode`、`distPayerUserCode`），**禁止** `xxxSysUserCode`。
- **历史遗留**：`trade` 模块中 `tdOdSysUserCode` 等为旧写法，**新代码勿模仿**；以 `Customer`、`SysUser` 实体及 `distribution` 域内 `dist*UserCode` 为准。
- **字典/枚举字段**：以 `Code` 结尾；枚举放 `*-api/constants`，类名 `XxxCodeEnum`。
- **`*StatusCode`**：仅 0/1（否/是），`null` 视同否；**禁止**放「审核中」等流程态。
- **`*ProcessCode`**：多步流程（0 待提交、1 审核中…）；终态通过时同步对应 `*StatusCode = 1`。
- **已废弃**：通用字典表 / `spring-boot-starter-dict`；勿新增字典 HTTP 依赖。

---

## 5. 管理端 Vue（`tg-vue`）

- 列表删除：优先传 **`row.id`**（技术主键）；若接口约定按业务编码删，后端用 `removeByBizCodes`，前端 `primaryKey` 可为 `xxxCode`。
- `useCrud` 默认 `primaryKey: 'id'`；与 Customer 模块保持一致。
- 接口路径：`/mgt/{域}/{资源}/list|add|edit|delete`。

---

## 6. 新增表 / 新模块检查清单

生成代码后自检：

- [ ] 已执行过的 `create_*.sql` / 首版 `alter_*.sql` **勿再改内容**；新增字段另写 `alter_*.sql` 增量脚本
- [ ] `Api**Service` 接口的入参/返回值均为 `*-api/dto` 或枚举，**无** `crud.entity` 引用
- [ ] `*-api/pom.xml` 未依赖任何 `*-biz`
- [ ] `crud/entity/*` 全部 `extends BaseEntity`，无重复审计字段
- [ ] 无 `@TableId` 标在 `xxxCode` 上
- [ ] `ServiceImpl` 含 `getByCode`（或说明仅用 `id` 的纯日志表）
- [ ] `Api**` / Controller 按业务编码查询时用 `getByCode`，不是 `getById(业务编码)`
- [ ] 枚举与 `*StatusCode` / `*ProcessCode` 符合 README 约定
- [ ] 未在 `*-biz` 直接依赖其他域 `*-biz`
- [ ] 子模块 README 已补充对外 API 说明（若新增组件）
- [ ] 跨模块写库后发 MQ 使用 `MqPublisher.publishAfterCommit`（或 `TransactionAfterCommit.runAfterCommit`）
- [ ] 新增业务域后已在 `spring-boot-starter-architecture-tests/pom.xml` 补充 `*-api` 与 `*-biz` 依赖

### 6.1 跨模块 MQ 发布（硬性）

- **须**在事务提交后投递：`mqPublisher.publishAfterCommit(consumerClass, payload)`。
- 工具类：`pub.module.common.messaging.TransactionAfterCommit`（非 MQ 副作用同理）。
- **禁止**在 `@Transactional` 写库方法内直接 `mqPublisher.publish`（无事务的只读/回调场景除外）。

---

## 7. 为何会出现「未继承 BaseEntity」的代码？

常见原因（短信模块 `SmsSendLog` / `SmsTemplate` / `SmsTencentConfig` 即属此类）：

1. **未加载规范**：会话未引用 `README.md` / `AGENTS.md`，模型按通用 MyBatis 样板生成「单 @TableId 实体」。
2. **子模块 README 过简**：`spring-boot-starter-sms/README.md` 仅描述 SPI，**未写明实体必须继承 BaseEntity**（已在本次补充引用本文）。
3. **历史反例干扰**：仓库内仍有少量旧代码（如 `DistRule`、`NpConfig`）未继承 `BaseEntity`，AI 可能误学；**以 Customer / SysUser 为准**。
4. **v3.6 移除代码生成器**：README 写明改由 AI 手写，若缺少本文档级检查清单，易漏掉 `BaseEntity`。

---

## 8. 认证与会话（common）

- 短时 KV：`pub.module.common.cache.TgEphemeralCache`（单区域 `tgEphemeral`，业务用 `namespace::key`，禁止自建 `sysVerification` 等区域名）。
- 登录会话：`AuthSessionStore`（`auth:session`）；登录写 `AuthSessionSnapshot`（含权限列表），`TgJwtAuthenticationFilter` **只读缓存、不查库**。
- 权限变更后需用户重新登录或调用登出踢会话。
- Security / JWT / Actuator Basic 在 `spring-boot-starter-common` 的 `pub.module.common.security.*`。

---

## 9. 相关文件路径

| 用途 | 路径 |
|------|------|
| 基础实体 | `spring-boot-starter-common/.../BaseEntity.java` |
| 架构与 MQ | `CROSS_MODULE_COLLABORATION.md` |
| 架构测试 | `mvn -pl spring-boot-starter-architecture-tests -am test`（含 BaseEntity / Api 契约 / 模块边界） |
| MQ 提交后发布 | `common/.../MqPublisher.publishAfterCommit` |
| CI | `.github/workflows/backend-ci.yml` |
| 运维 / Actuator | [运维说明](/dev/tg-boot/ops/)（生产禁止公网暴露 `/actuator/**`） |
| 管理端前端 | `tg-vue/` |

*文档版本随仓库演进；与 `README.md` 冲突时以实际 `pom` 与参考实体为准。*