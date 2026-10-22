---
title: TG-boot 總覽
createTime: 2026/01/12 20:05:26
permalink: /zh-Hant/dev/tg-boot/
---
# TG-boot | 模塊化單體架構開發平台（AI 協作友好）

本文檔面向 **AI 助手與開發者**：説明倉庫分層、`runner`、`*-biz`、`*-api` 的職責邊界，以及命名與模塊間通信約束。

**AI 生成代碼前請先讀**：[AI 編碼規範](/zh-Hant/dev/tg-boot/agents/)（實體 `BaseEntity`、雙主鍵、`getByCode` 等硬性約定與檢查清單）。

**部署與生產運維**：[運維説明](/zh-Hant/dev/tg-boot/ops/)（含 **Actuator 禁止對公網暴露**、MQ、架構測試門禁）。

## 本站模塊化文檔索引

與 `tg-boot` 倉庫目錄對應的在線説明（簡體中文 / English）：

| 分區 | 説明 |
|------|------|
| [AI 編碼規範](/zh-Hant/dev/tg-boot/agents/) | 實體、命名、跨模塊硬性約定（生成代碼前必讀） |
| [運維説明](/zh-Hant/dev/tg-boot/ops/) | Actuator 安全、MQ、上線自查 |
| [跨模塊協作規範](/zh-Hant/dev/tg-boot/cross-module-collaboration/) | MQ 與同步 `Api**Service` 選用規則 |
| [架構測試門禁](/zh-Hant/dev/tg-boot/architecture-tests/) | ArchUnit 模塊邊界守護 |
| [樹-圖架構](/zh-Hant/dev/tg-boot/tree-graph-architecture/) | 樹形定邊界、圖形定關係 |
| [starter-module](/zh-Hant/dev/tg-boot/starter-module/) | Maven 聚合根 |
| [runner](/zh-Hant/dev/tg-boot/runner/) | 默認單體啓動器 |
| [plugins](/zh-Hant/dev/tg-boot/plugins/) | 運行時外置插件目錄 |
| [components](/zh-Hant/dev/tg-boot/components/) | 通用 Starter |
| [business](/zh-Hant/dev/tg-boot/business/) | 垂直業務域 |
| [tg-manage-vue](/zh-Hant/dev/tg-boot/frontend-tg-manage-vue/) | 管理端前端 |

英文版入口：[TG-boot Documentation](/en/dev/tg-boot/)。


許久以來，希望把這些年踩坑積累的實踐經驗與借鑑到的成熟理念，沉澱成一套可複用的開發框架；目前已具雛形，歡迎同行批評指正並參與貢獻。

#### **TG** 基於 **Spring Boot**，以 Maven 多模塊劃分 **common / components / business / runner**；默認將多個 `*-biz` 打進同一個 `spring-boot-starter-runner` 進程。

- **模塊之間**只通過 `*-api` 中的接口與 **MQ 消息契約**通信。
- **模塊內部**在 `*-biz/service` 用 **SPI** 表達多實現（支付渠道、短信、存儲等），由註冊表路由。
- 整體風格對齊 **Spring Boot Starter**：能力以 Starter 引入，約定優於配置。

# 技術棧

- 後台框架：Spring Boot 3.5.5、Spring Security
- 前台框架：Vue 3、Element Plus、Vite（配套管理端見獨立工程 `tg-manage-vue`，可與本後端倉庫協同迭代）
- 多數據庫支持：MySQL、PostgreSQL、Oracle、SQL Server、達夢、人大金倉等
- 組件與業務（隨倉庫演進，以 `spring-boot-starter-module` 下各 `pom` 為準）：系統、客户、交友（dating）、交易、文件、IM、OCR、短信、微信、CMS、Excel、定時任務、核驗（verification）等
- 特別鳴謝：Hutool 作者提供的工具類庫；WxJava（weixin-java-tools）作者提供的微信開發工具類庫。

# 內置運行環境（`tg-boot/.tools`）

