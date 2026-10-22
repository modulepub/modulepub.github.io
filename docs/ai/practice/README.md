---
title: 实操：新增一个模块
description: 以 campaign 活动模块为例，从 Maven 骨架到契约、实体、Controller、MQ、runner 装配与架构门禁。
---

<div class="doc-eyebrow">HANDS-ON · BUILD CAMPAIGN FROM ZERO</div>

<p class="doc-lead">
  这一页用一个虚构但完整的 <code>campaign</code> 活动模块，走一遍 TG-boot 的真实开发闭环。
  重点不是复制代码，而是理解每一步<strong>为什么存在</strong>，以及 AI 应该在什么时候介入。
</p>

::: tip 示例约定
- 模块：`campaign`，表前缀 `cp_`
- 首个聚合：`CampaignActivity`（活动）
- 包名：`pub.module.campaign`
- 产物：一个管理端 CRUD + 一个“活动发布”事件契约
- 不涉及真实业务字段与外部供应商
:::

## 第 0 步：先确认边界

在写任何代码前，先回答四个问题：

| 问题 | 本例答案 |
| --- | --- |
| 它是技术能力还是业务产品？ | 业务产品，放 `business` |
| 是否已有域可以承载？ | 没有，现有域都不负责“活动” |
| 是否需要跨模块契约？ | 需要发布“活动已发布”事件，供其他域订阅 |
| 是否需要新表？ | 需要 `cp_activity` |

如果第 2 个问题的答案是“已有域可以承载”，就不要新建模块。模块化不是模块越多越好。

## 第 1 步：搭 Maven 骨架

目标结构：

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

同时把 `spring-boot-starter-campaign` 加入 `spring-boot-starter-business/pom.xml` 的 `<modules>`。

### api / biz 的 POM 关系

- `campaign-api` 依赖 `spring-boot-starter-common`；
- `campaign-biz` 依赖 `campaign-api` 与 `spring-boot-starter-common`；
- `campaign-biz` **不要**依赖其他域的 `*-biz`；
- 如果确实需要其他域的能力，依赖对方的 `*-api`。

::: warning 不要复制整份 POM
上面的片段只展示关键结构。实际新增时，复制同域模块的 POM，再替换 artifactId、parent 与描述，避免漏掉仓库统一的构建配置。
:::

## 第 2 步：写契约

### DTO

```java
package pub.module.campaign.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "活动 DTO")
public class CampaignActivityDTO {

    @Schema(description = "活动编码")
    private String campaignActivityCode;

    @Schema(description = "活动名称")
    private String campaignActivityName;

    @Schema(description = "状态：0 否 / 1 是")
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

### 异步事件

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

目的地按规则推导为 `campaign.activity.published`。

## 第 3 步：实体、Mapper、基础 Service

### 实体

```java
package pub.module.campaign.crud.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import pub.module.common.model.po.BaseEntity;

@Data
@EqualsAndHashCode(callSuper = false)
@Schema(description = "活动")
public class CampaignActivity extends BaseEntity {

    @Schema(description = "活动编码")
    private String campaignActivityCode;

    @Schema(description = "活动名称")
    private String campaignActivityName;

    @Schema(description = "状态：0 否 / 1 是")
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

### 基础 Service

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

注意 `IService` / `ServiceImpl` 的包名是 `com.baomidou.mybatisplus.spring.service.*`，与旧版不同。

## 第 4 步：业务 Service 与自动配置

### 实现跨模块 Api

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

### 自动配置

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

### 注册自动配置

文件：`src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`

```text
pub.module.campaign.BizCampaignAutoConfiguration
```

没有这个文件，`*-biz` 被打进 runner 也不会自动装配。

## 第 5 步：Controller 与事件发布

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

@Tag(name = "管理端-活动")
@RestController
@RequestMapping("/mgt/campaign/activity")
public class MgtCampaignActivityController {

    @Resource
    private CampaignActivityService campaignActivityService;

    @Operation(summary = "活动详情")
    @GetMapping("/queryByCode")
    public Result<CampaignActivity> queryByCode(@RequestParam String code) {
        return Result.ok(campaignActivityService.getByCode(code));
    }

