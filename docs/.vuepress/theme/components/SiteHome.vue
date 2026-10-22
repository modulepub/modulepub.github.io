<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const ticker = [
  'CONTRACT FIRST',
  'MODULAR MONOLITH',
  'AI-NATIVE',
  'MQ-RPC',
  'GCC · 200M FIXED',
  'CAPITAL FOR GOOD',
  'PUBLIC GOOD',
  'REBUILD VALUE',
]

const principles = [
  {
    index: '01',
    title: '契约先于自由',
    text: '边界写进代码，接口成为团队与 AI 的共同语言。自由生长，但不失控。',
  },
  {
    index: '02',
    title: '账本先于叙事',
    text: '每一笔投入、每一份收益都可追溯。先让事实可核查，再让故事被相信。',
  },
  {
    index: '03',
    title: '人先于资本',
    text: '资本是工具，不是目的。技术效率最终要回到人的尊严与公共生活。',
  },
]

onMounted(() => {
  const items = root.value?.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!items?.length)
    return

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-revealed'))
    return
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting)
        return
      ;(entry.target as HTMLElement).classList.add('is-revealed')
      observer?.unobserve(entry.target)
    })
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' })

  items.forEach(el => observer?.observe(el))
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="sh">
    <section class="sh-hero">
      <div class="sh-hero__grid" aria-hidden="true" />
      <div class="sh-hero__glow sh-hero__glow--mint" aria-hidden="true" />
      <div class="sh-hero__glow sh-hero__glow--blue" aria-hidden="true" />

      <div class="sh-shell sh-hero__inner">
        <div class="sh-hero__copy">
          <div class="sh-kicker">
            <span class="sh-kicker__dot" />
            OPEN SOURCE · HUMAN COMMUNITY
          </div>

          <h1 class="sh-hero__title">
            让代码<span class="sh-grad">生长</span><br>
            让价值<span class="sh-grad sh-grad--warm">回归</span>
          </h1>

          <p class="sh-hero__lede">
            一端是面向 AI 时代的工程框架，一端是以人为本的社区制度。
            我们用可维护的代码，承载可共治的价值。
          </p>

          <div class="sh-hero__actions">
            <a class="sh-btn sh-btn--primary" href="/ai/">
              探索 AI 编程框架
              <span class="sh-btn__arrow" aria-hidden="true">↗</span>
            </a>
            <a class="sh-btn sh-btn--ghost" href="/community/">
              进入人类社区
              <span class="sh-btn__arrow" aria-hidden="true">↗</span>
            </a>
          </div>

          <div class="sh-hero__meta">
            <div class="sh-meta">
              <strong>02</strong>
              <span>内容主线</span>
            </div>
            <div class="sh-meta">
              <strong>16<span>+</span></strong>
              <span>内置业务模块</span>
            </div>
            <div class="sh-meta">
              <strong>200<span>M</span></strong>
              <span>GCC 固定总量</span>
            </div>
          </div>
        </div>

        <div class="sh-hero__visual" aria-hidden="true">
          <div class="sh-core-stage">
            <div class="sh-core-stage__halo" />
            <div class="sh-orbit sh-orbit--one">
              <span class="sh-orbit__node" />
            </div>
            <div class="sh-orbit sh-orbit--two">
              <span class="sh-orbit__node sh-orbit__node--blue" />
              <span class="sh-orbit__node sh-orbit__node--small" />
            </div>
            <div class="sh-orbit sh-orbit--three">
              <span class="sh-orbit__node sh-orbit__node--warm" />
            </div>

            <div class="sh-core">
              <span class="sh-core__ring" />
              <span class="sh-core__mark">M</span>
              <span class="sh-core__label">module.pub</span>
            </div>

            <div class="sh-float sh-float--code">
              <span class="sh-float__bar">
                <i /><i /><i />
              </span>
              <code><em>@Resource</em><br>ApiProjectService<br><span>→ LOCAL / MQ</span></code>
            </div>

            <div class="sh-float sh-float--tag">
              <span class="sh-pulse" />
              <span>CONTRACT-FIRST</span>
            </div>

            <div class="sh-coord sh-coord--a">34° 12′ N</div>
            <div class="sh-coord sh-coord--b">118° 14′ E</div>
          </div>
        </div>
      </div>

      <div class="sh-scroll" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>
    </section>

    <div class="sh-ticker" aria-label="站点关键词">
      <div class="sh-ticker__track">
        <template v-for="n in 2" :key="n">
          <span
            v-for="item in ticker"
            :key="item + n"
            class="sh-ticker__item"
            :aria-hidden="n === 2 ? 'true' : undefined"
          >
            {{ item }}
            <i aria-hidden="true" />
          </span>
        </template>
      </div>
    </div>

    <section class="sh-paths">
      <div class="sh-shell">
        <header class="sh-section-head" data-reveal>
          <div class="sh-kicker">TWO JOURNEYS · ONE QUESTION</div>
          <h2>
            技术如何让协作更高效，<br>
            <span>制度如何让协作更长久？</span>
          </h2>
          <p>
            我们给出两条彼此呼应的路径：一条把工程质量变成可复用的开发框架，
            一条把价值分配变成可核查的社区协议。
          </p>
        </header>

        <div class="sh-path-grid">
          <a href="/ai/" class="sh-path sh-path--ai" data-reveal>
            <div class="sh-path__noise" aria-hidden="true" />
            <div class="sh-path__top">
              <span class="sh-path__index">01</span>
              <span class="sh-path__tag">AI-NATIVE FRAMEWORK</span>
            </div>

            <div class="sh-path__body">
              <h3>高质量 AI 编程框架</h3>
              <p class="sh-path__lede">
                以开源项目 TG-boot 为样本：把模块边界、接口契约与验收门禁写进代码，
                让 AI 不只是写得快，而是写得对、接得住、能上线。
              </p>

              <ul class="sh-path__points">
                <li><span />模块化单体 · 一个进程交付</li>
                <li><span />Api / MQ 双轨 · 拆分不改业务</li>
                <li><span />AGENTS 规范 + 架构测试 · 可验收</li>
                <li><span />多端中台 · H5 / 小程序 / App 复用</li>
              </ul>

              <div class="sh-path__foot">
                <span>阅读框架文档 <i>→</i></span>
                <small>10 篇文档 · AI 自动搭建</small>
              </div>
            </div>

            <svg class="sh-path__art" viewBox="0 0 360 220" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="sh-ai-line" x1="40" y1="40" x2="320" y2="190" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#2EE6C5" stop-opacity=".9" />
                  <stop offset="1" stop-color="#5B8CFF" stop-opacity=".25" />
                </linearGradient>
                <filter id="sh-ai-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g opacity=".22" stroke="#4F6E82">
                <path d="M20 55h320M20 110h320M20 165h320" />
                <path d="M80 20v180M160 20v180M240 20v180M320 20v180" />
              </g>
              <path d="M72 152 144 96l76 34 72-66" stroke="url(#sh-ai-line)" stroke-width="1.4" stroke-dasharray="5 7" />
              <g filter="url(#sh-ai-glow)">
                <rect x="34" y="132" width="78" height="42" rx="10" fill="#08141C" stroke="#2EE6C5" stroke-opacity=".6" />
                <rect x="124" y="68" width="88" height="42" rx="10" fill="#08141C" stroke="#5B8CFF" stroke-opacity=".55" />
                <rect x="226" y="104" width="94" height="42" rx="10" fill="#08141C" stroke="#2EE6C5" stroke-opacity=".4" />
                <circle cx="104" cy="154" r="3.5" fill="#2EE6C5" />
                <circle cx="184" cy="84" r="3.5" fill="#7DFFE8" />
                <circle cx="268" cy="122" r="3.5" fill="#5B8CFF" />
              </g>
              <g font-family="ui-monospace, monospace" font-size="8" fill="#B9D8E5" letter-spacing="1.2">
                <text x="49" y="157">API CONTRACT</text>
                <text x="140" y="93">BIZ MODULE</text>
                <text x="243" y="129">RUNNER · 1 JVM</text>
              </g>
            </svg>
          </a>

          <a href="/community/" class="sh-path sh-path--community" data-reveal>
            <div class="sh-path__noise" aria-hidden="true" />
            <div class="sh-path__top">
              <span class="sh-path__index">02</span>
              <span class="sh-path__tag">HUMAN COMMUNITY · GCC</span>
            </div>

            <div class="sh-path__body">
              <h3>人类社区项目</h3>
              <p class="sh-path__lede">
                以 GCC 人类社区共识标准为样本：用白皮书定义规则，用明星项目验证路径，
                让资本在透明账本中流向人、流向公共品。
              </p>

              <ul class="sh-path__points">
                <li><span />白皮书 · 规则先于规模</li>
                <li><span />明星项目 · 可复制的共建样本</li>
                <li><span />资本向善 → 共创财富 → 转公益</li>
              </ul>

              <div class="sh-path__foot">
                <span>进入社区文档 <i>→</i></span>
                <small>5 个篇章 · 1 套完整机制</small>
              </div>
            </div>

            <svg class="sh-path__art sh-path__art--community" viewBox="0 0 360 220" fill="none" aria-hidden="true">
              <defs>
                <radialGradient id="sh-cc-glow" cx="50%" cy="50%" r="50%">
                  <stop stop-color="#FFC46B" stop-opacity=".35" />
                  <stop offset="1" stop-color="#FFC46B" stop-opacity="0" />
                </radialGradient>
              </defs>
              <circle cx="196" cy="112" r="94" fill="url(#sh-cc-glow)" />
              <circle cx="196" cy="112" r="78" stroke="#FFC46B" stroke-opacity=".25" stroke-dasharray="2 7" />
              <circle cx="196" cy="112" r="52" stroke="#2EE6C5" stroke-opacity=".35" />
              <circle cx="196" cy="112" r="24" fill="#08141C" stroke="#FFC46B" stroke-opacity=".6" />
              <text x="196" y="109" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9" fill="#FFD79A" letter-spacing="1.5">GCC</text>
              <text x="196" y="121" text-anchor="middle" font-family="ui-monospace, monospace" font-size="5.5" fill="#A9C8D5" letter-spacing="1">HUMAN COMMUNITY</text>
              <g fill="#2EE6C5">
                <circle cx="196" cy="34" r="4" />
                <circle cx="274" cy="83" r="4" />
                <circle cx="246" cy="169" r="4" />
                <circle cx="130" cy="160" r="4" />
                <circle cx="112" cy="85" r="4" />
              </g>
              <g stroke="#2EE6C5" stroke-opacity=".22">
                <path d="M196 34v54M274 83l-55 20M246 169l-38-43M130 160l43-35M112 85l55 20" />
              </g>
              <g font-family="ui-monospace, monospace" font-size="7" fill="#8FAEBD" letter-spacing="1">
                <text x="196" y="20" text-anchor="middle">PEOPLE</text>
                <text x="284" y="78">PROJECT</text>
                <text x="252" y="184">PUBLIC GOOD</text>
                <text x="92" y="174">CAPITAL</text>
                <text x="70" y="80">GOVERNANCE</text>
              </g>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <section class="sh-principles">
      <div class="sh-shell">
        <div class="sh-principles__head" data-reveal>
          <div class="sh-kicker">THE COMMON BASE</div>
          <h2>两种表达，同一套底层信念</h2>
        </div>

        <div class="sh-principle-grid">
          <article v-for="item in principles" :key="item.index" class="sh-principle" data-reveal>
            <span class="sh-principle__index">{{ item.index }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="sh-route">
      <div class="sh-shell sh-route__inner" data-reveal>
        <div class="sh-route__copy">
          <div class="sh-kicker">START HERE</div>
          <h2>先跑起来，再谈理解</h2>
          <p>
            不必先读完所有文档。把启动说明复制给 AI，让它把环境、数据库、后端和前端
            一起搭好；再用 2 小时做一个真实模块，最后用一篇白皮书理解价值如何被重新分配。
          </p>
        </div>

        <div class="sh-route__steps">
          <a href="/ai/quickstart/" class="sh-route__step">
            <span>01</span>
            <strong>让 AI 启动项目</strong>
            <small>1 段说明 · 自动搭建</small>
          </a>
          <a href="/ai/practice/" class="sh-route__step">
            <span>02</span>
            <strong>做一个模块</strong>
            <small>2 h · 从需求到门禁</small>
          </a>
          <a href="/community/whitepaper/" class="sh-route__step">
            <span>03</span>
            <strong>读懂 GCC</strong>
            <small>20 min · 机制与边界</small>
          </a>
        </div>
      </div>
    </section>

    <section class="sh-closing">
      <div class="sh-closing__grid" aria-hidden="true" />
      <div class="sh-shell sh-closing__inner" data-reveal>
        <div class="sh-kicker">MODULE.PUB</div>
        <p class="sh-closing__quote">
          技术让协作更高效，<br>
          制度让协作更长久。
        </p>
        <p class="sh-closing__text">
          开源不是把代码放出来，而是把方法、边界与信任一起交出去。
        </p>
        <div class="sh-closing__actions">
          <a href="/ai/" class="sh-text-link">AI 编程框架 <span>↗</span></a>
          <a href="/community/" class="sh-text-link">人类社区项目 <span>↗</span></a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sh {
  --sh-bg: #05070b;
  --sh-panel: #081018;
  --sh-line: rgba(125, 175, 205, 0.14);
  --sh-mint: #2ee6c5;
  --sh-blue: #5b8cff;
  --sh-warm: #ffc46b;
  --sh-text: #e8f4ff;
  --sh-muted: #91a9b9;
  --sh-dim: #5d7587;
  width: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% -8%, rgba(46, 230, 197, 0.12), transparent 32%),
    radial-gradient(circle at 92% 8%, rgba(91, 140, 255, 0.12), transparent 34%),
    var(--sh-bg);
  color: var(--sh-text);
  font-family: var(--vp-font-family-base);
}

