---
title: TG-boot 总览
createTime: 2026/05/09
permalink: /dev/tg-boot/
---

# TG-boot | 模块化单体架构低代码开发平台

本文档面向 **AI 助手与开发者**：说明仓库分层、`runner` / `*-biz` / `*-api` / `*-plugin` 的职责边界，以及命名与模块通信约束。阅读后应能正确新增业务模块、遵守「模块间仅通过 API」规则，并理解从模块化单体演进到多 `runner` 部署的路径。

很久之前就想把这些年踩坑的经验及学到的先进概念熔炼成一个开发框架，直到今天已经初具形态，欢迎各位同行批评指正并参与到本开源项目中。

#### **TG** 基于 **Spring Boot**，延续其自动装配与 Starter 扩展思路，并叠加 **模块化单体**：Maven 多模块划分边界，默认将多个 `*-biz` 打进同一个 `spring-boot-starter-runner` 运行。模块粒度与 Spring 生态常见 Starter 相近，**未引入的 Starter 不会在编译期拖入无关依赖**，便于按团队规模拆分职责。

- **模块之间**只通过 `***-api` 中的接口**通信，契约稳定后拆分微服务时主要是部署与调用链变化，而不是推倒重来。
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
- 前台框架：Vue 3、Element Plus、Vite（仓库内管理端见 `tg-manage-vue`）
- 多数据库支持：MySQL、PostgreSQL、Oracle、SQL Server、达梦、人大金仓等
- 功能模块：系统、支付、交易、文件、IM、OCR、短信、微信、小程序、CMS 等
- 特别鸣谢 Hutool 作者提供的工具类库，weixin-java-tools 作者提供微信开发工具类库。

# 框架特点

- 启动速度快，约 5.44 秒完成启动。
- 主打一个尊重Spring boot 设计思想。
- 用户端、角色、部门三者绑定：适配借调、兼任多部门等场景；切换部门时同步切换角色，降低越权风险。
- 支持 Excel 模板导入导出：模板侧可使用表格样式与常用函数；业务模块只负责提供数据，由 Excel 能力模块按模板渲染，二者解耦。
- 字典由前端按规范消费，减少后端逐字段翻译带来的耦合。
- 支持分片上传与单文件上传；存储支持本地、MinIO、阿里云 OSS 等，并通过 SPI 扩展更多实现。


# 架构图

```angular2svg
springboot
├── spring-boot-starter-module（后端根模块）
│   ├── spring-boot-starter-business（主要业务，按业务域划分）
│   │   ├── 各业务域 *-biz（业务实现）
│   │   └── spring-boot-starter-*-plugin（插件模块：承载 SPI/扩展实现，跨模块仅依赖 *-api 调用契约）
│   ├── spring-boot-starter-components（组件化模块，为基础代码库贡献资源）
│   │   └── 短信、支付、文件、IM、OCR、字典、缓存、日志、权限、消息队列、用户中心、工作流、定时任务、持久化数据等
│   └── spring-boot-starter-runner（单应用启动器）
```

```angular2svg
前端（示例）
├── tg-manage-vue（后台管理端：Vue 3 + Element Plus + Vite）
```

### 架构理念简述

- **微服务化**：能力按边界独立部署、独立伸缩，协作依赖明确的远程契约（HTTP/RPC 等）。本框架通过「模块间只走 API 层」预先固化契约，拆分服务时主要是部署与调用方式变化，而不是重写业务粘连代码。
- **模块化单体（本仓库默认形态）**：**将多个 `*-biz` 业务模块一并集成进同一个 `spring-boot-starter-runner` 启动器**，同进程启动，即为模块化单体——源码仍按 Maven 模块切分，运行时却是一个 JVM、一套部署单元，兼顾协作边界与运维简单性。演进为微服务时，既可把**负载高的模块单独打进各自的 runner** 独立扩容，也可继续**整包 runner 部署**；无论物理上是多套 runner 还是一包到底，**对外统一依赖网关/路由策略将流量分发到对应实例，实现分而治之**。
- **微内核 + 插件**：内核（框架与通用组件）追求稳定；可变部分以 **plugin 模块** 形式外挂——例如仓库中的 `spring-boot-starter-dating-plugin` 通过依赖 `*-api` 编排支付、客户等能力，而不穿透对方 `*-biz` 内部实现。插件可单独打包（如放入 `./plugins`），在进程内仍保持「面向接口协作」的形态。

