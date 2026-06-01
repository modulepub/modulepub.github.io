---
title: TG-boot 总览
createTime: 2026/01/12 20:05:26
permalink: /dev/tg-boot/
---
# TG-boot | 模块化单体架构开发平台（AI 协作友好）

本文档面向 **AI 助手与开发者**：说明仓库分层、`runner`、`*-biz`、`*-api` 的职责边界，以及命名与模块间通信约束。

**AI 生成代码前请先读**：[AI 编码规范](/dev/tg-boot/agents/)（实体 `BaseEntity`、双主键、`getByCode` 等硬性约定与检查清单）。

**部署与生产运维**：[运维说明](/dev/tg-boot/ops/)（含 **Actuator 禁止对公网暴露**、MQ、架构测试门禁）。

## 本站模块化文档索引

与 `tg-boot` 仓库目录对应的在线说明（简体中文 / English）：

| 分区 | 说明 |
|------|------|
| [AI 编码规范](/dev/tg-boot/agents/) | 实体、命名、跨模块硬性约定（生成代码前必读） |
| [运维说明](/dev/tg-boot/ops/) | Actuator 安全、MQ、上线自查 |
| [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/) | MQ 与同步 `Api**Service` 选用规则 |
| [架构测试门禁](/dev/tg-boot/architecture-tests/) | ArchUnit 模块边界守护 |
| [树-图架构](/dev/tg-boot/tree-graph-architecture/) | 树形定边界、图形定关系 |
| [starter-module](/dev/tg-boot/starter-module/) | Maven 聚合根 |
| [runner](/dev/tg-boot/runner/) | 默认单体启动器 |
| [plugins](/dev/tg-boot/plugins/) | 运行时外置插件目录 |
| [components](/dev/tg-boot/components/) | 通用 Starter |
| [business](/dev/tg-boot/business/) | 垂直业务域 |
| [tg-manage-vue](/dev/tg-boot/frontend-tg-manage-vue/) | 管理端前端 |

英文版入口：[TG-boot Documentation](/en/dev/tg-boot/)。


许久以来，希望把这些年踩坑积累的实践经验与借鉴到的成熟理念，沉淀成一套可复用的开发框架；目前已具雏形，欢迎同行批评指正并参与贡献。

#### **TG** 基于 **Spring Boot**，以 Maven 多模块划分 **common / components / business / runner**；默认将多个 `*-biz` 打进同一个 `spring-boot-starter-runner` 进程。

- **模块之间**只通过 `*-api` 中的接口与 **MQ 消息契约**通信。
- **模块内部**在 `*-biz/service` 用 **SPI** 表达多实现（支付渠道、短信、存储等），由注册表路由。
- 整体风格对齐 **Spring Boot Starter**：能力以 Starter 引入，约定优于配置。

# 技术栈

- 后台框架：Spring Boot 3.5.5、Spring Security
- 前台框架：Vue 3、Element Plus、Vite（配套管理端见独立工程 `tg-manage-vue`，可与本后端仓库协同迭代）
- 多数据库支持：MySQL、PostgreSQL、Oracle、SQL Server、达梦、人大金仓等
- 组件与业务（随仓库演进，以 `spring-boot-starter-module` 下各 `pom` 为准）：系统、客户、交友（dating）、交易、文件、IM、OCR、短信、微信、CMS、Excel、定时任务、核验（verification）等
- 特别鸣谢：Hutool 作者提供的工具类库；WxJava（weixin-java-tools）作者提供的微信开发工具类库。

# 内置运行环境（`tg-boot/.tools`）

本仓库 **`tg-boot` 目录下** 提供自带的 JDK 与 Maven（目录名为 **`.tools`**，注意是复数 **`s`**，不是 `.tool`），免去本机全局安装与 `PATH` 冲突：

| 组件 | 典型路径 |
|------|----------|
| JDK 21 | `tg-boot/.tools/jdk-21` |
| Apache Maven（版本以目录为准，如 `3.9.9`） | `tg-boot/.tools/apache-maven-*/bin` |

**一键启动默认单体 runner**（先确保 MySQL / Redis 等已与 `application-dev.yml` 等配置一致）：

- **PowerShell**（需在 `tg-boot` 根目录执行）：

```powershell
.\scripts\run-runner.ps1
```

