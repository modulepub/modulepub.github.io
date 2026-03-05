---
title: 树-图架构
createTime: 2026/01/12 20:05:26
permalink: /en/dev/tg/
---



# TG-boot | 模块化单体架构低代码开发平台

很久之前就想把这些年踩坑的经验及学到的先进概念熔炼成一个开发框架，直到今天已经初具形态，欢迎各位同行批评指及参与到这个开源项目里面。

#### **TG** 基于springboot且继承了springboot的设计理念，同时融入了模块化单体的设计理念，便于不同规模系统的团队分工协作，也便于功能解耦，支撑模块的划分颗粒度也和spring boot 框架同频，不使用的模块不会强制耦合其他模块。
- 模块间基于API层进行通信，零成本进行模块微服务化，模块内基于SPI机制进行扩展，实现了模块的多实现，可插拔。
- 遵循并延续springboot starter设计风格及固有的模块化设计理念，比如spring cache,spring data,spring security等。
- 模块边界清晰，规避耦合混乱，降低业务理解难度。
- 职责分工明确，结合树图架构（TG）的统一规范，提升团队协作效率。
- 易扩展、高可靠，可平滑过渡至微服务架构。
- 保留单体应用轻量优势，支持快速开发交付。
- 架构普适性强，适配小、中、大各规模项目。

# 技术栈

- 后台框架：springboot 3.5.5 支持到jdk24
- 前台框架：vue3、element ui
- 小程序框架：uniapp x (支持鸿蒙开发) 、cool ui、 vit
-
- 多数据库支持：MySQL、PostgreSQL、Oracle、SQL Server、达梦、人大金仓等
- 功能模块：系统、支付、交易、文件、IM、OCR、短信、微信、小程序、CMS 等
- 特别鸣谢 Hu tool 作者提供的工具类库，weixin-java-tools 作者提供微信开发工具类库。

# 仓库地址及演示环境
- Gitee仓库：https://gitee.com/pub_module/tg-boot.git
- 文档地址：https://docs.module.pub
- 演示环境：https://tg-boot.module.pub
- # 成果展示
1、启动速度快，5.44秒完成启动- ![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/ea4a5d8b2d834b9ebed8e77261df0bbb.png)
2、支持前后端代码生成
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c1f2fd806f28431fafdced1ba43b7c90.png)


# 树图风格 (Tree Graph简称TG)

- Tree Graph 简称TG, 提供统一的命名规范和模块拆分策略，便于团队沟通和协作。
- 树图架构（Tree Graph
  简称TG）是一种基于树形结构的软件架构模式，它将系统的功能模块分解成一系列的子系统，并通过树形结构的关系来表示它们的依赖关系。TG架构的优点是易于理解和维护，可以有效地降低系统的复杂度，提高系统的可靠性和可维护性。

## 目录式命名范式
- 目录式命名范式是一种基于目录结构的命名规范: 以上一层级的名称作为前缀，拼接下一层级的名来命名，类似于中国的姓+名的方式。因此看到这个名称我们很容易清晰它的“家族式”关系。例如A下面有B，B下面有C,因此我们在表示B的名称时为AB，表示C的名称为BC或者ABC。当层级超过三级需要取末尾三级，例如C下面有D,命名D可以使用BCD,程序设计中通常不建议超过三级，超过三级需要考虑设计是否合理。根据唯一性原则通常至少2个层级。需要注意的是如果上述的
  ABC组合中任何一个元素，例如A为单词，可以使用简写，假设A本身为简写词，跟别的词组合时要使用A的简写组合。
- 遵循唯一性原则：在业务表述中，描述一个事务时为了避免歧义我们会发掘它的唯一属性来作为形容词，例如“什么什么的名称”，或者我们沟通中默认我们的思维交织在一起建立了上下文，我们可以省略“什么什么的”的形容，在软件编码实践过程中，我们发现不同的对象之间关联时及容易产生命名冲突，因此写代码时为了避免混乱、风格不一致，我们不应该省略“什么什么的”形容词，这就是唯一性原则的由来。 唯一性命名规则适用于在编写源码过程中可以有效地避免字段命名冲突，并提高代码的可读性。且有利于代码的风格一致和简洁，比如我们存储用户的最高学历的编码及冗余该学历的名称、就读时间等多个字段的信息，我们可以轻松使用拷贝工具一行代码实现字段映射与赋值，而不必一行行对照字段、set属性。
- 命名示例：比如即时通讯模块，英文完成词为 Instant Messaging，模块的名称简写为IM,IM模块下的频道表命名为 im_channel，则下面的主键编码 应为 im_cl_code或cl_code，通常推荐加一级表前缀的方式，这样可以避免过度冗余也可以有效避免命名冲突（前提不同的表的前缀不能相同）。