本倉庫 **`tg-boot` 目錄下** 提供自帶的 JDK 與 Maven（目錄名為 **`.tools`**，注意是複數 **`s`**，不是 `.tool`），免去本機全局安裝與 `PATH` 衝突：

| 組件 | 典型路徑 |
|------|----------|
| JDK 21 | `tg-boot/.tools/jdk-21` |
| Apache Maven（版本以目錄為準，如 `3.9.9`） | `tg-boot/.tools/apache-maven-*/bin` |

**一鍵啓動默認單體 runner**（先確保 MySQL / Redis 等已與 `application-dev.yml` 等配置一致）：

- **PowerShell**（需在 `tg-boot` 根目錄執行）：

```powershell
.\scripts\run-runner.ps1
```

- **CMD**：在 `tg-boot` 目錄下雙擊或執行：

```bat
scripts\run-runner.bat
```

若已自行安裝全局 JDK/Maven，也可在 **`tg-boot/spring-boot-starter-module`**（反應堆根）下執行：

```bat
mvn -pl spring-boot-starter-runner -am spring-boot:run -DskipTests
```

説明：**必須在** `spring-boot-starter-module` 目錄執行且保留 **`-am`**，這樣在本地反應堆中解析 `${revision}` 與各 sibling；若只在 `runner` 子目錄跑或省略 `-am`，易誤從中央倉庫拉取未展開的 `pub.module` 佔位符而失敗。

# 框架特點

- 啓動速度快，約 5.44 秒完成冷啓動（視環境與機器配置而定）。
- 注重遵循 Spring Boot 的設計思想與擴展習慣。
- 用户端、角色、部門三者綁定：適配借調、兼任多部門等場景；切換部門時同步切換角色，降低越權風險。
- 支持 Excel 模板導入導出：模板側可使用表格樣式與常用函數；業務模塊只負責提供數據，由 Excel 能力模塊按模板渲染，二者解耦。
- 字典類字段以 `*Code` 約定由前端按規範拉取與展示；**`*StatusCode` 僅表示是否（0/1，null 視同否）**，多步流程中間態使用 **`*ProcessCode`**；後端側重存編碼、判邏輯，減少逐字段翻譯帶來的前後端耦合，輕量的字典使用枚舉類實現。
- 支持分片上傳與單文件上傳；存儲支持本地、MinIO、阿里雲 OSS 等，並可通過 SPI 擴展更多實現。

