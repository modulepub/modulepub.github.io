---
title: spring-boot-starter-sms
createTime: 2026/05/09
permalink: /dev/tg-boot/components/sms/
---

# spring-boot-starter-sms

**短信发送组件**：对上游暴露统一 **`BizSmsService`**（`spring-boot-starter-sms-api`），具体厂商（创蓝、玄武等）在 `-biz` 中通过 SPI/实现类切换，**换短信平台只需改配置，不必改业务代码**。

## 对外 API

- **`BizSmsService.sendSms(String mobile, String content)`** 等（以接口定义为准）。

## Maven 结构

- **`spring-boot-starter-sms-api`**：配置属性 `SmsProperties`、发送器工具类、常量枚举。
- **`spring-boot-starter-sms-biz`**：`BizSmsAutoConfiguration`、默认业务实现与各厂商 `Spi*SmsServiceImpl`。

引入 **`spring-boot-starter-sms-biz`** 即可获得自动配置与实现；仅契约依赖可单独引入 `-api`。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-sms/`
