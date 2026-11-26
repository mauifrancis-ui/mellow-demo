# Mellow · positioning hypothesis (Step 0, 2026-11-26)

**Prepared by:** Research and the Product Lead, reviewed by the team and the board (see DESIGN_BOARD.md, "Positioning hypothesis · Step 0").
**Status:** a hypothesis to test in the V1 interviews, not a claim. Nothing here goes into product copy or outreach until interviews support it.
**Confidence:** desk research only. Vendor pages describe what they sell, not what operators actually use.

## The question

The founder asked: what makes Mellow desirable above other offerings?

## What is *not* different (checked 2026-11-26)

The first draft of this hypothesis said building the investigation record is "still mostly manual". That was too strong.

- **Metrc already requires a reason and a note.** Every package adjustment needs a reason code, and a note explaining it is also required (Metrc, "Tips for common corrections").
- **POS systems already detect and correct.**
  - Cova has a Metrc reconciliation report with a "Difference" column, and names the case where a manifest is received in Metrc but not yet in the POS.
  - Flowhub has a Metrc discrepancy report ("Active package in METRC, not in FH", "Quantity Discrepancy").
  - Treez has a "Metrc True Up" with a reason and note per row.
  - Meadow syncs reconciliations, with the reason and note, to Metrc.
  - BLAZE advertises audit logging and discrepancy detection.
- **So detection, the correction itself, and the note are all covered.** Mellow can't win on "we find discrepancies" or "we keep a log".

## What may still be different

### 1 · The evidence behind the note (lead hypothesis)

Regulators ask for more than the note in Metrc:
- **Ohio:** licensees must maintain records that fully outline what occurred.
- **Nevada:** keep all supporting documentation for the reason, readily available for an audit.
- **Maryland:** discrepancies must be investigated and reported to the regional supervisor within 30 days.
- **Missouri:** discrepancies can't be corrected without being documented and investigated by management.

The note is one line. The supporting record is whatever the store kept: what each record said, who looked, what they checked, and when. As far as the desk research shows, POS reports show the difference *now* but don't keep that evidence attached to the decision.

**Hypothesis:** Mellow keeps the evidence behind every correction. That's the three records side by side, who decided, and when. Mellow can also draft the adjustment note from that evidence, for a person to edit and submit. The draft is deterministic: it's filled in from the records, never generated.

### 2 · The receiving moment, across three records (supporting)

POS reports compare the POS with Metrc. That's two systems. At the dock there are three: the manifest, what was counted, and what inventory says. At many stores the receiving count lives on paper or in a spreadsheet. Mellow compares all three before the transfer is accepted, when fixing the problem is cheapest.

### 3 · Works on top of any stack (supporting)

Mellow reads exports and doesn't replace the POS. That matters most for groups with stores on different systems, or a separate inventory tool. Whether that's common is unknown.

### Delivery, not the reason to buy

The A2UI direction, Mellow showing up inside other tools, makes all three easier to adopt. It isn't why someone would pay.

## What would prove it wrong (kill criteria)

Record any of these first, before anything that supports the hypothesis.

1. Inspectors accept the Metrc note alone, and nobody keeps supporting records.
2. Their POS already keeps that evidence with the correction, and they're happy with it.
3. The receiving count is already in the POS at the dock, so there are only two records.
4. Discrepancies are rare (under about one a week per store) or cheap to fix.
5. Most operators run one system end to end and have no plan to change.

**Decision rule.** If 3 or more of the 5 interviews hit kill criterion 1 or 2, drop hypothesis 1 and rethink. If 3 or more hit criterion 3 or 4, receiving isn't the moment. The founder decides either way.

## What it would mean for the product, if supported

These are not proposals yet. Each would go through Step 0 with interview evidence.
- A drafted adjustment note on each decision, edited and submitted by a person.
- The decision record exported per correction, for the inspector or for Missouri's management investigation.
- The demo leads with "here's the record you'd show an inspector", not "here's what we found".

## Sources

- Metrc, "Tips for common corrections in Metrc" (reason code and required note)
- Ohio DCC, Metrc Package Adjustment Guidance; Nevada CCB, Package Adjustment Reasons (Aug 2025); Metrc MD IB 0092 (Nov 2024)
- Cova, Metrc Reconciliation Reports; Flowhub, Metrc Reporting best practices and Discrepancy Report; Treez help, Metrc True Up; Meadow help and blog, reconciliations; BLAZE, compliance guide
- `research/market-analysis.md` (Missouri and Colorado rules; competitor list)