# 架構與代碼約定
以下先導圖及約定，面向AI及人類開發者。
## 模塊結構先導圖
```text
*-biz （業務子模塊）
├── biz
│   ├── controller
    │   ├── cus 用户端接口
    │   ├── mgt 管理端接口
    │   ├── pub 公開接口
│   ├── service
    │   ├── impl （模塊內 SPI 多實現）
    │   ├── Spi**Service （模塊內多實現 SPI，僅定義在 biz/service）
├── crud（目錄名為 crud，即持久層框架相關增刪改查方法）
    │   ├── mapper 
    │   ├── entity 
    │   ├── service（區別於biz的service，這裏是mybatis-plus增刪改查服務實現類）
└── Biz*AutoConfiguration.java（本模塊自動配置入口）

*-api （接口子模塊，可對外暴露業務接口及消息契約）
└── api
    ├── service
        │   ├── Api**Service （跨模塊業務接口）
    ├── messaging （跨模塊 MQ 契約）
    ├── constants （枚舉類，應用於字典及其他常量,遵循字段名稱+Enum後綴命名規範）

下圖自上而下依次為：**Maven 模塊樹**（倉庫真實聚合關係）、**前端配套工程**、**單個 `*-biz` / `*-api` 源碼包佈局**（以 `system` 為例，其它域包名隨模塊前綴變化）。緊隨圖後的 **Runner** 小節説明默認可執行包如何選型。
```
## 系統現有功能模塊先導圖
```text
tg-boot
└── spring-boot-starter-module
    ├── spring-boot-starter-common（通用基礎庫，jar）
    ├── spring-boot-starter-components（能力組件）
    │   ├── spring-boot-starter-file（文件上傳能力）
    │   ├── spring-boot-starter-cms（CMS系統）
    │   ├── spring-boot-starter-im（即時通訊能力）
    │   ├── spring-boot-starter-ocr（OCR識別能力）
    │   ├── spring-boot-starter-trade（交易系統）
    │   ├── spring-boot-starter-wechat（微信公眾平台能力）
    │   ├── spring-boot-starter-sms（短信發送能力）
    │   ├── spring-boot-starter-excel（EXCEL導入導出能力）
    │   ├── spring-boot-starter-system（用户體系系統*核心）
    │   ├── spring-boot-starter-job
    │   └── spring-boot-starter-verification（實名等認證能力）
    ├── spring-boot-starter-business（垂直業務域）
    │   ├── spring-boot-starter-dating（交友系統）
    │   │   ├── spring-boot-starter-dating-api（業務定義）
    │   │   └── spring-boot-starter-dating-biz（業務實現 + MQ 消費端）
    │   └── spring-boot-starter-customer（客户系統）
    │       ├── spring-boot-starter-customer-api（業務定義）
    │       └── spring-boot-starter-customer-biz（業務實現 + MQ 消費/發佈）
    └── spring-boot-starter-runner（可執行單體：pom 中按需引入 *-biz）

前端（示例）
└── tg-vue（管理端：Vue 3 + Element Plus + Vite）
└── tg-matchmaker-h5（團隊簡稱 **h5項目**：uni-app 多端殼，基於 unibest，已接後端；H5 為 history 路由非 hash；https://unibest.tech/）

```

**Runner**：實際打進哪些 `*-biz` 以 [`spring-boot-starter-runner/pom.xml`](spring-boot-starter-module/spring-boot-starter-runner/pom.xml) 為準；增刪能力一般只改此處，不必調整上層模塊樹。

**配置與協作習慣**：能力以 Starter 引入，路徑為「加依賴 → `application` → 寫業務」；DB / Redis / 緩存等通過各 Starter 與配置文件（及少量 `@Configuration`）接入，**避免在業務模塊裏堆廠商方言或重複中間層**。分庫分表在對應 Starter 的配置類裏聲明數據源；模塊化單體不足時再拆 runner，由路由 / 網關分流。

### 架構理念簡述

- **微服務化**：能力按邊界獨立部署、獨立伸縮，協作依賴明確的遠程契約（HTTP/RPC 等）。本框架通過「模塊間只走 API 層」預先固化契約，拆分服務時主要是部署與調用方式變化，而不是重寫業務粘連代碼。
- **模塊化單體（本倉庫默認形態）**：**將多個 `*-biz` 業務模塊一併集成進同一個 `spring-boot-starter-runner` 啓動器**，同進程啓動，即為模塊化單體——源碼仍按 Maven 模塊切分，運行時卻是一個 JVM、一套部署單元，兼顧協作邊界與運維簡單性。演進為微服務時，既可把**負載高的模塊單獨打進各自的 runner** 獨立擴容，也可繼續**整包 runner 部署**；無論物理上是多套 runner 還是一包到底，**對外統一依賴網關/路由策略將流量分發到對應實例，實現分而治之**。
- **跨模塊協作**：**異步副作用走 MQ**（契約在 `*-api/messaging`）；**同進程強一致編排**可注入 `Api**Service`（詳見 [跨模塊協作規範](CROSS_MODULE_COLLABORATION.md)）。
- **模塊內多實現**：在 `*-biz/service` 定義 SPI 接口，由註冊表或 Spring 注入 `List<實現>` 路由（支付渠道、短信、存儲等）。

### 跨模塊消息（MQ）一覽