.sh *,
.sh *::before,
.sh *::after {
  box-sizing: border-box;
}

.sh-shell {
  width: min(1200px, calc(100% - 48px));
  margin: 0 auto;
}

.sh-hero {
  position: relative;
  min-height: min(880px, 100vh);
  padding: clamp(70px, 9vw, 118px) 0 84px;
  display: flex;
  align-items: center;
  isolation: isolate;
}

.sh-hero__grid {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-image:
    linear-gradient(rgba(122, 168, 196, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122, 168, 196, 0.055) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, black 18%, transparent 86%);
  -webkit-mask-image: linear-gradient(to bottom, black 18%, transparent 86%);
}

.sh-hero__grid::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--sh-bg) 0%, transparent 28%, transparent 72%, var(--sh-bg) 100%);
}

.sh-hero__glow {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(20px);
  pointer-events: none;
}

.sh-hero__glow--mint {
  width: 420px;
  height: 420px;
  left: -180px;
  top: 34%;
  background: radial-gradient(circle, rgba(46, 230, 197, 0.13), transparent 65%);
}

.sh-hero__glow--blue {
  width: 520px;
  height: 520px;
  right: -160px;
  top: 4%;
  background: radial-gradient(circle, rgba(91, 140, 255, 0.14), transparent 66%);
}

