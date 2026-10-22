---
title: 架構與邊界
description: 模塊化單體、Api 契約、AUTO 路由與 MQ 事件：一頁看懂 TG-boot 的結構和演進路線。
---

<div class="doc-eyebrow">ARCHITECTURE · ONE PROCESS, REAL BOUNDARIES</div>

<p class="doc-lead">
  TG-boot 的默認形態是“模塊化單體”：源碼按 Maven 模塊切得很細，運行時卻裝配進同一個 runner。
  它用單進程換取交付效率，用契約與門禁保住未來拆分的能力。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>1<em> runner</em></strong><span>默認運行單元</span></div>
  <div class="doc-metric"><strong>2<em> 軌</em></strong><span>同步 Api / 異步 MQ</span></div>
  <div class="doc-metric"><strong>AUTO</strong><span>本地優先，遠程兜底</span></div>
  <div class="doc-metric"><strong>4<em> 層</em></strong><span>common / api / biz / runner</span></div>
</div>

## 一、先看全貌

```text
tg-boot
└── spring-boot-starter-module                Maven 反應堆根
    ├── spring-boot-starter-common            內核：Result / BaseEntity / MQ / RPC
    ├── spring-boot-starter-components        通用能力域
    │   ├── spring-boot-starter-system        用户 / 組織 / 權限
    │   ├── spring-boot-starter-trade         商品 / 訂單 / 支付
    │   ├── spring-boot-starter-verification  實名 / 內容審核
    │   └── ...                               文件 / CMS / IM / 短信 / Excel ...
    ├── spring-boot-starter-business          垂直業務域
    │   ├── spring-boot-starter-dating        婚戀 / 客户
    │   └── spring-boot-starter-parent-led    親家
    ├── spring-boot-starter-runner            可執行裝配殼（微內核）
    └── spring-boot-starter-architecture-tests 架構門禁
```

每個能力域再拆成兩個模塊：

```text
spring-boot-starter-{域}/
├── spring-boot-starter-{域}-api/    契約：Api**Service、事件、DTO、枚舉
└── spring-boot-starter-{域}-biz/    實現：Controller、Service、Mapper、Consumer
```

這就是最重要的空間約束：**接口和實現，從目錄上就是分開的。**

## 二、四層的職責

| 層 | 應該放什麼 | 不應該放什麼 |
| --- | --- | --- |
| `common` | Result、異常、BaseEntity、MQ 與 RPC 支撐、安全基礎設施 | 任何業務邏輯 |
| `*-api` | 跨模塊接口、DTO、事件契約、枚舉、常量 | 傳輸代碼、`crud.entity`、`Spi*` |
| `*-biz` | Controller、業務 Service、持久化、消費者、模塊內 SPI | 依賴他域 `*-biz`、手寫 MQ binding |
| `runner` | 按需裝配 `*-biz`、啓動配置 | 業務代碼 |

一條經驗規則：

> 如果一段代碼需要被**另一個模塊**調用，它才應該出現在 `*-api`；
> 如果它只服務於本域，就應該留在 `*-biz`。

## 三、三條不可越過的邊界

### 3.1 跨模塊只能依賴契約

```java
// 在 dating-biz 中
@Resource
private ApiSysUserService apiSysUserService; // 注入的是代理，不是 Impl

UserDTO user = apiSysUserService.getByUserCode(code);
```

禁止：

```java
// 錯誤：直接依賴他域實現
@Resource
private SysUserServiceImpl sysUserServiceImpl;

// 錯誤：跨域 Mapper / SQL JOIN
@Select("select * from sys_user where user_code = #{code}")
UserDTO selectUser(String code);
```

### 3.2 `*-api` 不依賴 `*-biz`

`*-api` 是“可被外部依賴的最小集合”。一旦它引用了實體或實現，所有調用方都會被迫拖上一整套持久化依賴。

### 3.3 模塊內多實現用 SPI，不用跨模塊接口

支付渠道、短信供應商、文件存儲，這些是**模塊內**的變化點：

- 接口定義在 `*-biz/service`，命名為 `Spi**Service`；
- 多個實現通過註冊表或 `List<實現>` 路由；
- 不要把 SPI 放到 `*-api`，否則它會被誤認為跨模塊契約。