- **CMD**：在 `tg-boot` 目录下双击或执行：

```bat
scripts\run-runner.bat
```

若已自行安装全局 JDK/Maven，也可在 **`tg-boot/spring-boot-starter-module`**（反应堆根）下执行：

```bat
mvn -pl spring-boot-starter-runner -am spring-boot:run -DskipTests
```

说明：**必须在** `spring-boot-starter-module` 目录执行且保留 **`-am`**，这样在本地反应堆中解析 `${revision}` 与各 sibling；若只在 `runner` 子目录跑或省略 `-am`，易误从中央仓库拉取未展开的 `pub.module` 占位符而失败。

# 框架特点

- 启动速度快，约 5.44 秒完成冷启动（视环境与机器配置而定）。
- 注重遵循 Spring Boot 的设计思想与扩展习惯。
- 用户端、角色、部门三者绑定：适配借调、兼任多部门等场景；切换部门时同步切换角色，降低越权风险。
- 支持 Excel 模板导入导出：模板侧可使用表格样式与常用函数；业务模块只负责提供数据，由 Excel 能力模块按模板渲染，二者解耦。
- 字典类字段以 `*Code` 约定由前端按规范拉取与展示；**`*StatusCode` 仅表示是否（0/1，null 视同否）**，多步流程中间态使用 **`*ProcessCode`**；后端侧重存编码、判逻辑，减少逐字段翻译带来的前后端耦合，轻量的字典使用枚举类实现。
- 支持分片上传与单文件上传；存储支持本地、MinIO、阿里云 OSS 等，并可通过 SPI 扩展更多实现。

# 架构与代码约定
以下先导图及约定，面向AI及人类开发者。
## 模块结构先导图
```text
*-biz （业务子模块）
├── biz
│   ├── controller
    │   ├── cus 用户端接口
    │   ├── mgt 管理端接口
    │   ├── pub 公开接口
│   ├── service
    │   ├── impl （模块内 SPI 多实现）
    │   ├── Spi**Service （模块内多实现 SPI，仅定义在 biz/service）
├── crud（目录名为 crud，即持久层框架相关增删改查方法）
    │   ├── mapper 
    │   ├── entity 
    │   ├── service（区别于biz的service，这里是mybatis-plus增删改查服务实现类）
└── Biz*AutoConfiguration.java（本模块自动配置入口）

*-api （接口子模块，可对外暴露业务接口及消息契约）
└── api
    ├── service
        │   ├── Api**Service （跨模块业务接口）
    ├── messaging （跨模块 MQ 契约）
    ├── constants （枚举类，应用于字典及其他常量,遵循字段名称+Enum后缀命名规范）

下图自上而下依次为：**Maven 模块树**（仓库真实聚合关系）、**前端配套工程**、**单个 `*-biz` / `*-api` 源码包布局**（以 `system` 为例，其它域包名随模块前缀变化）。紧随图后的 **Runner** 小节说明默认可执行包如何选型。
```
## 系统现有功能模块先导图
```text
tg-boot
└── spring-boot-starter-module
    ├── spring-boot-starter-common（通用基础库，jar）
    ├── spring-boot-starter-components（能力组件）
    │   ├── spring-boot-starter-file（文件上传能力）
    │   ├── spring-boot-starter-cms（CMS系统）
    │   ├── spring-boot-starter-im（即时通讯能力）
    │   ├── spring-boot-starter-ocr（OCR识别能力）
    │   ├── spring-boot-starter-trade（交易系统）
    │   ├── spring-boot-starter-wechat（微信公众平台能力）
    │   ├── spring-boot-starter-sms（短信发送能力）
    │   ├── spring-boot-starter-excel（EXCEL导入导出能力）
    │   ├── spring-boot-starter-system（用户体系系统*核心）
    │   ├── spring-boot-starter-job
    │   └── spring-boot-starter-verification（实名等认证能力）
    ├── spring-boot-starter-business（垂直业务域）
    │   ├── spring-boot-starter-dating（交友系统）
    │   │   ├── spring-boot-starter-dating-api（业务定义）
    │   │   └── spring-boot-starter-dating-biz（业务实现 + MQ 消费端）
    │   └── spring-boot-starter-customer（客户系统）
    │       ├── spring-boot-starter-customer-api（业务定义）
    │       └── spring-boot-starter-customer-biz（业务实现 + MQ 消费/发布）
    └── spring-boot-starter-runner（可执行单体：pom 中按需引入 *-biz）

前端（示例）
└── tg-vue（管理端：Vue 3 + Element Plus + Vite）
└── tg-matchmaker-h5（团队简称 **h5项目**：uni-app 多端壳，基于 unibest，已接后端；H5 为 history 路由非 hash；https://unibest.tech/）

```

