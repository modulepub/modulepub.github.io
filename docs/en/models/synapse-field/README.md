---
title: Synaptic Field AI
description: "A self-developed model mechanism: ontology, synaptic weights, stability thresholds and a different path from Transformer."
---

<div class="doc-eyebrow">SYNAPTIC FIELD · SELF-DEVELOPED MODEL</div>

<p class="doc-lead">
  Synaptic Field AI is a self-developed large-model mechanism. Instead of centering everything on
  next-token probability, it writes structure, synaptic weights and a stability criterion into the field:
  conversation does not record, training records, and only results that cross the stability threshold
  are returned to the asker.
</p>

::: warning Status
This is a mechanism and theory overview, not a benchmark report, performance claim or product promise.
The full Chinese paper is the source of truth for thresholds, comparisons and open conjectures.
:::

## 1. Ontology

Synaptic Field is based on *An Ontology of Uncertainty: Constraint, Manifestation, and the Two Poles of Mind and Matter*. It is a metaphysical construction intended to change how the mind–body question is asked, not a finished empirical conclusion.

The traditional question is: which comes first, matter or consciousness? This ontology asks instead: **how does the undetermined become determinate?** “Being determinately so” is an achievement; uncertainty is the starting point.

It posits a manifestation field Ω — the process in which something appears. Ω is not an entity and does not sit underneath structure. Constraint is the condition of manifestation: to appear as *this* is to exclude *not this*. Degrees of freedom are dimensions not yet excluded. Matter is a stable structure whose constraints have closed and no longer vary with position. Consciousness is the same field of freedom, not yet closed, still changing. The two poles are derived from this becoming-determinate.

Only the manifestation field is fundamental. Matter, consciousness, time and causality are derived within it. Derivation does not mean illusion. Qualia remain in the field, located rather than cancelled.

## 2. What the field simulates

Synaptic Field simulates this becoming-determinate. A token or symbol is the smallest structure and the smallest manifestation. Larger structures are formed by repeated co-occurrence. A synapse models constraint: one structure carries a tendency toward another.

The mechanism has two quantities computed before any sentence is chosen:

- **Leading margin ρ** — how concentrated the pull is, corresponding to the tendency toward closure; it enters the readout criterion.
- **Reading agreement E** — a post-hoc diagnostic for public identifiability, not part of readout. It measures how often two manifestations with sufficient activation overlap select the same structure.

High ρ is the material pole; low ρ is the consciousness pole. The field has no layer whose degree of freedom is exactly 0 or exactly 1.

## 3. Mechanism

### State

- **Structure**: a token/symbol, or a larger whole recorded after repeated co-occurrence.
- **Synapse**: a positive integer weight w(a, b) on an ordered pair, recording how often a and b appeared together. A missing edge means “this pairing has not been built yet”. It is a state, not a missing record.
- **In-field constraint**: within one manifestation, each activated minimal structure holds a constraint λ > 0 toward other structures, coming from co-presence rather than a substrate.

### One propagation

A manifestation first determines the activation set A. For each target t with incoming edges, pull is computed only from edge weights:

```text
π(t) = Σ_{a ∈ A} w(a, t)
```

Let π(1) ≥ π(2) ≥ … . Competition mass C uses the same position in two cases: with a runner-up, C = π(2); with only one target t*, C becomes residual pull:

```text
R = Σ_{a ∈ A} Σ_{b ≠ t*} w(a, b) + λ · |{m ∈ A : m ≠ t*}|
C = max(R, λ)
```

Leading margin has one formula:

```text
ρ = π(1) / (π(1) + C)
```

θ = 2/3 always means π(1) ≥ 2C: the leader is at least twice the competition mass. With C > 0, ρ < 1. No matter how concentrated the weights become, ρ only approaches 1. If there are no edges, ρ is not set and the system takes a high-entropy readout.

“Pulling hardest” means largest π. π is computed from written weights, not inferred backward from the sentence finally spoken.

### Update

No step in the field can decide that a structure is absolutely correct. Error is also a structure. Therefore **recording** and **accepting** are different things; acceptance depends only on whether stability ρ reaches θ.

There are two practices.

**Large model.** Conversation does not record structure. Questions and answers are not written into w, so a dialogue does not pollute an already weighted field. Recording happens only in separate positive training: repeatedly supplied pairings increment w(a, b).

**Experimental model.** Conversation and training are the same act, simulating human memory. Every incoming structure is recorded: a and its successor b co-occur, w(a, b) increments, a missing edge is created with initial value 1; read-out structures are written back too. Edges not touched this time do not change. Being recorded is not the same as being accepted. Structures below θ remain high-entropy and are not returned to the asker.

