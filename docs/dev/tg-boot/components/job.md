---
title: spring-boot-starter-job
createTime: 2026/05/09
permalink: /dev/tg-boot/components/job/
---

# spring-boot-starter-job

**定时任务**：基于 **XXL-Job** 集成，支持调度中心管理执行器与任务。

## 使用注意

- 任务需评估计算资源与数据量级；**计算密集型**任务建议独立部署执行器或单独集群。
- 具体 JobHandler、执行器配置与 Spring 扫描范围见 `-biz` 模块实现与项目 `application.yml`。

## Maven 结构

- **`spring-boot-starter-job-api`**：契约与公共类型（若有）。
- **`spring-boot-starter-job-biz`**：自动配置与具体 Job 实现。

**源码路径**：`tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-job/`