.sh-hero__inner {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
  gap: 56px;
  align-items: center;
}

.sh-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: 0.19em;
  color: #9adfd3;
  text-transform: uppercase;
}

.sh-kicker__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--sh-mint);
  box-shadow: 0 0 0 4px rgba(46, 230, 197, 0.1), 0 0 16px rgba(46, 230, 197, 0.8);
  animation: sh-pulse 2.4s ease-in-out infinite;
}

.sh-hero__title {
  margin: 22px 0 0;
  font-size: clamp(48px, 6.2vw, 88px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.055em;
  color: #f4fbff;
  text-wrap: balance;
}

.sh-grad {
  background: linear-gradient(105deg, #f5fffd 4%, #b8fff1 34%, #2ee6c5 66%, #52a4ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sh-grad--warm {
  background: linear-gradient(105deg, #fff8eb 2%, #ffd79a 38%, #ffc46b 62%, #77e9d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.sh-hero__lede {
  max-width: 590px;
  margin: 28px 0 0;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.9;
  color: var(--sh-muted);
  letter-spacing: 0.01em;
}

.sh-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 34px;
}

.sh-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  min-height: 52px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease, box-shadow 220ms ease;
}

.sh-btn--primary {
  color: #041411;
  background: linear-gradient(120deg, #7dffe8, #2ee6c5 55%, #79e5ff);
  box-shadow: 0 10px 34px rgba(46, 230, 197, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.55);
}

.sh-btn--ghost {
  color: #d7ebf5;
  border: 1px solid rgba(138, 188, 214, 0.25);
  background: rgba(10, 18, 27, 0.64);
  backdrop-filter: blur(16px);
}

.sh-btn:hover {
  transform: translateY(-2px);
}

.sh-btn--primary:hover {
  box-shadow: 0 14px 44px rgba(46, 230, 197, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.sh-btn--ghost:hover {
  border-color: rgba(46, 230, 197, 0.55);
  background: rgba(46, 230, 197, 0.07);
}

.sh-btn__arrow {
  font-size: 15px;
  opacity: 0.85;
}

.sh-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin-top: 46px;
  border-top: 1px solid var(--sh-line);
}

.sh-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 130px;
  padding: 18px 32px 0 0;
}

.sh-meta + .sh-meta {
  padding-left: 32px;
  border-left: 1px solid var(--sh-line);
}

.sh-meta strong {
  font-family: var(--vp-font-family-mono);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  color: #eafffb;
  letter-spacing: -0.03em;
}

.sh-meta strong span {
  margin-left: 1px;
  font-size: 12px;
  color: var(--sh-mint);
}

.sh-meta > span {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--sh-dim);
}

.sh-hero__visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 520px;
}

