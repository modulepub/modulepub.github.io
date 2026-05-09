---
title: spring-boot-starter-cms
createTime: 2026/05/09
permalink: /en/dev/tg-boot/components/cms/
---

# spring-boot-starter-cms

**Content nodes (CMS)**: hierarchical content maintenance and public reads.

## HTTP overview

- **Public**: `PubCmsNodeController` — site/app content reads.
- **Admin**: `MgtCmsNodeController` — editing, ordering, publishing workflows.

## Maven layout

- **`spring-boot-starter-cms-api`**: node models and contracts.
- **`spring-boot-starter-cms-biz`**: `BizCmsAutoConfiguration`, implementations, controllers.

Prefer `-api` types when wiring operational consoles, static sites, or mini-program copy.

**Source**: `tg-boot/spring-boot-starter-module/spring-boot-starter-components/spring-boot-starter-cms/`
