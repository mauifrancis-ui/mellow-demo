# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.6.0 · 2026-11-24

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

## Version 1.2 review layout

Use a warm neutral record surface and charcoal text. Reserve muted teal for
action, focus, and selection. Reduce the heading and record block so decisions
sit nearer to the observation. Align evidence controls using matching field
heights. Keep the optional decision note below the actions.

## Assisted review target

When a record opens, Mellow should retrieve eligible evidence already connected
to the record and prepare a short review with cited observations, an explicit
recommendation, and any gaps. Show the source and supporting passage inline.
Let the reviewer inspect or change the evidence and confirm the decision.
Manual entry is available for missing sources and overrides. Keep the existing
approval gate and clear separation between model advice and a recorded decision.
See the activation prerequisites in [MELLOW_CORE.md](MELLOW_CORE.md).

## Version 1.3 review workspace

Keep the active record, source observation, evidence, and decision in one
review frame. On wide screens, place the work queue and unresolved manager
reviews in a right rail. On narrow screens, provide a queue shortcut in the
record header and keep **Next record** beside the decision controls.

After a successful decision, advance in work-queue order and announce the
saved result in the review frame. Move focus to the new record heading and
scroll it into view only as needed. Keep manager reviews in their own queue
when ordinary work is complete. Next record skips without saving a decision.
A failed save keeps the current record and draft in place.

Use proximity and common region to group the fact with its source and group
the two evidence fields within one editor. Ink navy anchors navigation,
mineral blue identifies contextual observation and the active record, and
amber denotes a pending manager review. Keep surface contrast, pill actions,
and the 12px vertical queue-row spacing. Animate the header and observation
when the record changes (200ms, 4px settle). Keep controls steady and respect
reduced motion.

### Contextual intelligence components

| Component | Placement and behavior |
| --- | --- |
| Source observation | In the record frame, next to the record identity. Shows the observed fact and source. The preview renders local CSV or sample data here. |
| Evidence gap | Beside evidence entry and linked to approval. Names the exact missing input. Retains manual review when assistance is unavailable. |
| Cited finding | Planned for the record frame. Show a source excerpt, stable evidence reference, and retrieval status. Keep the recommendation visibly separate from the finding. |
| Proposed action | Planned for the decision area. Show the suggested action, scope, evidence, and expected effect. The reviewer inspects and confirms; a model response cannot record a decision. |
| Agent activity | Planned within the relevant record and Activity. Show a real state only when a job exists. Include pending, completed, unavailable, or conflicting evidence and an appropriate next step. Keep transient progress quiet and retain meaningful outcomes. |

Response states belong to the record that requested them. A late response for an
earlier record must never replace the active record or its draft. See
[Mellow Core](MELLOW_CORE.md) for server and knowledge requirements.

## Palette studies

Use the preview's Palette selector to compare the same record and queue in
three treatments. The choice persists in that browser.

- **Solar olive** uses a marigold signature, pale lemon observation surface,
  and darker olive controls.
- **Indigo ember** uses deep violet navigation, indigo controls, a coral
  observation edge, and a marigold signature. This is the preview default.
- **Ochre clay** uses cream paper, clay navigation, muted olive observation
  cues, and ochre selection.

Use the brighter colors for accents and grouping. Pending review and errors
retain explicit labels across themes.

## Version 1.5 prepared review

Today is where a reviewer decides what to do with an observation Mellow has
prepared. Start with what the export shows, the linked source if present, what
the comparison means, and the next available action. Confirm a finding when
the evidence supports it, dismiss it when it does not apply, or route an
unresolved case to a manager.

The demo has three explicitly fictional source situations: corroborating
evidence, conflicting evidence, and no linked evidence. Show the two available
sample excerpts inline. Provide a ready-to-confirm path for the corroborated
finding and a manager path for the unresolved ones. Manual entry lives behind
Add evidence. A conflict needs both an alternate source and the reviewer's
reason for resolving it before confirmation. Saving records the decision and
evidence in Activity without making an external data change.

These are deterministic sample comparisons. Uploaded data receives only the
observations the app can establish from that data and can never borrow sample
evidence. The Metrc sandbox probe and model integration do not provide live
evidence to this preview.

## Version 1.6 dispensary shift

Design for a spectrum of familiarity, from staff who check occasional records
between customers to inventory leads and managers responsible for follow-up.
Use the same vocabulary across Today, Activity, and Learn. Define industry
terms at the point of use or in Learn. Preserve package IDs and source names
for staff who already know their workflow.

Today answers what needs attention with live workspace counts: To check,
Needs a manager, and Checked. The source comparison makes the difference
between inventory records and receiving visible without opening separate
files. Staff can confirm an issue, leave it for a manager, or mark it as
not an issue. When their queue clears, link to the work they left behind.

Activity answers what the next shift needs. The handoff includes unresolved
package IDs, the evidence already reviewed, and the next check. Copy is
deliberate and the preview stores work on this device. Learn explains lot or
batch numbers, receiving logs, and handoffs alongside official references.

Evaluate the value with a stockroom or receiving task. Check whether a new
staff member can explain why a record needs attention, and whether the next
reviewer can pick up the case without repeating source discovery. Measure
those results against the team's normal process before claiming savings.