.sh-core-stage {
  position: relative;
  width: min(100%, 500px);
  aspect-ratio: 1;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(46, 230, 197, 0.08), transparent 48%),
    radial-gradient(circle at 50% 50%, rgba(91, 140, 255, 0.06), transparent 68%);
}

.sh-core-stage::before,
.sh-core-stage::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.sh-core-stage::before {
  inset: 3%;
  border: 1px solid rgba(133, 184, 209, 0.09);
}

.sh-core-stage::after {
  inset: 16%;
  border: 1px dashed rgba(46, 230, 197, 0.12);
  animation: sh-spin 42s linear infinite;
}

.sh-core-stage__halo {
  position: absolute;
  inset: 19%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(46, 230, 197, 0.18), rgba(46, 230, 197, 0.02) 48%, transparent 68%);
  filter: blur(24px);
}

.sh-orbit {
  position: absolute;
  inset: 11%;
  border-radius: 50%;
  border: 1px solid rgba(137, 188, 210, 0.13);
}

.sh-orbit--one {
  inset: 11%;
  transform: rotate(18deg) scaleY(0.62);
  animation: sh-spin-one 30s linear infinite;
}

.sh-orbit--two {
  inset: 22%;
  transform: rotate(-38deg) scaleY(0.78);
  animation: sh-spin-two 24s linear infinite;
}

