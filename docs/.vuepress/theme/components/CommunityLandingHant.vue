<script setup lang="ts">
const chapters = [
  {
    no: '01',
    title: '白皮書',
    desc: '從 2 億枚固定供應、1/3 股本池、2/3 質押分紅，到創業成功與公益達成：一套完整的規則底層。',
    meta: '機制總覽 + 執行邊界',
    link: '/zh-Hant/community/whitepaper/',
    featured: true,
  },
  {
    no: '02',
    title: '明星項目',
    desc: '不按估值排名，只看可複製性。農業、婚戀、能源、教育四個樣板，拆解項目樹如何把目標變成任務。',
    meta: '4 個樣板 · 5 個共同點',
    link: '/zh-Hant/community/projects/',
  },
  {
    no: '03',
    title: '如何實現資本向善',
    desc: '不是捐款，而是把資本的進入、使用、回報和退出都寫進可核查的規則裏。',
    meta: '5 個機制 · 1 張記分卡',
    link: '/zh-Hant/community/capital-for-good/',
  },
  {
    no: '04',
    title: '共創財富後轉公益',
    desc: '創業成功不是終點。股本池如何回贈持有人，代理公司如何繼續運轉，公共品如何被制度化。',
    meta: '階段躍遷 · 治理轉換',
    link: '/zh-Hant/community/wealth-to-public/',
  },
  {
    no: '05',
    title: '重塑價值',
    desc: '資本虹吸之後，如何讓資本重新循環、讓人上岸，並讓想象力與知識產權成為下一個千年的價值引擎。',
    meta: '4 層價值 · 3 件短期基建',
    link: '/zh-Hant/community/value-reset/',
  },
]

const flow = [
  { no: '01', title: '人 & 項目', text: '本地就業、社區項目、真實產出' },
  { no: '02', title: '資本進入', text: 'USDT 兑入，進入股本池' },
  { no: '03', title: '利潤迴流', text: '1/3 補股本，2/3 按質押票權' },
  { no: '04', title: '創業成功', text: '股本池按持有量回贈，清退擔保' },
  { no: '05', title: '公益普惠', text: 'KYC 一人一票，紅利均分方向' },
]
</script>

