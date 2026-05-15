---
title: TG-boot 总览
createTime: 2026/05/09
permalink: /dev/tg-boot/
---

# TG-boot | 模块化单体架构低代码开发平台

本文档面向 **AI 助手与开发者**：说明仓库分层、`runner`、`*-biz`、`*-api`、`*-plugin` 的职责边界，以及命名与模块间通信约束。读完后应能正确新增业务模块、遵守「模块间仅通过 `*-api`」规则，并理解从模块化单体演进到多 `runner` 部署的路径。

许久以来，希望把这些年踩坑积累的实践经验与借鉴到的成熟理念，沉淀成一套可复用的开发框架；目前已具雏形，欢迎同行批评指正并参与贡献。

#### **TG** 基于 **Spring Boot**，延续其自动装配与 Starter 扩展思路，并叠加 **模块化单体**：以 Maven 多模块划分边界，仓库根下由 `spring-boot-starter-module` 聚合 **common（通用库）**、**components（能力组件）**、**business（垂直业务域）** 与 **runner（启动器）**；默认将多个 `*-biz`（以及按需引入的 `*-plugin`）打进同一个 `spring-boot-starter-runner` 进程。模块粒度与 Spring 生态常见 Starter 相近，**未引入的 Starter 不会在编译期拖入无关依赖**，便于按团队规模拆分职责。

- **模块之间**只通过 `*-api` 中的接口**通信**；契约稳定后拆分微服务时，主要是部署与调用链变化，而不是推倒重来。
- **模块内部**用 **SPI** 做多实现、可插拔，配合 **plugin 模块**承载跨模块编排型扩展，形态上接近微内核。
- 整体风格对齐 **Spring Boot Starter**（如 Spring Cache、Spring Data、Spring Security 等）：能力以 Starter 形式接入，约定优于配置。
- 模块边界清晰，降低理解与协作成本；易扩展、可平滑过渡到多实例 / 微服务部署。
- 默认单体进程轻量，交付快；架构同样适配中大型项目的演进。

## 本站模块化文档索引

与 `tg-boot` 仓库目录一一对应的在线说明（简体中文 / English）：

| 分区 | 说明 |
|------|------|
| [树-图架构](/dev/tg-boot/tree-graph-architecture/) | 树形定边界、图形定关系（TG 命名与模块拆分思想） |
| [starter-module](/dev/tg-boot/starter-module/) | Maven 聚合根：`components` / `business` / `runner` |
| [runner](/dev/tg-boot/runner/) | 默认单体启动器 `spring-boot-starter-runner` |
| [plugins](/dev/tg-boot/plugins/) | 运行时外置插件目录 `./plugins` |
| [components](/dev/tg-boot/components/) | 通用 Starter：system、trade、file、excel… |
| [business](/dev/tg-boot/business/) | 垂直业务：customer、dating 等 |
| [tg-manage-vue](/dev/tg-boot/frontend-tg-manage-vue/) | 管理端前端示例工程 |

英文版入口：[TG-boot Documentation](/en/dev/tg-boot/)。

# 技术栈

- 后台框架：Spring Boot 3.5.5、Spring Security
- 前台框架：Vue 3、Element Plus、Vite（配套管理端见独立工程 `tg-manage-vue`，可与本后端仓库协同迭代）
- 多数据库支持：MySQL、PostgreSQL、Oracle、SQL Server、达梦、人大金仓等
- 组件与业务（随仓库演进，以 `spring-boot-starter-module` 下各 `pom` 为准）：系统、客户、交友（dating）、交易、文件、IM、OCR、短信、微信、CMS、字典、Excel、代码生成、定时任务等
- 特别鸣谢：Hutool 作者提供的工具类库；WxJava（weixin-java-tools）作者提供的微信开发工具类库。

# 框架特点

- 启动速度快，约 5.44 秒完成冷启动（视环境与机器配置而定）。
- 注重遵循 Spring Boot 的设计思想与扩展习惯。
- 用户端、角色、部门三者绑定：适配借调、兼任多部门等场景；切换部门时同步切换角色，降低越权风险。
- 支持 Excel 模板导入导出：模板侧可使用表格样式与常用函数；业务模块只负责提供数据，由 Excel 能力模块按模板渲染，二者解耦。
- 字典类字段以 `*Code` 约定由前端按规范拉取与展示，后端侧重存编码、判逻辑，减少逐字段翻译带来的前后端耦合。
- 支持分片上传与单文件上传；存储支持本地、MinIO、阿里云 OSS 等，并可通过 SPI 扩展更多实现。

# 架构与代码约定