.sh-orbit--three {
  inset: 0;
  border-color: rgba(255, 196, 107, 0.08);
  transform: rotate(62deg) scaleY(0.45);
  animation: sh-spin-three 46s linear infinite;
}

.sh-orbit__node {
  position: absolute;
  top: 50%;
  left: -4px;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  border-radius: 50%;
  background: var(--sh-mint);
  box-shadow: 0 0 12px rgba(46, 230, 197, 0.9), 0 0 0 5px rgba(46, 230, 197, 0.07);
}

.sh-orbit__node--blue {
  left: auto;
  right: 8%;
  top: 9%;
  background: var(--sh-blue);
  box-shadow: 0 0 14px rgba(91, 140, 255, 0.9), 0 0 0 5px rgba(91, 140, 255, 0.08);
}

.sh-orbit__node--small {
  left: 16%;
  top: 86%;
  width: 5px;
  height: 5px;
  margin-top: 0;
  background: #d7fff8;
}

.sh-orbit__node--warm {
  left: 76%;
  top: 86%;
  background: var(--sh-warm);
  box-shadow: 0 0 14px rgba(255, 196, 107, 0.8), 0 0 0 5px rgba(255, 196, 107, 0.07);
}

.sh-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 168px;
  height: 168px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 28%, rgba(46, 230, 197, 0.18), transparent 44%),
    linear-gradient(145deg, rgba(12, 26, 35, 0.96), rgba(5, 10, 16, 0.98));
  border: 1px solid rgba(46, 230, 197, 0.34);
  box-shadow:
    0 0 0 9px rgba(46, 230, 197, 0.035),
    0 0 70px rgba(46, 230, 197, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(14px);
}

.sh-core__ring {
  position: absolute;
  inset: 9px;
  border-radius: 50%;
  border: 1px dashed rgba(46, 230, 197, 0.28);
}

.sh-core__mark {
  font-family: var(--vp-font-family-mono);
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.08em;
  background: linear-gradient(130deg, #fff, #7dffe8 45%, #2ee6c5 70%, #5b8cff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sh-core__label {
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.2em;
  color: #83b9c7;
  text-transform: uppercase;
}

.sh-float {
  position: absolute;
  z-index: 2;
  border: 1px solid rgba(130, 183, 208, 0.18);
  border-radius: 14px;
  background: rgba(8, 16, 24, 0.78);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.38);
  backdrop-filter: blur(18px);
}

.sh-float--code {
  right: 1%;
  top: 13%;
  padding: 14px 16px 14px;
  min-width: 178px;
  animation: sh-float 8s ease-in-out infinite;
}

.sh-float__bar {
  display: flex;
  gap: 5px;
  margin-bottom: 11px;
}

.sh-float__bar i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #507081;
}

.sh-float__bar i:first-child {
  background: var(--sh-mint);
}

.sh-float--code code {
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  line-height: 1.8;
  color: #b7d5e2;
  letter-spacing: 0.015em;
}

.sh-float--code em {
  color: #ffd79a;
  font-style: normal;
}

.sh-float--code code span {
  color: var(--sh-mint);
}

.sh-float--tag {
  left: -2%;
  bottom: 19%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  border-radius: 999px;
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.13em;
  color: #b8e9e1;
  animation: sh-float 7s ease-in-out infinite reverse;
}

.sh-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sh-mint);
  box-shadow: 0 0 10px var(--sh-mint);
}

.sh-coord {
  position: absolute;
  font-family: var(--vp-font-family-mono);
  font-size: 7px;
  letter-spacing: 0.16em;
  color: #3f6273;
}

.sh-coord--a {
  left: 8%;
  top: 12%;
}

.sh-coord--b {
  right: 6%;
  bottom: 11%;
}

.sh-scroll {
  position: absolute;
  left: 50%;
  bottom: 22px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.2em;
  color: #3d5a6b;
}

.sh-scroll i {
  width: 1px;
  height: 30px;
  background: linear-gradient(to bottom, rgba(46, 230, 197, 0.7), transparent);
  animation: sh-scroll 2.3s ease-in-out infinite;
}

.sh-ticker {
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(125, 175, 205, 0.1);
  border-bottom: 1px solid rgba(125, 175, 205, 0.1);
  background: rgba(8, 14, 21, 0.66);
}