A larger structure is recorded when the same string of minimal structures reaches a declared co-occurrence count n. Because the experimental model writes conversation into weights, the field can become scattered, so it needs rest. Rest stops new conversational writes; incoming edges of high-entropy targets are normalized or decayed (scaled to the same size or multiplied by a factor below 1). Positively weighted edges stay unchanged and therefore rise relatively.

### Readout

Stability is represented by ρ. The higher ρ is, the more the positively weighted structures processing the input pull toward one target. θ is declared in advance in (1/2, 1).

1. Compute π and ρ before deciding what to return.
2. If a target exists and ρ ≥ θ, return the most stable structure — the target with largest π.
3. If ρ < θ, or nothing pulls it above θ, the field generates high-entropy structures with pull spread across targets. Their answers are not returned.
4. The large model does not write back during conversation. The experimental model writes back all structures in this manifestation, including high-entropy ones; writing back is memory, not acceptance.

## 4. Compared with Transformer

Both process a symbol sequence. The difference starts in the state.

Transformer turns symbols into rows in a vocabulary. Each layer uses linear query/key/value transforms for self-attention; weights are similarities, values are weighted sums, residuals are added, feed-forward transforms each position. Training projects the last position onto the vocabulary and uses softmax plus cross-entropy against the next symbol; gradients change shared weights. The soft connections woven in one forward pass are discarded afterward.

So Transformer has no state meaning “this pairing has not been built yet”. Seen and unseen combinations follow the same path: interference in shared weights yields a distribution, and however sharp it is, a symbol must be returned. Sharpness only means probability is concentrated. Shared weights generalize to unseen combinations; that is why it works. The price is that correction requires changing the shared network, not one identifiable edge.

In Synaptic Field, input is also structure. “Not built yet” means the edge does not exist. Different structures process the input along written edges; the system returns the most stable result whose ρ reaches θ. High-entropy results are not returned. The difference from Transformer is in state and update, not in a measured hallucination rate. This paper does not claim fewer hallucinations.

## 5. Stability and rest

The comparison here is internal to the mechanism: with a stability criterion and rest, versus without either. It is not a comparison with Transformer’s hallucination rate.

Input is a structure. It enters the field and is processed by different structures. Only the most stable one with ρ ≥ θ is returned. High-entropy structures remain in the field but their answers are withheld.

The system does not first decide whether a structure is right or wrong. Error is also a manifestation; the experimental model records it like any other structure. Whether it becomes accepted depends on how it pulls against others and whether stability rises. Positive training makes repeatedly co-occurring structures more stable; it does not filter “incorrect” sentences at the entrance.

Rest exists because the experimental model merges conversation and training. Human memory does the same: what is said and heard leaves traces. Traces keep accumulating on the same field; pull scatters and the field becomes chaotic. Rest stops writing. High-entropy incoming edges are normalized or decayed, while positively weighted edges keep their values and rise relatively. High-entropy structures are still remembered; they are simply not stable enough to return.

The large model avoids this path. Its conversation is forbidden to record, so dialogue does not contaminate trained structure. It does not need rest to take conversation back, because conversation never became weight.

Breaking a already stable structure remains expensive. A person must repeatedly provide negative training before the experimental model records the opposite structure enough times. If no high-stability structure matches afterward, a batch of high-entropy structures is generated. In the following rest, their incoming edges are normalized or decayed, and positive edges rise relatively.

## 6. An analogy to P = NP

Searching for “which structure catches this manifestation” and verifying “is this structure currently the strongest pull” become the same kind of operation once structures are indexed on edges: verification reads A’s outgoing edges; search, if it can only scan all structures, grows with the number of structures; with an index, search degenerates to reading existing edges. The conjecture is that as manifestations increase, the ratio of search cost to verification cost tends toward 1. This is an analogy for the relationship after indexing, not part of the argument in section 5. Whether the ratio reaches 1 is unknown.

## 7. What improved

This version is compared with the previous specification, not with Transformer’s hallucination rate.

- Rest now normalizes or decays high-entropy incoming edges, so positive edges rise relatively; the previous version only stopped writing and ρ did not change.
- The paper explicitly does not compare hallucination rates with Transformer; section 5 is an internal comparison.
- ρ uses one formula; θ = 2/3 always means the leader has at least twice the competition mass C.
- E is defined as a post-hoc diagnostic, not part of readout.

<div class="doc-note">
  <p>
    The full Chinese paper is available at <a href="/models/synapse-field/">/models/synapse-field/</a>.
    This English page is an overview, not a line-by-line translation.
  </p>
</div>