下图自上而下依次为：**Maven 模块树**（仓库真实聚合关系）、**前端配套工程**、**单个 `*-biz` / `*-api` 源码包布局**（以 `system` 为例，其它域包名随模块前缀变化）。紧随图后的 **Runner** 小节说明默认可执行包如何选型。

```text
Maven 模块（tg-boot → spring-boot-starter-module）
tg-boot
└── spring-boot-starter-module
    ├── spring-boot-starter-common（通用基础库，jar）
    ├── spring-boot-starter-components（能力组件；常见形态 *-api + *-biz）
    │   ├── spring-boot-starter-generator
    │   ├── spring-boot-starter-file
    │   ├── spring-boot-starter-cms
    │   ├── spring-boot-starter-dict
    │   ├── spring-boot-starter-im
    │   ├── spring-boot-starter-ocr
    │   ├── spring-boot-starter-trade
    │   ├── spring-boot-starter-wechat
    │   ├── spring-boot-starter-sms
    │   ├── spring-boot-starter-excel
    │   ├── spring-boot-starter-system
    │   └── spring-boot-starter-job
    ├── spring-boot-starter-business（垂直业务域；域内 *-api / *-biz / *-plugin）
    │   ├── spring-boot-starter-dating（交友）
    │   │   ├── spring-boot-starter-dating-api
    │   │   ├── spring-boot-starter-dating-biz
    │   │   └── spring-boot-starter-dating-plugin
    │   └── spring-boot-starter-customer（客户）
    │       ├── spring-boot-starter-customer-api
    │       ├── spring-boot-starter-customer-biz
    │       └── spring-boot-starter-customer-plugin
    └── spring-boot-starter-runner（可执行单体：pom 中按需引入 *-biz / *-plugin）

前端（示例）
└── tg-vue（管理端：Vue 3 + Element Plus + Vite）
└── tg-uniapp（小程序端，基于开源项目unibest，本项目仅作了接入后端适配，unibest官网地址：https://unibest.tech/）

*-biz 包内布局（示例：spring-boot-starter-system-biz，Java 包根 pub.module.system）
├── biz（手写：Controller、Api*Impl、配置等）
│   ├── controller（下分 cus / mgt / pub 等包：客户端 / 管理端 / 公开接口）
│   ├── service / impl（对接 *-api 中 Api* 契约）
│   └── config（Web、Security、Swagger 等）
├── curd（目录名为 curd；生成器产出的 Mapper、Entity、基础 Service）
└── Biz*AutoConfiguration.java（本模块自动配置入口）

*-api 包内布局（示例：spring-boot-starter-system-api，根 pub.module.system.api）
└── api
    ├── service（Api*Service）
    ├── service/dto、vo
    ├── constants、event 等
    └── …（如 util，按模块约定）
```

