<script setup lang="ts">
const docs = [
  {
    no: '01',
    title: '為什麼是 TG-boot',
    desc: '從 AI 寫代碼的真實失敗模式出發，理解框架為什麼把邊界、契約和驗收放在第一位。',
    meta: '8 min · 設計動機',
    link: '/zh-Hant/ai/why/',
  },
  {
    no: '02',
    title: '讓 AI 啓動項目',
    desc: '把一段啓動説明覆制給 AI，自動準備 JDK、Maven、數據庫、Redis 與前端，並啓動完整開發環境。',
    meta: '1 段説明 · AI 自動搭建',
    link: '/zh-Hant/ai/quickstart/',
  },
  {
    no: '03',
    title: '架構與邊界',
    desc: '模塊化單體、Api 契約、MQ 雙軌、AUTO 路由：一頁看懂它如何同時兼顧交付與演進。',
    meta: '12 min · 架構',
    link: '/zh-Hant/ai/architecture/',
  },
  {
    no: '04',
    title: '模塊地圖',
    desc: '16+ 能力域如何劃分，表前綴如何命名，依賴為什麼只能朝一個方向流動。',
    meta: '8 min · 全局',
    link: '/zh-Hant/ai/modules/',
  },
  {
    no: '05',
    title: '跨模塊契約',
    desc: '同步 Api 與異步 MQ 的完整寫法：接口放哪裏、事件怎麼發、消費者如何保持冪等。',
    meta: '10 min · 代碼',
    link: '/zh-Hant/ai/contracts/',
  },
  {
    no: '06',
    title: 'AI 協作工作流',
    desc: '把需求變成上下文包，把約束變成提示詞，把驗收變成可執行命令。',
    meta: '12 min · 方法',
    link: '/zh-Hant/ai/ai-workflow/',
  },
  {
    no: '07',
    title: '實操：新增模塊',
    desc: '以 campaign 活動模塊為例，從 Maven 骨架到 Controller、MQ、runner 裝配和門禁。',
    meta: '40 min · 實戰',
    link: '/zh-Hant/ai/practice/',
  },
  {
    no: '08',
    title: '質量與上線',
    desc: '測試分層、架構測試、Actuator 安全、部署清單，以及上線前必須回答的 12 個問題。',
    meta: '10 min · 交付',
    link: '/zh-Hant/ai/quality/',
  },
  {
    no: '09',
    title: '深度手冊',
    desc: '舊版全量文檔索引：組件手冊、業務模塊、樹圖架構、運維與共識算法研究。',
    meta: 'Reference · 按需查閲',
    link: '/zh-Hant/ai/reference/',
  },
]

const supports = [
  { title: 'Starter 化能力', text: '加依賴即裝配，減依賴即卸載。業務模塊不重複造基礎設施。' },
  { title: '契約即邊界', text: '跨模塊只認 *-api，接口、DTO、枚舉都和實現解耦。' },
  { title: 'AUTO 路由', text: '本進程有實現就本地直調，沒有才走 MQ，業務代碼不變。' },
  { title: '架構門禁', text: '用 ArchUnit 把禁止依賴寫成測試，靠 CI 而不是靠記憶。' },
  { title: '一鍵環境', text: 'JDK、Maven、MariaDB、Redis、Node 全部收進 .tools。' },
  { title: '無痛拆分', text: '先單體交付，流量上來再按域拆 runner，拆的是部署不是業務。' },
]

const steps = [
  { no: '01', title: '讀總覽', desc: '10 分鐘建立心智模型', link: '/zh-Hant/ai/' },
  { no: '02', title: '交給 AI', desc: '複製説明 · 自動搭環境', link: '/zh-Hant/ai/quickstart/' },
  { no: '03', title: '做一個模塊', desc: '2 小時走完閉環', link: '/zh-Hant/ai/practice/' },
  { no: '04', title: '過門禁', desc: '10 分鐘完成驗收', link: '/zh-Hant/ai/quality/' },
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
          <div class="lp-kicker"><span />AI 編程框架 · TG-BOOT</div>
          <h1 class="lp-title">
            讓 AI 寫對，<br>
            <span>讓團隊接住。</span>
          </h1>
          <p class="lp-lead">
            高質量 AI 編程，不是把提示詞寫得更長，而是把工程約束寫進代碼。
            TG-boot 用模塊化單體、接口契約和架構門禁，為 AI 與人類開發者劃出同一條可驗收的邊界。
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--primary" href="/zh-Hant/ai/quickstart/">
              讓 AI 啓動項目 <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/zh-Hant/ai/why/">
              先看設計動機 <span>→</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>1</strong><span>JVM 默認交付</span></div>
            <div class="lp-stat"><strong>16<span>+</span></strong><span>內置業務模塊</span></div>
            <div class="lp-stat"><strong>0</strong><span>拆分時業務改動</span></div>
            <div class="lp-stat"><strong>2</strong><span>協作軌道</span></div>
          </div>
        </div>

        <div class="lp-terminal" aria-label="TG-boot 啓動示例">
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
          <h2>從一個問題開始，<br><em>走到一次可上線的交付。</em></h2>
          <p>十篇文檔，按“理解 → 運行 → 編寫 → 驗收”的順序組織。可以順序讀，也可以直接跳到正在解決的問題。</p>
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

        <a class="lp-multiplatform" href="/zh-Hant/ai/uniapp-middle-platform/">
          <div class="lp-multiplatform__main">
            <span class="lp-multiplatform__eyebrow">MULTI-END MIDDLE PLATFORM</span>
            <h3>uniapp-middle-platform</h3>
            <p>
              基於 unibest 改進版的可複用多端中台。新增模塊只寫業務頁面，
              後台、微信小程序與 App 共用同一套登錄、權限、請求、佈局與組件。
            </p>
          </div>
          <div class="lp-multiplatform__ends">
            <span><strong>H5</strong><small>後台 / 運營台</small></span>
            <span><strong>小程序</strong><small>微信 / 多平台</small></span>
            <span><strong>App</strong><small>原生移動端</small></span>
          </div>
          <span class="lp-multiplatform__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>

    <section class="lp-section lp-section--alt">
      <div class="lp-shell lp-split">
        <div class="lp-split__copy">
          <div class="lp-kicker"><span />EXECUTABLE PATH</div>
          <h2>把“會用”拆成<br>四個可完成的動作</h2>
          <p>不需要先成為框架專家。每一步都有明確的輸入、輸出和驗收方式。</p>

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
            <small>框架的六個支點</small>
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
          AI 不缺生成代碼的能力，缺的是<strong>知道什麼不能寫</strong>的邊界。
          好的框架，應該讓正確的寫法成為最省力的寫法。
        </p>
        <div class="lp-quote__by">
          <span>TG-boot 設計原則</span>
          <span>契約優先 · 邊界即代碼</span>
        </div>
      </div>
    </section>

    <section class="lp-cta">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker"><span />OPEN SOURCE</div>
          <h2>把第一個模塊跑通，<br>再決定要不要相信它。</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--primary" href="/zh-Hant/ai/quickstart/">開始實操 <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="https://gitee.com/pub_module/tg-boot" target="_blank" rel="noopener noreferrer">查看源碼 <span>↗</span></a>
        </div>
      </div>
    </section>
  </div>
</template>
