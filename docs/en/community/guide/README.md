---
title: Human Community Guide
description: "An English guide to GCC: the whitepaper, star projects, capital for good, public good and rebuilding value."
---

<div class="doc-eyebrow">HUMAN COMMUNITY · ENGLISH EDITION</div>

<p class="doc-lead">
  GCC is an attempt to put capital, labour, governance and public benefit on one accountable ledger.
  This guide summarizes the mechanism, the project models and the direction of value after venture success.
  It is a mechanism overview, not investment advice, a securities offering or a promise of return.
</p>

<div class="doc-metrics">
  <div class="doc-metric"><strong>200M</strong><span>fixed GCC supply</span></div>
  <div class="doc-metric"><strong>1/3</strong><span>profit to the equity pool</span></div>
  <div class="doc-metric"><strong>2/3</strong><span>stake-weighted dividends</span></div>
  <div class="doc-metric"><strong>1:1</strong><span>public-good phase: one KYC, one vote</span></div>
</div>

::: warning Read the boundary first
GCC rules are governed by the on-chain contracts and the full Chinese whitepaper. This English edition is a guide, not the legal or technical source of truth. Confirm local laws, contract addresses and your own risk capacity before participating.
:::

## Whitepaper

### What GCC is

GCC (General Consensus Coin) is a TRC20 community token with a fixed supply of **200,000,000**. It is issued into the exchange contract; participants obtain it by paying USDT at the mechanism price. The mechanism price starts at **1 USDT per GCC** and only moves upward. There is no private market and no secondary order book between holders.

“Only moves upward” describes the contract’s pricing function. It is not a promise that a holder can exit at a higher price, and it is not investment advice.

### The five roles

| Role | Responsibility |
| --- | --- |
| Holder | Deposits USDT, stakes GCC, receives dividends, votes |
| Agent company | Operates local community projects and injects net profit |
| Guarantor | Locks a guarantee price and shares the downside |
| Community project | Uses borrowed capital and produces real returns |
| Community | Forms consensus, votes, supervises and decides public goods |

### Capital flow

```text
Holder deposits USDT → GCC leaves inventory → USDT enters equity pool
        ↓
Agent requests an equity loan → eligible stakers vote → capital enters projects
        ↓
Project earns profit (local costs and agreed retention stay off-chain)
        ↓
Net profit enters contract
   ├─ 1/3 back to equity pool
   └─ 2/3 distributed by stake weight
```

### Dividends: quantity × time

```text
weight = staked quantity × seconds overlapping the dividend period × time coefficient

coefficient:
- ordinary stake: 1
- seconds with a guarantee price > 0: 2
```

- Community profit: **1/3** to the equity pool, the rest by stake weight.
- Any donation: **100%** by stake weight.
- If nobody has weight in the period, the amount enters the equity pool.
- Dividends are credited as claimable; the holder claims them.
- Local-currency dividends are paid locally and confirmed by the holder; the contract does not record that confirmation.

### Governance

The current on-chain special votes are bankruptcy, venture success, terminating the agent, and equity borrowing. Eligibility is based on stake, not wallet balance:

- the unlock time is later than the vote deadline;
- the address has at least **1 GCC** staked under that condition;
- one address has one vote, whether it stakes 1 GCC or 1,000,000;
- the product interface additionally requires KYC; the contract itself does not read KYC.

Each vote lasts **7 days**; the same type has a 7-day cooldown after closing.

### Venture success

Conditions:

1. the equity pool reaches **200,000,000 USDT**;
2. a 7-day vote passes with more yes than no;
3. the pool is still full at close;
4. GCC still exists outside the contract.

Execution:

- the entire equity pool is distributed to GCC holders in proportion to holdings;
- holdings are frozen at settlement: wallet GCC, own staked GCC, own sell-order-locked GCC; inventory does not count;
- all guarantors are cleared and their guarantee prices returned;
- holders claim their gift afterward; transferring GCC later does not change it.

This is not an IPO, a share buyback or a guarantee that venture success will happen.

### What it cannot do

- It cannot guarantee returns or liquidity.
- It cannot eliminate smart-contract, key, oracle or governance risk.
- It cannot replace local law, tax, AML or securities compliance.
- It cannot automatically deliver public goods; public good still needs institutions and operations.
- It cannot remove the human factor from agents, guarantors and KYC bodies.

