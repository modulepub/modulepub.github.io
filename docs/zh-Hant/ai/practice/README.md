---
title: 實操：新增一個模塊
description: 以 campaign 活動模塊為例，從 Maven 骨架到契約、實體、Controller、MQ、runner 裝配與架構門禁。
---

<div class="doc-eyebrow">HANDS-ON · BUILD CAMPAIGN FROM ZERO</div>

<p class="doc-lead">
  這一頁用一個虛構但完整的 <code>campaign</code> 活動模塊，走一遍 TG-boot 的真實開發閉環。
  重點不是複製代碼，而是理解每一步<strong>為什麼存在</strong>，以及 AI 應該在什麼時候介入。
</p>

::: tip 示例約定
- 模塊：`campaign`，表前綴 `cp_`
- 首個聚合：`CampaignActivity`（活動）
- 包名：`pub.module.campaign`
- 產物：一個管理端 CRUD + 一個“活動發佈”事件契約
- 不涉及真實業務字段與外部供應商
:::

## 第 0 步：先確認邊界

在寫任何代碼前，先回答四個問題：

| 問題 | 本例答案 |
| --- | --- |
| 它是技術能力還是業務產品？ | 業務產品，放 `business` |
| 是否已有域可以承載？ | 沒有，現有域都不負責“活動” |
| 是否需要跨模塊契約？ | 需要發佈“活動已發佈”事件，供其他域訂閲 |
| 是否需要新表？ | 需要 `cp_activity` |

如果第 2 個問題的答案是“已有域可以承載”，就不要新建模塊。模塊化不是模塊越多越好。

## 第 1 步：搭 Maven 骨架

目標結構：

```text
spring-boot-starter-business/
└── spring-boot-starter-campaign/
    ├── pom.xml                                聚合 POM
    ├── spring-boot-starter-campaign-api/
    │   ├── pom.xml
    │   └── src/main/java/pub/module/campaign/api/
    │       ├── service/ApiCampaignActivityService.java
    │       ├── dto/CampaignActivityDTO.java
    │       └── subscribe/CampaignActivityPublishedConsumer.java
    └── spring-boot-starter-campaign-biz/
        ├── pom.xml
        └── src/main/
            ├── java/pub/module/campaign/
            │   ├── BizCampaignAutoConfiguration.java
            │   ├── biz/controller/mgt/MgtCampaignActivityController.java
            │   └── crud/{entity,mapper,service}/
            └── resources/META-INF/spring/
                └── org.springframework.boot.autoconfigure.AutoConfiguration.imports
```

### 聚合 POM

```xml
<parent>
    <groupId>pub.module</groupId>
    <artifactId>spring-boot-starter-business</artifactId>
    <version>${revision}</version>
</parent>

<artifactId>spring-boot-starter-campaign</artifactId>
<packaging>pom</packaging>

<modules>
    <module>spring-boot-starter-campaign-api</module>
    <module>spring-boot-starter-campaign-biz</module>
</modules>
```

同時把 `spring-boot-starter-campaign` 加入 `spring-boot-starter-business/pom.xml` 的 `<modules>`。

### api / biz 的 POM 關係

- `campaign-api` 依賴 `spring-boot-starter-common`；
- `campaign-biz` 依賴 `campaign-api` 與 `spring-boot-starter-common`；
- `campaign-biz` **不要**依賴其他域的 `*-biz`；
- 如果確實需要其他域的能力，依賴對方的 `*-api`。

::: warning 不要複製整份 POM
上面的片段只展示關鍵結構。實際新增時，複製同域模塊的 POM，再替換 artifactId、parent 與描述，避免漏掉倉庫統一的構建配置。
:::

## 第 2 步：寫契約

### DTO

