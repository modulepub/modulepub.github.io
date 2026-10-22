---
title: 跨模塊契約
description: 同步 Api 與異步 MQ 的完整模板：接口、實現、調用、發佈、消費與冪等。
---

<div class="doc-eyebrow">CONTRACTS · THE ONLY WAY ACROSS BOUNDARIES</div>

<p class="doc-lead">
  在 TG-boot 裏，模塊之間沒有“順手調一下”的捷徑。
  要麼聲明一個 <code>Api**Service</code> 契約，要麼發佈一個 MQ 事件契約。
  這聽起來更麻煩，但它換來的是：依賴可追蹤、影響面可枚舉、AI 可複用同一套模板。
</p>

## 一、先做選擇：同步還是異步？

```text
需要立即拿到結果？
├─ 是 → Api**Service（同步 RPC）
└─ 否 → 有多個訂閲方，或允許最終一致？
   ├─ 是 → XxxConsumer（異步事件）
   └─ 否 → 再確認是否真的需要跨模塊；可能應留在本域
```

| 場景 | 選擇 | 例子 |
| --- | --- | --- |
| 下單前校驗用户狀態 | 同步 Api | 調用 `ApiSysUserService` |
| 支付成功後通知多個域 | 異步事件 | `trade.order-goods.paid` |
| 頁面實時查詢訂單 | 同步 Api | `ApiTdOrderService` |
| 用户註冊後發歡迎消息、初始化分銷 | 異步事件 | `system.user.registered` |

## 二、同步契約：Api 接口

### 2.1 定義在 `*-api/service`

```java
package pub.module.system.api.service;

import pub.module.rpc.spi.RpcApi;
import pub.module.system.api.dto.UserDTO;

@RpcApi
public interface ApiSysUserService {

    UserDTO getByUserCode(String userCode);

    void updateLastLogin(String userCode);
}
```

規則：

- 接口命名 `Api**Service`；
- 必須在 `pub.module.{module}.api.service` 包下；
- 入參 / 出參只能是 `*-api/dto`、枚舉或簡單類型；
- 返回業務 DTO 或 `void`，不要返回 `Result`；
- 不使用 default 方法；
- 方法粒度按用例，不按表。

### 2.2 實現在 `*-biz/service/impl`

```java
package pub.module.system.biz.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pub.module.system.api.dto.UserDTO;
import pub.module.system.api.service.ApiSysUserService;

@Service
@RequiredArgsConstructor
public class ApiSysUserServiceImpl implements ApiSysUserService {

    private final SysUserService sysUserService;

    @Override
    public UserDTO getByUserCode(String userCode) {
        return sysUserService.getDtoByCode(userCode);
    }

    @Override
    public void updateLastLogin(String userCode) {
        sysUserService.updateLastLogin(userCode);
    }
}
```

實現類只做業務編排，不寫傳輸細節。

### 2.3 調用方直接注入

```java
@Service
@RequiredArgsConstructor
public class DatingLoginService {

    private final ApiSysUserService apiSysUserService;

    public UserDTO loadUser(String userCode) {
        return apiSysUserService.getByUserCode(userCode);
    }
}
```

注入的是 `common` 生成的代理。調用方不需要判斷本地還是遠程。

### 2.4 隊列與路由

| 項 | 規則 |
| --- | --- |
| module 鍵 | 從包路徑 `pub.module.{module}.api...` 推導 |
| 請求隊列 | `api.rpc.{module}` |
| 應答 | Rabbit Request-Reply 臨時隊列 |
| 路由 | 本地 Provider 優先，否則 MQ |
| 超時 | `tg.module-call.default-timeout-ms` |

不要在 YAML 裏手配隊列名或 reply-prefix。

## 三、異步契約：事件

### 3.1 契約定義在 `*-api/subscribe`