    @Operation(summary = "新增活动")
    @PostMapping("/add")
    public Result<String> add(@RequestBody CampaignActivity activity) {
        campaignActivityService.save(activity);
        return Result.ok("添加成功");
    }
}
```

### 发布事件

在真正发布活动的业务方法里：

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
            throw new IllegalArgumentException("活动不存在");
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

## 第 6 步：装配进 runner

在 `spring-boot-starter-runner/pom.xml` 增加：

```xml
<dependency>
    <groupId>pub.module</groupId>
    <artifactId>spring-boot-starter-campaign-biz</artifactId>
    <version>${project.version}</version>
</dependency>
```

然后启动 runner。装配成功的标志：

- 启动日志中出现 `BizCampaignAutoConfiguration`；
- `/mgt/campaign/activity/queryByCode` 可访问；
- 事件发布后，消费者能收到消息（如果已实现）。

## 第 7 步：多端界面，复用中台模板

后端模块完成后，界面层不需要从零搭。以 [`uniapp-middle-platform`](/ai/uniapp-middle-platform/) 为模板，
新增本模块的后台、微信小程序和 App 页面。

```text
uniapp-middle-platform/
├── src/pages/manage_ability/campaign/
│   ├── index.vue                 # 模块工作台
│   ├── activity/index.vue        # 活动列表
│   └── components/               # 表单、详情、选择器
└── src/pages/manage/api/campaign.ts
```

能直接复用的部分：

- 管理端登录态、页面守卫、权限与菜单；
- `MgAdminLayout` 布局、页签、主题；
- 请求封装、token 注入、统一错误处理；
- 上传、表格、弹窗、表单、字典等公共组件；
- H5、小程序、App 的多端构建入口。

你只需要写：

- 本模块的页面与交互；
- 本模块的 `/mgt` API；
- 平台差异（登录、支付、分享、文件等）的适配；
- 功能地图中的菜单、按钮与接口节点。

```bash
cd uniapp-middle-platform
pnpm dev:h5     # 后台 / 浏览器
pnpm dev:mp     # 微信小程序
pnpm dev:app    # App
```

::: info 模板边界
`uniapp-middle-platform` 当前承载核心中台能力，不是所有业务后台的堆放处。
新业务以它为模板建立自己的前端工程，公共能力继续从模板升级；
不要把婚恋、亲家、路演等业务页面塞回公共中台。
:::

## 第 8 步：补数据库脚本

按仓库现有方式同步 SQL 脚本，至少包含：

```sql
create table cp_activity (
    id varchar(32) not null comment '技术主键',
    campaign_activity_code varchar(64) not null comment '活动编码',
    campaign_activity_name varchar(128) not null comment '活动名称',
    campaign_activity_status_code char(1) default '0' comment '状态：0否 1是',
    create_time datetime comment '创建时间',
    update_time datetime comment '更新时间',
    create_by varchar(64) comment '创建人',
    update_by varchar(64) comment '更新人',
    deleted tinyint default 0 comment '逻辑删除',
    version int default 0 comment '版本号',
    primary key (id),
    unique key uk_cp_activity_code (campaign_activity_code)
) comment '活动';
```

字段以 `BaseEntity` 的实际定义为准。不要只建表不补索引，也不要把所有字段都设成 `varchar(255)`。

## 第 9 步：测试与架构门禁

### 编译

```bash
mvn -q -DskipTests compile
```

### 模块测试

```bash
mvn -pl spring-boot-starter-business/spring-boot-starter-campaign -am test
```

### 架构门禁

```bash
mvn -pl spring-boot-starter-architecture-tests -am test
```

### 启动验证

```bash
powershell -ExecutionPolicy Bypass -File scripts\run-runner.ps1
```

访问 Swagger，确认新接口出现；调用一次新增与查询；观察日志中是否有本地路由或 MQ 路由记录。

## 第 10 步：让 AI 复述它的改动

实现完成后，不要只问“完成了吗”。让它输出一份可核对的交付说明：

```text
请用下面的格式总结本次改动：
1. 新增/修改的文件清单；
2. 每个文件解决了什么问题；
3. 新增了哪些契约、事件、配置；
4. 执行了哪些命令，实际输出是什么；
5. 还有哪些未验证项或风险；
6. 如果要把这个模块拆成独立 runner，需要改哪里。
```

如果它无法回答第 6 个问题，说明它还没有真正理解模块化单体的边界。

## 验收清单

<ul class="doc-checklist">
  <li>模块位于正确的 components / business 聚合下；</li>
  <li>api 与 biz 的依赖方向正确，没有跨域 biz 依赖；</li>
  <li>实体继承 BaseEntity，业务主键使用 *Code；</li>
  <li>自动配置已注册到 imports 文件；</li>
  <li>事件在事务提交后发布，消费者有幂等策略；</li>
  <li>runner 装配后可启动、可访问、可发布事件；</li>
  <li>编译、单测、架构门禁全部通过；</li>
  <li>界面层以 uniapp-middle-platform 为模板，复用登录、权限、布局与请求；</li>
  <li>目标端（H5 / 小程序 / App）分别完成运行验证；</li>
  <li>SQL 脚本、README、事件登记已同步。</li>
</ul>

<div class="doc-quote">
  一个模块真正完成的标志，不是“页面能打开”，<br>
  而是下一个人（或 AI）能在不了解你思路的情况下，安全地继续修改它。
  <small>DEFINITION OF DONE</small>
</div>