```java
package pub.module.campaign.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "活動 DTO")
public class CampaignActivityDTO {

    @Schema(description = "活動編碼")
    private String campaignActivityCode;

    @Schema(description = "活動名稱")
    private String campaignActivityName;

    @Schema(description = "狀態：0 否 / 1 是")
    private String campaignActivityStatusCode;
}
```

### 同步 Api

```java
package pub.module.campaign.api.service;

import pub.module.campaign.api.dto.CampaignActivityDTO;
import pub.module.rpc.spi.RpcApi;

@RpcApi
public interface ApiCampaignActivityService {

    CampaignActivityDTO getByCode(String campaignActivityCode);
}
```

### 異步事件

```java
package pub.module.campaign.api.subscribe;

import lombok.Data;
import pub.module.campaign.api.dto.CampaignActivityDTO;
import pub.module.event.spi.MqChannel;
import pub.module.event.spi.MqMessageConsumer;

import java.io.Serializable;

@MqChannel
public interface CampaignActivityPublishedConsumer
        extends MqMessageConsumer<CampaignActivityPublishedConsumer.Payload> {

    void onActivityPublished(Payload message);

    @Data
    class Payload implements Serializable {
        private CampaignActivityDTO activity;
        private String operatorUserCode;
    }
}
```

目的地按規則推導為 `campaign.activity.published`。

## 第 3 步：實體、Mapper、基礎 Service

### 實體

```java
package pub.module.campaign.crud.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pub.module.common.model.po.BaseEntity;

@Data
@EqualsAndHashCode(callSuper = false)
@Schema(description = "活動")
public class CampaignActivity extends BaseEntity {

    @Schema(description = "活動編碼")
    private String campaignActivityCode;

    @Schema(description = "活動名稱")
    private String campaignActivityName;

    @Schema(description = "狀態：0 否 / 1 是")
    private String campaignActivityStatusCode;
}
```

### Mapper

```java
package pub.module.campaign.crud.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import pub.module.campaign.crud.entity.CampaignActivity;

public interface CampaignActivityMapper extends BaseMapper<CampaignActivity> {
}
```

### 基礎 Service

```java
package pub.module.campaign.crud.service;

import com.baomidou.mybatisplus.spring.service.IService;
import pub.module.campaign.crud.entity.CampaignActivity;

public interface CampaignActivityService extends IService<CampaignActivity> {

    CampaignActivity getByCode(String campaignActivityCode);
}
```

```java
package pub.module.campaign.crud.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.spring.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import pub.module.campaign.crud.entity.CampaignActivity;
import pub.module.campaign.crud.mapper.CampaignActivityMapper;
import pub.module.campaign.crud.service.CampaignActivityService;

@Service
public class CampaignActivityServiceImpl
        extends ServiceImpl<CampaignActivityMapper, CampaignActivity>
        implements CampaignActivityService {

    @Override
    public CampaignActivity getByCode(String code) {
        return getOne(new QueryWrapper<CampaignActivity>().lambda()
                .eq(CampaignActivity::getCampaignActivityCode, code), false);
    }
}
```

注意 `IService` / `ServiceImpl` 的包名是 `com.baomidou.mybatisplus.spring.service.*`，與舊版不同。

## 第 4 步：業務 Service 與自動配置

### 實現跨模塊 Api

```java
package pub.module.campaign.biz.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pub.module.campaign.api.dto.CampaignActivityDTO;
import pub.module.campaign.api.service.ApiCampaignActivityService;
import pub.module.campaign.crud.entity.CampaignActivity;

@Service
@RequiredArgsConstructor
public class ApiCampaignActivityServiceImpl implements ApiCampaignActivityService {

    private final CampaignActivityService campaignActivityService;

    @Override
    public CampaignActivityDTO getByCode(String code) {
        CampaignActivity entity = campaignActivityService.getByCode(code);
        if (entity == null) {
            return null;
        }
        CampaignActivityDTO dto = new CampaignActivityDTO();
        dto.setCampaignActivityCode(entity.getCampaignActivityCode());
        dto.setCampaignActivityName(entity.getCampaignActivityName());
        dto.setCampaignActivityStatusCode(entity.getCampaignActivityStatusCode());
        return dto;
    }
}
```

