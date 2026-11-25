# Mellow Design Advisory Board

These simulated lenses are inspired by published work and practice. The board is an internal review method. The founder decides releases.

| Lens | Review question |
| --- | --- |
| Dieter Rams | Can operators find the next task with less interface and honest status information? |
| Charles and Ray Eames | Does the workflow fit how people gather evidence and pass work between shifts? |
| Massimo Vignelli | Do layout, hierarchy, and the 4px spacing scale behave consistently across surfaces? |
| Susan Kare | Do icons reinforce recognizable, clearly labeled actions? |
| Don Norman | Can people understand the evidence gate, recover a draft, and reopen a decision? |
| Jony Ive | Are alignment, row centering, and interaction details consistent across devices? |
| Julie Zhuo | Does each screen support a clear user outcome and produce reviewable evidence? |
| Luke Wroblewski | Can operators finish the primary workflow on a narrow screen with touch? |
| John Maeda | Does simplification preserve the context needed for a responsible decision? |
| Josh Clark | Are touch, keyboard, zoom, and responsive interaction reliable? |
| Meredith Ringel Morris | Can people understand, challenge, and override AI advice while retaining agency? |

## Continuous improvement

1. At proposal review, document the user problem, constraints, and representative tasks. Apply relevant lenses and record what changed.
2. At implementation review, exercise real flows on mobile and desktop. Review data, permissions, transaction behavior, keyboard and assistive technology, evidence provenance, and recovery.
3. At preview review, close findings or record their impact and ownership. Capture build and test evidence and the founder's release decision.
4. After release, review support issues and outcome measures, prioritize fixes, and record what the next iteration will verify.

For each pass record the version, lens, observed evidence, finding, owner, disposition, and retest result. The current pass was a specification review. Product behavior and visual implementation are pending.

## Version 1.1 visual and interaction review

These are simulated advisory perspectives applied to the release spec and source.

| Lenses | Recommendation adopted |
| --- | --- |
| Dieter Rams and John Maeda | Spend visual emphasis on the record and next action. Put approval requirements beside the decision. |
| Charles and Ray Eames and Jony Ive | Pair warm paper with evergreen and rounded actions. Give the interface a subtle press response and let new content settle quickly. |
| Massimo Vignelli and Susan Kare | Give editorial headings and operational text distinct roles. Use labels, contrast, and a selection marker so state survives without color. |
| Don Norman and Julie Zhuo | Name the missing evidence before the user acts. Keep confirmations inline and make optional notes discoverable. |
| Luke Wroblewski and Josh Clark | Let navigation and actions wrap and the evidence grid reflow. Keep 44px targets and support reduced motion. |
| Meredith Ringel Morris | Make provenance visible beside the observation. Keep human judgment explicit after evidence fields are complete. |

Desktop and narrow-screen browser checks, keyboard flow, and screen-reader
verification remain part of preview review.

## Version 1.3 team review and board pass

Product design and engineering reviewed the reported workflow first. They
identified the queue placement and top-of-page focus jump as separate causes
of the scroll loop. The team recommended a persistent review frame, a nearby
queue, and continuation after successful saves.

The subsequent simulated board pass applied the Rams, Maeda, and Vignelli
lenses to common-region grouping and a restrained ink, mineral blue, and
amber palette. The Eames, Norman, and Zhuo lenses reviewed continuation and
recovery. The Kare, Ive, Wroblewski, and Clark lenses informed recognizable
controls, tactile motion, reduced motion, and access on narrow screens. The
Morris lens required record-scoped provenance, clear evidence gaps, and
explicit human control of future agent proposals.

## Version 1.7 editorial and retrieval pass

- Rams, Maeda, and Vignelli favored one clear work surface, typography for
  hierarchy, and rules for comparison. The repeated rounded panels made
  unrelated items appear equally important.
- The Eameses, Kare, and Ive favored recognizable pill controls with color
  used sparingly where the reviewer needs orientation.
- Norman, Zhuo, and Morris prioritized the path from source to discrepancy
  to next check. The discrepancy becomes the heading and each source stays
  visible beside its counterpart.
- Wroblewski and Clark favored stacking sources within the same comparison at
  narrow widths and keeping the decision close to the record.

## Version 1.17 simulated board pass

Rams and Maeda questioned the need for a second entrance to the task already
on Today. Norman and Zhuo favored opening the actionable record in place.
Vignelli and Kare favored one structured row per package with the source
values aligned under their labels. Morris kept the recommendation separate
from the values and kept decisions in the review. The receiving comparison
is available below it for source verification.

## Version 1.35 proposal review and board pass · Ask Mellow AI brand · 2026-11-25