**Runner**：实际打进哪些 `*-biz` 以 [`spring-boot-starter-runner/pom.xml`](spring-boot-starter-module/spring-boot-starter-runner/pom.xml) 为准；增删能力一般只改此处，不必调整上层模块树。

**配置与协作习惯**：能力以 Starter 引入，路径为「加依赖 → `application` → 写业务」；DB / Redis / 缓存等通过各 Starter 与配置文件（及少量 `@Configuration`）接入，**避免在业务模块里堆厂商方言或重复中间层**。分库分表在对应 Starter 的配置类里声明数据源；模块化单体不足时再拆 runner，由路由 / 网关分流。

### 架构理念简述

- **微服务化**：能力按边界独立部署、独立伸缩，协作依赖明确的远程契约（HTTP/RPC 等）。本框架通过「模块间只走 API 层」预先固化契约，拆分服务时主要是部署与调用方式变化，而不是重写业务粘连代码。
- **模块化单体（本仓库默认形态）**：**将多个 `*-biz` 业务模块一并集成进同一个 `spring-boot-starter-runner` 启动器**，同进程启动，即为模块化单体——源码仍按 Maven 模块切分，运行时却是一个 JVM、一套部署单元，兼顾协作边界与运维简单性。演进为微服务时，既可把**负载高的模块单独打进各自的 runner** 独立扩容，也可继续**整包 runner 部署**；无论物理上是多套 runner 还是一包到底，**对外统一依赖网关/路由策略将流量分发到对应实例，实现分而治之**。
- **跨模块协作**：**异步副作用走 MQ**（契约在 `*-api/messaging`）；**同进程强一致编排**可注入 `Api**Service`（详见 [跨模块协作规范](CROSS_MODULE_COLLABORATION.md)）。
- **模块内多实现**：在 `*-biz/service` 定义 SPI 接口，由注册表或 Spring 注入 `List<实现>` 路由（支付渠道、短信、存储等）。

### 跨模块消息（MQ）一览

开发 / 运维默认使用嵌入式 Rabbit（`tg.messaging.embedded-rabbit.enabled=true`，见 `common` 的 `EmbeddedRabbitAutoConfiguration`）；生产环境关闭 mock、接入真实 RabbitMQ 即可。

| Destination | 模式 | 消息类型 | 发布方 | 消费方（group） | 说明 |
|-------------|------|----------|--------|-----------------|------|
| `trade.order-goods.paid` | 单向 | `TdOrderGoodsDTO` | trade-biz | `dating` / `distribution` | 订单商品支付成功后履约 / 分佣 |
| `customer.profile.updated` | 单向 | `CustomerProfileUpdatedMessage` | customer-biz | 各订阅域自定 group | 客户资料变更广播，订阅方在自身 api 声明槽位 |
| `system.user.login` | 单向 | `SysUserLoginMessage` | system-biz | `customer` | 登录成功后幂等初始化客户档案 |
| `system.user-info.updated` | 单向 | `SysUserInfoUpdatedMessage` | system-biz | `customer` | 用户昵称等变更，同步客户表 |
| `system.user.registered` | 单向 | `SysUserRegisteredMessage` | system-biz | `distribution` | 注册成功后绑定推荐关系 |
| `verification.phone-two-factor.verified` | 单向 | `PhoneTwoFactorVerifiedMessage` | verification-biz | `customer` | 二要素核验通过后更新客户实名 |
| `distribution.promoter-role.query` | request-reply | `DistPromoterRoleQueryMessage` → `DistPromoterRoleReplyMessage` | distribution-biz | `dating`（应答） | 分佣前查询推广人是否红娘 |

契约见各域 `*-api/messaging/XxxConsumer.java`（单文件定义生产+消费槽位）；**消费重试/DLQ 基线**见 common 的 `application-messaging-baseline.yml`；binding 由 `MqMessagingAutoConfiguration` 按契约自动注册。