##  TG 模块划分范式
- TG范式将系统模块分解成一系列的子模块及兄弟模块，并通过树形结构的关系来表示它们的依赖关系。
- 不同模块的通信只能通过API层，API层的实现依赖于具体的业务模块，子模块可以依赖父模块，父级模块不能依赖于子模块，子模块继承的能力丰度取决于父级模块的丰度。
- 系统的关联关系基于业务主键。业务主键命名为：模块名+CODE，例如：用户表的业务主键为：USER_CODE。

# TG架构 实战案例
```angular2svg
springboot
├── spring-boot-starter-module（根模块）
│   ├── spring-boot-starter-parent（父级模块）
│   │   │   ├── 短信、支付、文件、IM、OCR、字典、缓存（）、日志、权限、消息队列、用户中心、工作流、定时任务、持久化数据
│   ├── 普通业务模块
|-- spring-boot-starter-runner(单应用启动器)
```


```angular2svg
代码结构 模块架构
├── spring-boot-starter-system-biz
│   ├── biz（自定义业务代码包）
│   │   ├──service
│   │   │   ├── BizSysUserServiceImpl.java
│   │   │   ├── BizSysRoleServiceImpl.java
│   |   ├──controller
│   │   │   ├── CusSysUserController.java
│   │   │   ├── PubSysRoleController.java
│   │   │   ├── MgtSysRoleController.java 路径带mgt区分管理端接口
│   |   ├──websocket
│   |   ├──grpc
│   ├── curd（代码生成器生成的增删改查实体）
│   │   ├── mapper
│   │   │   ├── TgUserMapper.java
│   │   │   ├── TgRoleMapper.java
│   │   ├── entity(如果API层未定义VO但依赖于实体模型，可以将该目录平移到API模块)
│   │   │   ├── TgUser.java
│   │   │   ├── TgRole.java
|   |   ├──service
│   │   │   ├── TgUserService.java
│   │   │   ├── TgRoleService.java
|   |   ├──controller
│   │   │   ├── TgUserController.java
│   │   │   ├── TgRoleController.java
代码结构 API模块
├── spring-boot-starter-system-api
│   ├── api（接口定义包）
│   │   ├──service
│   │   │   ├── BizXXXService.java (业务模块间通信接口)
│   │   │   ├── SpiXXXService.java (模块内扩展接口，可插拔)
│   ├── curd（代码生成器生成的增删改查实体）
│   │   ├── entity(如果API层未定义VO但依赖于实体模型，该目录可以从业务模块平移)
│   │   │   ├── TgUser.java
│   │   │   ├── TgRole.java


分库分表指南：
在业务模块的starter的配置类中配置要查询的数据源。
分库分表微服务化指南：
打开启动类注释，实现模块的分布式能力需要严格遵守架构设计，关联模块之间的依赖只能依赖API层。目前API层配置了feign和dubbo注解，因此支持feign和duboo两种方式，但是在使用上只能二选一。

```
```angular2svg
业务表设计：
├── 系统根表字段（id,create_time,update_time,create_by,update_by,deleted,version,sequence……,table_name,table_data,operate_type 等字段(可以是抽象的表，也可以是具体的表)
├── 业务字段
│   ├── 表前缀+字段名称（符合目录式命名规范）
│   ├── 冗余字段（与来源名称一致，冗余字段是随着外键冗余过来的字段，该字段通常具有以下几种特点：不经常变更内容、属于其他系统或模块、需要关联查询、需要提升查询效率。
设计思想：
系统字段是虚拟了一个系统表或者实际有一个系统表，用来做共性或者系统层面的事情，比如数据的生成更新时间，操作人，版本变更，排序，日志，数据权限，租户数据隔离等。
业务字段使用目录式范式便于遵循唯一性命名原则，标准化冗余，便于形成范式，利于追踪，理解，统一开发风格。
```
