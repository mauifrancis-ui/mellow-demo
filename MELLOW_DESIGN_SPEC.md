# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.22.0 · 2026-11-24

**High standards, low stress.** Help dispensary staff see what needs attention,
inspect the evidence, and leave the next shift a decision or a clear next
step. Design for both staff working between customers and inventory leads
responsible for resolution. This document describes the current preview.
[Previous versions in Git](https://github.com/mauifrancis-ui/mellow-demo/blob/4ca804a7564410c72f70756f1c20148d8c52b216/MELLOW_DESIGN_SPEC.md)

## The review flow

| Surface | Job |
| --- | --- |
| Today | Open one actionable record in place. Start with an unresolved sample label mismatch when available. Respect explicit record selection. Keep the work queue and unresolved manager reviews next to the record at wide widths and below it on narrow screens. No second Review button for the open record. |
| Activity | Show dated decisions, reviewed sources, and unresolved manager follow-up. Let a reviewer reopen a decision without erasing its history. The copyable handoff gives the package ID, evidence, and next check. |
| Learn | Explain common dispensary terms and link to authoritative references. State when jurisdiction, scope, or effective dates have yet to be verified. |

A review shows the record ID, an instruction, and the available evidence.
Use one source row for a single record and aligned columns when two sources
exist. Name the records and keep provenance beside the observation. Line
drawings support source recognition and remain decorative for assistive
technology. Use the same language across entry points.

- **Record issue** comes first when evidence supports the finding. It becomes
  available for manual evidence after the reviewer enters a source and
  what it shows. Resolving a conflict also requires a reason.
- **Leave for manager** comes first when linked sources disagree. Keep the
  unresolved case visible in Today and Activity.
- **Add evidence** comes first when the source is missing. Keep saved evidence
  behind **Review saved evidence**. Use concrete examples for that record and
  explain the first missing requirement. Keep optional notes, dismissal,
  and secondary evidence actions in **More options**.
- **Next record** skips without recording a decision. After a successful
  save, advance to the next eligible record in queue order and move focus
  to its heading. Keep the saved result inline. A failed decision keeps
  the active record and its draft available.

## Lot numbers, side by side

The comparison helps explain differences across files. It appears below the
review and stays read-only. Match by package ID and reject duplicate IDs.
Equal nonblank lot numbers match. Unequal values differ. Two blank fields
or an absent source row indicate missing details. Distinguish **No lot
number** from **No matching record** in the source table.

1. **Skim.** Show the outcome, which package to check first, and why. Give a
   disagreement priority over missing details. For an all-match comparison,
   show a quiet confirmation. Label sample data and user files distinctly.
2. **Dip.** Select a result group for a short explanation and next check.
   Selecting a group opens it. Selecting it again closes it. Do not restate
   every cell as prose.
3. **Dive.** Reveal exact source values in one accessible table. Align
   Package, Inventory record, and Receiving record to the left. Use one row
   per package, one divider between rows, and a distinct 48px header.

The comparison count describes the source scan. The queue count describes
work awaiting a decision. User files are compared in memory and do not create
review tasks. Preserve the prior comparison if a replacement fails. Keep
file selection secondary. The ten-second skim is a research target.

## Surface and control rules

| Element | Rule |
| --- | --- |
| Canvas | The masthead shares the page background. Page introductions and supporting sections in Activity and Learn use typography and dividers. |
| Cards | Use one shared card surface for the review workspace and the comparison. Use the same 28px radius, one neutral border, and no shadow. The shared content inset scales from 16px to 28px. |
| Inside a card | Use flat rows, simple dividers, and quiet section backgrounds to group related material. Keep the review queue rail, evidence comparison, and source table flat within their parent surface. |
| Rows | Compact queue, activity, and table rows use 12px top and bottom padding. Align text and trailing controls on the vertical center. |
| Actions | Use pill-shaped standalone buttons with a minimum 44px target. Give the task's main action the filled treatment. Use outlined or quiet treatments for secondary actions. Keep padding steady on hover and focus. |
| Evidence fields | Keep a visible label, rounded outline, and one field-specific supporting line. Use 8px between label, field, and hint and 20px between field groups. Inset labels and hints 12px to align with typed text. Associate hints with fields using `aria-describedby`. Use an inset focus outline. |

Use 4px spacing increments for fixed values. Let gutters, text, and the layout
scale with the viewport. Preserve a clear reading order at 320 CSS pixels and
200% zoom and use inline wrapping where content allows.

Use self-hosted Google Sans Variable for body, controls, and labels. Use
Georgia for editorial headings and the wordmark. Forest field guide is the
default palette for new visitors. Keep saved palette preferences. In Forest,
use #1E3B24 for dark ink and primary actions, #5E9C4C for emphasis,
#A9CC7A for selection and the evidence editor accent, and #EFF5E4 for the
canvas. State and focus cues must remain understandable without color.

Use 120ms press and hover feedback, 180ms page arrival, and approximately
200ms for record changes and disclosure. Keep motion tied to user actions and
state changes. Respect reduced motion by removing timed movement and entry
effects. Keep focus and feedback available in either mode.

## Voice and trust

Speak as a knowledgeable coworker. Say what was checked, where the facts came
from, what remains uncertain, and what the person can do next. Use terms seen
in receiving and inventory workflows, with short explanations where needed.
Avoid fabricated evidence, unsupported rules or corrections, and readiness
scores. Distinguish facts, requirements, and recommendations. The sample
records are fictional and the comparison does not edit the source.

The preview keeps drafts and decisions locally in the browser. Manager
handoffs are visible locally and can be copied. Production requires verified
actor identity, accessible evidence linked to the record, and server-side
authorization and evidence validation. One explicit human decision applies to
one record. Preserve drafts and append to the decision history on reopen.
Keep unresolved manager reviews discoverable.

## Assisted review target

Retrieve eligible evidence for the current record when the user opens it.
Display a cited finding in the existing evidence area and show the proposed
action near the human decision. Show actual agent progress only when a job
exists. Represent unavailable or conflicting data clearly, keep manual review
available, and ignore responses for a different record. The readiness of the
server, retrieval sources, and GPT knowledge is tracked in
[Mellow Core](MELLOW_CORE.md) and the [release checklist](RELEASE_CHECKLIST.md).

## Acceptance

- Build, lint, and test the comparison, evidence gate, queue continuation,
  reopening, and handoff.
- On mobile and desktop, check card consistency, 12px compact-row padding,
  centered row actions, and wrapping at 320px and 200% zoom.
- Verify keyboard focus, screen-reader names and announcements, reduced
  motion, and sample versus file comparison disclosures in a browser.
- Ask receiving staff and inventory leads to explain the result and next step
  in ten seconds without coaching. Compare their handling of a de-identified
  discrepancy with their current process before claiming savings.
- Release the production build only after founder review and approval.
