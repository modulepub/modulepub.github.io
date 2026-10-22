<script setup lang="ts">
const docs = [
  {
    no: '01',
    title: '为什么是 TG-boot',
    desc: '从 AI 写代码的真实失败模式出发，理解框架为什么把边界、契约和验收放在第一位。',
    meta: '8 min · 设计动机',
    link: '/ai/why/',
  },
  {
    no: '02',
    title: '让 AI 启动项目',
    desc: '把一段启动说明复制给 AI，自动准备 JDK、Maven、数据库、Redis 与前端，并启动完整开发环境。',
    meta: '1 段说明 · AI 自动搭建',
    link: '/ai/quickstart/',
  },
  {
    no: '03',
    title: '架构与边界',
    desc: '模块化单体、Api 契约、MQ 双轨、AUTO 路由：一页看懂它如何同时兼顾交付与演进。',
    meta: '12 min · 架构',
    link: '/ai/architecture/',
  },
  {
    no: '04',
    title: '模块地图',
    desc: '16+ 能力域如何划分，表前缀如何命名，依赖为什么只能朝一个方向流动。',
    meta: '8 min · 全局',
    link: '/ai/modules/',
  },
  {
    no: '05',
    title: '跨模块契约',
    desc: '同步 Api 与异步 MQ 的完整写法：接口放哪里、事件怎么发、消费者如何保持幂等。',
    meta: '10 min · 代码',
    link: '/ai/contracts/',
  },
  {
    no: '06',
    title: 'AI 协作工作流',
    desc: '把需求变成上下文包，把约束变成提示词，把验收变成可执行命令。',
    meta: '12 min · 方法',
    link: '/ai/ai-workflow/',
  },
  {
    no: '07',
    title: '实操：新增模块',
    desc: '以 campaign 活动模块为例，从 Maven 骨架到 Controller、MQ、runner 装配和门禁。',
    meta: '40 min · 实战',
    link: '/ai/practice/',
  },
  {
    no: '08',
    title: '质量与上线',
    desc: '测试分层、架构测试、Actuator 安全、部署清单，以及上线前必须回答的 12 个问题。',
    meta: '10 min · 交付',
    link: '/ai/quality/',
  },
  {
    no: '09',
    title: '深度手册',
    desc: '旧版全量文档索引：组件手册、业务模块、树图架构、运维与共识算法研究。',
    meta: 'Reference · 按需查阅',
    link: '/ai/reference/',
  },
]

const supports = [
  { title: 'Starter 化能力', text: '加依赖即装配，减依赖即卸载。业务模块不重复造基础设施。' },
  { title: '契约即边界', text: '跨模块只认 *-api，接口、DTO、枚举都和实现解耦。' },
  { title: 'AUTO 路由', text: '本进程有实现就本地直调，没有才走 MQ，业务代码不变。' },
  { title: '架构门禁', text: '用 ArchUnit 把禁止依赖写成测试，靠 CI 而不是靠记忆。' },
  { title: '一键环境', text: 'JDK、Maven、MariaDB、Redis、Node 全部收进 .tools。' },
  { title: '无痛拆分', text: '先单体交付，流量上来再按域拆 runner，拆的是部署不是业务。' },
]

const steps = [
  { no: '01', title: '读总览', desc: '10 分钟建立心智模型', link: '/ai/' },
  { no: '02', title: '交给 AI', desc: '复制说明 · 自动搭环境', link: '/ai/quickstart/' },
  { no: '03', title: '做一个模块', desc: '2 小时走完闭环', link: '/ai/practice/' },
  { no: '04', title: '过门禁', desc: '10 分钟完成验收', link: '/ai/quality/' },
]
</script>