## 四、兩條協作軌道

### 4.1 同步軌：像 Feign 一樣調用

```text
調用方
  @Resource ApiXxxService
        │
        ▼
  ModuleApiProxy（JDK 動態代理）
        │
        ├─ 本 JVM 有 Provider ──► 本地直調
        │
        └─ 沒有 Provider ──────► MQ Request-Reply
                                  隊列 api.rpc.{module}
```

關鍵點：

- 路由固定 **AUTO**，不需要配置“單體 / 微服務”模式；
- 接口必須標註 `@RpcApi`，並位於 `pub.module.{module}.api.service`；
- 返回值是業務 DTO 或 `void`，不要返回 HTTP 層的 `Result`；
- 方法粒度按用例設計，便於未來遠程化與事務編排。

### 4.2 異步軌：事件在事務提交後出發

```java
// 發佈方：只依賴事件契約
mqPublisher.publishAfterCommit(SystemUserLoginConsumer.class, payload);
```

```java
// 消費方：直接實現契約
@Component
public class ParentLedSystemUserLoginHandler implements SystemUserLoginConsumer {
    @Override
    public void onUserLogin(Payload message) {
        if (!accepts(message)) {
            return;
        }
        // 冪等處理
    }
}
```

約束：

- **禁止**在 `@Transactional` 內直接 `publish`，必須 `publishAfterCommit`；
- 禁止在業務模塊裏直接使用 `RabbitTemplate` 做跨模塊調用；
- 消費者必須説明冪等鍵；
- 事件名遵循 `{域}.{實體}.{動作}`，例如 `trade.order-goods.paid`。

## 五、數據與事務

- 實體繼承 `BaseEntity`，統一審計字段；
- 技術主鍵 `id`，業務主鍵 `xxxCode`；
- 表前綴按域劃分（`sys_`、`td_`、`dt_`、`pl_`、`vt_` 等）；
- 跨表冗餘字段與來源字段同名語義，前綴隨本表變化；
- 同步鏈路的事務邊界在用例層；
- 異步鏈路採用“本地事務 + 提交後事件 + 冪等消費”，不把 MQ 放進 2PC。

## 六、從單體到多 runner

| 階段 | 形態 | 主要改動 |
| --- | --- | --- |
| Phase 1 | 一個 runner，全部 `*-biz` | 默認狀態，交付最快 |
| Phase 2 | 按域拆多個 runner，共享 Broker | 新建 runner 的 POM 與啓動配置 |
| Phase 3 | 獨立數據域 | 拆分 schema / 數據庫，處理跨域查詢 |
| Phase 4 | 分佈式事務與可觀測性 | 在 RPC 攔截鏈上引入事務傳播、追蹤與治理 |

關鍵結論：**業務代碼不需要為拆分重寫。** 調用方仍然注入 `Api**Service`，只是本 JVM 沒有 Provider 時，代理自動改走 MQ。

## 七、常見誤解

| 誤解 | 實際情況 |
| --- | --- |
| “模塊化單體就是普通單體換個目錄” | 不是。它有契約、模塊依賴規則和架構門禁 |
| “拆微服務時要把 Api 改成 HTTP 客户端” | 不需要。調用方仍然面向接口 |
| “用了 MQ 就一定是微服務” | 不是。單進程內也可以使用 MQ 做解耦 |
| “所有跨模塊調用都應該異步” | 不是。需要立即返回結果的用例仍走同步 Api |
| “架構測試只是形式” | 它會在 CI 中直接失敗，阻止越界合併 |

## 八、驗收這份架構的四句話

<div class="doc-quote">
  能在一個進程裏交付，<br>
  能在不改業務的前提下拆分，<br>
  能在編譯期發現依賴越界，<br>
  能讓 AI 只看目錄就知道代碼該放哪裏。
  <small>ARCHITECTURE ACCEPTANCE</small>
</div>

下一步建議閲讀 [跨模塊契約](/zh-Hant/ai/contracts/)，把這兩條軌道落到可複製的代碼模板。