### 模块内 SPI 与跨模块 API

- **跨模块异步**：MQ + `*-api/messaging`（见下表与 [跨模块协作规范](CROSS_MODULE_COLLABORATION.md)）。
- **跨模块同步**：同 runner 内可注入 `Api**Service` 做强一致编排；拆服务时改为 RPC 或 Saga。
- **模块内**：`Spi**Service` 在 `*-biz/service`；多实现用注册表路由。
- **架构守护**：`spring-boot-starter-architecture-tests`（禁止 api 定义 SPI、禁止 biz 依赖 biz）。

### 架构优势（摘要）

- **交付与演进兼顾**：默认多 biz 集成单 runner，启动快、协作成本低；需要时可按模块拆分多个 runner 或维持整包部署，配合路由策略分流，迁移路径清晰。
- **依赖可治理**：模块间依赖接口契约而非对方实现，降低循环依赖与隐性耦合。
- **扩展灵活**：模块内 SPI 支持多实现替换，符合开闭原则。
- **团队协作友好**：API（跨模块）、SPI（模块内）、MQ（异步协作）分层明确，职责边界与仓库结构一致。

### 架构优势（面向初学者）

若你不熟悉「模块化单体」等提法，只需记住三点：**（1）默认在一个 Java 进程（runner）里集成多个业务模块，运维简单；（2）模块之间像调用远程服务一样只认 `*-api` 契约与 MQ 消息，将来拆成多台机器也不会牵一大片；（3）负载或隔离要求高的域，可单独打成另一个 runner，由网关或路由把请求分到正确实例。** 这样既能先快速交付，又不必一上来就承担全套微服务的运维复杂度。

```text
业务表设计（示意）├── 系统根表（抽象公共字段）id, create_time, update_time, create_by, update_by, deleted, version, seq_no
├── 业务字段
│   ├── 表前缀 + 字段名（目录式命名）
│   └── 冗余字段（命名与来源一致；随外键冗余。常见：不常变更、归属其他模块、用于关联展示或提升查询效率）

设计思想：
- 系统字段：可视为来自一张虚拟或真实的「系统根表」，承载共性能力，如创建 / 更新时间、操作人、版本、排序、审计、数据权限、多租户隔离等。
- 业务字段：采用目录式命名便于保证唯一性、规范冗余与追踪，统一团队风格，降低沟通成本。
```

# 开发风格

## 命名规范

- 目录式命名范式是一种基于目录结构的命名规范：以上一层级名称为前缀，拼接下一层级名称，类似「姓 + 名」。看到名称即可联想其在结构中的层级关系。例如 A 下有 B、B 下有 C，则 B 可称 AB，C 可称 BC 或 ABC；层级过深时一般取末尾三级（如 BCD）。**不建议超过三级**，否则应审视设计是否过度嵌套。唯一性原则下通常至少两级。若某层为固定简写（如 IM），组合命名时应统一使用该简写。
- **本项目执行口径（省略系统层）**：业务表字段采用 **表前缀 + 字段名** 即可，前缀对应当前表（或该表约定简写），**不必**再把「系统模块 / 实体类名」叠进字段。例如 `dist_user_bill_summary` 关联用户编码 → Java `distUserCode`、列 `dist_user_code`；**不要**写成 `distSysUserCode`。跨表冗余字段与来源列保持同一字段名（如均为 `userCode` 语义，前缀随本表变化）。
- **唯一性原则**：口头沟通里我们常省略定语，但编码时不同对象一旦关联就极易撞名。因此字段、类名等应写全限定含义（如「用户学历编码」而非模糊的 `code`），从源头减少歧义与冲突；配合 Bean 拷贝等工具，映射仍然可以保持简洁。
- 命名示例：即时通讯英文全称为 Instant Messaging，模块简写为 `IM`；若频道表名为 `im_channel`，则业务主键等字段建议使用表前缀（如 `im_cl_code`），在可读性与避免冲突之间取得平衡（不同表前缀不得重复）。
- 系统内关联以**业务主键**为准。命名约定为「表前缀 + 字段含义 + Code」，例如用户表 `sys_user` 的业务主键为 `user_code`（Java `userCode`）；其他表引用该用户时用本表前缀 + `UserCode`，而非 `SysUserCode`。
- 字典项的**编码**命名与对应业务字段含义对齐；若跨模块或跨表易混淆，在命名前增加**业务域/表前缀**（与目录式命名一致），而非模块实现类名前缀。
- **历史遗留**：`trade` 等模块中部分 `*SysUserCode` 字段为早期命名，新表与新字段请按上文「表前缀 + 字段名、省略系统层」执行。

