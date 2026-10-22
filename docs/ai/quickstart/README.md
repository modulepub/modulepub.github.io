---
title: 让 AI 启动项目
description: 复制一段说明给 AI，让 TG-boot 的 JDK、Maven、数据库、Redis、后端与前端环境自动建立。
---

<div class="doc-eyebrow">AI BOOTSTRAP · COPY & RUN</div>

<p class="doc-lead">
  不需要先自己安装一长串开发环境。把下面这段说明整段复制给能执行 PowerShell 的 AI，
  让它直接运行 TG-boot 自带的启动脚本、观察日志、处理失败，最后把可访问地址交给你。
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>1<em> 篇</em></strong><span>复制给 AI 的说明</span></div>
  <div class="doc-metric"><strong>1<em> 条</em></strong><span>启动入口</span></div>
  <div class="doc-metric"><strong>6<em> 项</em></strong><span>自动准备的环境</span></div>
  <div class="doc-metric"><strong>0<em> 次</em></strong><span>手工安装</span></div>
</div>

<ai-setup />

## 一、AI 会替你完成什么

这段说明不是“操作建议”，而是一份可执行的启动契约。AI 需要实际运行脚本，而不是把命令再转述给你。

| 步骤 | 实际动作 |
| --- | --- |
| 准备运行时 | 检查并补齐 `.tools` 中的 JDK、Maven、数据库、Node 与 Redis |
| 初始化数据库 | 启动本机数据库，空库时导入 `sql/tg-boot.sql` 与本地登录数据 |
| 启动缓存 | 启动 Redis，供登录会话使用 |
| 启动后端 | 用 JDK 27 + Maven 启动 runner，端口 `9999` |
| 启动前端 | 用 Node 安装依赖并启动中台 H5，端口 `9100` |
| 验证交付 | 检查日志、访问两个地址，并报告实际状态 |

::: info 这不是“远程一键部署”
脚本运行在你指定的这台 Windows 电脑上。它不会替你购买服务器、配置域名或部署到公网。
它解决的是：**把本地完整开发环境从零建立起来。**
:::

## 二、你只需要做三件事

1. **打开一个能执行 PowerShell 的 AI 编码工具**，并让它进入 `tg-boot` 仓库根目录；
2. 点击上面的 **“复制给 AI”**；
3. 把整段说明粘贴给 AI，发送，然后等它执行并返回地址。

如果 AI 只输出了步骤而没有执行，补一句：

```text
请直接执行，不要只给步骤。你可以运行 PowerShell 命令，并在每一步后检查实际输出。
```

## 三、成功标准

后端日志中出现：

```text
Started StartApplication
```

并且这两个地址可以访问：

| 用途 | 地址 |
| --- | --- |
| 中台登录 | <http://127.0.0.1:9100/pages/manage/login/index> |
| 接口文档 | <http://127.0.0.1:9999/swagger-ui/index.html> |

本地账号：`tgadmin` / `Tgboot@123`。

::: danger 本地口令不要外带
这组账号来自本地初始化数据，只用于打开开发环境。
不要用于测试环境、生产环境，也不要把本地数据库快照直接当成生产数据。
:::

## 四、如果 AI 卡住了

让 AI 按这个顺序排查，并把完整报错发回来：

| 现象 | 优先检查 |
| --- | --- |
| 后端启动失败 | 数据库是否启动、`3306` 是否被占用 |
| 登录后接口 401 | Redis 是否在 `127.0.0.1:6379` 运行 |
| Maven 找不到模块 | 是否在仓库根目录执行，是否保留 `-am` |
| 端口冲突 | `3306`、`6379`、`9999`、`9100` 是否被旧进程占用 |
| 前端请求失败 | `.env.development` 的后端地址是否为 `9999` |
| RabbitMQ 连接失败 | 是否误配了 `spring.rabbitmq.*`；开发环境默认使用嵌入式 Rabbit |

::: tip 只需给 AI 一句话
把“失败步骤 + 完整错误 + 已经尝试的修复”发给它，让它继续排查。
不要只发最后一行日志，最早出现的 `Caused by` 通常才是根因。
:::

## 五、人工兜底

只有在 AI 无法执行命令、或你明确想手动接管时，才需要看这一节。

```powershell
git clone https://gitee.com/pub_module/tg-boot.git
cd tg-boot
powershell -ExecutionPolicy Bypass -File scripts\up.ps1
```

如果 `.tools` 缺少运行时：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fetch-tools.ps1
powershell -ExecutionPolicy Bypass -File scripts\up.ps1
```

已有数据库和 Redis 时，也可以单独启动后端：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run-runner.ps1
```

这些命令只是兜底。正常路径是：**复制说明给 AI，让 AI 执行并验证。**

## 六、下一步

环境起来之后，不要停在登录页。先让 AI 做一次只读分析，再进入真实模块开发。

<div class="doc-cards">
  <a class="doc-card" href="/ai/architecture/">
    <span class="doc-card__tag">NEXT · ARCHITECTURE</span>
    <h3>理解架构与边界</h3>
    <p>为什么默认是一个进程？AUTO 路由如何工作？拆分时到底改什么？</p>
  </a>
  <a class="doc-card" href="/ai/practice/">
    <span class="doc-card__tag">NEXT · HANDS-ON</span>
    <h3>新增一个模块</h3>
    <p>从 Maven 骨架到 Controller、MQ、runner 装配与架构门禁。</p>
  </a>
</div>
