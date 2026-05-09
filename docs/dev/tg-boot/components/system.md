---
title: spring-boot-starter-system
createTime: 2026/05/09
permalink: /dev/tg-boot/components/system/
---

# spring-boot-starter-system

**系统管理底座**：组织、用户、角色、权限、验证码、登录；为多端（管理端 / 客户侧）提供账号与授权相关 REST。

## HTTP 概要

- **公开**：`PubLoginController`、`PubCaptchaController` 等。
- **管理端 `mgt`**：用户、组织、角色、权限、校验类等 CRUD 与关联。
- **客户侧 `cus`**：`CusSysUserController`、`CusPermissionController`、用户组织视图等。

## Maven 结构

- **`spring-boot-starter-system-api`**：契约与 DTO。
- **`spring-boot-starter-system-biz`**：`BizSystemAutoConfiguration`、控制器与服务。

其他业务模块若需「沿用平台账号体系」，依赖 `-api` 获取类型或通过 REST 集成；定制登录可扩展 `-biz` 内登录相关实现。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-system/`
