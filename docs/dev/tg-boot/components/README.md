---
title: spring-boot-starter-components
createTime: 2026/05/09
permalink: /dev/tg-boot/components/
---

# spring-boot-starter-components

**通用能力聚合**：为业务模块提供系统管理、交易支付、内容、字典、文件、消息、任务调度等可装配 starter；多数能力采用 `-api`（契约/DTO/配置）+ `-biz`（实现、HTTP、自动配置）分层。

## 子模块一览

| 模块 | 业务与职责摘要 | 文档 |
|------|------------------|------|
| `spring-boot-starter-common` | 统一响应、异常、基础实体；**插件 SPI**、外置 JAR 装载、`TgPlugin` 元数据；管理端插件列表接口 | [common](/dev/tg-boot/components/common/) |
| `spring-boot-starter-system` | 登录/验证码、用户组织角色权限等后台与用户端能力 | [system](/dev/tg-boot/components/system/) |
| `spring-boot-starter-trade` | 商品订单、微信支付配置与回调、`SpiNotifyThirdPaidResultService` 按商品品类扩展付费后逻辑 | [trade](/dev/tg-boot/components/trade/) |
| `spring-boot-starter-wechat` | 微信网页能力、登录等（`WxController` / `WxLoginController`） | [wechat](/dev/tg-boot/components/wechat/) |
| `spring-boot-starter-file` | 上传与文件管理（`FileController`、`MgtFileController` 等） | [file](/dev/tg-boot/components/file/) |
| `spring-boot-starter-dict` | 字典项、区域字典；对外 `PubDictController` / `PubDictAreaController` | [dict](/dev/tg-boot/components/dict/) |
| `spring-boot-starter-cms` | CMS 节点；公开与管理端接口 | [cms](/dev/tg-boot/components/cms/) |
| `spring-boot-starter-im` | IM 相关用户端接口 | [im](/dev/tg-boot/components/im/) |
| `spring-boot-starter-excel` | Excel 导入导出（如 `PubExcelController`） | [excel](/dev/tg-boot/components/excel/) |
| `spring-boot-starter-ocr` | OCR HTTP（银行卡等），底层实现通过命名 Bean（如 `bizKsOcrService`） | [ocr](/dev/tg-boot/components/ocr/) |
| `spring-boot-starter-sms` | 短信发送门面 `BizSmsService`，多厂商实现可切换 | [sms](/dev/tg-boot/components/sms/) |
| `spring-boot-starter-generator` | 代码生成 Web（`/pub/generator/index` 等） | [generator](/dev/tg-boot/components/generator/) |
| `spring-boot-starter-job` | 与 XXL-Job 集成的定时任务说明 | [job](/dev/tg-boot/components/job/) |

## 装配方式

- 各 `-biz` 模块通过 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 注册 `Biz*AutoConfiguration`，引入对应依赖后即参与 Spring Boot 自动配置。
- 跨模块协作优先依赖 **对方 `-api` 模块** 中的接口与 DTO，避免直连 `-biz` 实现类。

## 扩展建议

- 新增组件：在本聚合下新建 `spring-boot-starter-xxx`（含 `-api`/`-biz`），并实现自动配置类。
- 交易后业务扩展：实现 `pub.module.trade.api.service.SpiNotifyThirdPaidResultService`，Spring Bean 名称与订单商品品类编码对齐（参见 trade-biz 中对 `SpiNotifyThirdPaidResultService` 的解析方式）。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`