## 模块规范

- **跨模块只允许通过 `*-api` 暴露的接口协作**；接口的实现放在各自 `*-biz`（或约定实现模块）中。Maven 上允许子模块依赖父模块；**父模块不得依赖子模块**。子模块能用的公共能力范围由父级聚合模块决定。
- **禁止跨模块直接拼 SQL 关联对方表**；若必须展示关联结果，请用同步表、视图或由 API 组装数据等符合边界的方式实现。

## 关于字典与状态字段

### 字典类字段（`*Code`）

- **命名**：凡表示「取自字典 / 枚举 / 固定码表」的字段，采用 `xxCode` 形式（以 `Code` 结尾），与展示用的名称、`Name` 区分开。
- **数据来源**：以各模块 `*-api` 中的**枚举 / 常量**、或业务侧**独立码表**为准；对调用方而言，消费方式一致——按编码取值、按编码提交。
- **为何存 Code、不靠 name**：判断分支、持久化、接口传参均以 **编码** 为准，不以中文或其它展示文案为准。展示名可能重复、会改、会做多语言；编码稳定、唯一，可避免「改文案却改坏逻辑」的问题，在**国际化**场景下尤其明显。
- **前端**：列表/表单中按规范拉取选项（编码 + 当前语言下的展示文案），提交回写编码即可。
- **使用枚举类**：枚举类需要实现模板，且类的命名遵循字段名+Enum结尾风格。

### 布尔式状态机（`*StatusCode`）

**仅表示「是 / 否」**，不承载多步流程中间态：

| 取值 | 含义（约定）       |
|------|--------------|
| `1` | 是 / 通过 / 肯定  |
| `0` | 否 / 不通过 / 否定 |
| `null` | 未填写；**业务判定视同否**（库表后续将逐步改为非空且默认 `0`） |

- **命名**：字段以 `StatusCode` 结尾。
- **禁止**：勿在 `*StatusCode` 中编码「待提交 / 审核中 / 已驳回」等多步流程状态。
- **收益**：取值空间固定，避免与流程态混淆；因枚举简单，多数情况可不再单独配置字典说明。

### 流程状态机（`*ProcessCode`）

**多步审核、申请、审批等中间态**使用 `*ProcessCode` 字段，枚举实现 `BaseEnum`（如 `IdentityApplyProcessCodeEnum`）：

| 取值 | 含义（示例：资质/入驻申请） |
|------|---------------------------|
| `0` | 待提交 |
| `1` | 审核中 |
| `2` | 审核通过 |
| `3` | 审核拒绝 |

- **命名**：字段以 `ProcessCode` 结尾。
- **与 StatusCode 配合**：流程到达终态「审核通过」时，同步将对应 `*StatusCode` 置为 `1`（是）；其余流程态下 `*StatusCode` 一般为 `0`（否）。
- **示例字段**：`mkIdentityStatusCode` + `mkIdentityProcessCode`；`mkCompanyIdentityStatusCode` + `mkCompanyIdentityProcessCode`。

### 关于舍弃字典模块的新约定

为规范项目技术架构，规避长期运维风险，解决通用字典功能模块带来的开发低效、逻辑隐患、国际化适配不足等问题，保障系统业务稳定性、扩展性及数据安全性，经技术团队评估、项目负责人审批，本次版本变更决定\*\*全面舍弃通用字典功能模块\*\*，同步制定相关技术新约定，统一各类选项数据、常量的管理标准，支撑项目长期迭代优化。

#### 二、舍弃通用字典功能模块的核心理由

1\.  开发查阅不便，影响研发效率：各类常量、选项值分散存储于字典表，开发人员需频繁查询数据库核对编码与释义，打断开发节奏，增加前后端联调、问题排查的沟通成本与难度，不利于团队标准化协作。

