---
title: Time-River Consensus (TRC)
description: "TRC concept v4: lottery-based rotation, welded history, credit-backed transactions and a recourse waterfall — without majority voting."
---

<div class="doc-eyebrow">TIME-RIVER CONSENSUS · CONCEPT v4</div>

<p class="doc-lead">Lottery for power · welding for history · credit for settlement · recourse for repair</p>

::: warning Status
This is an **English overview** of the TRC implementation draft (concept v4). The full Chinese paper is the
source of truth. TRC v4 is a design draft under review, not a released network or an investment product.
:::

## What it is

TRC is a single-parent hash chain. Each new ring is welded on by exactly one proposer.

The proposer is not chosen by negotiation. The proposer is drawn by lottery from a pre-committed table.
If the proposer misbehaves, the system does not vote the block away. It demands evidence, slashes the stake
and runs a recourse process.

There is no point in the chain that requires a majority to nod. This is the most fundamental difference
from existing consensus designs.

## Why "time river"

The name comes from an argument about time, not from rhetoric.

**The defining property of time is not that it flows, but that it cannot be rewritten.**

We feel time passing because we cannot go back. What makes “yesterday” real is not a clock tick, but the fact
that what was done yesterday cannot be changed today. If history could be freely rewritten, yesterday and today
would be indistinguishable, and time would collapse.

So the first property of time is **irreversibility**, not speed. TRC turns that sentence into structure:

| Property of time | On-chain implementation |
|---|---|
| History is extremely hard to change | Welding: change one ring and every later ring must be re-welded |
| Time only moves forward | The tick only increases; a closed ring cannot be reopened |
| Time appears through events | No closure, no next slot |
| No public time during stillness | No event, no commonly visible tick |

The design deliberately gives up block speed, duration semantics and liveness during silence in order to keep
one bottom line: history cannot be quietly replaced.

## 1. The proposer cannot be elected by vote

If the proposer were elected by vote, nodes would first have to communicate, then count, then announce.
Communication takes time; counting takes time. But time is exactly what the chain is supposed to explain.
It cannot be borrowed first.

So the proposer must satisfy a stronger condition: **everyone can compute the same answer at home, without
saying a word.**

This is not an efficiency argument. It is an ordering argument. There must be a shared result before there
can be time; time cannot be used to create the shared result.

## 2. The lottery table

There is a table written in advance. Everyone who opens page *p* sees the same number.

It has three useful properties:

- **No author.** No one can say “I wrote this table”, so no one can secretly edit a page. Its neutrality does
  not depend on trusting an institution.
- **No communication.** Everyone holds the same table; turning a page requires no message.
- **Unbounded.** However long the chain runs, the table is long enough.

The purpose is not to make the next proposer unpredictable. The purpose is to make it impossible for a group
to close the draw around itself.

The lottery is uniform. A group that owns a fraction of slots still has a fixed probability that the next draw
lands outside the group. Resources can buy probability; they cannot buy certainty.

The guarantee is therefore not “cheating is impossible”. It is:

> **Cheating cannot become a stable state.**

To cheat permanently, a group would have to draw itself forever. As long as one outsider remains in the table,
that cannot be done.

## 3. The page is chosen by transaction volume

If the table turned by round number, nodes could time their entry. They could crowd in just before the page
that would select them.

So the page index must be driven by a quantity already grown into history. Transaction volume is such a
quantity: it can only be accumulated one transaction at a time, inside rings that are already welded. To change
it, one must rewrite history — and history cannot be rewritten.

The hand that turns the page is therefore not in anyone’s hand. It is in history’s own accumulation. A person
can add transactions, but cannot control where the page lands afterward.

Two details matter:

- **Read enough digits.** A single digit has only ten values. Modulo a large validator set, only ten positions
  would ever have a chance. TRC reads a window of digits and folds the resulting large number into the
  validator count.
- **Use only the past.** The page must be derived from transaction volume that is already finalized, not from
  the transactions currently being packed. Otherwise the proposer could choose the next page.

## 4. Welding

The new header contains the previous ring’s hash and the proposer’s signature.

This is welding. Once welded, erasing this ring requires re-welding every later ring.

What makes a person part of history is therefore not consent, but **occlusion**: they stand in front of every
later participant.

There is no substitute. Writing only a height or a sequence number breaks the occlusion relation, and history
becomes something that can be quietly replaced.

## 5. Time is produced only at closure

Only after a ring is welded can the next page turn. The page turn uses this ring’s transaction volume, and that
volume does not exist before the ring is closed.

