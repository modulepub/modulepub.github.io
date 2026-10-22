<script setup lang="ts">
const principles = [
  { index: '01', title: 'Contracts before freedom', text: 'Boundaries live in code. Interfaces become the shared language of teams and AI.' },
  { index: '02', title: 'Ledgers before stories', text: 'Every contribution and every return should be traceable before it is believed.' },
  { index: '03', title: 'People before capital', text: 'Capital is a tool, not the destination. Technology must return to human dignity and public life.' },
]
</script>

<template>
  <div class="lp lp--ai en-home">
    <section class="lp-hero en-home-hero">
      <div class="lp-hero__grid" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--a" aria-hidden="true" />
      <div class="lp-hero__glow lp-hero__glow--b" aria-hidden="true" />

      <div class="lp-shell">
        <div class="lp-hero__copy">
          <div class="lp-kicker"><span />OPEN SOURCE · HUMAN COMMUNITY</div>
          <h1 class="lp-title">
            Build with <span>AI.</span><br>
            Create for <span class="lp-title--warm">people.</span>
          </h1>
          <p class="lp-lead">
            An AI-native engineering framework on one side, a human community protocol on the other.
            We use maintainable code to carry value that can be governed, verified and shared.
          </p>
          <div class="lp-actions">
            <a class="lp-btn lp-btn--primary" href="/en/ai/">
              Explore the AI framework <span>↗</span>
            </a>
            <a class="lp-btn lp-btn--ghost" href="/en/community/">
              Enter the human community <span>↗</span>
            </a>
          </div>
          <div class="lp-stats">
            <div class="lp-stat"><strong>02</strong><span>content pillars</span></div>
            <div class="lp-stat"><strong>16<span>+</span></strong><span>backend modules</span></div>
            <div class="lp-stat"><strong>200<span>M</span></strong><span>fixed GCC supply</span></div>
          </div>
        </div>
      </div>
    </section>

    <div class="lp-rail" aria-hidden="true">
      <div class="lp-rail__track">
        <template v-for="n in 2" :key="n">
          <span v-for="word in ['CONTRACT FIRST', 'MODULAR MONOLITH', 'AI-NATIVE', 'HUMAN COMMUNITY', 'CAPITAL FOR GOOD', 'PUBLIC GOOD', 'REBUILD VALUE']" :key="word + n">
            {{ word }} <i />
          </span>
        </template>
      </div>
    </div>

    <section class="lp-section">
      <div class="lp-shell">
        <header class="lp-section__head">
          <div class="lp-kicker"><span />TWO JOURNEYS · ONE QUESTION</div>
          <h2>How can technology make collaboration efficient,<br><em>and institutions make it last?</em></h2>
          <p>Two paths, one shared belief: code should be maintainable, and value should be accountable to the people who create it.</p>
        </header>

        <div class="lp-card-grid en-home-paths">
          <a class="lp-card en-home-card" href="/en/ai/">
            <span class="lp-card__no">01</span>
            <span class="en-home-card__tag">AI-NATIVE FRAMEWORK</span>
            <h3>High-quality AI programming</h3>
            <p>
              Use TG-boot as a working example: module boundaries, API contracts and architecture tests
              that let AI write code that is not only fast, but correct, reviewable and shippable.
            </p>
            <ul>
              <li>Modular monolith · one process</li>
              <li>API + MQ contracts · split without rewriting</li>
              <li>Architecture tests · acceptance built in</li>
            </ul>
            <div class="lp-card__foot">
              <small>English framework edition</small>
              <span aria-hidden="true">↗</span>
            </div>
          </a>

          <a class="lp-card en-home-card en-home-card--warm" href="/en/community/">
            <span class="lp-card__no">02</span>
            <span class="en-home-card__tag">HUMAN COMMUNITY · GCC</span>
            <h3>A community built around people</h3>
            <p>
              Use the GCC human community protocol as a working example: a whitepaper that defines the rules,
              star projects that test them, and capital that returns to people and public goods.
            </p>
            <ul>
              <li>Whitepaper · rules before scale</li>
              <li>Star projects · replicable models</li>
              <li>Capital for good → shared wealth → public good</li>
            </ul>
            <div class="lp-card__foot">
              <small>English community edition</small>
              <span aria-hidden="true">↗</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="lp-section lp-section--alt">
      <div class="lp-shell">
        <header class="lp-section__head">
          <div class="lp-kicker"><span />THE COMMON BASE</div>
          <h2>Two expressions, one set of beliefs</h2>
        </header>
        <div class="en-home-principles">
          <article v-for="item in principles" :key="item.index">
            <span>{{ item.index }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="lp-section">
      <div class="lp-shell">
        <div class="lp-cta__inner en-home-cta">
          <div>
            <div class="lp-kicker"><span />START HERE</div>
            <h2>Start with the framework.<br>Then read the rules of value.</h2>
            <p class="en-home-cta__text">
              The English edition includes the core framework reference, the multi-end platform overview,
              and a complete guide to the human community protocol.
            </p>
          </div>
          <div class="lp-cta__actions">
            <a class="lp-btn lp-btn--primary" href="/en/ai/">AI framework <span>↗</span></a>
            <a class="lp-btn lp-btn--ghost" href="/en/community/">Human community <span>→</span></a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.en-home-hero {
  min-height: 680px;
  display: flex;
  align-items: center;
}

.en-home-hero .lp-shell {
  width: min(1200px, calc(100% - 48px));
}

.en-home-hero .lp-hero__copy {
  max-width: 820px;
}

.en-home-paths {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.en-home-card {
  min-height: 380px;
}

.en-home-card__tag {
  margin-top: 26px;
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
  color: #72cabb;
}

.en-home-card h3 {
  margin-top: 12px;
  font-size: clamp(24px, 2.6vw, 32px);
}

.en-home-card ul {
  display: grid;
  gap: 8px;
  padding: 0;
  margin: 20px 0 0;
  list-style: none;
}

.en-home-card li {
  position: relative;
  padding-left: 16px;
  font-size: 12px;
  color: #9ab4c2;
}

.en-home-card li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--mc-mint);
}