2\.  业务逻辑风险极高，易引发致命故障：系统核心常量均深度绑定业务逻辑，若存入字典表交由非技术人员维护，其不熟悉底层业务规则，随意修改字典编码、值或状态，极易导致流程中断、数据错乱、权限失效等严重线上故障，且溯源修复成本高。

3\.  国际化场景适配性差：通用字典表仅支持单一文本存储，无法满足多语言切换需求，后期拓展海外业务时，字典数据改造工作量极大，不符合项目国际化布局规划。

4\.  滥用字典表埋下运维灾难：为简化开发将商品分类等具备层级、业务关联的复杂选项存入字典表，会导致数据杂乱、冗余、联动失效，随着业务迭代逐步形成无法整改的运维隐患，制约功能优化。

5\.  特殊标准化数据无法适配：行政区划等国标级标准化数据，具备固定层级与规范，字典表无法适配其层级结构与批量更新需求，无法保障数据准确性与调用效率。

#### 三、变更决定

1\.  本次版本变更后，正式舍弃项目中所有通用字典功能模块，删除相关字典表、字典管理接口及前端字典渲染相关代码，不再新增任何基于通用字典的开发需求。

2\.  对现有基于字典表开发的功能模块，由对应研发负责人牵头，在规定期限内完成改造，迁移至新约定的管理方式，确保改造后业务逻辑不受影响、数据准确无误。

3\.  禁止任何研发人员在后续开发中，擅自使用通用字典表或搭建类似字典的临时管理模块，违规者将按项目技术规范进行考核。

#### 四、后续执行的技术新约定

##### 4\.1 业务常量管理约定

所有深度绑定核心业务逻辑的常量（状态值、流程控制值、业务判定值等），统一采用代码枚举方式定义，明确注释释义、使用场景及关联业务逻辑；常量修改需经过代码评审流程，严禁擅自修改，避免引发逻辑错误。

##### 4\.2 复杂选择项管理约定

商品分类、业务类型、层级类目等具备层级关系、业务联动关系的复杂选择项，由研发人员通过专属业务功能模块、独立业务数据表开发实现，明确层级关联与数据校验规则，杜绝用字典表替代简化开发。

##### 4\.3 标准化公共数据管理约定

行政区划、地域编码等固定标准化公共数据，采用以下两种方式管理（二选一）：

（1）搭建独立专属数据表，规范层级结构，建立批量更新、数据校验机制，由专人负责维护；


# 感谢 & 友情链接

在此，首先要向各位开源前辈、向 Jeecg 等众多优秀框架的开发者们致以最诚挚的敬意。正是在这些优秀作品的熏陶与滋养下，我才得以在实际工作中不断沉淀、稳步成长，也才能真正做出一些看得见的成绩。

从业多年，我始终受益于开源精神的光芒。在无数优秀开源框架的陪伴下，我得以博采众长、融会贯通，逐步形成了自己的技术理解与架构思路，并基于这些积累，研发了这套更贴合自身场景与理念的框架。

如今将它开源，既是致敬一路指引我的开源前辈们，也希望以微薄之力回馈社区。愿本框架能为更多同行带来便利、启发与价值；也愿开源之路常有人前行、常有人照亮。以下致谢不分先后；若有采纳、借鉴方面的疏漏，欢迎在文末仓库地址处提 Issue，我会尽快处理。

## Spring Boot

毋庸置疑，**Spring Boot** 在 Java 应用开发领域影响深远，显著降低了工程化与交付门槛。


## Jeecg

笔者曾在某科技公司从业三年，做过政务、教育等领域大小系统 **100+** 套；**Jeecg** 在圈内影响力大、生态成熟，是很多同类项目的参照标杆。

## RuoYi

笔者从业多年，接触过不少优秀项目；**RuoYi** 框架简洁易懂，在国内知名度很高。

## Maku

笔者早期接触的系统中，**Maku** 的代码风格最让我认同。

## Activiti

工作流方向的经典开源方案之一。

## Hutool

「天下谁人不识君」——凭丰富的工具封装，让 Java 日常开发更顺手、更简洁。

## WxJava（weixin-java-tools）

曾经对接微信平台颇为头疼；**WxJava** 的封装简洁高效，事半功倍。

## Excel 导入导出

曾借鉴过某位作者分享的导出工具思路，原项目地址现已难觅。若作者看到本文，欢迎联系我补录到致谢列表。

