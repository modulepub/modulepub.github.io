---
title: spring-boot-starter-components
createTime: 2026/05/09
permalink: /dev/tg-boot/components/
---

# spring-boot-starter-components

**通用能力聚合**：为业务模块提供系统管理、交易支付、内容、文件、消息、核验、任务调度等可装配 starter；多数能力采用 `-api`（契约/DTO/配置）+ `-biz`（实现、HTTP、自动配置）分层。

`spring-boot-starter-common`（统一响应、异常、基础实体、MQ 基础设施等）已作为 [starter-module](/dev/tg-boot/starter-module/) 的直接子模块，见其 [common](/dev/tg-boot/components/common/)。

## 子模块一览（与 `pom.xml` 一致）

| 模块 | 业务与职责摘要 | 文档 |
|------|------------------|------|
| `spring-boot-starter-system` | 登录/验证码、用户组织角色权限等后台与用户端能力 | [system](/dev/tg-boot/components/system/) |
| `spring-boot-starter-trade` | 商品订单、微信支付；支付成功后 MQ 发布 `trade.order-goods.paid` | [trade](/dev/tg-boot/components/trade/) |
| `spring-boot-starter-distribution` | 分销分佣、钱包；MQ 消费支付事件、request-reply 查询推广角色 | [distribution](/dev/tg-boot/components/distribution/) |
| `spring-boot-starter-verification` | 二要素核验、资产认证；核验通过后 MQ 通知 customer 等 | [verification](/dev/tg-boot/components/verification/) |
| `spring-boot-starter-wechat` | 微信网页能力、登录等（`WxController` / `WxLoginController`） | [wechat](/dev/tg-boot/components/wechat/) |
| `spring-boot-starter-file` | 上传与文件管理（`FileController`、`MgtFileController` 等） | [file](/dev/tg-boot/components/file/) |
| `spring-boot-starter-cms` | CMS 节点；公开与管理端接口 | [cms](/dev/tg-boot/components/cms/) |
| `spring-boot-starter-im` | IM 相关用户端接口 | [im](/dev/tg-boot/components/im/) |
| `spring-boot-starter-excel` | Excel 导入导出（如 `PubExcelController`） | [excel](/dev/tg-boot/components/excel/) |
| `spring-boot-starter-ocr` | OCR HTTP（银行卡等），底层实现通过命名 Bean（如 `bizKsOcrService`） | [ocr](/dev/tg-boot/components/ocr/) |
| `spring-boot-starter-sms` | 短信发送门面，多厂商 SPI 实现可切换 | [sms](/dev/tg-boot/components/sms/) |

> **v3.6.0 起已移除**：`spring-boot-starter-dict`（通用字典）、`spring-boot-starter-generator`（代码生成）、`spring-boot-starter-job`（XXL-Job 集成说明模块）。详见 [TG-boot 总览 · 版本变更](/dev/tg-boot/#版本变更历史)。

## 装配方式

- 各 `-biz` 模块通过 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 注册 `Biz*AutoConfiguration`，引入对应依赖后即参与 Spring Boot 自动配置。
- 跨模块协作优先依赖 **对方 `-api` 模块** 中的接口与 DTO，避免直连 `-biz` 实现类。

## 扩展建议

- 新增组件：在本聚合下新建 `spring-boot-starter-xxx`（含 `-api`/`-biz`），并实现自动配置类。
- 跨模块事件：在 `-api/messaging` 定义 `XxxConsumer` 契约与消息 DTO，在 `-biz/messaging` 实现发布/消费；binding 由 common 自动注册。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`
