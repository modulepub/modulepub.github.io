---
title: spring-boot-starter-wechat
createTime: 2026/05/09
permalink: /dev/tg-boot/components/wechat/
---

# spring-boot-starter-wechat

**微信集成**：网页授权、登录回调等与微信平台对接的能力（具体 scope 以代码与配置为准）。

## HTTP 入口（检索用）

- **`WxController`**：微信侧回调或通用微信接口。
- **`WxLoginController`**：登录流程相关接口。

路径与参数见 Swagger 与各方法注解。

## Maven 结构

- **`spring-boot-starter-wechat-api`**：DTO、配置常量、与微信交互所需的契约类型。
- **`spring-boot-starter-wechat-biz`**：`BizWxAutoConfiguration`、上述控制器与服务实现。

**支付与商户订单**主要在 **`spring-boot-starter-trade`**（微信支付配置、支付回调）；本模块侧重身份与微信开放平台能力衔接。

## 使用说明

引入 **`spring-boot-starter-wechat-biz`**，在配置文件中填写微信 AppId、密钥等；与其他模块协作时仅依赖 `-api` 即可引用类型。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-wechat/`