**Runner**：实际打进哪些 `*-biz` / `*-plugin` 以 [`spring-boot-starter-runner/pom.xml`](https://gitee.com/pub_module/tg-boot/blob/master/spring-boot-starter-module/spring-boot-starter-runner/pom.xml) 为准；增删能力一般只改此处，不必调整上层模块树。

**配置与协作习惯**：能力以 Starter 引入，路径为「加依赖 → `application` → 写业务」；DB / Redis / 缓存等通过各 Starter 与配置文件（及少量 `@Configuration`）接入，**避免在业务模块里堆厂商方言或重复中间层**。分库分表在对应 Starter 的配置类里声明数据源；模块化单体不足时再拆 runner，由路由 / 网关分流。

### 架构理念简述

- **微服务化**：能力按边界独立部署、独立伸缩，协作依赖明确的远程契约（HTTP/RPC 等）。本框架通过「模块间只走 API 层」预先固化契约，拆分服务时主要是部署与调用方式变化，而不是重写业务粘连代码。
- **模块化单体（本仓库默认形态）**：**将多个 `*-biz` 业务模块一并集成进同一个 `spring-boot-starter-runner` 启动器**，同进程启动，即为模块化单体——源码仍按 Maven 模块切分，运行时却是一个 JVM、一套部署单元，兼顾协作边界与运维简单性。演进为微服务时，既可把**负载高的模块单独打进各自的 runner** 独立扩容，也可继续**整包 runner 部署**；无论物理上是多套 runner 还是一包到底，**对外统一依赖网关/路由策略将流量分发到对应实例，实现分而治之**。
- **微内核 + 插件**：内核（框架与通用组件）追求稳定；可变部分以 **plugin 模块** 形式外挂——例如仓库中的 `spring-boot-starter-dating-plugin`、`spring-boot-starter-customer-plugin` 通过依赖各 `*-api` 做跨模块编排，而不穿透对方 `*-biz` 内部实现。插件可单独打包（如放入 `./plugins`），在进程内仍保持「面向接口协作」的形态。

### plugin 模块与微服务能力

插件模块（属于微内核架构）表示：**业务扩展实现在独立的 plugin 工件中完成，纵向通过 SPI 等与内核或宿主衔接，横向只调用其他模块公布的 API**。这样即使在模块化单体部署下，模块间协作方式已与微服务「契约化调用」一致，后续将某一 `*-api` 的实现远端化时，插件侧调用点可平滑迁移为远程客户端，从而**保留微服务化的演进能力**。

### 架构优势（摘要）

- **交付与演进兼顾**：默认多 biz 集成单 runner，启动快、协作成本低；需要时可按模块拆分多个 runner 或维持整包部署，配合路由策略分流，迁移路径清晰。
- **依赖可治理**：插件与业务模块依赖接口契约而非对方实现，降低循环依赖与隐性耦合。
- **扩展灵活**：内核稳定、扩展可插拔；同一扩展点多实现时可替换，符合开闭原则。
- **团队协作友好**：API（模块间）、SPI（模块内扩展）、plugin（跨模块编排型扩展）分层明确，职责边界与仓库结构一致。

### 架构优势（面向初学者）

若你不熟悉「微内核」「模块化单体」等提法，只需记住三点：**（1）默认在一个 Java 进程（runner）里集成多个业务模块，运维简单；（2）模块之间像调用远程服务一样只认 `*-api` 契约，将来拆成多台机器也不会牵一大片；（3）负载或隔离要求高的域，可单独打成另一个 runner，由网关或路由把请求分到正确实例。** 这样既能先快速交付，又不必一上来就承担全套微服务的运维复杂度。

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
- **唯一性原则**：口头沟通里我们常省略定语，但编码时不同对象一旦关联就极易撞名。因此字段、类名等应写全限定含义（如「用户学历编码」而非模糊的 `code`），从源头减少歧义与冲突；配合 Bean 拷贝等工具，映射仍然可以保持简洁。
- 命名示例：即时通讯英文全称为 Instant Messaging，模块简写为 `IM`；若频道表名为 `im_channel`，则业务主键等字段建议使用表前缀（如 `im_cl_code`），在可读性与避免冲突之间取得平衡（不同表前缀不得重复）。
- 系统内关联以**业务主键**为准。命名约定为「表名 + CODE」，例如用户表业务主键写作 `USER_CODE`。
- 字典项的**编码**命名与对应业务字段含义对齐；若跨模块或跨表易混淆，在命名前增加模块或业务域前缀（与目录式命名一致）。

## 模块规范

- **跨模块只允许通过 `*-api` 暴露的接口协作**；接口的实现放在各自 `*-biz`（或约定实现模块）中。Maven 上允许子模块依赖父模块；**父模块不得依赖子模块**。子模块能用的公共能力范围由父级聚合模块决定。
- **禁止跨模块直接拼 SQL 关联对方表**；若必须展示关联结果，请用同步表、视图或由 API 组装数据等符合边界的方式实现。

## 关于字典与状态字段

### 字典类字段（`*Code`）

- **命名**：凡表示「取自字典 / 枚举 / 固定码表」的字段，采用 `xxCode` 形式（以 `Code` 结尾），与展示用的名称、`label` 区分开。
- **数据来源**：可以是平台**字典表**中的项，也可以是某业务表侧维护的**独立码表**；对调用方而言，消费方式一致——按编码取值、按编码提交。
- **为何存 Code、不靠 name**：判断分支、持久化、接口传参均以 **编码** 为准，不以中文或其它展示文案为准。展示名可能重复、会改、会做多语言；编码稳定、唯一，可避免「改文案却改坏逻辑」的问题，在**国际化**场景下尤其明显。
- **前端**：列表/表单中按规范拉取选项（编码 + 当前语言下的展示文案），提交回写编码即可。

### 布尔式状态机（`*StatusCode`）

部分状态只做「是 / 否」或带少量过渡态时，可采用**布尔式状态机约定**（取值空间小、流转清晰）：

| 取值 | 含义（约定） |
|------|----------------|
| `1` | 是 / 通过 / 肯定 |
| `0` | 否 / 不通过 / 否定 |
| `null` | 未填写 / 未决 |
| `2` | 过渡态（按需使用） |

- **命名**：字段以 `StatusCode` 结尾，例如「是否通过」用 `passedStatusCode`，见名知义。
- **收益**：减少状态组合爆炸与互相矛盾的流转；团队对取值含义有一致预期。因枚举简单，**多数情况可不再单独配置字典说明**，文档与代码即契约。

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