Before closure, “who is next” has **no physical answer**. It is not that nobody knows; the number does not yet
exist.

Therefore:

> **Every closure is the birth of the next moment.**

This reverses the usual picture. We normally say time flows first, and events happen inside it. Here, an event
closes first, and only then does time acquire its next slot.

Without closure there is no next slot. A quiet period is not “time passing while the ledger stands still”.
It is **no public time**, because nothing has been commonly seen.

## 6. No voting: veto power and accountability are different

Voting does one thing in consensus: it **vetoes**. A majority says “we do not accept this block”, and the block
is discarded.

There is another route: do not veto; assign liability. Whoever cheats is proven, slashed and pursued.

**A veto needs a majority. Accountability needs evidence.**

If the evidence is self-proving — for example, the same slot signs two different blocks at the same height, and
both signatures can be checked by anyone — no one needs to nod. The rule is the judgment, effective immediately.

This is what “compliance wins immediately” means: **compliant is valid; non-compliant does not exist.** There is
no waiting period for a majority to express an opinion.

Removing voting also leaves only one punishable crime. Without witness signatures, the system has only welding
signatures and check-in signatures. Double-signing at the same height is the only unambiguous offence: no room
for interpretation, no way to frame an innocent party.

The smaller the signature surface, the fewer false convictions. Permanent removal is an irreversible punishment,
so this matters.

## 7. Cheating looks like a negative account

This is the most economical step in the design.

If cheating appeared as “two histories both claim to be canonical”, something would have to decide which is
real — and we would be back to voting.

But if cheating appears as **an account balance going negative**, no judge is needed. It is an arithmetic error
that anyone can see locally.

The ledger changes character: it no longer rejects overspending; it **records the overspend and pursues it**.

This is not tolerance. It is a different processing order: **record first, settle later.** Recording is immediate;
settlement comes later, but both are on-chain and provable.

## 8. The guardian becomes an issuing bank

Every transaction names a **guardian** to endorse it. The guardian’s stake is the credit line for that
transaction.

The guarantee is: if the payment cannot be settled, the loss is paid from my stake.

So a guardian’s stake is not abstract reputation; it is **specific solvency**. The stake determines the maximum
amount it can guarantee, no more.

The model has a two-hundred-year-old human prototype: the letter of credit.

| On-chain | Letter of credit |
|---|---|
| Guardian | Issuing bank |
| Stake | Capital |
| Exposure cap | Capital adequacy |
| Slash and compensation | Confirming responsibility |
| Payee acceptance | Beneficiary document check |

The trust source changes — from bank credit to stake plus evidence — but the structure does not.

## 9. Four hard rules

### 1. Full backing is required

A transaction is valid only if the guardian’s unsettled exposure plus this transaction does not exceed its
stake. Otherwise the sender would pick the cheapest guardian and externalize the loss onto an unsuspecting
payee. Soft constraints degrade in an adversarial environment because the cost is pushed outside.

### 2. Exposure is capped

A guardian may endorse many transactions, but its stake must cover **all unsettled** endorsements, not just
one. Otherwise one slash would leave ninety-nine transactions hanging. That is not insurance; it is leverage.

### 3. The payee can accept or reject

The payer chooses the guardian; the payee must be able to reject a payment with insufficient backing.
Otherwise protection works only for the payer, and the payee is left to claim after the money is gone.

### 4. Verification is a guarantee

A guardian’s signature says “I checked”. If the block contains cheating — overspend, double-sign, a state root
that does not replay — and the guardian signed it, that is not negligence. It is **complicity**.

The penalty is the same: full slash. The deficit is paid first; the remainder goes to the prover.

This works because verification is an act: you signed. “I did not check” is not silence; it is a false
signature, and the signature can be compared.

## 10. A clean result

The coverage rule protects victims and limits cheating at the same time. The maximum loss from overspending is
the stake. The amount a cheater can extract does not exceed the amount frozen, so net profit is always negative.

One rule, two jobs. That is usually a sign that the design is right.

## 11. Permanent removal

Failure and fraud are separated:

| | Failure | Fraud |
|---|---|---|
| Cause | Did not appear, did not produce, lost network | Double-sign, overspend, passed an unverified block |
| Money | No loss of funds | Full slash; remainder to prover |
| Status | Probation, removal only on repeat | Immediate permanent removal |

A power outage is not fraud. Removing a guardian permanently for one outage would demand 100% availability,
raise the barrier until only large institutions remain, and make the system more centralized.