### 自動配置

```java
package pub.module.campaign;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = "pub.module.campaign.**")
@MapperScan(basePackages = "pub.module.campaign.crud.mapper")
@AutoConfiguration
public class BizCampaignAutoConfiguration {
}
```

### 註冊自動配置

文件：`src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

```text
pub.module.campaign.BizCampaignAutoConfiguration
```

沒有這個文件，`*-biz` 被打進 runner 也不會自動裝配。

## 第 5 步：Controller 與事件發佈

### 管理端接口

```java
package pub.module.campaign.biz.controller.mgt;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pub.module.campaign.crud.entity.CampaignActivity;
import pub.module.campaign.crud.service.CampaignActivityService;
import pub.module.common.model.vo.Result;

@Tag(name = "管理端-活動")
@RestController
@RequestMapping("/mgt/campaign/activity")
public class MgtCampaignActivityController {

    @Resource
    private CampaignActivityService campaignActivityService;

    @Operation(summary = "活動詳情")
    @GetMapping("/queryByCode")
    public Result<CampaignActivity> queryByCode(@RequestParam String code) {
        return Result.ok(campaignActivityService.getByCode(code));
    }

    @Operation(summary = "新增活動")
    @PostMapping("/add")
    public Result<String> add(@RequestBody CampaignActivity activity) {
        campaignActivityService.save(activity);
        return Result.ok("添加成功");
    }
}
```

### 發佈事件

在真正發佈活動的業務方法裏：

```java
@Service
@RequiredArgsConstructor
public class CampaignPublishService {

    private final CampaignActivityService campaignActivityService;
    private final MqPublisher mqPublisher;

    @Transactional
    public void publish(String code, String operatorUserCode) {
        CampaignActivity activity = campaignActivityService.getByCode(code);
        if (activity == null) {
            throw new IllegalArgumentException("活動不存在");
        }
        activity.setCampaignActivityStatusCode("1");
        campaignActivityService.updateById(activity);

        CampaignActivityPublishedConsumer.Payload payload =
                new CampaignActivityPublishedConsumer.Payload();
        payload.setActivity(toDto(activity));
        payload.setOperatorUserCode(operatorUserCode);

        mqPublisher.publishAfterCommit(CampaignActivityPublishedConsumer.class, payload);
    }
}
```

## 第 6 步：裝配進 runner

在 `spring-boot-starter-runner/pom.xml` 增加：

```xml
<dependency>
    <groupId>pub.module</groupId>
    <artifactId>spring-boot-starter-campaign-biz</artifactId>
    <version>${project.version}</version>
