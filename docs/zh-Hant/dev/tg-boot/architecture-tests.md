---
title: spring-boot-starter-architecture-tests
createTime: 2026/06/02
permalink: /zh-Hant/dev/tg-boot/architecture-tests/
---
# spring-boot-starter-architecture-tests

**模塊邊界守護**：通過自動化測試在構建階段校驗 TG-boot 的模塊化約定是否被遵守，防止跨模塊耦合悄悄滲入代碼庫。

> **本模塊不屬於系統運行時代碼。** 它不參與 Spring Boot 啓動、不會打進業務 runner 的 classpath、也不會部署到生產環境。僅在 **Maven 測試階段** 執行，作為架構規範的「門禁」。

## 守護什麼

與 [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/) 中的跨模塊協作規範對應，本模塊自動校驗以下硬性邊界：

| 規則 | 檢測方式 | 違規示例 |
|------|----------|----------|
| `*-api` 禁止定義 SPI 接口 | ArchUnit 字節碼掃描 | 在 `system-api` 中定義 `SpiSmsService` |
| `*-biz` / `*-crud` 禁止依賴他域實現包 | ArchUnit 依賴分析 | `dating-biz` 直接 import `customer.crud.entity.Customer` |
| `*-biz` 的 pom 禁止依賴其他域 `*-biz` | POM 文件掃描 | `dating-biz/pom.xml` 引入 `spring-boot-starter-customer-biz` |
| `crud.entity` 須繼承 `BaseEntity` | ArchUnit（歷史實體白名單除外） | 新表實體未繼承 `BaseEntity` |
| 業務 `*Code` 不得 `@TableId` | ArchUnit | 將 `smsTemplateCode` 標為 `@TableId` |
| `Api**Service` 契約禁止 biz/crud 類型 | ArchUnit | api 接口返回 `crud.entity.*` |

**允許的做法**：跨模塊只依賴 `*-api` 與 `common`；模塊內多實現 SPI 定義在 `*-biz/service`；跨模塊協作走 `Api**Service` 或 MQ 契約。

## 生效原理

本模塊 **沒有 `src/main`**，全部邏輯在 `src/test/java` 的 JUnit 5 測試類中，依賴 [ArchUnit](https://www.archunit.org/) 與 Maven Surefire 驅動。

### 1. ArchUnit 字節碼規則（`ModuleArchitectureRulesTest`）

```
mvn test 啓動
    → Surefire 加載本模塊 test classpath
    → ClassFileImporter 導入 pub.module 下全部已編譯 class（排除 test 自身）
    → ArchUnit 逐條校驗架構規則
    → 違規則測試失敗，構建中斷
```

- **SPI 規則**：掃描 `pub.module` 包下所有類名以 `Spi` 開頭的類型，若位於 `..api..` 包則判定違規。
- **跨域實現依賴規則**：對 `pub.module..biz..` 與 `pub.module..crud..` 中的每個類，檢查其 **直接依賴** 的目標類是否屬於 **其他業務域** 的 `.biz.` 或 `.crud.` 包（同域內部依賴不受限）。

為讓 ArchUnit 能掃描到各域實現，本模塊 pom 顯式依賴全部 `*-api` 與 `*-biz`（僅 test 編譯期使用，見下文「為何能依賴全部 biz」）。

### 2. POM 依賴規則（`BizModuleDependencyRulesTest`）

```
mvn test 啓動
    → 從當前工作目錄向上查找 spring-boot-starter-module 根目錄
    → 遍歷所有 *-biz/pom.xml
    → 解析 <dependencies> 塊中的 <artifactId>
    → 若出現其他域的 *-biz artifactId 則判定違規
```

不依賴 ArchUnit，直接讀 pom 文本，與 Maven 依賴聲明保持一致。

## 生效時機

| 場景 | 是否執行 | 説明 |
|------|----------|------|
| `mvn test` / `mvn verify` | ✅ | 本模塊測試隨 reactor 一併運行 |
| `mvn -pl spring-boot-starter-architecture-tests -am test` | ✅ | 僅跑架構測試（推薦本地/CI 快速校驗） |
| `mvn package` / `mvn install`（含 test 階段） | ✅ | 默認生命週期會觸發 test |
| `mvn package -DskipTests` | ❌ | 跳過全部測試，架構規則不生效 |
| Spring Boot 應用啓動 / 生產部署 | ❌ | runner 不依賴本模塊，運行時無感知 |

**建議**：在 CI 流水線中至少執行一次 `mvn -pl spring-boot-starter-architecture-tests -am test`；合併前本地改 pom 或跨模塊 import 後也應手動跑一遍。

## 不屬於系統代碼

以下幾點説明本模塊與業務 starter 的本質區別：

| 對比項 | 業務 `*-biz` / `common` | 本模塊 |
|--------|-------------------------|--------|
| 源碼目錄 | `src/main/java` | **僅** `src/test/java` |
| 打包產物 | 打進 runner fat jar | `maven.deploy.skip=true`，**不發佈、不部署** |
| Spring 組件 | 有 `@Component`、AutoConfiguration 等 | **無任何** Spring Bean |
| runner 依賴 | runner pom 顯式引入 | runner **不引入** 本模塊 |
| 運行時作用 | 提供業務能力 | **零運行時作用**，純構建期門禁 |

本模塊 pom 雖然聲明瞭對全部 `*-biz` 的依賴，目的僅是 **在測試 classpath 中加載各域 class 供 ArchUnit 分析**，不代表架構上允許 biz 互引——恰恰相反，測試會檢測並拒絕這類依賴。

## 測試類一覽

| 類 | 職責 |
|----|------|
| `ModuleArchitectureRulesTest` | ArchUnit：api 禁 SPI；biz/crud 禁跨域實現依賴 |
| `EntityAndApiArchitectureRulesTest` | ArchUnit：BaseEntity、`@TableId`、Api 契約類型 |
| `BizModuleDependencyRulesTest` | POM 掃描：biz 禁依賴其他 biz |
| `TransactionAfterCommitTest` | common 工具：無事務時立即執行 |
| `ModulePaths` | 定位 `spring-boot-starter-module` 根目錄（供 POM 掃描） |

## 運行方式

在 `spring-boot-starter-module` 目錄下：

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

或在倉庫根目錄 `tg-boot` 下：

```bash
mvn -pl spring-boot-starter-module/spring-boot-starter-architecture-tests -am test
```

測試失敗時，Surefire 報告會列出違規類名或 pom 路徑，按提示改為依賴 `*-api` 或調整包引用即可。

## 新增模塊時的維護

新增業務域（如 `spring-boot-starter-foo-api` / `spring-boot-starter-foo-biz`）後，需在本模塊 `pom.xml` 的 `<dependencies>` 中補充對應 `*-api` 與 `*-biz`，否則 ArchUnit 無法掃描到新域的 class，跨域違規可能被漏檢。

## 相關文檔

- [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/) — 跨模塊協作規範（本模塊守護的規則來源）
- [common](/zh-Hant/dev/tg-boot/components/common/) — 公共內核與 MQ 基礎設施