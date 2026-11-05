---
title: Time River Consensus (TRC)
description: "TRC-V1: a consensus design that uses quantum decoherence as a metaphor for time irreversibility, with time guardians and Planck time nodes."
---

<div class="doc-eyebrow">TIME RIVER CONSENSUS · TRC-V1</div>

<p class="doc-lead">
  Time River Consensus (TRC) tries to put the irreversibility of time into the consensus mechanism itself.
  It uses quantum decoherence as a metaphor for the one-way nature of time, makes time guardians the
  participants in consensus, and treats the Planck time node as the hub for time advancement and
  historical confirmation.
</p>

::: warning Status
This is an **English overview** of the TRC-V1 design paper. The full paper is currently in Chinese.
TRC-V1 is a design draft, not a released protocol; parameter balance, practical validation and a complete
security analysis are still in progress.
:::

## Abstract

TRC starts from two ideas: history should be extremely expensive to rewrite, and causality should not be violated.
It borrows the concept of time from physics — not a claim about the physical mechanism of time — and uses
quantum decoherence to model irreversibility.

The design aims to address three weaknesses of existing consensus algorithms:

- history can be rewritten at a cost that is too low;
- fork handling is complex and inefficient;
- accounting lacks a clear causal relationship, which creates duplicate or invalid records.

The intended result is a history chain that is **derivable, tamper-resistant and causally closed**.

## Core roles

### Ordinary node

An ordinary node originates transactions and submits bills. It does not participate in consensus, voting or
leader election. A bill must pass validation by the Planck time node; invalid, overspent or duplicate bills
are discarded before they can enter the history chain.

### Time guardian node

Time guardians are the only participants in consensus. Their responsibilities are to:

- validate the legality of historical blocks;
- submit participation declarations to the current Planck time node;
- participate in electing and verifying the Planck time node;
- report provable cheating and receive the cheating node’s stake as a reward.

Admission requires a stake. A guardian that accepts a bill but fails to include it in the corresponding block
loses its entire stake.

### Planck time node

The Planck time node is the hub for receiving participation proofs and confirming history. It does not
perform the complex duties of a traditional leader. It only needs to:

- receive the participation confirmations of all time guardians;
- receive valid bills from ordinary nodes;
- trigger the decoherence event when a valid transaction arrives, confirming the irreversibility of the round
  and producing a historical block.

Election is derived from the previous round: the node confirmed by the largest number of active time guardians
wins. Ties are resolved by the previous round’s node sequence, then by an ascending hash of the node address,
so the result can be derived without disagreement.

## Core mechanisms

### Transaction-driven time

TRC does not use wall-clock time. Planck time advances only when a valid transaction arrives.

1. A valid bill triggers the decoherence event.
2. The event confirms the round’s transaction and consensus data as irreversible.
3. The block hash is derived from the previous block hash, the hash list of guardian confirmations, and the
   hash list of valid bills.
4. Any node can independently verify the election, confirmations and bills from the history chain.

### No merging

TRC removes the traditional “merge” step. Every valid bill is either included in a block or rejected before
consensus. This is intended to make real-time settlement possible without a separate merging cycle.

### Fork handling

When more than one branch appears, the longest branch is the valid history chain. A fork attack requires
constructing real transactions, burning energy and controlling more than 51% of “darkened” time guardians,
which makes the attack economically expensive.

### Time repair

If a Planck time node cheats, its stake is confiscated, the current block is invalidated and the round is
revalidated. If more than 50% of time guardians confirm that the node is unavailable, transactions pause
until a new Planck time node is elected and takes over.

## Comparison

### Against PoW

- No massive hash-power competition; consensus is transaction-driven.
- History is protected by the time-irreversibility model plus chained hashes, not by raw hash power.
- Election is based on historical participation and a shared random number, not hash monopoly.

### Against PoS

- Participation is not weighted by the amount of stake; it is tied to historical participation, reducing the
  “rich get richer” effect.
- Cheating is punished by losing the stake and invalidating the round.
- A failed Planck time node can be replaced through guardian voting.

### Against PBFT

- No fixed validator set; roles are elected by the protocol.
- Forks are resolved by the longest valid branch rather than a complex view-change process.
- The causal history chain is independently verifiable by all nodes.

## Open questions

TRC-V1 is not a release candidate. The paper still needs:

- precise parameters for the shared random number and energy-burning rules;
- a formal cheating-cost model;
- practical validation under network partition, adversarial behaviour and large-scale operation;
- a complete security and liveness proof.

The target for a future TRC-release is a protocol with three “100%” properties: 100% decentralization,
100% real-time reliable transactions without double-spend, and 100% tamper-resistance.

<div class="doc-note">
  <p>
    The full Chinese design paper is available at <a href="/philosophy/trc/">/philosophy/trc/</a>.
    This English page is an overview, not a line-by-line translation.
  </p>
</div>