**Proposal.** The four directions on the canvas page "Ask Mellow · AI brand": A Margin Note, B The Period, C Second Shift, D Proof. They're reviewed against the founder's voice and behavior rules of 2026-11-25. The prototype build that started before this review (a provenance stamp, a proactive row dot, and routing rule questions) was paused and is stashed. It's evidence for this review, not an approved build.

### Team review

| Pass | Finding | Severity | Recommendation |
| --- | --- | --- | --- |
| Compliance and risk | **Live bug.** "Is a blank lot a violation under the regulation?" matches the gaps intent and answers with a list of today's gaps, which reads as a compliance answer. It breaks rule 5. | High · live | Route rule, violation and compliance questions to an honest "I can't tell you whether that's allowed" answer before any record intent. Add a regression test. Founder go-ahead needed to ship it ahead of the bundle. |
| Compliance and risk | "CHECKED" on a stamp can be read as an attestation in an audit. Mellow compares records; it doesn't check them against the law. | High | Use **"Compared"**, and name the files and time. Never put a stamp on interpretive answers. Use "Not from your records" for guidance, not "Not verified", which implies a verification step exists. |
| Compliance and risk | Proactive signals must come only from deterministic triggers: a new difference or gap, a delayed check, a handoff that's due. | Rule | Keep "noticed", "risk" and predictive words out of proactive copy. |
| Product design | B's dot clashes with the queue grammar, where a filled vermilion dot already means "records disagree" and a ring means "gap". A third vermilion dot makes all three ambiguous. | High | Give Mellow's signal a distinct mark (for example the margin-note tick), or redesign the queue marks first. B can't ship as drawn. |
| Product design | D's rotated stamps read as playful and fight the ledger's straight rules. | Medium | Keep stamps square, with a 1px ink rule and mono type. Motion is a short press only. |
| Product design | C's handoff moment fits the shift workflow, but its "we" voice overstates what Mellow does. | Medium | Defer it to its own sprint. Borrow the drafted handoff, not the voice. |
| Content and voice | A matches the shipped voice. "Mellow" only, with plain limits, holds in all four directions. | Info | Keep A's lines as the voice reference. |
| Engineering | Provenance can be computed deterministically from the comparison and run data that answers already use. It's cheap, and testable per intent. | Info | Attach provenance when the answer is created, so the time is the answer's, not the render's. |
| Engineering | "New since you last looked" is stored per device in localStorage. It's fine for the demo, but the real product needs a per-user timestamp from the server. | Medium | Label it as device-local in the spec. Open item for live mode. |
| Accessibility | The prototype dot's hit area is 28px, under the spec's 44px minimum. A dot alone carries meaning by colour and shape. | High | Use a 44px target, an accessible name, and a visible label on hover and focus. The stamp keeps its word, so it doesn't rely on colour. |
| Accessibility | The stamp's source list must open with the keyboard and close with Escape, and overlay rather than push content (the dropdown rule). | Medium | A summary or details disclosure with an overlay popover, retested on phones. |

### Board pass

- **Rams, Maeda:** back A as the base: the least interface that still tells the truth. Stamps only where a fact needs a source, never as ornament.
- **Eames:** back C's handoff for a later sprint. It's the real moment people pass work between shifts.
- **Vignelli, Kare:** reject B as drawn. One shape can't mean three things. Resolve the marker grammar before adding a signal.
- **Norman:** back D with changes. Provenance must look tappable and say "What I compared". The person should be able to see why a signal appeared and dismiss it.
- **Zhuo:** back D. The outcome is decisions a reviewer can audit, and the stamp creates that evidence.
- **Ive:** square stamps, no rotation, one motion (the press).
- **Wroblewski, Clark:** 44px targets. The popover has to fit at 390px.
- **Morris:** strongest support for A + D. People must be able to understand, challenge and override Mellow, and it must state its limits. Proactive signals must be explainable and dismissible.

### Board recommendation for founder decision

1. **Approve A (Margin Note) as Mellow's identity.**
2. **Approve D's provenance, revised:** a square "Compared · files · time" stamp on answers drawn from records, and "Not from your records" on guidance.
3. **Hold B.** Redesign the proactive mark so it doesn't collide with the queue marks, then review it again.
4. **Defer C's handoff** to its own sprint.
5. **Ship the rule-question routing fix** as a hotfix, with the founder's go-ahead.

**Process note.** Versions 1.31 to 1.34 (the contextual panel, the motion and app shell, Ask Mellow from anywhere, and the chat panel) shipped without a team review or board pass. A retro pass is offered.
