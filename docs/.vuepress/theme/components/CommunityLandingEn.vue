<script setup lang="ts">
const chapters = [
  {
    no: '01',
    title: 'Whitepaper',
    desc: 'Fixed supply, the equity pool, stake-weighted dividends, guarantees, venture success and the public-good horizon.',
    meta: 'Rules · execution · boundaries',
    link: '/en/community/guide/#whitepaper',
    featured: true,
  },
  {
    no: '02',
    title: 'Star projects',
    desc: 'Four replicable community projects in agriculture, matchmaking, energy and education — and the project tree behind them.',
    meta: '4 models · 5 common patterns',
    link: '/en/community/guide/#projects',
  },
  {
    no: '03',
    title: 'Capital for good',
    desc: 'Not charity: purpose lock, repayable capital, contribution pricing, shared risk and public verification.',
    meta: '6 mechanisms · 1 scorecard',
    link: '/en/community/guide/#capital-for-good',
  },
  {
    no: '04',
    title: 'Wealth to public good',
    desc: 'Venture success, the equity gift, the points system, and the transition from stake-weighted returns to equal voice.',
    meta: 'Stage transition · governance',
    link: '/en/community/guide/#public-good',
  },
  {
    no: '05',
    title: 'Rebuilding value',
    desc: 'After capital circulation and mass automation, imagination and intellectual property become the next engine of value.',
    meta: '4 layers · 3 short-term foundations',
    link: '/en/community/guide/#value-reset',
  },
]

const flow = [
  { no: '01', title: 'People & projects', text: 'local jobs, community projects, real output' },
  { no: '02', title: 'Capital enters', text: 'USDT deposits into the equity pool' },
  { no: '03', title: 'Value returns', text: '1/3 to equity, 2/3 by stake weight' },
  { no: '04', title: 'Venture success', text: 'equity pool returned, guarantees cleared' },
  { no: '05', title: 'Public good', text: 'one KYC account, one vote; equal-share direction' },
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
          <div class="lp-kicker lp-kicker--warm"><span />HUMAN COMMUNITY · GCC</div>
          <h1 class="lp-title">
            Bring capital<br>
            <span class="lp-title--warm">back to people.</span>
          </h1>
          <p class="lp-lead">
            The GCC human community protocol asks a harder question than “how do we raise money?”:
            when capital, labour and governance sit on one ledger, can wealth continue to flow toward
            people and public life after it has been created?
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--warm" href="/en/community/guide/#whitepaper">
              Read the protocol <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/en/community/guide/#projects">
              See the projects <span>→</span>
            </a>
          </div>
          <div class="lp-stats en-community-stats">
            <div class="lp-stat"><strong>200<span>M</span></strong><span>fixed GCC supply</span></div>
            <div class="lp-stat"><strong>1/3</strong><span>profit to equity pool</span></div>
            <div class="lp-stat"><strong>2/3</strong><span>stake-weighted dividends</span></div>
            <div class="lp-stat"><strong>1:1</strong><span>public-good phase: one KYC, one vote</span></div>
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
            <h2>Read the rules first.<br><em>Then see how people bring them to life.</em></h2>
          </div>
          <p>
            The whitepaper provides the institutional skeleton. Star projects make it tangible.
            The final chapters answer how capital serves people, how wealth becomes public, and how value itself is rebuilt.
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
              <span>200M fixed supply</span>
              <span>1/3 equity pool</span>
              <span>2/3 stake dividends</span>
              <span>7-day special vote</span>
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
          <h2>A complete loop from labour<br><em>to public goods</em></h2>
          <p>
            This is not “make money first, donate later”. Return, governance and public benefit are written into the rules from day one.
          </p>
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
          <span>NOTE</span>
          <p>
            This site is for mechanism research and product explanation. It is not investment advice,
            a securities offering or a promise of return. GCC rules are governed by the on-chain contracts
            and the full whitepaper; confirm local laws and your own risk capacity before participating.
          </p>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--quote">
      <div class="lp-shell lp-quote lp-quote--warm">
        <span class="lp-quote__mark">“</span>
        <p>
          Public good is not what remains after wealth is made. It is
          <strong>a destination written into governance before the money arrives</strong>.
        </p>
        <div class="lp-quote__by">
          <span>GCC human community protocol</span>
          <span>Transparent rules · verifiable returns · local opportunity</span>
        </div>
      </div>
    </section>

    <section class="lp-cta lp-cta--warm">
      <div class="lp-shell lp-cta__inner">
        <div>
          <div class="lp-kicker lp-kicker--warm"><span />READ THE RULES</div>
          <h2>Before trusting a story,<br>read its rules.</h2>
        </div>
        <div class="lp-cta__actions">
          <a class="lp-btn lp-btn--warm" href="/en/community/guide/#whitepaper">Open the guide <span>↗</span></a>
          <a class="lp-btn lp-btn--ghost" href="/en/community/guide/#value-reset">See value reset <span>→</span></a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.en-community-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.en-community-stats .lp-stat {
  min-width: 0;
  padding-right: 12px;
}

@media (max-width: 900px) {
  .en-community-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .en-community-stats .lp-stat:nth-child(n + 3) {
    margin-top: 10px;
    padding-top: 14px;
    border-top: 1px solid rgba(125, 175, 205, 0.12);
  }
}

@media (max-width: 560px) {
  .en-community-stats .lp-stat {
    padding: 14px 10px 0 0;
    border-left: 0;
  }

  .en-community-stats .lp-stat:nth-child(even) {
    padding-left: 14px;
    border-left: 1px solid rgba(125, 175, 205, 0.12);
  }

  .en-community-stats .lp-stat:nth-child(n + 3) {
    border-top: 1px solid rgba(125, 175, 205, 0.12);
  }
}
</style>