### plugin 模块与微服务能力

插件模块（属于微内核架构）表示：**业务扩展实现在独立的 plugin 工件中完成，纵向通过 SPI 等与内核或宿主衔接，横向只调用其他模块公布的 API**。这样即使在模块化单体部署下，模块间协作方式已与微服务「契约化调用」一致，后续将某一 `*-api` 的实现远端化时，插件侧调用点可平滑迁移为远程客户端，从而**保留微服务化的演进能力**。

### 架构优势（摘要）

- **交付与演进兼顾**：默认多 biz 集成单 runner，启动快、协作成本低；需要时可按模块拆分多个 runner 或维持整包部署，配合路由策略分流，迁移路径清晰。
- **依赖可治理**：插件与业务模块依赖接口契约而非对方实现，降低循环依赖与隐性耦合。
- **扩展灵活**：内核稳定、扩展可插拔；同一扩展点多实现时可替换，符合开闭原则。
- **团队协作友好**：API（模块间）、SPI（模块内扩展）、plugin（跨模块编排型扩展）分层明确，职责边界与仓库结构一致。

### 架构优势（面向初学者）

若你不熟悉「微内核」「模块化单体」等词，只需抓住三点：**（1）默认一个 Java 进程里跑多个业务模块（runner），运维简单；（2）模块之间像调用服务一样只认接口（`*-api`），所以以后拆成多台机器也不会乱；（3）特别重的业务可以单独打成另一个 runner，入口用网关或路由把请求分到对的机器。** 这样既能先快速上线，又不必一开始就上全套微服务运维复杂度。

### 代码与配置约定（工程风格）

- **遵循 Spring Boot / Starter 习惯**：能力以 Starter 模块引入，自动配置与约定命名与 Spring 生态一致，AI 与开发者可按「加依赖 → 配 `application` → 写业务」的路径工作。
- **数据库、Redis、缓存等基础设施**：优先通过对应 Starter 与 **配置文件（及少量 `@Configuration`）** 接入；**业务模块内不写面向特定厂商的方言封装或重复造轮子式中间层**，避免配置与业务代码缠在一起，换库或拆服务时改动面可控。

```angular2svg
代码风格
├── spring-boot-starter-system-biz
│   ├── biz（自定义业务代码包）
│   │   ├──service
│   │   │   ├── SpiSysUserServiceImpl.java spi为插件式设计模式接口，模块内部使用
│   │   │   ├── ApiSysRoleServiceImpl.java api为模块化通信接口，模块间使用
│   |   ├──controller
│   │   │   ├── CusSysUserController.java 路径带cus为客户端接口
│   │   │   ├── PubSysRoleController.java 路径带pub为公开接口
│   │   │   ├── MgtSysRoleController.java 路径带mgt为管理端接口
│   |   ├──websocket
│   |   ├──grpc
│   ├── curd（代码生成器生成的增删改查实体,里面可以增加维持数据一致性的数据服务）
│   │   ├── mapper
│   │   │   ├── TgUserMapper.java
│   │   │   ├── TgRoleMapper.java
│   │   ├── entity(如果API层未定义VO但依赖于实体模型，可以将该目录平移到API模块)
│   │   │   ├── TgUser.java
│   │   │   ├── TgRole.java
|   |   ├──service
│   │   │   ├── TgUserService.java
│   │   │   ├── TgRoleService.java

代码结构 API模块
├── spring-boot-starter-system-api
│   ├── api（接口定义包）
│   │   ├──service
│   │   │   ├── ApiXXXService.java (业务模块间通信接口)
│   │   │   ├── SpiXXXService.java (业务插件接口)



分库分表指南：
在业务模块的starter的配置类中配置要查询的数据源。
微服务化指南：
模块化单体不能满足流量或隔离诉求时，可将访问量大的 `*-biz` **单独纳入（或组合纳入）某个 runner 打包部署**，其余模块仍可留在原 runner；也可**多个 biz 仍打成一个 runner 整包部署**。无论拆分粒度如何，**入口侧通过路由/网关策略把请求导向正确实例**，实现分而治之。
```