</dependency>
```

然後啓動 runner。裝配成功的標誌：

- 啓動日誌中出現 `BizCampaignAutoConfiguration`；
- `/mgt/campaign/activity/queryByCode` 可訪問；
- 事件發佈後，消費者能收到消息（如果已實現）。

## 第 7 步：多端界面，複用中台模板

後端模塊完成後，界面層不需要從零搭。以 [`uniapp-middle-platform`](/zh-Hant/ai/uniapp-middle-platform/) 為模板，
新增本模塊的後台、微信小程序和 App 頁面。

```text
uniapp-middle-platform/
├── src/pages/manage_ability/campaign/
│   ├── index.vue                 # 模塊工作台
│   ├── activity/index.vue        # 活動列表
│   └── components/               # 表單、詳情、選擇器
└── src/pages/manage/api/campaign.ts
```

能直接複用的部分：

- 管理端登錄態、頁面守衞、權限與菜單；
- `MgAdminLayout` 佈局、頁籤、主題；
- 請求封裝、token 注入、統一錯誤處理；
- 上傳、表格、彈窗、表單、字典等公共組件；
- H5、小程序、App 的多端構建入口。

你只需要寫：

- 本模塊的頁面與交互；
- 本模塊的 `/mgt` API；
- 平台差異（登錄、支付、分享、文件等）的適配；
- 功能地圖中的菜單、按鈕與接口節點。

```bash
cd uniapp-middle-platform
pnpm dev:h5     # 後台 / 瀏覽器
pnpm dev:mp     # 微信小程序
pnpm dev:app    # App
```

::: info 模板邊界
`uniapp-middle-platform` 當前承載核心中台能力，不是所有業務後台的堆放處。
新業務以它為模板建立自己的前端工程，公共能力繼續從模板升級；
不要把婚戀、親家、路演等業務頁面塞回公共中台。
:::

## 第 8 步：補數據庫腳本

按倉庫現有方式同步 SQL 腳本，至少包含：

```sql
create table cp_activity (
    id varchar(32) not null comment '技術主鍵',
    campaign_activity_code varchar(64) not null comment '活動編碼',
    campaign_activity_name varchar(128) not null comment '活動名稱',
    campaign_activity_status_code char(1) default '0' comment '狀態：0否 1是',
    create_time datetime comment '創建時間',
    update_time datetime comment '更新時間',
    create_by varchar(64) comment '創建人',
    update_by varchar(64) comment '更新人',
    deleted tinyint default 0 comment '邏輯刪除',
    version int default 0 comment '版本號',
    primary key (id),
    unique key uk_cp_activity_code (campaign_activity_code)
) comment '活動';
```

字段以 `BaseEntity` 的實際定義為準。不要只建表不補索引，也不要把所有字段都設成 `varchar(255)`。

## 第 9 步：測試與架構門禁

### 編譯

```bash
mvn -q -DskipTests compile
```

### 模塊測試

```bash
mvn -pl spring-boot-starter-business/spring-boot-starter-campaign -am test
```

### 架構門禁

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

### 啓動驗證

```bash
powershell -ExecutionPolicy Bypass -File scripts\run-runner.ps1
```

訪問 Swagger，確認新接口出現；調用一次新增與查詢；觀察日誌中是否有本地路由或 MQ 路由記錄。

## 第 10 步：讓 AI 複述它的改動

實現完成後，不要只問“完成了嗎”。讓它輸出一份可核對的交付説明：

```text
請用下面的格式總結本次改動：
1. 新增/修改的文件清單；
2. 每個文件解決了什麼問題；
3. 新增了哪些契約、事件、配置；
4. 執行了哪些命令，實際輸出是什麼；
5. 還有哪些未驗證項或風險；
6. 如果要把這個模塊拆成獨立 runner，需要改哪裏。
```

如果它無法回答第 6 個問題，説明它還沒有真正理解模塊化單體的邊界。

## 驗收清單

<ul class="doc-checklist">
  <li>模塊位於正確的 components / business 聚合下；</li>
  <li>api 與 biz 的依賴方向正確，沒有跨域 biz 依賴；</li>
  <li>實體繼承 BaseEntity，業務主鍵使用 *Code；</li>
  <li>自動配置已註冊到 imports 文件；</li>
  <li>事件在事務提交後發佈，消費者有冪等策略；</li>
  <li>runner 裝配後可啓動、可訪問、可發佈事件；</li>
  <li>編譯、單測、架構門禁全部通過；</li>
  <li>界面層以 uniapp-middle-platform 為模板，複用登錄、權限、佈局與請求；</li>
  <li>目標端（H5 / 小程序 / App）分別完成運行驗證；</li>
  <li>SQL 腳本、README、事件登記已同步。</li>
</ul>

<div class="doc-quote">
  一個模塊真正完成的標誌，不是“頁面能打開”，<br>
  而是下一個人（或 AI）能在不瞭解你思路的情況下，安全地繼續修改它。
  <small>DEFINITION OF DONE</small>
</div>