開發 / 運維默認使用嵌入式 Rabbit（`tg.messaging.embedded-rabbit.enabled=true`，見 `common` 的 `EmbeddedRabbitAutoConfiguration`）；生產環境關閉 mock、接入真實 RabbitMQ 即可。

| Destination | 模式 | 消息類型 | 發佈方 | 消費方（group） | 説明 |
|-------------|------|----------|--------|-----------------|------|
| `trade.order-goods.paid` | 單向 | `TdOrderGoodsDTO` | trade-biz | `dating` / `distribution` | 訂單商品支付成功後履約 / 分傭 |
| `customer.profile.updated` | 單向 | `CustomerProfileUpdatedMessage` | customer-biz | 各訂閲域自定 group | 客户資料變更廣播，訂閲方在自身 api 聲明槽位 |
| `system.user.login` | 單向 | `SysUserLoginMessage` | system-biz | `customer` | 登錄成功後冪等初始化客户檔案 |
| `system.user-info.updated` | 單向 | `SysUserInfoUpdatedMessage` | system-biz | `customer` | 用户暱稱等變更，同步客户表 |
| `system.user.registered` | 單向 | `SysUserRegisteredMessage` | system-biz | `distribution` | 註冊成功後綁定推薦關係 |
| `verification.phone-two-factor.verified` | 單向 | `PhoneTwoFactorVerifiedMessage` | verification-biz | `customer` | 二要素核驗通過後更新客户實名 |
| `distribution.promoter-role.query` | request-reply | `DistPromoterRoleQueryMessage` → `DistPromoterRoleReplyMessage` | distribution-biz | `dating`（應答） | 分傭前查詢推廣人是否紅娘 |

契約見各域 `*-api/messaging/XxxConsumer.java`（單文件定義生產+消費槽位）；**消費重試/DLQ 基線**見 common 的 `application-messaging-baseline.yml`；binding 由 `MqMessagingAutoConfiguration` 按契約自動註冊。

### 模塊內 SPI 與跨模塊 API

- **跨模塊異步**：MQ + `*-api/messaging`（見下表與 [跨模塊協作規範](CROSS_MODULE_COLLABORATION.md)）。
- **跨模塊同步**：同 runner 內可注入 `Api**Service` 做強一致編排；拆服務時改為 RPC 或 Saga。
- **模塊內**：`Spi**Service` 在 `*-biz/service`；多實現用註冊表路由。
- **架構守護**：`spring-boot-starter-architecture-tests`（禁止 api 定義 SPI、禁止 biz 依賴 biz）。

### 架構優勢（摘要）

- **交付與演進兼顧**：默認多 biz 集成單 runner，啓動快、協作成本低；需要時可按模塊拆分多個 runner 或維持整包部署，配合路由策略分流，遷移路徑清晰。
- **依賴可治理**：模塊間依賴接口契約而非對方實現，降低循環依賴與隱性耦合。
- **擴展靈活**：模塊內 SPI 支持多實現替換，符合開閉原則。
- **團隊協作友好**：API（跨模塊）、SPI（模塊內）、MQ（異步協作）分層明確，職責邊界與倉庫結構一致。

### 架構優勢（面向初學者）

若你不熟悉「模塊化單體」等提法，只需記住三點：**（1）默認在一個 Java 進程（runner）裏集成多個業務模塊，運維簡單；（2）模塊之間像調用遠程服務一樣只認 `*-api` 契約與 MQ 消息，將來拆成多台機器也不會牽一大片；（3）負載或隔離要求高的域，可單獨打成另一個 runner，由網關或路由把請求分到正確實例。** 這樣既能先快速交付，又不必一上來就承擔全套微服務的運維複雜度。