.sh-ticker::before,
.sh-ticker::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: 14%;
  pointer-events: none;
}

.sh-ticker::before {
  left: 0;
  background: linear-gradient(to right, var(--sh-bg), transparent);
}

.sh-ticker::after {
  right: 0;
  background: linear-gradient(to left, var(--sh-bg), transparent);
}

.sh-ticker__track {
  display: flex;
  width: max-content;
  padding: 17px 0;
  animation: sh-marquee 36s linear infinite;
}

.sh-ticker__item {
  display: inline-flex;
  align-items: center;
  gap: 26px;
  padding-right: 26px;
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  letter-spacing: 0.16em;
  color: #6f8b9b;
  white-space: nowrap;
}

.sh-ticker__item i {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(46, 230, 197, 0.55);
}

.sh-paths {
  position: relative;
  padding: clamp(86px, 10vw, 138px) 0;
}

.sh-paths::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(91, 140, 255, 0.055), transparent 55%);
  pointer-events: none;
}

.sh-section-head {
  max-width: 800px;
}

.sh-section-head h2 {
  margin: 18px 0 0;
  font-size: clamp(32px, 4.1vw, 54px);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.045em;
  color: #edf8ff;
}

.sh-section-head h2 span {
  color: #86a3b4;
}

.sh-section-head > p {
  max-width: 650px;
  margin: 22px 0 0;
  font-size: 15px;
  line-height: 1.9;
  color: var(--sh-muted);
}

.sh-path-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-top: 48px;
}

.sh-path {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 510px;
  padding: 28px;
  overflow: hidden;
  border: 1px solid rgba(128, 181, 207, 0.16);
  border-radius: 24px;
  color: inherit;
  text-decoration: none;
  background:
    radial-gradient(circle at 100% 100%, rgba(46, 230, 197, 0.09), transparent 44%),
    linear-gradient(145deg, rgba(13, 25, 34, 0.9), rgba(6, 11, 17, 0.96));
  transition: transform 340ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 340ms ease, box-shadow 340ms ease;
}

.sh-path--community {
  background:
    radial-gradient(circle at 100% 100%, rgba(255, 196, 107, 0.1), transparent 42%),
    radial-gradient(circle at 0% 0%, rgba(46, 230, 197, 0.055), transparent 47%),
    linear-gradient(145deg, rgba(19, 23, 25, 0.92), rgba(7, 11, 15, 0.97));
}

.sh-path::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(120deg, rgba(46, 230, 197, 0.12), transparent 28%, transparent 70%, rgba(91, 140, 255, 0.1));
  opacity: 0;
  transition: opacity 340ms ease;
  pointer-events: none;
}

.sh-path--community::before {
  background: linear-gradient(120deg, rgba(255, 196, 107, 0.13), transparent 28%, transparent 68%, rgba(46, 230, 197, 0.1));
}

.sh-path:hover {
  transform: translateY(-6px);
  border-color: rgba(46, 230, 197, 0.38);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(46, 230, 197, 0.05);
}

.sh-path--community:hover {
  border-color: rgba(255, 196, 107, 0.36);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 196, 107, 0.05);
}

.sh-path:hover::before {
  opacity: 1;
}

.sh-path__noise {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.16) 0.5px, transparent 0.5px);
  background-size: 5px 5px;
  mask-image: linear-gradient(to bottom, black, transparent 42%);
  -webkit-mask-image: linear-gradient(to bottom, black, transparent 42%);
}

.sh-path__top {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.sh-path__index {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: #7dffe8;
}

.sh-path--community .sh-path__index {
  color: #ffd79a;
}

.sh-path__tag {
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.15em;
  color: #6e8999;
}

.sh-path__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 42px;
}

.sh-path h3 {
  margin: 0;
  font-size: clamp(27px, 3vw, 38px);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.04em;
  color: #f1fbff;
}

.sh-path__lede {
  max-width: 470px;
  margin: 17px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: #92aab9;
}

.sh-path__points {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 0;
  margin: 24px 0 0;
  list-style: none;
}

.sh-path__points li {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #b9ced9;
}

.sh-path__points li span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--sh-mint);
  box-shadow: 0 0 8px rgba(46, 230, 197, 0.5);
}

.sh-path--community .sh-path__points li span {
  background: var(--sh-warm);
  box-shadow: 0 0 8px rgba(255, 196, 107, 0.45);
}

.sh-path__foot {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 34px;
}

.sh-path__foot > span {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #e8fbf7;
}

.sh-path__foot > span i {
  font-style: normal;
  transition: transform 220ms ease;
}

.sh-path:hover .sh-path__foot > span i {
  transform: translateX(5px);
}

.sh-path__foot small {
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  line-height: 1.5;
  color: #587483;
  text-align: right;
  letter-spacing: 0.05em;
}

