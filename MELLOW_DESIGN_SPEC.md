# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.1.0 · 2026-11-24

Status: approved requirements captured. Release 01 local demo implemented. Hosted preview and browser verification pending.

| Surface | Behavior |
| --- | --- |
| Today | Lead with one guided task showing the record, why it needs attention, supporting evidence or its absence, and one next action. Display the compact work queue immediately below or beside it. Use a stable ordering based on known workflow state and verified deadlines, with unresolved manager reviews visible until resolved. |
| Activity | Display dated decision events with actor, record, outcome, and evidence references subject to permissions. Show currently unresolved manager reviews even after newer activity arrives. Provide an authorized reopen action and retain the original decision in history. |
| Learn | Preserve the learning entry point. Identify source, scope, and effective date for regulatory material. Show missing or outdated coverage explicitly. |
| Record review | Open a single record from the queue. Preserve drafts across navigation, refresh, and retry. Keep approval unavailable until supporting evidence qualifies. Explain the missing evidence and how to supply it. Show save and decision outcomes clearly. |

## Visual system

Use one 4px spacing scale across the app. Compact rows use exactly 12px top and 12px bottom padding. Center leading content, text groups, and trailing icons on the row's vertical axis, including when text wraps. Reuse row components across queue and activity where their semantics match. Provide adequately sized interactive targets, visible focus, meaningful accessible names, and status cues that include text. Keep logical reading and focus order on desktop and mobile. On narrow screens stack sections, allow text to wrap, and keep all actions reachable without horizontal scrolling.

## Trust and recovery

Remove bulk approval and every record-selection checkbox. Each approval requires a verified human actor and accessible evidence tied to that record, with server validation at write time. Preserve the latest draft if a decision fails. Capture changes to the decision as an event with actor, time, reason, and evidence references. Reopening a manager-owned review makes it visible in the unresolved queue again. Render known facts and actual counts only. Display missing data explicitly and omit readiness scores. Display recommendations and source-grounded requirements distinctly, following [MELLOW_CORE.md](MELLOW_CORE.md).

## Acceptance

Verify the guided task, complete queue, evidence gate, draft recovery, and decision recovery using real application entry points. Verify unresolved manager reviews persist across navigation and reload. Inspect keyboard and screen-reader flows and measure row padding and alignment at desktop and mobile widths. Test at 320 CSS pixels and 200% zoom. Check that failed requests preserve work and that stale or conflicting regulatory data does not become a claim.

## Local demo boundary

The recovered frontend has no verified identity or storage backend. The demo
uses sample records and browser-local drafts and events. CSV intake reports only
observable data gaps and stated transfer statuses. Evidence references and
excerpts support a local demonstration of the approval gate. Production requires
managed evidence, actor permissions, and server enforcement. Manager flags stay
visible in the local workspace. The demo does not deliver notifications.

## Visual direction in version 1.1

**High standards, low stress.** Give the operator a clear next step, show why it
matters, and let them set the pace.

- **Shape.** Use full pills for standalone buttons and navigation. Give text
  fields practical corners and preserve the full-width compact queue rows.
- **Color.** Warm paper and neutral surfaces carry most of the page. Deep
  evergreen establishes the active record, sage marks selection, and stronger
  green identifies the primary action. Pair each state with a label or a
  structural cue. Reserve error color for issues that require attention.
- **Type.** Use editorial serif headings for screen and record identity. Use
  system sans-serif for forms, evidence, and queue data.
- **Anticipate context.** Show the observation and its source and record position
  when a task opens. Identify exactly which evidence is missing before approval.
  Restore per-record drafts and keep existing notes available.
- **Adapt fluidly.** Use a wrapping masthead and action group, clamped gutters
  and headings, and an intrinsic evidence grid. Compact rows keep 12px block
  padding even as their contents wrap.
- **Respect attention.** Give one action primary weight. Keep optional notes
  collapsed until requested or until a note exists on the selected record.
  Keep decision feedback inline and move focus to it after an action.
- **Reveal logic.** Put provenance next to the observation and the approval
  reason next to the controls. Keep written evidence, approval eligibility,
  and the recorded decision distinguishable.

## Motion

- **Press and hover.** Use 120ms ease-out feedback and a 1px press movement on
  enabled standalone buttons. State and focus styles remain visible without motion.
- **Context and disclosure.** Use a 200ms, 4px settle for newly shown record
  context and optional notes. Keep controls and decision text available
  immediately.
- **Confirmation.** Keep results inline and readable until the next operation.
  Avoid automatic dismissal, animation loops, and motion tied to scrolling.
- **Reduced motion.** Disable transitions and movement for reduced-motion
  preferences. Preserve the same content, focus, and feedback.
