# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.20.0 · 2026-11-24

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

## Version 1.7 editorial workspace

Use a continuous work surface. Start Today with the shift headline and three
ruled counts. Make the discrepancy the active record heading and keep its
package ID directly above it. Use one shared surface for the source
comparison, with aligned labels and a divider between sources. Keep the
next check and human decision directly below. Use a ruled side rail for
the two queues, with 12px vertical row padding. At narrow widths the sources
stack inside the same surface and the rail moves below the review.

Reserve pills for standalone controls. Use color along an edge or within a
shared area to identify context. Keep source and decision states readable
as words. Avoid nesting raised or rounded surfaces inside the review.
Use typography, alignment, and spacing to establish the hierarchy across all
three preview palettes. Keep motion confined to the incoming record's
identity and source comparison and honor reduced motion.

For live retrieval, show evidence in the same source comparison. Label the
provider, source record, and effective or retrieved time where available.
Keep operational evidence, regulatory sources, and educational information
distinct in both the interface and the retrieval layer. Acquisition and
permission requirements are in [Mellow Core](MELLOW_CORE.md).

## Version 1.8 illustrated review

Forest field guide is the new default palette for first-time visitors.
Use #1E3B24 for ink, navigation, and primary actions, #5E9C4C for rules
and emphasis, #A9CC7A for step markers and selection, and #EFF5E4 for the
canvas and source surface. Place dark ink on the lighter greens instead
of using medium green as a text background. Preserve saved palette choices.

Add an illustrated index to the active review. An original line drawing
of a package, a receiving document, or a decision sheet accompanies each
labeled shortcut. The index remains one flat strip. Each link takes focus
to its source or decision controls. People may skip the index and use the
normal reading and tab order. Numbers indicate reading order. They carry
no implication that a task is complete or that a decision is mandatory.

Use a 200ms, 3px settle for the drawings when a record opens, with 35ms
between entries. Press and selection feedback use existing timing tokens.
All illustrations and state cues remain visible in reduced-motion mode.

## Version 1.9 guided decisions

The app header shares the page canvas. Use a 28–42px title range for the
active issue and more rounded corners on the review frame and editing
controls. Keep the source area on a neutral surface with a thin separator.

Start with a case-specific instruction that identifies what to verify and
what the main action will do. Show the original line drawings next to the
named sources and instruction. For the sample, use Inventory export and
Receiving log as source labels. Present the records before the action row.
When records support the finding, Record issue saves it in Mellow. When they
disagree or a source is missing, favor Leave for manager. A reviewer can
mark a finding that does not apply as Not an issue.

Keep saved manual evidence collapsed until the reviewer opens it. Evidence
that exactly matches the prepared source remains visible in the comparison,
without a duplicate editor. Preserve existing drafts, including partial
drafts. Require review of saved manual evidence before it can support a
decision. Show the save result as small inline feedback below the actions.

Use 180ms page arrival, a 200ms slide for the evidence and instruction
panels, and 120ms button feedback. Give a changed record and save
confirmation their own restrained transitions. Avoid simulated loading
delays. Reduced motion removes all movement and timed entry effects.

## Version 1.10 action order and evidence density

Show one instruction and the available evidence. A file with no supporting
record gets one evidence row. Show a comparison only when both records exist.
Keep provenance in the row and use the instruction to explain the gap or
disagreement. Avoid an additional status badge that repeats the instruction.

The first action reflects the current case. Record issue for supporting
evidence, Add evidence when only an import exists, and Leave for manager
when sources conflict. Saved evidence opens for inspection before it can
support a decision. Keep any available manager action visible as a secondary
choice. Put dismissal, notes, and alternative evidence under More options
when they are secondary to the immediate task. Next record remains a
navigation action. Keep controls at least 44px high with the same padding
at rest, hover, and focus. Hover changes the fill without moving the label.

## Version 1.11 evidence entry guidance

Show brief, case-specific source examples only when the reviewer opens Add
evidence. Name the record being reviewed. Ask where the reviewer found the
evidence and what it shows. Describe how to identify the source and what to
copy in persistent, accessible field hints. When sources conflict, also
ask which record the reviewer trusts and why. Near the decision, state the
next missing requirement if the draft is incomplete. This preview accepts
a text reference and excerpt.

## Version 1.12 supporting text and body type