```angular2svg
业务表设计：
├── 系统根表(抽象的表)字段 id,create_time,update_time,create_by,update_by,deleted,version,seq_no
├── 业务字段
│   ├── 表前缀+字段名称（符合目录式命名规范）
│   ├── 冗余字段（与来源名称一致；随外键冗余，常见特点：不常变更、属其他模块、需关联展示或提升查询效率）。
设计思想：
系统字段是虚拟了一个系统表或者实际有一个系统表，用来做共性或者系统层面的事情，比如数据的生成更新时间，操作人，版本变更，排序，日志，数据权限，租户数据隔离等。
业务字段使用目录式范式便于遵循唯一性命名原则，标准化冗余，便于形成范式，利于追踪，理解，统一开发风格。
```

# 开发风格

## 命名规范

- 目录式命名范式是一种基于目录结构的命名规范：以上一层级名称为前缀，拼接下一层级名称，类似「姓 + 名」。看到名称即可联想其在结构中的层级关系。例如 A 下有 B、B 下有 C，则 B 可称 AB，C 可称 BC 或 ABC；层级过深时一般取末尾三级（如 BCD）。**不建议超过三级**，否则应审视设计是否过度嵌套。唯一性原则下通常至少两级。若某层为固定简写（如 IM），组合命名时应统一使用该简写。
- **唯一性原则**：口头沟通里我们常省略定语，但编码时不同对象一旦关联就极易撞名。因此字段、类名等应写全限定含义（如「用户学历编码」而非模糊的 `code`），从源头减少歧义与冲突；配合 Bean 拷贝等工具，映射仍然可以保持简洁。
- 命名示例：即时通讯英文全称为 Instant Messaging，模块简写为 `IM`；若频道表名为 `im_channel`，则业务主键等字段建议使用表前缀（如 `im_cl_code`），在可读性与避免冲突之间取得平衡（不同表前缀不得重复）。
- 系统的关联关系基于业务主键。业务主键命名为：表名+CODE，例如：用户表的业务主键为：USER_CODE。
- 字典编码命名与业务字段同名，当产生命名冲突时候前面+模块名称。

## 模块规范

- **跨模块只允许通过 `*-api` 暴露的接口协作**；接口的实现放在各自 `*-biz`（或约定实现模块）中。Maven 上允许子模块依赖父模块；**父模块不得依赖子模块**。子模块能用的公共能力范围由父级聚合模块决定。
- **禁止跨模块直接拼 SQL 关联对方表**；若必须展示关联结果，请用同步表、视图或由 API 组装数据等符合边界的方式实现。

# 感谢 & 友情链接

在此，首先要向各位开源前辈、向 Jeecg 等众多优秀框架的开发者们致以最诚挚的敬意。正是在这些优秀作品的熏陶与滋养下，我才得以在实际工作中不断沉淀、稳步成长，也才能真正做出一些看得见的成绩。
从业多年，我始终受益于开源精神的光芒。在无数优秀开源框架的陪伴下，我得以博采众长、融会贯通，逐步形成了自己的技术理解与架构思路，并基于这些积累，研发了这套更贴合自身场景与理念的框架。
如今将它开源，既是致敬一路指引我的开源大神们，也是希望以微薄之力回馈社区。愿这套框架能为更多同行带来便利、启发与价值，也愿开源之路，永远有人前行，永远有人照亮。以下致谢没有先后之分，如有采纳、借鉴等遗漏情况请提issue,我看到后会第一时间处理。

## spring boot

毋庸置疑，一己之力撑起了 Java 的一片天。

## jeecg

笔者某科技公司从业三年，做了政务、教育等大大小小系统100+，当之无愧框架之星。

## ruoyi

笔者某科技公司从业多年，做的优秀项目很多，框架简洁易懂，是知名度极高的系统。

## maku

笔者刚接触的系统、代码风格是我最喜欢的框架。

## activi

工作流框架的王者。

## hutool

天下谁人不识君，凭一己之力让java写的功能好写，简洁，直逼python。

## binwang-wx

曾经对接微信生态很头疼，王斌大哥的框架即简洁又高效，真好！

## excel导入导出

以前借鉴过某大神写的导出工具类，项目地址找不到了，如果看到了请联系我上墙。

## vue

懂的都懂，国人骄傲的前端框架，如果前端分历史，我愿意说vue时代是现代。

## element ui

当之无愧最好用的前端开源ui框架，让多少公司的项目呱呱落地。

# 仓库地址及演示环境

- Gitee仓库：[https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
- 文档地址：[http://docs.module.pub](http://docs.module.pub)
- 演示环境：[http://tg.module.pub](http://tg.module.pub)