## Projects

“Star” here does not mean the highest valuation. It means the most replicable structure. The prototypes use demonstration data, not real fundraising or performance claims.

| Project | Model | What it demonstrates |
| --- | --- | --- |
| Qinghe Smart Farm | Agriculture / traceability / co-governance | Cold-chain goals, outcome nodes and task-level costs |
| Qingqing Light Public Welfare Matchmaking | Matchmaking / light public welfare | Compliance files, matchmaking pool, transparent revenue share |
| Haifeng New Energy Microgrid | Energy / ESG / settled | Heavy-asset project with batch-level public settlement |
| Consensus Academy | Education / community | Courses, venue, mentors and a low-threshold project tree |

### The project tree

```text
Project (root)
├── Branch / sub-project
│   ├── Goal
│   │   ├── Outcome
│   │   │   └── Task
│   │   └── Outcome
└── ...
```

Every task traces back to an outcome, and every outcome traces back to a project goal. Tasks can be rewarded in tickets or cash; project ledgers aggregate planned and actual cost, income, ticket share and cash flow.

### Five common patterns

1. Goals can be broken into verifiable outcomes and tasks.
2. Tasks have a cost basis and an accountable owner.
3. Financial flows can be checked, not just summarized.
4. Ticket shares can circulate, but technical transferability is not legal permission to issue securities.
5. Public purpose is chosen at project creation: full public welfare, light public welfare, or private.

## Capital for good

Capital for good is not a moral label. It is a set of constraints that make extractive behavior harder.

### Six mechanisms

| Mechanism | What it does |
| --- | --- |
| Purpose lock | The project type is chosen before capital enters: full public welfare, light public welfare, or private |
| Repayable capital | Equity loans must be requested, voted and returned through project profit |
| Contribution pricing | 1/3 of profit strengthens the equity pool; 2/3 is shared by stake × time |
| Shared downside | Guarantors lock USDT; bankruptcy merges guarantee funds into the equity pool |
| Public verification | On-chain state, project trees, public reports and local dividend confirmation |
| Pre-written exit | Venture success returns the equity pool and clears guarantees; public good is the next horizon |

### A capital-for-good scorecard

Score 0–3 on each dimension:

- purpose: is the public goal verifiable?
- capital: is there a repayment and voting path?
- distribution: can quantity × time be checked?
- risk: who absorbs the downside?
- transparency: can an outsider reconcile the ledger?
- exit: what remains for the community after success or failure?

A low score is not a moral verdict. It is a reason to ask better questions before committing capital.

### Four real tensions

- **Return vs public good**: the startup phase recognizes capital’s time value; the public phase shifts toward equal voice and equal shares.
- **Efficiency vs consensus**: only major decisions go to a vote; daily operations stay with the agent, under public reporting.
- **Global rules vs local law**: one protocol does not override local jurisdictions.
- **Transparency vs privacy**: funds and rules should be public; personal KYC data should not be exposed on-chain.

## Public good

### Venture success is a settlement, not the end

Venture success returns the equity pool to holders and clears the guarantors. The agent continues to operate. Its profit is used first for company operations and committed facilities and welfare; surplus can be recorded as points at the gold price, with **1 point anchored to 1 gram of gold**. Points can be transferred.

This is not a guarantee of price or income. It is an operating and accounting mechanism after the venture phase.

### From stake weight to equal voice

| Startup phase | Public-good phase (direction) |
| --- | --- |
| Eligible staked address: one address, one vote | One KYC account, one vote |
| Dividends by stake × time | Whether and how much to distribute is voted |
| Weighted distribution | Direction: equal shares for eligible holders |
| Agent-led operations | Community co-governance + agent execution |
| Equity and guarantee pools | Self-owned capacity and public goods |

“Public-good phase” is a direction, not an automatic switch in the current contract. It requires facts, governance, law and operations.

### What public good could fund

- healthcare access;
- housing and elder care;
- honor and recognition;
- research;
- crisis response;
- expanding productive capacity.

These are possible destinations, not benefits already delivered. The decision belongs to equal-weight governance and must respect local law and operational capacity.

## Value reset

### The old loop

Capital naturally tends toward monopoly, rent and pricing power. When value concentrates in a few nodes, circulation slows, ordinary people lose purchasing power and social creativity declines.