## Vue

国人骄傲的前端框架之一；若要给前端开源分个「时代」，我愿意说 **Vue** 定义了其中一段主流叙事。

## Element Plus

管理端采用 **Element Plus**（生态上继承自 **Element UI**）。称它为「最好用的后台 UI 组件库之一」并不为过，不知帮多少项目稳步落地。

## Unibest

一个非常好用的前端框架，ai编程非常顺畅，生成的页面很美观，听说项目发起方说要适配uniapp x ，期待一波。

# 仓库地址及演示环境

- **Gitee 仓库**：[https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
- **文档站点**：[http://docs.module.pub](http://docs.module.pub)
- **演示环境**：[http://tg.module.pub](http://tg.module.pub)

# 版本变更历史

## v3.6.0（2026-05-20）

**次版本升级**（`3.5.2` → `3.6.0`）：Maven 统一版本号见根 `pom.xml` 的 `<revision>`。本版以架构收敛与 AI 协作友好为主，无 Spring Boot 大版本变更（仍为 3.5.x 系）。

### 移除低代码 / 代码生成模块

**变更**：下线平台内置的「低代码 / 可视化代码生成」能力（含基于生成器的 `crud` 批量产出链路），不再维护生成器模板与配套管理端入口。

**原因与替代思路**：

- 本仓库定位已明确为 **面向 AI 助手与开发者的模块化单体**：契约、命名、模块边界写在 README 与 `spring-boot-starter-module` 各子模块说明中，由 AI 按约定**从表结构设计 → API 契约 → `*-biz` 实现**一气呵成，比「先配元数据再点生成」更贴近真实迭代节奏。
- 生成器产出往往带来大量同质代码，后续改字段、改边界时容易与手写 `biz` 层纠缠，长期维护成本高于「小步手写 + 评审」。
- 在 Cursor、Copilot 等工具普及后，**自然语言 + 仓库约定**即可稳定产出符合 `*-api` / 目录式命名的代码，且便于随业务即时调整，无需再维护一套与框架版本绑定的模板 DSL。

**对开发者的影响**：新功能请直接按本文「架构与代码约定」「开发风格」新增模块或扩展 `*-biz`；历史由生成器产生的 `crud` 目录可随业务改造逐步收敛为手写结构，不必依赖已移除的生成入口。

### 移除通用字典模块，改为常量与专属数据管理

**变更**：舍弃 `spring-boot-starter-dict` 及通用字典表、字典管理接口、前端统一字典渲染链路；选项类数据改按下文 **[关于舍弃字典模块的新约定](#关于舍弃字典模块的新约定)** 执行。

**原因摘要**（完整论述见上文该节）：

| 维度 | 说明 |
|------|------|
| 研发效率 | 编码分散在库表，开发需反复查库核对，打断实现与联调 |
| 稳定性 | 与流程、权限绑定的核心码值若可被非研发在后台改动，易引发线上逻辑故障 |
| 国际化 | 通用字典难以承载多语言展示与稳定编码分离 |
| 模型适配 | 层级类目、国标区划等不适合塞进「扁平字典」 |
| 演进成本 | 滥用字典表易形成难以治理的数据债 |

**迁移方向**：

- **业务常量 / 状态机**：在 `*-api` 用枚举或常量类定义，修改走代码评审；简单二值状态继续采用 `*StatusCode` 约定（见 [布尔式状态机](#布尔式状态机statuscode)）。
- **复杂选项**：独立业务表或专属管理功能，保留层级与联动。
- **标准化公共数据**：独立表或受控同步，禁止再用通用字典替代。

**对开发者的影响**：字段仍遵循 `*Code` 存编码、前端按编码展示；仅**数据来源**从「平台字典服务」改为「模块内契约 + 业务数据」。升级时请清理对字典 Starter、字典 HTTP 接口的依赖，并核对存量数据是否已迁至枚举或业务表。

*文档与仓库同步更新；若你发现 README 与 `pom` 不一致，以 `spring-boot-starter-module` 下实际模块为准，欢迎提 Issue。*

## 历史版本

| 版本 | 说明 |
|------|------|
| 3.5.2 | 上一稳定次版本；含描述式系统日志等能力（管理端见 `V3.5.2+` 说明） |