```text
業務表設計（示意）├── 系統根表（抽象公共字段）id, create_time, update_time, create_by, update_by, deleted, version, seq_no
├── 業務字段
│   ├── 表前綴 + 字段名（目錄式命名）
│   └── 冗餘字段（命名與來源一致；隨外鍵冗餘。常見：不常變更、歸屬其他模塊、用於關聯展示或提升查詢效率）

設計思想：
- 系統字段：可視為來自一張虛擬或真實的「系統根表」，承載共性能力，如創建 / 更新時間、操作人、版本、排序、審計、數據權限、多租户隔離等。
- 業務字段：採用目錄式命名便於保證唯一性、規範冗餘與追蹤，統一團隊風格，降低溝通成本。
```

# 開發風格

## 命名規範

- 目錄式命名範式是一種基於目錄結構的命名規範：以上一層級名稱為前綴，拼接下一層級名稱，類似「姓 + 名」。看到名稱即可聯想其在結構中的層級關係。例如 A 下有 B、B 下有 C，則 B 可稱 AB，C 可稱 BC 或 ABC；層級過深時一般取末尾三級（如 BCD）。**不建議超過三級**，否則應審視設計是否過度嵌套。唯一性原則下通常至少兩級。若某層為固定簡寫（如 IM），組合命名時應統一使用該簡寫。
- **本項目執行口徑（省略系統層）**：業務表字段採用 **表前綴 + 字段名** 即可，前綴對應當前表（或該表約定簡寫），**不必**再把「系統模塊 / 實體類名」疊進字段。例如 `dist_user_bill_summary` 關聯用户編碼 → Java `distUserCode`、列 `dist_user_code`；**不要**寫成 `distSysUserCode`。跨表冗餘字段與來源列保持同一字段名（如均為 `userCode` 語義，前綴隨本表變化）。
- **唯一性原則**：口頭溝通裏我們常省略定語，但編碼時不同對象一旦關聯就極易撞名。因此字段、類名等應寫全限定含義（如「用户學歷編碼」而非模糊的 `code`），從源頭減少歧義與衝突；配合 Bean 拷貝等工具，映射仍然可以保持簡潔。
- 命名示例：即時通訊英文全稱為 Instant Messaging，模塊簡寫為 `IM`；若頻道表名為 `im_channel`，則業務主鍵等字段建議使用表前綴（如 `im_cl_code`），在可讀性與避免衝突之間取得平衡（不同表前綴不得重複）。
- 系統內關聯以**業務主鍵**為準。命名約定為「表前綴 + 字段含義 + Code」，例如用户表 `sys_user` 的業務主鍵為 `user_code`（Java `userCode`）；其他表引用該用户時用本表前綴 + `UserCode`，而非 `SysUserCode`。
- 字典項的**編碼**命名與對應業務字段含義對齊；若跨模塊或跨表易混淆，在命名前增加**業務域/表前綴**（與目錄式命名一致），而非模塊實現類名前綴。
- **歷史遺留**：`trade` 等模塊中部分 `*SysUserCode` 字段為早期命名，新表與新字段請按上文「表前綴 + 字段名、省略系統層」執行。

## 模塊規範

- **跨模塊只允許通過 `*-api` 暴露的接口協作**；接口的實現放在各自 `*-biz`（或約定實現模塊）中。Maven 上允許子模塊依賴父模塊；**父模塊不得依賴子模塊**。子模塊能用的公共能力範圍由父級聚合模塊決定。
- **禁止跨模塊直接拼 SQL 關聯對方表**；若必須展示關聯結果，請用同步表、視圖或由 API 組裝數據等符合邊界的方式實現。

## 關於字典與狀態字段

### 字典類字段（`*Code`）

- **命名**：凡表示「取自字典 / 枚舉 / 固定碼錶」的字段，採用 `xxCode` 形式（以 `Code` 結尾），與展示用的名稱、`Name` 區分開。
- **數據來源**：以各模塊 `*-api` 中的**枚舉 / 常量**、或業務側**獨立碼錶**為準；對調用方而言，消費方式一致——按編碼取值、按編碼提交。
- **為何存 Code、不靠 name**：判斷分支、持久化、接口傳參均以 **編碼** 為準，不以中文或其它展示文案為準。展示名可能重複、會改、會做多語言；編碼穩定、唯一，可避免「改文案卻改壞邏輯」的問題，在**國際化**場景下尤其明顯。
- **前端**：列表/表單中按規範拉取選項（編碼 + 當前語言下的展示文案），提交回寫編碼即可。
- **使用枚舉類**：枚舉類需要實現模板，且類的命名遵循字段名+Enum結尾風格。