```text
capital concentrates
  → returns come from position, licences and asset inflation
  → ordinary people lose a path upward
  → real demand weakens
  → innovation loses application scenarios
  → capital moves to safer assets instead of long-term creation
```

The problem is not capital itself. It is **capital without a circulation constraint**.

### The near-term task of a human community

Use capital to ignite projects, create real value, redistribute it, and inject new demand, jobs and supply chains into the market economy. Let people who work hard reach stability — income, skills, housing, health, education and a chance to try again. Let capital providers receive real services and reasonable returns, not only asset appreciation. Avoid the polarization that turns one society into two.

### After machines take most labour

If distribution remains tied only to jobs, automation can shrink income, demand and the market in a loop. If the meaning system is not updated, society may drift into passivity. “Lying flat” is often a rational response to blocked mobility and meaningless work, not a moral failure.

The question becomes: when survival is no longer the main driver, **why create, and how are creators rewarded?**

### Creativity as the new capital

As production becomes abundant, the scarce inputs are imagination, problem definition, cross-disciplinary connection, aesthetic judgment, ethical choice and the ability to organize people around a future that does not yet exist.

Rewards can include:

- contribution points that record creation, verification, communication and public service;
- public funding for higher-dimensional goals;
- intellectual-property revenue when a creation is used;
- honor and social recognition;
- access to public research, manufacturing, education and health facilities.

Points are a contribution ledger first, not a financial product to be speculated on.

### Intellectual property as the main battlefield

In a world of abundant production, the expensive things are new medicines, materials, energy systems, governance protocols and works that change how people understand the world. IP becomes the main competition — but the question should not be “who can lock knowledge down hardest?” It should be:

> **Who solves a more important problem, and who can make the answer affordable to more people?**

#### A thought experiment: cracking the longevity gene

Suppose a team truly solves a key mechanism of longevity. In a pure monopoly model, only the rich can afford it and the technology becomes a new class barrier.

Another model:

- a large public production facility allocates part of its return to reward the team;
- every user pays a very small fee, which aggregates into a large reward;
- a public fund buys the foundational licence so everyone can access it;
- the creators receive wealth, honor and further funding;
- the discovery remains open for other researchers to improve.

This is a thought experiment, not a scientific claim. Real biotechnology requires ethics, regulation and decades of validation. But it illustrates the value logic: **the creator is rewarded, the public can access the result, and the public facility has a reason to keep investing.**

### Four layers of value

| Layer | Value | Who pays | Goal |
| --- | --- | --- | --- |
| Survival | food, housing, health, safety | wages, social protection, community floor | stability |
| Market | products, services, jobs, profit | users, firms, markets | circulation |
| Public | education, health, infrastructure, knowledge | tax, public funds, community surplus | a shared floor |
| Exploration | science, art, longevity, space, consciousness | long-term funds, prizes, IP returns, micro-payments | higher horizons |

A society needs all four. Markets generate resources; public institutions provide the floor; exploration raises the ceiling.

### Three short-term foundations

This is not a distant utopia. It is infrastructure that must be built before automation makes the distribution problem worse.

1. **Make capital circulation verifiable** — where money comes from, where it goes, how profit returns, what remains after exit.
2. **Let people reach stability** — a social floor, retraining, a path after failure, real investment in care and public services.
3. **Make IP reward and public access compatible** — public procurement, micro-payments, collective licensing, verification, attribution, anti-monopoly and fair pricing.

### How to measure it

Do not only look at valuation, funding, token holders, patent counts or donations. Look at:

- project survival, real cash flow and jobs;
- long-term participation and contribution records;
- public access to knowledge and affordable licensing;
- the median creative income and social mobility;
- whether capital keeps flowing to creation rather than position;
- whether people have the time, resources and entry points to create.

### Boundaries

Capital is not the enemy; capital without circulation constraints is. IP is not inherently evil; protection that serves monopoly rather than creation is. Micro-payments can create privacy and surveillance problems. AI may bring distributional disruption before it brings leisure. Points and contribution systems can be gamed. Public-good governance can be captured.

Naming these risks does not weaken the direction. It makes the direction executable.

<div class="doc-quote">
  Rebuilding value is not distributing wealth once more.<br>
  It is rewriting what deserves to be rewarded.
  <small>THE SHORT-TERM GOAL FOR THE NEXT MILLENNIUM</small>
</div>
