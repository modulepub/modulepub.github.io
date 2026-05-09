---
title: spring-boot-starter-dating
createTime: 2026/05/09
permalink: /dev/tg-boot/business/dating/
---

# spring-boot-starter-dating

婚恋 / 约会垂直业务：匹配与推荐、意向与联系方式申请、偏好、红娘与婚介机构、客户侧与管理端运营能力，以及与统计相关的公开接口。

## Maven 结构

- **`spring-boot-starter-dating-api`**：`pub.module.dating.api.service.*` 等接口与 DTO，供其他模块（含交易插件）依赖。
- **`spring-boot-starter-dating-biz`**：业务实现、持久化、`BizDatingAutoConfiguration`、REST 控制器。
- **`spring-boot-starter-dating-plugin`**（可选）：交易扩展插件；`TradeDatingPluginAutoConfiguration` + `TradeDatingTgPlugin`（`TgPlugin` 元数据）；内含多个 `SpiNotifyThirdPaidResultService` 实现类，对应不同虚拟商品/合约付费成功后的业务。

## HTTP 能力（便于检索）

- **客户侧 `cus`**：匹配、推荐、意向、偏好、联系人、红娘关系等。
- **管理侧 `mgt`**：意向审核、匹配规则运营、红娘/门店、推荐配置等。
- **公开 `pub`**：机构/红娘展示、统计等（见 `Pub*`、`Statistic*` 控制器）。

具体路径与参数以 Swagger（`/swagger-ui/index.html`）与各 Controller 注解为准。

## 与交易模块的协作

- 引入 **`spring-boot-starter-dating-plugin`** 后，交易订单支付完成时会按商品品类编码选取对应的 `SpiNotifyThirdPaidResultService` Bean，执行婚恋侧履约（权益、合约类等）。
- 插件同时可被 **common** 插件注册逻辑识别（classpath / 外置 JAR 场景参见 [common](/dev/tg-boot/components/common/) 模块说明）。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-business/spring-boot-starter-dating/`