```java
package pub.module.system.api.subscribe;

import lombok.Data;
import pub.module.event.spi.MqChannel;
import pub.module.event.spi.MqMessageConsumer;
import pub.module.system.api.dto.UserDTO;

import java.io.Serializable;

@MqChannel
public interface SystemUserRegisteredConsumer
        extends MqMessageConsumer<SystemUserRegisteredConsumer.Payload> {

    void onUserRegistered(Payload message);

    @Data
    class Payload implements Serializable {
        private UserDTO user;
        private String source;
        private String userRegEntryCode;
    }
}
```

默認推導：

- destination：`system.user.registered`
- producerFunction：`systemUserRegistered`
- 消費 group：消費者所在模塊（如 `dating`、`distribution`）

如果顯式配置了 destination / producerFunction，則以手寫值為準。

### 3.2 發佈：事務提交後

```java
@Service
@RequiredArgsConstructor
public class SysUserRegisterService {

    private final MqPublisher mqPublisher;

    @Transactional
    public void register(RegisterCommand command) {
        SysUser user = createUser(command);

        SystemUserRegisteredConsumer.Payload payload =
                new SystemUserRegisteredConsumer.Payload();
        payload.setUser(toDto(user));
        payload.setSource(command.getSource());

        mqPublisher.publishAfterCommit(SystemUserRegisteredConsumer.class, payload);
    }
}
```

不要寫：

```java
// 錯誤：事務尚未提交，消息可能先被消費
mqPublisher.publish(SystemUserRegisteredConsumer.class, payload);
```

### 3.3 消費：直接實現契約

```java
@Component
@RequiredArgsConstructor
public class DatingUserRegisteredHandler implements SystemUserRegisteredConsumer {

    private final DatingCustomerService datingCustomerService;

    @Override
    public void onUserRegistered(Payload message) {
        if (!"dating".equals(message.getSource())) {
            return;
        }
        datingCustomerService.initFromUser(message.getUser());
    }
}
```

不要為了訂閲再建一箇中間接口。契約本身就是訂閲點。

## 四、冪等：異步鏈路不能假設“只來一次”

每個消費者都要回答：**同一條消息重複投遞時，會發生什麼？**

常見冪等鍵：

| 事件 | 冪等鍵 |
| --- | --- |
| `trade.order-goods.paid` | `tdOdGdCode` |
| `wx.pay.notify` | `outTradeNo` |
| `verification.face-auth.finished` | `faRecordCode` |
| `system.user.registered` | userCode + 來源 |
| `dating.profile.updated` | cusCode + 字段版本 |

實現方式可以是唯一索引、狀態機判斷、去重表或 Redis 標記。重點不是技術選型，而是**在消費前就定義好重複的判定標準**。

## 五、契約變更的禮儀

- 新增字段：保持向後兼容，消費方忽略未知字段；
- 刪除字段：先停止使用，再刪除，至少跨一個發佈週期；
- 改事件名：視為破壞性變更，必須新增 destination 並雙寫過渡；
- 改方法簽名：同步契約直接破壞調用方，必須評估所有實現與調用點；
- 不要讓 `*-api` 的 DTO 繼承 `*-biz` 的實體。

## 六、測試與驗收

<ul class="doc-checklist">
  <li>同步：本地有 Provider 時是否走本地，無 Provider 時是否走 MQ？</li>
  <li>同步：業務異常是否被轉換為穩定的錯誤碼，而不是泄漏堆棧？</li>
  <li>異步：事務回滾時，事件是否沒有發出？</li>
  <li>異步：重複消費兩次，結果是否一致？</li>
  <li>事件：destination、group、冪等鍵是否登記？</li>
  <li>依賴：架構測試是否仍然通過？</li>
</ul>

<div class="doc-quote">
  契約不是文檔的裝飾，而是模塊之間唯一合法的“海關”。
  每一次跨邊界，都要留下可檢查的記錄。
  <small>CONTRACT-FIRST</small>
</div>