<template>
  <div class="lp lp--ai">
    <section class="lp-hero">
      <div class="lp-hero__grid" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--a" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--b" aria-hidden="true" />

      <div class="lp-shell lp-hero__inner">
        <div class="lp-hero__copy">
          <div class="lp-kicker"><span />AI 编程框架 · TG-BOOT</div>
          <h1 class="lp-title">
            让 AI 写对，<br>
            <span>让团队接住。</span>
          </h1>
          <p class="lp-lead">
            高质量 AI 编程，不是把提示词写得更长，而是把工程约束写进代码。
            TG-boot 用模块化单体、接口契约和架构门禁，为 AI 与人类开发者划出同一条可验收的边界。
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--primary" href="/ai/quickstart/">
              让 AI 启动项目 <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/ai/why/">
              先看设计动机 <span>→</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>1</strong><span>JVM 默认交付</span></div>
            <div class="lp-stat"><strong>16<span>+</span></strong><span>内置业务模块</span></div>
            <div class="lp-stat"><strong>0</strong><span>拆分时业务改动</span></div>
            <div class="lp-stat"><strong>2</strong><span>协作轨道</span></div>
          </div>
        </div>

        <div class="lp-terminal" aria-label="TG-boot 启动示例">
          <div class="lp-terminal__bar">
            <span class="lp-terminal__dots"><i /><i /><i /></span>
            <span>tg-boot / quickstart</span>
            <span class="lp-terminal__badge">LIVE</span>
          </div>
          <div class="lp-terminal__body">
            <p><span class="c-dim">$</span> git clone https://gitee.com/pub_module/tg-boot.git</p>
            <p><span class="c-dim">$</span> powershell -ExecutionPolicy Bypass -File scripts\up.ps1</p>
            <p class="c-ok">✓ JDK 27 · Maven · MariaDB · Redis ready</p>
            <p class="c-ok">✓ runner started on :9999</p>
            <p class="c-ok">✓ middle platform on :9100</p>
            <p class="c-muted">[ModuleRpc] [LOCAL] ApiSysUserService#getByUserCode</p>
            <p class="c-muted">[MQ] system.user.login → parentled</p>
            <p class="c-cursor">_</p>
          </div>
          <div class="lp-terminal__foot">
            <span><i class="lp-dot" /> LOCAL FIRST</span>
            <span>MQ FALLBACK</span>
            <span>ARCH GUARDED</span>
          </div>
        </div>
      </div>
    </section>

    <div class="lp-rail" aria-hidden="true">
      <div class="lp-rail__track">
        <template v-for="n in 2" :key="n">
          <span v-for="word in ['CONTRACT', 'MODULE', 'RUNNER', 'AUTO ROUTE', 'ARCH TEST', 'AI READY', 'ONE JVM', 'ZERO REWRITE']" :key="word + n">
            {{ word }} <i />
          </span>
        </template>
      </div>
    </div>

    <section class="lp-section">
      <div class="lp-shell">
        <header class="lp-section__head">
          <div class="lp-kicker"><span />DOCUMENT MAP</div>
          <h2>从一个问题开始，<br><em>走到一次可上线的交付。</em></h2>
          <p>十篇文档，按“理解 → 运行 → 编写 → 验收”的顺序组织。可以顺序读，也可以直接跳到正在解决的问题。</p>
        </header>

        <div class="lp-card-grid">
          <a v-for="doc in docs" :key="doc.link" :href="doc.link" class="lp-card">
            <span class="lp-card__no">{{ doc.no }}</span>
            <h3>{{ doc.title }}</h3>
            <p>{{ doc.desc }}</p>
            <div class="lp-card__foot">
              <small>{{ doc.meta }}</small>
              <span aria-hidden="true">↗</span>
            </div>
          </a>
        </div>

        <a class="lp-multiplatform" href="/ai/uniapp-middle-platform/">
          <div class="lp-multiplatform__main">
            <span class="lp-multiplatform__eyebrow">MULTI-END MIDDLE PLATFORM</span>
            <h3>uniapp-middle-platform</h3>
            <p>
              基于 unibest 改进版的可复用多端中台。新增模块只写业务页面，
              后台、微信小程序与 App 共用同一套登录、权限、请求、布局与组件。
            </p>
          </div>
          <div class="lp-multiplatform__ends">
            <span><strong>H5</strong><small>后台 / 运营台</small></span>
            <span><strong>小程序</strong><small>微信 / 多平台</small></span>
            <span><strong>App</strong><small>原生移动端</small></span>
          </div>
          <span class="lp-multiplatform__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <section class="lp-section lp-section--alt">
      <div class="lp-shell lp-split">
        <div class="lp-split__copy">
          <div class="lp-kicker"><span />EXECUTABLE PATH</div>
          <h2>把“会用”拆成<br>四个可完成的动作</h2>
          <p>不需要先成为框架专家。每一步都有明确的输入、输出和验收方式。</p>

          <div class="lp-steps">
            <a v-for="step in steps" :key="step.no" :href="step.link" class="lp-step">
              <span class="lp-step__no">{{ step.no }}</span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.desc }}</small>
            </a>
          </div>
        </div>

        <div class="lp-split__panel">
          <div class="lp-panel-title">
            <span>SIX SUPPORTS</span>
            <small>框架的六个支点</small>
          </div>
          <div class="lp-support-grid">
            <article v-for="item in supports" :key="item.title" class="lp-support">
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--quote">
      <div class="lp-shell lp-quote">
        <span class="lp-quote__mark">“</span>
        <p>
          AI 不缺生成代码的能力，缺的是<strong>知道什么不能写</strong>的边界。
          好的框架，应该让正确的写法成为最省力的写法。
        </p>
        <div class="lp-quote__by">
          <span>TG-boot 设计原则</span>
          <span>契约优先 · 边界即代码</span>
        </div>
      </div>
    </section>

    <section class="lp-cta">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker"><span />OPEN SOURCE</div>
          <h2>把第一个模块跑通，<br>再决定要不要相信它。</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--primary" href="/ai/quickstart/">开始实操 <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="https://gitee.com/pub_module/tg-boot" target="_blank" rel="noopener noreferrer">查看源码 <span>↗</span></a>
        </div>
      </div>
    </section>
  </div>
</template>