### 布爾式狀態機（`*StatusCode`）

**僅表示「是 / 否」**，不承載多步流程中間態：

| 取值 | 含義（約定）       |
|------|--------------|
| `1` | 是 / 通過 / 肯定  |
| `0` | 否 / 不通過 / 否定 |
| `null` | 未填寫；**業務判定視同否**（庫表後續將逐步改為非空且默認 `0`） |

- **命名**：字段以 `StatusCode` 結尾。
- **禁止**：勿在 `*StatusCode` 中編碼「待提交 / 審核中 / 已駁回」等多步流程狀態。
- **收益**：取值空間固定，避免與流程態混淆；因枚舉簡單，多數情況可不再單獨配置字典説明。

### 流程狀態機（`*ProcessCode`）

**多步審核、申請、審批等中間態**使用 `*ProcessCode` 字段，枚舉實現 `BaseEnum`（如 `IdentityApplyProcessCodeEnum`）：

| 取值 | 含義（示例：資質/入駐申請） |
|------|---------------------------|
| `0` | 待提交 |
| `1` | 審核中 |
| `2` | 審核通過 |
| `3` | 審核拒絕 |

- **命名**：字段以 `ProcessCode` 結尾。
- **與 StatusCode 配合**：流程到達終態「審核通過」時，同步將對應 `*StatusCode` 置為 `1`（是）；其餘流程態下 `*StatusCode` 一般為 `0`（否）。
- **示例字段**：`mkIdentityStatusCode` + `mkIdentityProcessCode`；`mkCompanyIdentityStatusCode` + `mkCompanyIdentityProcessCode`。

### 關於捨棄字典模塊的新約定

為規範項目技術架構，規避長期運維風險，解決通用字典功能模塊帶來的開發低效、邏輯隱患、國際化適配不足等問題，保障系統業務穩定性、擴展性及數據安全性，經技術團隊評估、項目負責人審批，本次版本變更決定\*\*全面捨棄通用字典功能模塊\*\*，同步制定相關技術新約定，統一各類選項數據、常量的管理標準，支撐項目長期迭代優化。

#### 二、捨棄通用字典功能模塊的核心理由

1\.  開發查閲不便，影響研發效率：各類常量、選項值分散存儲於字典表，開發人員需頻繁查詢數據庫核對編碼與釋義，打斷開發節奏，增加前後端聯調、問題排查的溝通成本與難度，不利於團隊標準化協作。

2\.  業務邏輯風險極高，易引發致命故障：系統核心常量均深度綁定業務邏輯，若存入字典表交由非技術人員維護，其不熟悉底層業務規則，隨意修改字典編碼、值或狀態，極易導致流程中斷、數據錯亂、權限失效等嚴重線上故障，且溯源修復成本高。

3\.  國際化場景適配性差：通用字典表僅支持單一文本存儲，無法滿足多語言切換需求，後期拓展海外業務時，字典數據改造工作量極大，不符合項目國際化佈局規劃。

4\.  濫用字典表埋下運維災難：為簡化開發將商品分類等具備層級、業務關聯的複雜選項存入字典表，會導致數據雜亂、冗餘、聯動失效，隨着業務迭代逐步形成無法整改的運維隱患，制約功能優化。

5\.  特殊標準化數據無法適配：行政區劃等國標級標準化數據，具備固定層級與規範，字典表無法適配其層級結構與批量更新需求，無法保障數據準確性與調用效率。

#### 三、變更決定

