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
