<script setup lang="ts">
const chapters = [
  {
    no: '01',
    title: '白皮书',
    desc: '从 2 亿枚固定供应、1/3 股本池、2/3 质押分红，到创业成功与公益达成：一套完整的规则底层。',
    meta: '机制总览 + 执行边界',
    link: '/community/whitepaper/',
    featured: true,
  },
  {
    no: '02',
    title: '明星项目',
    desc: '不按估值排名，只看可复制性。农业、婚恋、能源、教育四个样板，拆解项目树如何把目标变成任务。',
    meta: '4 个样板 · 5 个共同点',
    link: '/community/projects/',
  },
  {
    no: '03',
    title: '如何实现资本向善',
    desc: '不是捐款，而是把资本的进入、使用、回报和退出都写进可核查的规则里。',
    meta: '5 个机制 · 1 张记分卡',
    link: '/community/capital-for-good/',
  },
  {
    no: '04',
    title: '共创财富后转公益',
    desc: '创业成功不是终点。股本池如何回赠持有人，代理公司如何继续运转，公共品如何被制度化。',
    meta: '阶段跃迁 · 治理转换',
    link: '/community/wealth-to-public/',
  },
  {
    no: '05',
    title: '重塑价值',
    desc: '资本虹吸之后，如何让资本重新循环、让人上岸，并让想象力与知识产权成为下一个千年的价值引擎。',
    meta: '4 层价值 · 3 件短期基建',
    link: '/community/value-reset/',
  },
]

const flow = [
  { no: '01', title: '人 & 项目', text: '本地就业、社区项目、真实产出' },
  { no: '02', title: '资本进入', text: 'USDT 兑入，进入股本池' },
  { no: '03', title: '利润回流', text: '1/3 补股本，2/3 按质押票权' },
  { no: '04', title: '创业成功', text: '股本池按持有量回赠，清退担保' },
  { no: '05', title: '公益普惠', text: 'KYC 一人一票，红利均分方向' },
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
          <div class="lp-kicker lp-kicker--warm"><span />人类社区项目 · GCC</div>
          <h1 class="lp-title">
            让资本回到<br>
            <span class="lp-title--warm">人身边。</span>
          </h1>
          <p class="lp-lead">
            GCC 人类社区共识标准，试图回答一个比“如何融资”更难的问题：
            当资本、劳动与治理放在同一张账本上，财富能否在创造之后，继续流向公共生活？
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--warm" href="/community/whitepaper/">
              阅读白皮书 <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/community/projects/">
              查看明星项目 <span>→</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>200<span>M</span></strong><span>GCC 固定总量</span></div>
            <div class="lp-stat"><strong>1/3</strong><span>利润补入股本池</span></div>
            <div class="lp-stat"><strong>2/3</strong><span>按质押票权分红</span></div>
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
            <h2>先读规则，<br><em>再看人怎么把它活出来。</em></h2>
          </div>
          <p>
            白皮书给出制度骨架，明星项目给出可触摸的样本，后三章回答资本如何向善、财富如何转公共、价值如何被重新定义。
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
              <span>200M 固定供应</span>
              <span>1/3 股本池</span>
              <span>2/3 质押分红</span>
              <span>7 天特别投票</span>
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
          <h2>一条从劳动到公共品的<br><em>完整价值回路</em></h2>
          <p>不是“先赚钱，再捐钱”的线性叙事，而是从第一天起就把回流、治理与公共性写进规则。</p>
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
            本站内容用于机制研究与产品说明，不构成投资建议、证券发行或收益承诺。
            GCC 相关规则以链上合约和完整白皮书为准；参与前请确认当地法律法规与自身风险承受能力。
          </p>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--quote">
      <div class="lp-shell lp-quote lp-quote--warm">
        <span class="lp-quote__mark">“</span>
        <p>
          公益不是财富的剩余物，而是<strong>治理权提前写下的目的地</strong>。
          当规则允许人参与、允许账本被核对，善意才不必依赖某个人的品格。
        </p>
        <div class="lp-quote__by">
          <span>GCC 人类社区共识标准</span>
          <span>规则透明 · 收益可核 · 机会贴近本地</span>
        </div>
      </div>
    </section>

    <section class="lp-cta lp-cta--warm">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker lp-kicker--warm"><span />READ THE RULES</div>
          <h2>在相信一个故事之前，<br>先读它的规则。</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--warm" href="/community/whitepaper/">打开白皮书 <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="/community/value-reset/">看价值重塑 <span>→</span></a>
        </div>
      </div>
    </section>
  </div>
</template>
