---
title: Multi-end Middle Platform
description: "uniapp-middle-platform, an improved unibest-based template for H5, mini programs and apps, so new modules only write business code."
---

<div class="doc-eyebrow">MULTI-END MIDDLE PLATFORM</div>

<p class="doc-lead">
  <code>uniapp-middle-platform</code> is a reusable multi-end middle platform based on an
  <strong>improved unibest template</strong>. A new module's backend is built in TG-boot;
  its admin, mini program and app screens can share one front-end foundation instead of being rebuilt three times.
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>3<em> ends</em></strong><span>H5 / mini program / app</span></div>
  <div class="doc-metric"><strong>15<em> domains</em></strong><span>core platform capabilities</span></div>
  <div class="doc-metric"><strong>1<em> model</em></strong><span>login, permissions and layout</span></div>
  <div class="doc-metric"><strong>0<em> rebuilds</em></strong><span>of the platform shell</span></div>
</div>

## What the name means

<div class="doc-grid-3">
  <article class="doc-card">
    <span class="doc-card__tag">UNI-APP</span>
    <h3>One codebase, multiple ends</h3>
    <p>Vue pages compile to H5, mini programs and apps. Platform differences are isolated in adapters and conditional compilation.</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">MIDDLE</span>
    <h3>A middle layer, not middleware</h3>
    <p>It sits between TG-boot services and the UI: login, permissions, requests, layout, shared components, uploads and configuration.</p>
  </article>
  <article class="doc-card">
    <span class="doc-card__tag">PLATFORM</span>
    <h3>A reusable platform</h3>
    <p>Not a one-off project. New products start from the same structure and platform capabilities, then add only their own business surface.</p>
  </article>
</div>

## Built on unibest, adapted for a middle platform

The base provides Vue 3, TypeScript, Vite, conventional routing, layouts, request wrappers, login interception, UnoCSS and i18n. This edition adds:

- an independent admin shell and login state;
- RBAC, feature maps and `v-auth` button permissions;
- a `/mgt` request layer and unified error handling;
- shared upload, table, dialog, form and configuration utilities;
- 15 core domains: system, AI, CMS, IM, WeChat, trade, distribution, verification, SMS, file, config, quartz, monitor, UA and forms;
- `manage` shell plus `manage_ability` domains, designed for module-by-module expansion.

## Three ends, one foundation

| End | Development | Output | Typical use |
| --- | --- | --- | --- |
| H5 | `pnpm dev:h5` | `dist/build/h5` | admin, operations, browser |
| WeChat mini program | `pnpm dev:mp` | `dist/build/mp-weixin` | user-facing mobile |
| App | `pnpm dev:app` | `dist/build/app` | native mobile capabilities |

The project also keeps build scripts for other mini program targets. Enable the ones you actually ship.

::: warning Current default
This repository currently runs primarily as the **admin H5 console**. The uni-app multi-end build entries remain available; new business products should use it as a template and compile for their target ends.
:::

## Adding a module

1. Build the backend module in TG-boot (`*-api` / `*-biz`).
2. In the front-end template, add pages under `src/pages/manage_ability/{module}/`.
3. Add the module's `/mgt` API under `src/pages/manage/api/{module}.ts`.
4. Reuse login, guards, layout, request wrappers, uploads, tables and permissions.
5. Add menus, buttons and API nodes to the feature map.
6. Verify H5, mini program and app separately.

```text
src/pages/manage_ability/{module}/
├── index.vue
├── {entity}/
│   ├── index.vue
│   └── components/
src/pages/manage/api/{module}.ts
```

## Why it matters

| Without a shared platform | With uniapp-middle-platform |
| --- | --- |
| Every module rebuilds login, layout, requests and permissions | Reuse one platform layer |
| Each end gets a separate front-end | Shared pages + platform adapters |
| Permissions and menus drift | Feature map + `v-auth` |
| Business teams spend time on infrastructure | Business teams focus on business |

The goal is simple: **reuse the platform, focus the module.**

::: info Scope
The current repository carries core platform capabilities, not every business back-office. New business products should use it as a template rather than adding all business pages back into the shared platform.
:::