Use the Material 3 supporting-text pattern for evidence fields. Keep each
label visible and place one short hint 4px below the control, inset to
align with the input text. Set supporting text at 12px with 16px line
height and associate it with its field using `aria-describedby`. Keep
field names independent of their hints. Retain Mellow's rounded outlines.
[Material Web text field guidance](https://material-web.dev/components/text-field/#supporting-text)

Use self-hosted Nunito Variable for body text, labels, and controls.
Keep Georgia for editorial headings and the wordmark.

## Version 1.13 evidence editor rhythm

Use 24px before the editor, 12px between its heading and introduction, 20px
between field groups, and 8px from label to field and field to supporting text.
Inset both labels and hints 12px to align with typed content. Use a single
inset focus outline so its geometry stays within the field and clear of the
hint. In Forest field guide, use the third swatch, #A9CC7A, as the editor
heading rule. Keep the dark palette role for text and focus contrast.

## Version 1.14 receiving check

Compare an inventory export and a receiving export by exact package ID.
Classify nonblank equal lot numbers as Match, unequal lot numbers as
Different, and absent source rows or two blank lot numbers as Missing
information. Reject duplicate IDs. Compare records read-only and keep
source data distinct from decisions.

Today shows a segmented count visualization with an adjacent text key.
The simulated example uses eight fictional packages and links directly
to the reviewable label mismatch. Routine matches stay out of the work
queue. The exception list can be expanded to see actual source values.
An optional browser-local comparison accepts two de-identified CSV files
with package_id and lot_number columns. It does not persist results or
create tasks. Metrc and POS remain separate live retrieval integrations.

The supplied strain catalog is a potential Learn source after provenance,
rights, and content checks. Product names and strain descriptions do not
identify a store package or establish its lot number.

## Version 1.15 shift briefing

Lead Today with one evidence-based action. Prioritize a disagreement over
a gap. Name the affected package, what each source did or did not show,
and the next check. Link the sample action to the active review and the
file comparison action to the relevant source values. After the evidence
queue clears, surface outstanding manager handoffs or a quiet completion.
Label sample and file comparison insights distinctly.

Render Package, Inventory, and Receiving in consistent left-aligned columns
with shared row alignment. Pair each exception with the reason for the
next step. Distinguish a blank field from a missing row. A finding never
infers which source is correct or makes changes to either source.

## Version 1.16 receiving check secondary actions

Place See differences and gaps and Compare your own exports side by side
as outlined secondary buttons. Wrap them on narrow screens. Both controls
report their expanded state and display their content below the action row.

## Version 1.17 one review path and source table

Today opens the highest-priority unresolved sample review in place, with the
queue beside it at wide widths. After an explicit selection, keep the chosen
record active. The review shows the next check beside its evidence and
decision controls. Keep the receiving summary below the review. For real CSV
comparisons, open the results on completion and show one computed next check
above the table. This comparison remains read-only.

Use a native semantic table styled with Material surface and divider roles.
Give it a distinct 48px header, 12px vertical cell padding, shared left
alignment, and a single divider between rows. Show package and source values
once per row, with Blank distinguished from No record. Avoid repeated prose,
row selection, and action buttons inside this evidence table.
[Material data table guidance](https://m2.material.io/components/data-tables)

## Version 1.18 receiving outcome

In ten seconds the operator should understand how many packages were flagged,
why, and where to see the affected records. Lead with the flagged count and
total. Name differences and missing information in plain text. When all lot
numbers match, show the match result and remove the exception disclosure.
A flagged count describes the comparison result and may include records that
have already been reviewed.

Keep this summary on the page surface beneath the review. The text and source
table answer the current question. Use a proportional chart only when
the proportion itself supports a decision, or a time series when historical
comparison is available and is the question the operator needs to answer.

## Version 1.19 comparison terminology

Use Lot number comparison and name the two sources. Describe differences
and gaps directly. In the table, No lot number means an existing record has
a blank lot field. No matching record means there was no row with that
package ID in the other source. Reserve To check and Needs a manager for
work that still has a decision or handoff state.

Desk research in the Dutchie and Flowhub help centers shows distinct
language for receiving inventory and comparing records for discrepancies.
The Mellow labels are hypotheses. Validate them with receiving staff and
inventory leads by asking what was compared, what the result means, and
what to do next without coaching.
[Dutchie receiving workflow](https://support.dutchie.com/hc/en-us/articles/12882250822035-Metrc-Receive-inventory-from-a-pending-transfer-in-Dutchie-POS) · [Flowhub comparison workflow](https://help.flowhub.com/en/articles/6487308-the-metrc-tab)

## Version 1.20 comparison card and voice

Give the comparison one rounded surface with a short heading, source scope,
and two result filters. The counts themselves open the matching source
rows. Show a clear selected state and keep the table flat inside the card.
If all lot numbers match, say so in one sentence. Keep file selection
secondary to the results.

Use self-hosted Google Sans Variable for body, labels, and controls. Keep
the serif for editorial hierarchy. Use the actual source name and a friendly
sentence such as “We compared eight packages across inventory and receiving
records.” Write with warmth and calm confidence. Explain gaps plainly, give
one useful next action, and avoid slang or reassurance that implies the
issue is resolved. The preview wording still needs confirmation with staff.
