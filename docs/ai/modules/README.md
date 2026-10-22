---
title: 模块地图
description: TG-boot 的能力域、表前缀、依赖方向与模块选型方法。
---

<div class="doc-eyebrow">MODULE MAP · KNOW WHERE IT BELONGS</div>

<p class="doc-lead">
  模块地图不是一份“功能清单”，而是一张<strong>归属决策表</strong>。
  当 AI 问你“这段代码放哪里”时，答案应该能从这张表里推出来，而不是靠感觉。
</p>

## 一、模块树

```text
spring-boot-starter-module
├── spring-boot-starter-common
├── spring-boot-starter-architecture-tests
├── spring-boot-starter-runner
├── spring-boot-starter-components
│   ├── system            sys_    用户 / 组织 / 角色 / 权限
│   ├── trade             td_     商品 / 订单 / 支付
│   ├── distribution      dist_   分销 / 分佣 / 账单
│   ├── wechat            wx_     公众号 / 小程序 / 微信支付
│   ├── file              —       文件 / 配置
│   ├── cms               cms_    内容节点
│   ├── im                im_     即时通讯 / STOMP
│   ├── ocr               —       OCR 门面
│   ├── sms               sms_    短信 SPI
│   ├── excel             —       模板 Excel
│   ├── verification      vt_     实名 / 内容审核 / 人脸
│   ├── quartz            qz_     定时任务
│   ├── ai                ai_     AI 对话
│   └── form              form_   表单材料
└── spring-boot-starter-business
    ├── dating            dt_     婚恋 / 客户
    ├── parent-led        pl_     亲家
    └── project           pm_     项目管理（文档阶段）
```

::: info 版本说明
模块数量会随仓库演进变化，以 `spring-boot-starter-runner/pom.xml` 和各子模块 README 为准。
上表描述的是当前代码中已出现的能力域，不代表每个模块都已达到同等成熟度。
:::

## 二、两类模块，两种判断

### 2.1 components：可复用的能力

`system`、`trade`、`file`、`sms` 这类模块，提供的往往是**其他业务域也会用到的能力**。

判断标准：

- 是否被两个以上业务域使用？
- 是否具有独立的技术边界（支付、短信、对象存储）？
- 是否可以独立演进、替换供应商？

如果答案是“是”，优先考虑放进 `components`。

### 2.2 business：垂直业务

`dating`、`parent-led` 这类模块，围绕一个具体业务场景组织：

- 有独立的领域语言（会员、配对、亲家、孩子档案）；
- 有自己的表、页面、流程；
- 不一定被其他域复用。

判断标准：

- 它是不是一个“业务产品”，而不是“技术能力”？
- 它的变化是否主要由业务策略驱动？

如果是，优先放进 `business`。

## 三、表前缀与命名

| 域 | 表前缀 | Java 包 |
| --- | --- | --- |
| system | `sys_` | `pub.module.system` |
| trade | `td_` | `pub.module.trade` |
| distribution | `dist_` | `pub.module.distribution` |
| wechat | `wx_` | `pub.module.wx` |
| cms | `cms_` | `pub.module.cms` |
| im | `im_` | `pub.module.im` |
| verification | `vt_` | `pub.module.verification` |
| dating | `dt_` | `pub.module.dating` |
| parent-led | `pl_` | `pub.module.parentled` |

命名遵循“表前缀 + 字段名”，并省略系统层：

```text
正确：dist_user_bill_summary.dist_user_code
错误：dist_user_bill_summary.dist_sys_user_code
```

业务主键使用 `xxxCode`，对外关联不暴露技术主键 `id`。

## 四、新增能力放哪里？

### 决策树

```text
新需求需要新的数据与流程
│
├─ 是否只是现有域的一个新用例？
│  ├─ 是 → 放在现有 *-biz，不新建模块
│  └─ 否 ↓
│
├─ 是否是可被多个业务域复用的技术能力？
│  ├─ 是 → components 下新增 {能力} 模块
│  └─ 否 ↓
│
└─ 是否是独立业务产品？
   ├─ 是 → business 下新增 {业务} 模块
   └─ 否 → 先回到需求，确认边界是否真的成立
```

### 三个反例

| 反例 | 为什么错 | 更好的做法 |
| --- | --- | --- |
| 把“活动报名”塞进 `system` | 系统域被业务污染，权限与业务耦合 | 新建 `campaign` 或放入对应业务域 |
| 为每个 CRUD 建一个 Maven 模块 | 模块爆炸，编译与维护成本上升 | 同一业务域内按聚合组织 |
| 把短信、支付实现写进业务模块 | 供应商变化会污染业务代码 | 使用现有 components 的 SPI 扩展 |

## 五、装配：runner 是微内核

`spring-boot-starter-runner` 只做两件事：

1. 按需引入 `*-biz`；
2. 提供启动配置与基础设施。

加依赖，模块自动装配；减依赖，对应的 Controller、Service、Consumer 自然消失。这就是“可裁剪的交付”。

```xml
<dependency>
  <groupId>pub.module</groupId>
  <artifactId>spring-boot-starter-system-biz</artifactId>
</dependency>
<dependency>
  <groupId>pub.module</groupId>
  <artifactId>spring-boot-starter-parent-led-biz</artifactId>
</dependency>
```

不同产品线可以使用不同组合：

| 组合 | 场景 |
| --- | --- |
| system + verification + parent-led | 亲家版 |
| system + trade + dating + verification | 婚恋版 |
| 全部 biz | 全功能开发环境 |

## 六、界面层：多端中台

后端模块解决“业务与契约”，界面层同样需要边界。TG-boot 的配套前端模板是
[`uniapp-middle-platform`](/ai/uniapp-middle-platform/)。

它基于 **unibest 改进版**，是一套可复用的多端中台：

- 支持 **H5、微信小程序、App**，同一套页面按平台编译；
- 沉淀登录、权限、布局、请求、上传、字典、表格、配置等公共能力；
- 内置系统、AI、CMS、IM、微信、交易、分销、核验等 15 个核心能力域；
- 新模块只写自己的页面与 API，不再重复搭后台壳。

```text
TG-boot 后端模块                   uniapp-middle-platform
spring-boot-starter-x-api   ←→    src/pages/manage_ability/x/
spring-boot-starter-x-biz         src/pages/manage/api/x.ts
                                  复用登录 / 权限 / 布局 / 请求
```

这就是“复用代码、聚焦业务”的完整闭环：**后端按模块切，前端按中台模板复用。**

## 七、模块自检清单

<ul class="doc-checklist">
  <li>新增的类是否能明确归入 api / biz / common / runner 之一？</li>
  <li>跨模块调用是否只使用 *-api 契约？</li>
  <li>是否避免了 *-biz 依赖他域 *-biz？</li>
  <li>表前缀与包名是否与域一致？</li>
  <li>新增事件是否登记了 destination、group 与幂等键？</li>
  <li>runner 的依赖是否确实需要？能否按产品线裁剪？</li>
</ul>