.en-home-card--warm {
  border-color: rgba(255, 196, 107, 0.18);
  background:
    radial-gradient(circle at 100% 100%, rgba(255, 196, 107, 0.09), transparent 44%),
    linear-gradient(145deg, rgba(19, 23, 25, 0.92), rgba(7, 11, 15, 0.97));
}

.en-home-card--warm li::before {
  background: var(--mc-warm);
}

.en-home-card--warm .en-home-card__tag {
  color: #d4ae72;
}

.en-home-principles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin-top: 34px;
  overflow: hidden;
  border: 1px solid rgba(125, 175, 205, 0.12);
  border-radius: 18px;
  background: rgba(125, 175, 205, 0.1);
}

.en-home-principles article {
  min-height: 200px;
  padding: 26px;
  background: rgba(8, 14, 20, 0.9);
}

.en-home-principles article > span {
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  color: #4f7c87;
}

.en-home-principles h3 {
  margin: 22px 0 0;
  font-size: 18px;
  color: #e5f4fa;
}

.en-home-principles p {
  margin: 10px 0 0;
  font-size: 12.5px;
  line-height: 1.8;
  color: #829baa;
}

.en-home-cta {
  margin-top: 0;
}

.en-home-cta__text {
  max-width: 560px;
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: #8ba4b3;
}

@media (max-width: 900px) {
  .en-home-hero {
    min-height: auto;
  }

  .en-home-paths {
    grid-template-columns: 1fr;
  }

  .en-home-principles {
    grid-template-columns: 1fr;
  }

  .en-home-principles article {
    min-height: auto;
  }
}

@media (max-width: 720px) {
  .en-home-hero .lp-shell {
    width: min(1200px, calc(100% - 32px));
  }

  .en-home-cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
