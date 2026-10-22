<script setup lang="ts">
const docs = [
  {
    no: '01',
    title: 'Framework overview',
    desc: 'The modular monolith, the four layers, and why one JVM can still keep real module boundaries.',
    meta: 'Overview · Deep manual',
    link: '/en/dev/tg-boot/',
  },
  {
    no: '02',
    title: 'AI coding rules',
    desc: 'The hard constraints an AI should read before generating entities, APIs, controllers or MQ consumers.',
    meta: 'Rules · AGENTS',
    link: '/en/dev/tg-boot/agents/',
  },
  {
    no: '03',
    title: 'Architecture tests',
    desc: 'How ArchUnit and POM rules stop a module from quietly depending on another module’s implementation.',
    meta: 'Guardrails · CI',
    link: '/en/dev/tg-boot/architecture-tests/',
  },
  {
    no: '04',
    title: 'Cross-module contracts',
    desc: 'Synchronous Api services and asynchronous MQ events: where they live and how to keep them stable.',
    meta: 'Contracts · Code',
    link: '/en/dev/tg-boot/cross-module-collaboration/',
  },
  {
    no: '05',
    title: 'Multi-end middle platform',
    desc: 'A reusable uni-app platform based on an improved unibest template, built for H5, mini programs and apps.',
    meta: 'H5 · Mini program · App',
    link: '/en/ai/uniapp-middle-platform/',
  },
  {
    no: '06',
    title: 'Operations',
    desc: 'Actuator exposure, MQ baselines and the checks that should happen before a production release.',
    meta: 'Run · Production',
    link: '/en/dev/tg-boot/ops/',
  },
]

const supports = [
  { title: 'Starter-based capabilities', text: 'Add a dependency to assemble; remove it to unload. Business modules do not rebuild infrastructure.' },
  { title: 'Contracts as boundaries', text: 'Cross-module calls only use *-api contracts, DTOs and enums, never another module’s implementation.' },
  { title: 'AUTO routing', text: 'Local provider first, MQ only when needed. The business code stays the same.' },
  { title: 'Architecture gates', text: 'Forbidden dependencies become tests, enforced by CI rather than memory.' },
  { title: 'One-command environment', text: 'JDK, Maven, MariaDB, Redis and Node live under .tools and are prepared by one script.' },
  { title: 'Split without rewrite', text: 'Start as one process. Split by domain later; what changes is deployment, not the business code.' },
]

const steps = [
  { no: '01', title: 'Read the overview', desc: 'Build the mental model', link: '/en/dev/tg-boot/' },
  { no: '02', title: 'Run the framework', desc: 'Launch the full environment', link: '/en/dev/tg-boot/' },
  { no: '03', title: 'Build a module', desc: 'Follow the contract path', link: '/en/dev/tg-boot/agents/' },
  { no: '04', title: 'Pass the gates', desc: 'Verify before shipping', link: '/en/dev/tg-boot/architecture-tests/' },
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
          <div class="lp-kicker"><span />AI PROGRAMMING FRAMEWORK · TG-BOOT</div>
          <h1 class="lp-title">
            Make AI write right.<br>
            <span>Make teams own it.</span>
          </h1>
          <p class="lp-lead">
            High-quality AI programming is not about longer prompts. It is about putting engineering
            constraints into code. TG-boot gives AI and human developers one verifiable boundary:
            modules, contracts and architecture gates.
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--primary" href="/en/dev/tg-boot/">
              Open the framework manual <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/en/dev/tg-boot/agents/">
              Read the AI coding rules <span>→</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>1</strong><span>JVM by default</span></div>
            <div class="lp-stat"><strong>16<span>+</span></strong><span>backend modules</span></div>
            <div class="lp-stat"><strong>0</strong><span>business rewrites when splitting</span></div>
            <div class="lp-stat"><strong>2</strong><span>collaboration tracks</span></div>
          </div>
        </div>

        <div class="lp-terminal" aria-label="TG-boot startup example">
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
          <div class="lp-kicker"><span />ENGLISH DOCUMENT MAP</div>
          <h2>Start with a real problem,<br><em>end with a shippable delivery.</em></h2>
          <p>The English edition focuses on the framework’s core rules and the multi-end delivery model. Deeper implementation notes remain in the full manual.</p>
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

        <a class="lp-multiplatform" href="/en/ai/uniapp-middle-platform/">
          <div class="lp-multiplatform__main">
            <span class="lp-multiplatform__eyebrow">MULTI-END MIDDLE PLATFORM</span>
            <h3>uniapp-middle-platform</h3>
            <p>
              An improved unibest-based platform. New modules write only their business pages;
              the admin, mini program and app share one login, permission model, layout and component layer.
            </p>
          </div>
          <div class="lp-multiplatform__ends">
            <span><strong>H5</strong><small>admin / console</small></span>
            <span><strong>Mini app</strong><small>WeChat / multi-platform</small></span>
            <span><strong>App</strong><small>native mobile</small></span>
          </div>
          <span class="lp-multiplatform__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <section class="lp-section lp-section--alt">
      <div class="lp-shell lp-split">
        <div class="lp-split__copy">
          <div class="lp-kicker"><span />EXECUTABLE PATH</div>
          <h2>Turn “knowing” into<br>four finishable actions</h2>
          <p>You do not need to become a framework expert first. Each step has a clear input, output and acceptance check.</p>
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
            <small>Why it holds together</small>
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
          AI does not lack the ability to generate code. It lacks a clear boundary of
          <strong>what must not be written</strong>. A good framework makes the correct path the easiest path.
        </p>
        <div class="lp-quote__by">
          <span>TG-boot design principle</span>
          <span>Contract first · boundaries as code</span>
        </div>
      </div>
    </section>

    <section class="lp-cta">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker"><span />OPEN SOURCE</div>
          <h2>Run one module first.<br>Then decide whether to trust it.</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--primary" href="/en/dev/tg-boot/">Read the manual <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="https://gitee.com/pub_module/tg-boot" target="_blank" rel="noopener noreferrer">View source <span>↗</span></a>
        </div>
      </div>
    </section>
  </div>
</template>