<template>
  <div class="lp lp--community">
    <section class="lp-hero">
      <div class="lp-hero__grid" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--warm" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--mint" aria-hidden="true" />

      <div class="lp-shell lp-hero__inner">
        <div class="lp-hero__copy">
          <div class="lp-kicker lp-kicker--warm"><span />人類社區項目 · GCC</div>
          <h1 class="lp-title">
            讓資本回到<br>
            <span class="lp-title--warm">人身邊。</span>
          </h1>
          <p class="lp-lead">
            GCC 人類社區共識標準，試圖回答一個比“如何融資”更難的問題：
            當資本、勞動與治理放在同一張賬本上，財富能否在創造之後，繼續流向公共生活？
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--warm" href="/zh-Hant/community/whitepaper/">
              閲讀白皮書 <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/zh-Hant/community/projects/">
              查看明星項目 <span>→</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>200<span>M</span></strong><span>GCC 固定總量</span></div>
            <div class="lp-stat"><strong>1/3</strong><span>利潤補入股本池</span></div>
            <div class="lp-stat"><strong>2/3</strong><span>按質押票權分紅</span></div>
            <div class="lp-stat"><strong>1:1</strong><span>公益期 KYC 一人一票</span></div>
          </div>
        </div>

        <div class="lp-seal-wrap" aria-hidden="true">
          <div class="lp-seal">
            <div class="lp-seal__ring lp-seal__ring--one"><span>PEOPLE</span><i /></div>
            <div class="lp-seal__ring lp-seal__ring--two"><span>PUBLIC GOOD</span><i /></div>
            <div class="lp-seal__ring lp-seal__ring--three"><span>CAPITAL</span><i /></div>
            <div class="lp-seal__core">
              <span class="lp-seal__label">GCC</span>
              <strong>200,000,000</strong>
              <small>GENERAL CONSENSUS COIN</small>
            </div>
            <div class="lp-seal__tag lp-seal__tag--a">FIXED SUPPLY</div>
            <div class="lp-seal__tag lp-seal__tag--b">ON-CHAIN LEDGER</div>
            <div class="lp-seal__tag lp-seal__tag--c">1 PERSON · 1 VOTE</div>
          </div>
        </div>
      </div>
    </section>

    <div class="lp-rail lp-rail--warm" aria-hidden="true">
      <div class="lp-rail__track">
        <template v-for="n in 2" :key="n">
          <span v-for="word in ['GCC', 'HUMAN COMMUNITY', 'CAPITAL FOR GOOD', 'PUBLIC GOOD', 'REBUILD VALUE', 'TRANSPARENT LEDGER', 'ONE PERSON ONE VOTE']" :key="word + n">
            {{ word }} <i />
          </span>
        </template>
      </div>
    </div>

    <section class="lp-section">
      <div class="lp-shell">
        <header class="lp-section__head lp-section__head--split">
          <div>
            <div class="lp-kicker lp-kicker--warm"><span />FIVE CHAPTERS</div>
            <h2>先讀規則，<br><em>再看人怎麼把它活出來。</em></h2>
          </div>
          <p>
            白皮書給出制度骨架，明星項目給出可觸摸的樣本，後三章回答資本如何向善、財富如何轉公共、價值如何被重新定義。
          </p>
        </header>

        <div class="lp-chapter-grid">
          <a
            v-for="chapter in chapters"
            :key="chapter.link"
            :href="chapter.link"
            class="lp-chapter"
            :class="{ 'lp-chapter--featured': chapter.featured }"
          >
            <span v-if="chapter.featured" class="lp-chapter__watermark" aria-hidden="true">GCC</span>
            <div class="lp-chapter__top">
              <span class="lp-chapter__no">{{ chapter.no }}</span>
              <span class="lp-chapter__line" />
              <span class="lp-chapter__arrow">↗</span>
            </div>
            <h3>{{ chapter.title }}</h3>
            <p>{{ chapter.desc }}</p>
            <div v-if="chapter.featured" class="lp-chapter__facts">
              <span>200M 固定供應</span>
              <span>1/3 股本池</span>
              <span>2/3 質押分紅</span>
              <span>7 天特別投票</span>
            </div>
            <div class="lp-chapter__foot">
              <small>{{ chapter.meta }}</small>
              <span v-if="chapter.featured" class="lp-chapter__badge">START HERE</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--alt">
      <div class="lp-shell">
        <header class="lp-section__head">
          <div class="lp-kicker lp-kicker--warm"><span />VALUE LOOP</div>
          <h2>一條從勞動到公共品的<br><em>完整價值迴路</em></h2>
          <p>不是“先賺錢，再捐錢”的線性敍事，而是從第一天起就把迴流、治理與公共性寫進規則。</p>
        </header>

        <div class="lp-flow">
          <article v-for="(item, index) in flow" :key="item.no" class="lp-flow__item">
            <span class="lp-flow__no">{{ item.no }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
            <span v-if="index < flow.length - 1" class="lp-flow__arrow" aria-hidden="true">→</span>
          </article>
        </div>

        <div class="lp-note">
          <span>注</span>
          <p>
            本站內容用於機制研究與產品説明，不構成投資建議、證券發行或收益承諾。
            GCC 相關規則以鏈上合約和完整白皮書為準；參與前請確認當地法律法規與自身風險承受能力。
          </p>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--quote">
      <div class="lp-shell lp-quote lp-quote--warm">
        <span class="lp-quote__mark">“</span>
        <p>
          公益不是財富的剩餘物，而是<strong>治理權提前寫下的目的地</strong>。
          當規則允許人蔘與、允許賬本被核對，善意才不必依賴某個人的品格。
        </p>
        <div class="lp-quote__by">
          <span>GCC 人類社區共識標準</span>
          <span>規則透明 · 收益可核 · 機會貼近本地</span>
        </div>
      </div>
    </section>

    <section class="lp-cta lp-cta--warm">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker lp-kicker--warm"><span />READ THE RULES</div>
          <h2>在相信一個故事之前，<br>先讀它的規則。</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--warm" href="/zh-Hant/community/whitepaper/">打開白皮書 <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="/zh-Hant/community/value-reset/">看價值重塑 <span>→</span></a>
        </div>
      </div>
    </section>
  </div>
</template>
