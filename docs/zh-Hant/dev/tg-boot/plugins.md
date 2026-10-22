---
title: plugins（外置插件目錄）
createTime: 2026/05/09
permalink: /zh-Hant/dev/tg-boot/plugins/
---
# plugins（外部插件目錄）

倉庫根目錄下的 **`plugins`** 用於存放**運行時外掛**的插件 JAR：宿主應用啓動時會掃描該目錄中的 `*.jar`，按 Spring Boot 自動裝配約定加載其中的配置類，**無需把插件打進 `spring-boot-starter-runner` 再發布**。

## 形態約定

- 插件應由 **`spring-boot-starter-*-plugin` 一類 Starter 工程**（或等價 Maven 模塊）打包產出，結構上與普通 Spring Boot Starter 一致。
- JAR 內須包含 Boot 3 約定的自動裝配清單：  
  **`META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`**  
  列出需要註冊的 `@AutoConfiguration`（或等價配置類）。宿主通過 `ImportCandidates` 解析清單，並將這些類併入 Spring 應用的 **primarySources**，與內置 Starter 的加載方式對齊。
- 可選：在 JAR 中提供 **`META-INF/services/pub.module.common.plugin.spi.TgPlugin`**，實現 `TgPlugin` SPI，用於聲明插件編碼、名稱與描述（管理端與安裝登記表展示）；未提供時則由文件名推導佔位信息。

裝載邏輯見 **`spring-boot-starter-common`** 中的 `pub.module.common.plugin.bootstrap.ExternalPluginBootstrap`。

## 目錄與配置

- 默認掃描目錄為**進程工作目錄下的 `./plugins`**（與本文件夾對應）。
- 可通過以下方式覆蓋（優先級從高到低）：  
  命令行 `--tg.plugins.directory=` → JVM 系統屬性 `tg.plugins.directory` → 環境變量 `TG_PLUGINS_DIRECTORY` → `application*.yml` 中的 `tg.plugins.directory`。

若目錄不存在或為空，宿主會跳過外部插件裝載，不影響正常啓動。

## 與源碼中的 `*-plugin` 模塊的關係

Maven 工程裏的 **`spring-boot-starter-*-plugin`** 負責編寫與打包插件；構建得到的 JAR 可複製到本 **`plugins`** 目錄（或部署環境的等價路徑），由線上 runner **自加載**。同一插件也可作為普通 Maven 依賴編入 runner，二者按交付方式擇一或組合使用。