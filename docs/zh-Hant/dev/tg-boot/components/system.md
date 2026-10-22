---
title: spring-boot-starter-system
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/components/system/
---
# spring-boot-starter-system

**系統管理底座**：組織、用户、角色、權限、驗證碼、登錄；為多端（管理端 / 客户側）提供賬號與授權相關 REST。

## HTTP 概要

- **公開**：`PubLoginController`、`PubCaptchaController` 等。
- **管理端 `mgt`**：用户、組織、角色、權限、校驗類等 CRUD 與關聯。
- **客户側 `cus`**：`CusSysUserController`、`CusPermissionController`、用户組織視圖等。

## Maven 結構

- **`spring-boot-starter-system-api`**：契約與 DTO；消息契約 `SystemStreamBindings`、`SysUserLoginMessage`、`SysUserInfoUpdatedMessage`。
- **`spring-boot-starter-system-biz`**：`BizSystemAutoConfiguration`、控制器與服務；`SysUserEventPublisher` 發佈用户登錄/資料更新 MQ。

## 跨模塊協作（MQ）

| Destination | 説明 |
|-------------|------|
| `system.user.login` | 登錄成功後發佈，customer-biz 消費並初始化客户檔案 |
| `system.user-info.updated` | 用户暱稱等變更（事務提交後發佈），customer-biz 同步客户暱稱 |
| `system.user.registered` | 新用户註冊（事務提交後發佈），distribution-biz 綁定推薦關係 |

綁定見 `application-system-messaging.yml`。

其他業務模塊若需「沿用平台賬號體系」，依賴 `-api` 獲取類型或通過 REST 集成；定製登錄可擴展 `-biz` 內登錄相關實現。
**源碼路徑**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/`