1\.  本次版本變更後，正式捨棄項目中所有通用字典功能模塊，刪除相關字典表、字典管理接口及前端字典渲染相關代碼，不再新增任何基於通用字典的開發需求。

2\.  對現有基於字典表開發的功能模塊，由對應研發負責人牽頭，在規定期限內完成改造，遷移至新約定的管理方式，確保改造後業務邏輯不受影響、數據準確無誤。

3\.  禁止任何研發人員在後續開發中，擅自使用通用字典表或搭建類似字典的臨時管理模塊，違規者將按項目技術規範進行考核。

#### 四、後續執行的技術新約定

##### 4\.1 業務常量管理約定

所有深度綁定核心業務邏輯的常量（狀態值、流程控制值、業務判定值等），統一採用代碼枚舉方式定義，明確註釋釋義、使用場景及關聯業務邏輯；常量修改需經過代碼評審流程，嚴禁擅自修改，避免引發邏輯錯誤。

##### 4\.2 複雜選擇項管理約定

商品分類、業務類型、層級類目等具備層級關係、業務聯動關係的複雜選擇項，由研發人員通過專屬業務功能模塊、獨立業務數據表開發實現，明確層級關聯與數據校驗規則，杜絕用字典表替代簡化開發。

##### 4\.3 標準化公共數據管理約定

行政區劃、地域編碼等固定標準化公共數據，採用以下兩種方式管理（二選一）：

（1）搭建獨立專屬數據表，規範層級結構，建立批量更新、數據校驗機制，由專人負責維護；


# 感謝 & 友情鏈接

在此，首先要向各位開源前輩、向 Jeecg 等眾多優秀框架的開發者們致以最誠摯的敬意。正是在這些優秀作品的薰陶與滋養下，我才得以在實際工作中不斷沉澱、穩步成長，也才能真正做出一些看得見的成績。

從業多年，我始終受益於開源精神的光芒。在無數優秀開源框架的陪伴下，我得以博採眾長、融會貫通，逐步形成了自己的技術理解與架構思路，並基於這些積累，研發了這套更貼合自身場景與理念的框架。

如今將它開源，既是致敬一路指引我的開源前輩們，也希望以微薄之力回饋社區。願本框架能為更多同行帶來便利、啓發與價值；也願開源之路常有人前行、常有人照亮。以下致謝不分先後；若有采納、借鑑方面的疏漏，歡迎在文末倉庫地址處提 Issue，我會盡快處理。

## Spring Boot

毋庸置疑，**Spring Boot** 在 Java 應用開發領域影響深遠，顯著降低了工程化與交付門檻。


## Jeecg

筆者曾在某科技公司從業三年，做過政務、教育等領域大小系統 **100+** 套；**Jeecg** 在圈內影響力大、生態成熟，是很多同類項目的參照標杆。

## RuoYi

筆者從業多年，接觸過不少優秀項目；**RuoYi** 框架簡潔易懂，在國內知名度很高。

## Maku

筆者早期接觸的系統中，**Maku** 的代碼風格最讓我認同。

## Activiti

工作流方向的經典開源方案之一。

## Hutool

「天下誰人不識君」——憑豐富的工具封裝，讓 Java 日常開發更順手、更簡潔。

## WxJava（weixin-java-tools）

曾經對接微信平台頗為頭疼；**WxJava** 的封裝簡潔高效，事半功倍。

## Excel 導入導出

曾借鑑過某位作者分享的導出工具思路，原項目地址現已難覓。若作者看到本文，歡迎聯繫我補錄到致謝列表。

## Vue

國人驕傲的前端框架之一；若要給前端開源分個「時代」，我願意説 **Vue** 定義了其中一段主流敍事。

## Element Plus

管理端採用 **Element Plus**（生態上繼承自 **Element UI**）。稱它為「最好用的後台 UI 組件庫之一」並不為過，不知幫多少項目穩步落地。

## Unibest

一個非常好用的前端框架，ai編程非常順暢，生成的頁面很美觀，聽説項目發起方説要適配uniapp x ，期待一波。

