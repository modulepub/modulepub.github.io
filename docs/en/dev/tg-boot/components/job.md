---
title: spring-boot-starter-job
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/job/
---

# spring-boot-starter-job

**Scheduled jobs**: integrates **XXL-Job** so dispatch centers can manage executors and handlers.

## Operational notes

- Size jobs against compute and data volume; **CPU-heavy** work should run on dedicated executor clusters or isolated deployments.
- Concrete `JobHandler`s, executor registration, and Spring component-scan boundaries live in `-biz` plus project `application.yml`.

## Maven layout

- **`spring-boot-starter-job-api`**: optional shared contracts/types.
- **`spring-boot-starter-job-biz`**: auto-configuration and job implementations.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-job/`
