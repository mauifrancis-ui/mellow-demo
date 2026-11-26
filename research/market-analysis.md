# Mellow · market and need analysis (sprint 6 retro, 2026-11-26)

**Prepared by:** Research and the Product Lead, at the founder's request.
**Why now:** no market analysis had been done in six sprints. The team had fictional archetypes and Texas rule research, but no evidence of who needs this, who pays, or what already exists.
**Confidence:** desk research only. No interviews. Sources are dated; claims from industry-funded or vendor sources are marked.

## 1 · Is the problem real?

**Yes, in tracked cannabis markets.**
- **Violations:** regulators issued nearly 2,500 violations in 2024, with $10.8M in fines, and nearly half were tied to track-and-trace errors. (Distru blog, Oct 2026, citing MJBizDaily. Secondary source from a vendor.)
- **What goes wrong:** inventory discrepancies between physical counts and the state system lead the list. Metrc's own bulletins list the usual transfer errors:
  - the wrong package on a manifest;
  - the wrong quantity;
  - the wrong item or category;
  - packages left off a manifest.
- **Rules require reconciliation:**
  - Colorado requires daily inventory reconciliation (MED Rule 3-805(E)(1)).
  - Missouri says discrepancies can't be corrected without being documented and investigated by management, and late reporting brings violations and fines.
- **Fit with Mellow:** Mellow's core, comparing two records, saying plainly where they disagree, and letting a person decide, matches this pain directly.

## 2 · Is our first segment (Texas hemp retail) a good market?

**Not right now. This is the most important finding.**

| Signal | Evidence | Source |
| --- | --- | --- |
| Size before the crackdown | DSHS estimated about 9,900 small businesses subject to the rules. An industry-commissioned report put 2025 retail revenue at $4.3B. | DSHS proposed rules (Dec 2025); Whitney Economics for the Texas Hemp Business Council (industry-funded) |
| Shrinking now | The delta-8 scheduling took effect July 31, 2026. The retail registration fee is $5,000 per location per year. A lawsuit claims retail sales are down more than 50% and 36,000 jobs lost. | DSHS; Texas Tribune, Aug 2026 (claims in a complaint) |
| Federal risk | A federal ban on hemp-derived THC products is set for November 2026. | MJBizDaily, Jan 2026 |
| Enforcement pull | DSHS hemp cases referred to compliance: 2 (FY24), 5 (FY25), 12 (FY26). That's low inspection pressure compared with tracked cannabis states. | DSHS FY26 trends |
| No state tracking system | Texas hemp has no Metrc-style system to reconcile against. Records are each retailer's own. | DSHS program pages |

**What this means.** The team built inspection prep for a segment that's contracting fast and under federal threat, with little enforcement pull. The Texas rules work isn't wasted: the honesty patterns, the catalog and the binder transfer. But it shouldn't drive the next sprints by default.

## 3 · Medical (TCUP)

There are 15 licenses at most (HB 46), vertically integrated, with the state registry (CURT). The segment is too small to be a market for a standalone product, though it may be a reference customer.

## 4 · Who already does this?

**The space is crowded at the platform level.**
- **Seed-to-sale and ERP:** Flourish, Distru, BioTrack, Cultivera, Canix, Acumatica. Several already manage COAs and sync with Metrc.
- **POS:** Cova, BLAZE, Flowhub, Treez. These sell compliance as a POS feature, and some advertise Metrc reconciliation.
- **Compliance management:** ComplianceQuest, Otter Systems.

**Where Mellow is different:**
- a comparison layer that sits *on top of* the exports teams already have;
- every claim shows its evidence;
- no verdicts, and a person decides.

That's a stance the platforms don't take. **The risk** is that it reads as a feature, not a product. The A2UI catalog points to a credible path: Mellow as an explainable intelligence layer that renders inside other tools, rather than another app to open.

**Update, 2026-11-26 (positioning check).** Detection and correction are covered more fully than §4 implied:
- Metrc requires a reason code and a note on every adjustment.
- Cova, Flowhub, Treez and Meadow all offer discrepancy reports or true-ups that sync the reason and note to Metrc.

What remains open is the supporting evidence that Ohio, Nevada, Maryland and Missouri ask licensees to keep behind a correction. See `research/positioning.md`.

## 5 · Market size

Syndicated estimates for "cannabis compliance/industry software" range from about $1.5B to $3.2B (2025), from firms whose methods aren't public. **The team shouldn't use these for decisions.** A bottom-up estimate, licensed retailers in tracked states × willingness to pay, needs real interviews.

## 6 · Was this done too late?

**Late, but not fatal.**
- **Normally:** problem and market validation come before the first build.
- **What's at risk:** about 1.5 sprints of Texas-specific work (the Rules registry, controls, binder), which is partly reusable.
- **What carries to any segment:**
  - the honesty rules;
  - the data integrity;
  - the design system;
  - the catalog;
  - the evaluation set.
- **The real cost of waiting longer:** sprint 7 ("What if" bills for Texas) would deepen a bet on the riskiest segment.

## 7 · Recommendations for the founder

1. **Validate before more features.** Five conversations with receiving leads or compliance managers in a tracked state (for example Colorado, Michigan, Missouri), testing one question: "When your receiving log and inventory disagree, what do you do today, and what does it cost you?"
2. **Reconsider the segment.** Make "Metrc-state retail receiving" the lead hypothesis. Keep Texas hemp as a watched segment while its legal status settles.
3. **Build the prototype dataset** (proposal in DESIGN_BOARD.md), modeled on how tracked states record packages, manifests and receiving, so the demo shows the real problem.
4. **Hold the "What if" bills work** until the segment decision is made. The founder decides; the session opens 2027-01-12.

## Sources

- DSHS Consumable Hemp Program pages; FY26 Trends report; proposed rules (Texas Register, Dec 26, 2025)
- Texas Tribune (Aug 3, 2026); NPR (Apr 29, 2026); MJBizDaily (Jan 12, Jan 13, Sep 4, 2026)
- Whitney Economics / Texas Hemp Business Council report (Mar 2025; industry-funded)
- Distru, "Out of compliance" (Oct 12, 2026), citing MJBizDaily
- Colorado MED compliance tip (Aug 2, 2023); Missouri DCR guidance (Mar 6, 2023)
- Metrc transfer best-practice bulletins (MN, MI, IL)
- Market Intelo; Dataintelo; The Insight Partners (syndicated estimates, low confidence)
