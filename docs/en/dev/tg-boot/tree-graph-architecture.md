---
title: Tree-Graph Architecture
createTime: 2026/03/07 14:08:13
permalink: /en/dev/tg-boot/tree-graph-architecture/
---

# Tree-Graph Architecture

# 1. Overview

## 1.1 Definition

**Tree-Graph Architecture** is a business-first architectural pattern guided by **“the tree sets boundaries; the graph expresses relationships.”** It balances ease of business communication with sound implementation structure:

Domains and capability modules are **decomposed top-down as a tree**, keeping boundaries and layering crisp; **interactions, dependencies, API collaboration, and data flows** are modeled as a **graph**, reflecting the real mesh inside the system. The approach combines the ordering of a tree with the connectedness of a graph—helping both stakeholders grasp layering and engineers integrate modules and iterate safely.

## 1.2 Core value

- **Business**: Tree-shaped decomposition matches mind-map thinking, lowers comprehension cost, clarifies domain/module ownership, and avoids overlapping responsibilities.

- **Technology**: Graph-shaped edges mirror actual dependencies and interactions, guiding API design, integration testing, and system wiring while reducing redundant coupling.

- **Iteration**: The tree eases horizontal growth (new child modules); the graph captures evolving edges between modules, improving extensibility and maintainability.

## 1.3 Where it fits

Use Tree-Graph Architecture when modules are well bounded yet interact heavily and you need **both** business clarity and engineering precision. This article illustrates the pattern with a combined **mall + marketing + payments** example.

# 2. End-to-end example (tree + graph unified)

## 2.1 Panorama (merged tree + graph)

Below is a textual panorama spanning mall core, marketing, and payments—the upper half is the **tree**, the lower half the **graph**, illustrating “tree-graph unity,” the central visualization for this walkthrough:

🌳 Tree-graph panorama (mall + payments + marketing)
```plaintext
                            【System Platform】
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
    Mall Core                Marketing                Payments & Funds      ◀ 【Tree: layering】
        │                          │                          │
  ┌─────┴─────┐            ┌──────┴──────┐            ┌──────┴──────┐
Product Hub   Order Hub  Coupon Hub   Campaign Hub  Payment Hub  Reconciliation
  │             │            │              │            │             │
Listings   Order create  Coupon manage  Flash/Group buy Unified order  Transaction log
Specs      Order detail  Coupon issue   Full reduction Pay channels  Recon checks
On/off     Order state   Coupon redeem  Referral/CRM Refund/void   Balance mgmt
Taxonomy   Order log                    Member points  Async notify
Inventory  Order search                              Callbacks
```
🔗 **Graph**: real module links (API calls)
```plaintext
        Product Hub ────────► Order Hub ◄──────── Campaign Hub
           │                  │   │                    │
           │                  │   │                    │
           │                  │   │                    │
           └──────────────┐  │   └─────────┐          │
                          │  │             │          │
                          ▼  ▼             ▼          ▼
                       Payment Hub ◄────── Reconciliation
```
Tree + graph combined
```plaintext
                              [ System Platform ]
                                    │
      ┌─────────────────────────────┼─────────────────────────────┐
      │                             │                             │
  [Mall Core]                 [Marketing]                 [Payments & Funds]
      │                             │                             │
┌─────┴──────┐              ┌──────┴──────┐              ┌──────┴──────┐
Product     Order         Coupon        Campaign        Payment     Recon
   │          │               │            │              │            │
   │          │               │            │              │            │
   │          │               │            │              │            │
   └──────────┼───────────────┼────────────┼──────────────┘            │
              │               │            │                           │
              └───────────────┼────────────┘                           │
                              │                                        │
                              └────────────────────────────────────────┘
```
- **Top = tree**: mind-map style layers with crisp boundaries.  
- **Bottom = graph**: calls, dependencies, and flows form a mesh.  
- **Together**: boundaries first, relationships second—**tree-graph unity**.

## 2.2 Layering notes

The tree half positions the platform root, three domains, and their modules; the graph half’s edges are the interaction core—**“tree for boundaries, graph for relationships.”**