.sh-path__art {
  position: absolute;
  right: -18px;
  bottom: -12px;
  width: 62%;
  height: auto;
  opacity: 0.64;
  pointer-events: none;
  transition: transform 500ms ease, opacity 500ms ease;
}

.sh-path:hover .sh-path__art {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.9;
}

.sh-principles {
  position: relative;
  padding: clamp(76px, 9vw, 120px) 0;
  border-top: 1px solid rgba(125, 175, 205, 0.09);
  border-bottom: 1px solid rgba(125, 175, 205, 0.09);
  background:
    linear-gradient(180deg, rgba(8, 14, 20, 0.72), rgba(5, 8, 12, 0.4)),
    radial-gradient(ellipse at 15% 100%, rgba(46, 230, 197, 0.055), transparent 54%);
}

.sh-principles__head h2 {
  margin: 16px 0 0;
  font-size: clamp(27px, 3.2vw, 40px);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.035em;
  color: #eaf7ff;
}

.sh-principle-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: 46px;
  border: 1px solid rgba(125, 175, 205, 0.12);
  border-radius: 20px;
  overflow: hidden;
  background: rgba(125, 175, 205, 0.1);
}

.sh-principle {
  position: relative;
  min-height: 220px;
  padding: 28px;
  background: rgba(7, 13, 19, 0.9);
  transition: background 260ms ease;
}

.sh-principle:hover {
  background: rgba(11, 21, 29, 0.98);
}

.sh-principle__index {
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #3e6d78;
}

.sh-principle h3 {
  margin: 24px 0 0;
  font-size: 19px;
  font-weight: 700;
  color: #e8f4fb;
  letter-spacing: -0.02em;
}

.sh-principle p {
  margin: 13px 0 0;
  font-size: 13px;
  line-height: 1.85;
  color: #829baa;
}

.sh-route {
  padding: clamp(76px, 9vw, 118px) 0;
}

.sh-route__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.88fr) minmax(0, 1.12fr);
  gap: 64px;
  align-items: center;
}

.sh-route__copy h2 {
  margin: 16px 0 0;
  font-size: clamp(29px, 3.6vw, 44px);
  font-weight: 750;
  line-height: 1.3;
  letter-spacing: -0.04em;
  color: #effaff;
}

.sh-route__copy p {
  margin: 20px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: #8da6b5;
}

.sh-route__steps {
  display: grid;
  gap: 10px;
}

.sh-route__step {
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 19px 20px;
  border: 1px solid rgba(125, 175, 205, 0.14);
  border-radius: 14px;
  color: inherit;
  text-decoration: none;
  background: rgba(9, 16, 23, 0.7);
  transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
}

.sh-route__step:hover {
  transform: translateX(5px);
  border-color: rgba(46, 230, 197, 0.38);
  background: rgba(46, 230, 197, 0.05);
}

.sh-route__step > span {
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: #4c7784;
}

.sh-route__step strong {
  font-size: 14px;
  color: #e0f0f8;
}

.sh-route__step small {
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  color: #5e7988;
  letter-spacing: 0.04em;
  text-align: right;
}

.sh-closing {
  position: relative;
  padding: clamp(86px, 11vw, 150px) 0 118px;
  overflow: hidden;
  border-top: 1px solid rgba(125, 175, 205, 0.1);
}

.sh-closing__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(122, 168, 196, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122, 168, 196, 0.045) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: radial-gradient(ellipse at 50% 45%, black 8%, transparent 68%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 45%, black 8%, transparent 68%);
}

.sh-closing__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.sh-closing__quote {
  margin: 24px 0 0;
  font-size: clamp(34px, 5vw, 66px);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: -0.05em;
  background: linear-gradient(100deg, #f7ffff 10%, #a8f5e8 50%, #ffd79a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sh-closing__text {
  max-width: 560px;
  margin: 22px 0 0;
  font-size: 14px;
  line-height: 1.9;
  color: #829baa;
}

.sh-closing__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 30px;
  margin-top: 34px;
}

.sh-text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(46, 230, 197, 0.3);
  font-size: 13px;
  font-weight: 600;
  color: #c7f9f1;
  text-decoration: none;
  transition: border-color 220ms ease, color 220ms ease;
}

.sh-text-link:hover {
  color: #fff;
  border-color: var(--sh-mint);
}

.sh-text-link span {
  color: var(--sh-mint);
}

[data-reveal] {
  opacity: 0;
  transform: translateY(26px);
  transition: opacity 700ms ease, transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-reveal].is-revealed {
  opacity: 1;
  transform: translateY(0);
}

.sh-path-grid [data-reveal]:nth-child(2) {
  transition-delay: 100ms;
}

.sh-principle-grid [data-reveal]:nth-child(2) {
  transition-delay: 90ms;
}