Money is money; position is position. A fraudster loses both the stake and the permanent right to be drawn.
The removal needs no execution: the registry marks the slot, and the lottery rule skips it.

## 12. Recourse: the account settles itself

The order is fixed:

1. The overspend is recorded as a deficit.
2. The slashed stake enters the compensation pool, paying the negative account first.
3. The economy rebalances.
4. The remainder rewards the prover.
5. The deficit reaches zero; the event closes.

Only fraud follows this pipeline. Failure creates no deficit, so there is nothing to compensate; it only loses
position. Every compensation is an on-chain event, and therefore a tick.

## 13. Two markets

Two allocation mechanisms coexist:

- **Block rights: lottery.** For fairness, against resource monopoly, against closure.
- **Endorsement rights: bidding.** More stake means more credit; the sender chooses.

One decides who has power; the other decides who dares to guarantee.

**Power is not auctioned; responsibility is.** That separation defines the system’s character.

Guardians earn fees proportional to endorsed volume. How much they can endorse is capped by stake. To earn
more, they must pledge more. Stake is not a threshold; it is **capacity**.

## 14. What it does not do

1. **It does not express duration.** No scheduled transfers, no interest, no T+1 settlement. A quiet period has
   no public time, so “how long” cannot be said.
2. **It does not shard.** Integrity requires all blocks to share one history.
3. **It does not eliminate cheating.** It makes cheating unprofitable and recoverable. That is weaker than
   “impossible”, but it is achievable.
4. **The payment cap is set by total stake, not by the algorithm.** The chain can guarantee only what guardians
   have locked in. This is the nature of the letter-of-credit model, not a defect.

## 15. Failure and boundaries

A drawn proposer failing to appear is normal, not exceptional. A uniform river needs enough volume. The design
uses two mechanisms:

- **Admission** tests real network stability, load capacity, DDoS resistance and long-term availability. This
  raises the cost of creating many identities.
- **Skip-over** handles force majeure. The five active slots closest by identifier hash form the neighbour set;
  any three can sign a declaration that the slot has no service. The target slot must actually be empty on-chain,
  so accusing a proposer who already produced a block is structurally impossible.

The skipped slot’s transactions are marked failed and returned; no property transfer occurs. The skipped node
enters probation. Repeat failure or clear intent leads to permanent admission ban.

If the whole network partitions, both sides see only half the table and may derive different proposers. The
system stops; it does not recover, because without a clock it cannot decide which side is later. Recovery is
external: governance or a hard fork.

## 16. Economics and parameters

Total supply is **2,000,000,000 TRC**, fixed, with 8 decimals and no inflation. There is no block reward. All
income comes from transaction fees: 0.3% of amount, split 60% endorsement / 30% block production / 10% insurance.
Slash remains are not burned; they pay the deficit first and the prover second.

The supply is derived backward from the target single-payment cap: with a 30% staking ratio, 1,000 validators and
a top-holder concentration of 5×, total supply is about 741× the target payment. 2×10^9 supports a single payment
of roughly 2.7 million, or 0.135% of supply.

The whitepaper lists the current parameters: N between 21 and 1,000, K = 8, W = 10, neighbour k = 5, skip threshold
m = 3, minimum stake 10^4, exposure coefficient 0.9, observation period 30 ticks, unbonding 10^4 blocks, block cap
4,096 transactions / 2 MB.

## 17. Safety properties and open questions

The whitepaper states five properties:

- **C1 uniqueness:** at most one valid block per height, independently computable.
- **C2 non-reversion:** a closed block cannot be excluded by a legal extension.
- **C3 communication-free proposer selection:** the proposer is derived from finalized history.
- **C4 local finality:** compliance is valid without a majority vote.
- **C5 bounded, recoverable fraud:** any deficit is cleared in finite steps and cheating has negative expected
  return.

The draft explicitly does not claim a strict probabilistic bound against a proposer who grinds the last K blocks
to bias the next draw. It argues that the cost is symmetric, that independent actors cancel the bias, and that
the economic and evidence layers price and record it. This is engineering sufficiency, not mathematical perfection.

Open issues include whether proposers should also be guardians, residual collusion in skip-over, post-partition
legitimacy, liquidity for the debt instrument in the recourse waterfall, and the cold-start problem: no inflation,
no subsidy and N ≥ 21 conflict when early fee volume is too low.

<div class="doc-note">
  <p>
    The full Chinese paper is available at <a href="/blockchain/trc/">/blockchain/trc/</a>.
    This English page is an overview, not a line-by-line translation.
  </p>
</div>
