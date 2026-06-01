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

- **`spring-boot-starter-system-api`**：契约与 DTO；消息契约 `SystemStreamBindings`、`SysUserLoginMessage`、`SysUserInfoUpdatedMessage`。
- **`spring-boot-starter-system-biz`**：`BizSystemAutoConfiguration`、控制器与服务；`SysUserEventPublisher` 发布用户登录/资料更新 MQ。

## 跨模块协作（MQ）

| Destination | 说明 |
|-------------|------|
| `system.user.login` | 登录成功后发布，customer-biz 消费并初始化客户档案 |
| `system.user-info.updated` | 用户昵称等变更（事务提交后发布），customer-biz 同步客户昵称 |
| `system.user.registered` | 新用户注册（事务提交后发布），distribution-biz 绑定推荐关系 |

绑定见 `application-system-messaging.yml`。

其他业务模块若需「沿用平台账号体系」，依赖 `-api` 获取类型或通过 REST 集成；定制登录可扩展 `-biz` 内登录相关实现。
**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`