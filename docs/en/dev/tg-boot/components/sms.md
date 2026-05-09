---
title: spring-boot-starter-sms
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/sms/
---

# spring-boot-starter-sms

**SMS sending**: exposes **`BizSmsService`** (`spring-boot-starter-sms-api`) while vendors (Chuanglan, Xuanwu, …) swap via SPI beans inside `-biz`—**switch SMS providers through configuration, not business code**.

## Public API

- Methods such as **`BizSmsService.sendSms(String mobile, String content)`** (see interface Javadoc).

## Maven layout

- **`spring-boot-starter-sms-api`**: `SmsProperties`, helpers, enums.
- **`spring-boot-starter-sms-biz`**: `BizSmsAutoConfiguration`, default wiring, `Spi*SmsServiceImpl` vendor beans.

Use **`spring-boot-starter-sms-biz`** for auto-configuration; depend on `-api` alone when you only need contracts.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-sms/`