There are **three** tree layers:

### 2.2.1 Top: system platform

Unified entry and control plane orchestrating the three domains, providing global configuration, permission baselines, logging, and the **root** of the tree.

### 2.2.2 Middle: business domains

Three independent domains with non-overlapping boundaries, interacting only through standard interfaces:

- **Mall core**: catalog and order capabilities—the commercial backbone.  
- **Marketing**: coupons, flash sales, group buying—driving traffic and conversion.  
- **Payments & funds**: payment rails and reconciliation—closing the money loop safely.

### 2.2.3 Bottom: functional modules

Leaf-level units, each with a single focus:

- **Mall core**  
  - **Product hub**: listings, specs, on/off-shelf, taxonomy, inventory.  
  - **Order hub**: creation, details, state, logs, search.

- **Marketing**  
  - **Coupon hub**: issue, redeem, lifecycle.  
  - **Campaign hub**: flash promos, group buying, stackable discounts, referral/CRM, points.

- **Payments & funds**  
  - **Payment hub**: unified order creation, channel integration, refund/void, async notify, callbacks.  
  - **Reconciliation**: ledgers, matching, balance management.

# 3. Graph view (module interactions)

The graph encodes **API calls, dependencies, and data movement**—the live wiring of the system, aligned with the lower half of the ASCII diagrams above.

## 3.1 Core relationships

## 3.2 Association design principles

1. **Product ↔ Order** (as in the diagram): products supply base data (name, spec, price, stock); order creation calls product APIs to validate and **lock** stock.

2. Orders **report state back** to product (e.g. unlock on cancel, deduct on completion).

3. **Marketing ↔ Order**: coupon services expose redemption APIs; payment steps validate coupons and applied amounts so rules land precisely.

4. Campaign services supply rule payloads (e.g. stackable promos, flash prices); order creation auto-computes marketing discounts.

5. Orders **emit completion/cancel events** to marketing, updating coupon usage, participation, and redemption—closing the marketing–commerce loop.

6. **Order ↔ Payment**: after order creation, the order service calls the payment hub’s unified order API to start payment.

7. After pay/refund, payment uses async notification to drive order state transitions.

8. **Payment ↔ Reconciliation**: every transaction line syncs to reconciliation for later matching.

9. Reconciliation **returns match results** to payment for exception handling and balance updates.

# 4. Benefits and adoption tips

## 4.3 Association design principles

- **Loose coupling**: modules talk only through standard APIs, not each other’s internals—easier testing and independent releases.

- **Prefer one-way dependencies**: the main chain (product → order → payment) stays acyclic, improving stability.

- **End-to-end coverage**: every interaction and data path appears in the graph—no hidden couplings for build or integration teams.

## 4.1 Architecture benefits

- **Business/tech alignment**: the tree matches how PMs think; the graph matches how engineers wire services.

- **Clear ownership**: tree cuts reduce feature overlap and ease maintenance.

- **Extensibility**: add tree nodes inside a domain; add graph edges when new collaborations appear without destabilizing the whole.

- **Actionable**: the same model guides mind maps, service cuts, API specs, and integration playbooks.

## 4.2 Adoption playbook

- **Business discovery**: build the mind map / tree of domains and modules, clarifying scope and responsibility.

- **Technical design**: from the tree, draft the graph of dependencies and contracts, then lock API and data contracts.

- **Implementation**: build layer-by-layer per the tree; integrate module-by-module per the graph.

- **Iteration**: grow the tree within the right domain; update the graph and documentation whenever edges change.

# 5. Summary

Tree-Graph Architecture unifies **top-down business decomposition (tree)** with **actual module collaboration (graph)**, reducing both boundary ambiguity and integration chaos.

The mall + marketing + payments case shows a reusable pattern; adjust domains, modules, and edges to match your own context.

## 5.1 Recommended open-source project

1. A 100% open-source project guided by Tree-Graph Architecture:  
[https://gitee.com/pub_module/tg-boot.git](https://gitee.com/pub_module/tg-boot.git)