.sh-principle-grid [data-reveal]:nth-child(3) {
  transition-delay: 180ms;
}

@keyframes sh-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.8); }
}

@keyframes sh-spin {
  to { transform: rotate(360deg); }
}

@keyframes sh-spin-one {
  from { transform: rotate(18deg) scaleY(0.62); }
  to { transform: rotate(378deg) scaleY(0.62); }
}

@keyframes sh-spin-two {
  from { transform: rotate(-38deg) scaleY(0.78); }
  to { transform: rotate(-398deg) scaleY(0.78); }
}

@keyframes sh-spin-three {
  from { transform: rotate(62deg) scaleY(0.45); }
  to { transform: rotate(422deg) scaleY(0.45); }
}

@keyframes sh-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-9px); }
}

@keyframes sh-scroll {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); transform-origin: top; }
  50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
}

@keyframes sh-marquee {
  to { transform: translateX(-50%); }
}

@media (max-width: 1080px) {
  .sh-hero__inner {
    grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
    gap: 20px;
  }

  .sh-hero__visual {
    min-height: 440px;
    transform: scale(0.9);
  }

  .sh-route__inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}

@media (max-width: 900px) {
  .sh-hero {
    min-height: auto;
    padding: 70px 0 86px;
  }

  .sh-hero__inner {
    grid-template-columns: 1fr;
  }

  .sh-hero__copy {
    position: relative;
    z-index: 2;
  }

  .sh-hero__visual {
    min-height: 410px;
    margin-top: 6px;
    transform: none;
  }

  .sh-core-stage {
    width: min(100%, 420px);
  }

  .sh-path-grid {
    grid-template-columns: 1fr;
  }

  .sh-path {
    min-height: 480px;
  }

  .sh-principle-grid {
    grid-template-columns: 1fr;
  }

  .sh-principle {
    min-height: auto;
  }

  .sh-scroll {
    display: none;
  }
}

@media (max-width: 640px) {
  .sh-shell {
    width: min(1200px, calc(100% - 32px));
  }

  .sh-hero {
    padding-top: 46px;
  }

  .sh-hero__title {
    font-size: clamp(42px, 13.5vw, 58px);
    letter-spacing: -0.06em;
  }

  .sh-hero__lede {
    margin-top: 22px;
    font-size: 14px;
    line-height: 1.85;
  }

  .sh-hero__actions {
    flex-direction: column;
  }

  .sh-btn {
    width: 100%;
    min-height: 50px;
  }

  .sh-hero__meta {
    margin-top: 34px;
  }

  .sh-meta {
    min-width: 0;
    flex: 1;
    padding-right: 12px;
  }

  .sh-meta + .sh-meta {
    padding-left: 14px;
  }

  .sh-meta strong {
    font-size: 20px;
  }

  .sh-meta > span {
    font-size: 8px;
    letter-spacing: 0.04em;
  }

  .sh-hero__visual {
    min-height: 350px;
    margin-top: 22px;
  }

  .sh-core {
    width: 132px;
    height: 132px;
  }

  .sh-core__mark {
    font-size: 44px;
  }

  .sh-float--code {
    right: -4px;
    top: 8%;
    min-width: 145px;
    padding: 10px 12px;
  }

  .sh-float--tag {
    left: 0;
    bottom: 12%;
    font-size: 7px;
  }

  .sh-coord {
    display: none;
  }

  .sh-paths {
    padding-top: 72px;
  }

  .sh-section-head h2 {
    font-size: 31px;
  }

  .sh-section-head > p {
    font-size: 14px;
  }

  .sh-path-grid {
    margin-top: 32px;
  }

  .sh-path {
    min-height: 500px;
    padding: 22px;
    border-radius: 20px;
  }

  .sh-path__body {
    margin-top: 32px;
  }

  .sh-path h3 {
    font-size: 28px;
  }

  .sh-path__lede {
    font-size: 13px;
  }

  .sh-path__foot {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-top: 26px;
  }

  .sh-path__foot small {
    text-align: left;
  }

  .sh-path__art {
    width: 78%;
    right: -34px;
    bottom: -8px;
    opacity: 0.52;
  }

  .sh-principles,
  .sh-route {
    padding-top: 72px;
    padding-bottom: 72px;
  }

  .sh-route__step {
    grid-template-columns: 34px 1fr;
    gap: 12px;
  }

  .sh-route__step small {
    grid-column: 2;
    text-align: left;
  }

  .sh-closing {
    padding-top: 80px;
    padding-bottom: 90px;
  }

  .sh-closing__quote {
    font-size: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sh-core-stage::after,
  .sh-orbit,
  .sh-float,
  .sh-kicker__dot,
  .sh-ticker__track,
  .sh-scroll i {
    animation: none !important;
  }

  [data-reveal] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
