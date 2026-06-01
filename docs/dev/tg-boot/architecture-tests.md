---
title: spring-boot-starter-architecture-tests
createTime: 2026/06/02
permalink: /dev/tg-boot/architecture-tests/
---
# spring-boot-starter-architecture-tests

**模块边界守护**：通过自动化测试在构建阶段校验 TG-boot 的模块化约定是否被遵守，防止跨模块耦合悄悄渗入代码库。

> **本模块不属于系统运行时代码。** 它不参与 Spring Boot 启动、不会打进业务 runner 的 classpath、也不会部署到生产环境。仅在 **Maven 测试阶段** 执行，作为架构规范的「门禁」。

## 守护什么

与 [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/) 中的跨模块协作规范对应，本模块自动校验以下硬性边界：

| 规则 | 检测方式 | 违规示例 |
|------|----------|----------|
| `*-api` 禁止定义 SPI 接口 | ArchUnit 字节码扫描 | 在 `system-api` 中定义 `SpiSmsService` |
| `*-biz` / `*-crud` 禁止依赖他域实现包 | ArchUnit 依赖分析 | `dating-biz` 直接 import `customer.crud.entity.Customer` |
| `*-biz` 的 pom 禁止依赖其他域 `*-biz` | POM 文件扫描 | `dating-biz/pom.xml` 引入 `spring-boot-starter-customer-biz` |
| `crud.entity` 须继承 `BaseEntity` | ArchUnit（历史实体白名单除外） | 新表实体未继承 `BaseEntity` |
| 业务 `*Code` 不得 `@TableId` | ArchUnit | 将 `smsTemplateCode` 标为 `@TableId` |
| `Api**Service` 契约禁止 biz/crud 类型 | ArchUnit | api 接口返回 `crud.entity.*` |

**允许的做法**：跨模块只依赖 `*-api` 与 `common`；模块内多实现 SPI 定义在 `*-biz/service`；跨模块协作走 `Api**Service` 或 MQ 契约。

## 生效原理

本模块 **没有 `src/main`**，全部逻辑在 `src/test/java` 的 JUnit 5 测试类中，依赖 [ArchUnit](https://www.archunit.org/) 与 Maven Surefire 驱动。

### 1. ArchUnit 字节码规则（`ModuleArchitectureRulesTest`）

```
mvn test 启动
    → Surefire 加载本模块 test classpath
    → ClassFileImporter 导入 pub.module 下全部已编译 class（排除 test 自身）
    → ArchUnit 逐条校验架构规则
    → 违规则测试失败，构建中断
```

- **SPI 规则**：扫描 `pub.module` 包下所有类名以 `Spi` 开头的类型，若位于 `..api..` 包则判定违规。
- **跨域实现依赖规则**：对 `pub.module..biz..` 与 `pub.module..crud..` 中的每个类，检查其 **直接依赖** 的目标类是否属于 **其他业务域** 的 `.biz.` 或 `.crud.` 包（同域内部依赖不受限）。

为让 ArchUnit 能扫描到各域实现，本模块 pom 显式依赖全部 `*-api` 与 `*-biz`（仅 test 编译期使用，见下文「为何能依赖全部 biz」）。

### 2. POM 依赖规则（`BizModuleDependencyRulesTest`）

```
mvn test 启动
    → 从当前工作目录向上查找 spring-boot-starter-module 根目录
    → 遍历所有 *-biz/pom.xml
    → 解析 <dependencies> 块中的 <artifactId>
    → 若出现其他域的 *-biz artifactId 则判定违规
```

不依赖 ArchUnit，直接读 pom 文本，与 Maven 依赖声明保持一致。

## 生效时机

| 场景 | 是否执行 | 说明 |
|------|----------|------|
| `mvn test` / `mvn verify` | ✅ | 本模块测试随 reactor 一并运行 |
| `mvn -pl spring-boot-starter-architecture-tests -am test` | ✅ | 仅跑架构测试（推荐本地/CI 快速校验） |
| `mvn package` / `mvn install`（含 test 阶段） | ✅ | 默认生命周期会触发 test |
| `mvn package -DskipTests` | ❌ | 跳过全部测试，架构规则不生效 |
| Spring Boot 应用启动 / 生产部署 | ❌ | runner 不依赖本模块，运行时无感知 |

**建议**：在 CI 流水线中至少执行一次 `mvn -pl spring-boot-starter-architecture-tests -am test`；合并前本地改 pom 或跨模块 import 后也应手动跑一遍。

## 不属于系统代码

以下几点说明本模块与业务 starter 的本质区别：

| 对比项 | 业务 `*-biz` / `common` | 本模块 |
|--------|-------------------------|--------|
| 源码目录 | `src/main/java` | **仅** `src/test/java` |
| 打包产物 | 打进 runner fat jar | `maven.deploy.skip=true`，**不发布、不部署** |
| Spring 组件 | 有 `@Component`、AutoConfiguration 等 | **无任何** Spring Bean |
| runner 依赖 | runner pom 显式引入 | runner **不引入** 本模块 |
| 运行时作用 | 提供业务能力 | **零运行时作用**，纯构建期门禁 |

本模块 pom 虽然声明了对全部 `*-biz` 的依赖，目的仅是 **在测试 classpath 中加载各域 class 供 ArchUnit 分析**，不代表架构上允许 biz 互引——恰恰相反，测试会检测并拒绝这类依赖。

## 测试类一览

| 类 | 职责 |
|----|------|
| `ModuleArchitectureRulesTest` | ArchUnit：api 禁 SPI；biz/crud 禁跨域实现依赖 |
| `EntityAndApiArchitectureRulesTest` | ArchUnit：BaseEntity、`@TableId`、Api 契约类型 |
| `BizModuleDependencyRulesTest` | POM 扫描：biz 禁依赖其他 biz |
| `TransactionAfterCommitTest` | common 工具：无事务时立即执行 |
| `ModulePaths` | 定位 `spring-boot-starter-module` 根目录（供 POM 扫描） |

## 运行方式

在 `spring-boot-starter-module` 目录下：

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

或在仓库根目录 `tg-boot` 下：

```bash
mvn -pl spring-boot-starter-module/spring-boot-starter-architecture-tests -am test
```

测试失败时，Surefire 报告会列出违规类名或 pom 路径，按提示改为依赖 `*-api` 或调整包引用即可。

## 新增模块时的维护

新增业务域（如 `spring-boot-starter-foo-api` / `spring-boot-starter-foo-biz`）后，需在本模块 `pom.xml` 的 `<dependencies>` 中补充对应 `*-api` 与 `*-biz`，否则 ArchUnit 无法扫描到新域的 class，跨域违规可能被漏检。

## 相关文档

- [跨模块协作规范](/dev/tg-boot/cross-module-collaboration/) — 跨模块协作规范（本模块守护的规则来源）
- [common](/dev/tg-boot/components/common/) — 公共内核与 MQ 基础设施