# 倉庫地址及演示環境

- **Gitee 倉庫**：[https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
- **文檔站點**：[http://docs.module.pub](http://docs.module.pub)
- **演示環境**：[http://tg.module.pub](http://tg.module.pub)

# 版本變更歷史

## v3.6.0（2026-05-20）

**次版本升級**（`3.5.2` → `3.6.0`）：Maven 統一版本號見根 `pom.xml` 的 `<revision>`。本版以架構收斂與 AI 協作友好為主，無 Spring Boot 大版本變更（仍為 3.5.x 系）。

### 移除低代碼 / 代碼生成模塊

**變更**：下線平台內置的「低代碼 / 可視化代碼生成」能力（含基於生成器的 `crud` 批量產出鏈路），不再維護生成器模板與配套管理端入口。

**原因與替代思路**：

- 本倉庫定位已明確為 **面向 AI 助手與開發者的模塊化單體**：契約、命名、模塊邊界寫在 README 與 `spring-boot-starter-module` 各子模塊説明中，由 AI 按約定**從表結構設計 → API 契約 → `*-biz` 實現**一氣呵成，比「先配元數據再點生成」更貼近真實迭代節奏。
- 生成器產出往往帶來大量同質代碼，後續改字段、改邊界時容易與手寫 `biz` 層糾纏，長期維護成本高於「小步手寫 + 評審」。
- 在 Cursor、Copilot 等工具普及後，**自然語言 + 倉庫約定**即可穩定產出符合 `*-api` / 目錄式命名的代碼，且便於隨業務即時調整，無需再維護一套與框架版本綁定的模板 DSL。

**對開發者的影響**：新功能請直接按本文「架構與代碼約定」「開發風格」新增模塊或擴展 `*-biz`；歷史由生成器產生的 `crud` 目錄可隨業務改造逐步收斂為手寫結構，不必依賴已移除的生成入口。

### 移除通用字典模塊，改為常量與專屬數據管理

**變更**：捨棄 `spring-boot-starter-dict` 及通用字典表、字典管理接口、前端統一字典渲染鏈路；選項類數據改按下文 **[關於捨棄字典模塊的新約定](#關於捨棄字典模塊的新約定)** 執行。

**原因摘要**（完整論述見上文該節）：

| 維度 | 説明 |
|------|------|
| 研發效率 | 編碼分散在庫表，開發需反覆查庫核對，打斷實現與聯調 |
| 穩定性 | 與流程、權限綁定的核心碼值若可被非研發在後台改動，易引發線上邏輯故障 |
| 國際化 | 通用字典難以承載多語言展示與穩定編碼分離 |
| 模型適配 | 層級類目、國標區劃等不適合塞進「扁平字典」 |
| 演進成本 | 濫用字典表易形成難以治理的數據債 |

**遷移方向**：

- **業務常量 / 狀態機**：在 `*-api` 用枚舉或常量類定義，修改走代碼評審；簡單二值狀態繼續採用 `*StatusCode` 約定（見 [布爾式狀態機](#布爾式狀態機statuscode)）。
- **複雜選項**：獨立業務表或專屬管理功能，保留層級與聯動。
- **標準化公共數據**：獨立表或受控同步，禁止再用通用字典替代。

**對開發者的影響**：字段仍遵循 `*Code` 存編碼、前端按編碼展示；僅**數據來源**從「平台字典服務」改為「模塊內契約 + 業務數據」。升級時請清理對字典 Starter、字典 HTTP 接口的依賴，並核對存量數據是否已遷至枚舉或業務表。

*文檔與倉庫同步更新；若你發現 README 與 `pom` 不一致，以 `spring-boot-starter-module` 下實際模塊為準，歡迎提 Issue。*

## 歷史版本

| 版本 | 説明 |
|------|------|
| 3.5.2 | 上一穩定次版本；含描述式系統日誌等能力（管理端見 `V3.5.2+` 説明） |