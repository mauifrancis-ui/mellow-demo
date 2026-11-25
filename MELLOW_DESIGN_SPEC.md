# Mellow Design Spec

Release 01 · Simplify & Trust · Version 1.34.0 · 2026-11-24

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

## One queue for source exceptions

A comparison supplies evidence to the review queue. It is read-only toward
the source files. Match by package ID and reject duplicate IDs in either
input. Only differences and gaps enter To check. The three sample exceptions
are already represented by their sample tasks. Retry of the same package
values from the same named source pair preserves the existing task and its
decision. Changed evidence and separately imported records retain their
own provenance.

- **Skim.** The queue names the package and its state. The active review opens
  with the next check and why it matters.
- **Dip and dive.** The two available values and source references are visible
  when the record opens. Distinguish No lot number from No matching record.
  Show a single source when only a one-file import is available.
- **Act.** Use the same evidence editor, decision controls, and manager
  handoff for all records. A comparison disagreement requires supporting
  evidence and a resolution note before a finding can be recorded.

Place an outlined Compare files button in the Today header. Open a focused
dialog with both inputs and source values side by side, stacking the inputs
on narrow screens. Compare first and show differences before Add to queue
writes exception tasks locally. Offer Check one file instead inside the
dialog. Leave both original files unchanged. The ten-second skim remains
a research target.

Keep the rail for work records. Show the To check count there once and show
manager follow-up only while it has records. Keep intake and comparison
controls outside the rail.

## Ambient receiving pilot

Today gives one short update from the monitored receiving comparison.
Say what changed or what needs human verification. Reuse the existing
queue item. Show its action only when a different task is active.
“What I checked” lists the scope, count, and time of the latest
successful check. Keep matching records quiet. If a source is delayed,
explain what is unavailable and keep the previous successful scope and
timestamp. Preserve any existing reviews for the next shift.

The preview runs against fictional data when opened. The delay and recovery
controls simulate coverage states. It does not run on a schedule after the
page closes or verify a physical package. The live pilot criteria and
evidence requirements are in [Mellow Core](MELLOW_CORE.md).

## Surface and control rules

| Element | Rule |
| --- | --- |
| Canvas | The masthead shares the page background. Page introductions and supporting sections in Activity and Learn use typography and dividers. |
| Cards | Use one card surface for the review workspace and its rail. Use the same 28px radius, one neutral border, and no shadow. The shared content inset scales from 16px to 28px. |
| Inside a card | Use flat rows, simple dividers, and quiet section backgrounds to group related material. Keep the review queue rail and evidence comparison flat within their parent surface. |
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

## Version 1.26 monitoring presentation

Place the sample monitoring brief above the active task within the shared
review surface. Lead with the message and keep the last successful time
visible beside What I checked. The source map names Inventory and Receiving
and shows their relationship to the comparison. Mark a delayed receiving
source with a broken line and an explicit label. Keep the prior successful
time in view during the delay. Use a brief entry transition on a state
change and on detail disclosure, with equivalent static states in reduced
motion. Stack the map under the brief at narrow widths.

## Version 1.27 monitoring chart and motion system

Replace the source map with a stacked column chart of packages compared per
sample check. Stack matched, difference, and gap from the baseline with 2px
surface gaps, 24px maximum columns, and a 4px rounded cap. Label the latest
total on its cap and keep times on the axis. Show a delayed source as a
dashed slot with an explicit Delayed label and keep earlier checks in view.
Use matched #5E9C4C, difference #E2A63D, and gap #8C5BC4 in every palette.
The set passes lightness, chroma, color-vision separation, and normal-vision
checks against the Forest surface. The amber is below 3:1 against the
surface, so the chart always keeps its legend, tooltip, and table view. The
chart is one tab stop. Arrow, Home, and End keys move between checks and
announce each check. Hover and focus show a tooltip beside the column and
dim the other columns. "What I checked" holds the same data as a table.
Earlier checks are fictional sample data and are labeled as such.

Motion tokens live in `:root`: `--motion-press` 120ms, `--motion-arrive`
180ms, `--motion-change` 200ms, `--motion-travel` 4px, and one easing curve.
Press and hover use press timing, including a 1px press on buttons and
summaries. Pages, feedback, and the dialog backdrop use arrival timing.
Record changes, disclosure bodies, the monitor message, the sliding
navigation pill, queue selection, disclosure chevrons, the To check count,
and a newly completed check use change timing. A new check grows from the
baseline. Checks already present on arrival render still. Every animation
sits inside `prefers-reduced-motion: no-preference`, so reduced motion keeps
the same end states with no timed movement.

## Version 1.28 Evergreen look and Ask Mellow

Founder direction: a look, feel, and UX in the spirit of dutchie.com/business,
where people get what they need in their own words. This section supersedes
the earlier rules on heading type, button shape, and default palette.

**Look.** Evergreen is the default palette for new visitors. Saved palette
preferences are kept. Deep forest #062F22 masthead and primary actions, warm
cream #FBF7EE canvas, white cards with a warm #E6DFCF line, and signal
yellow #FFC02A for the Ask action, the wordmark dot, the latest-check marker,
and the active queue row. Headings use Google Sans at weight 600 with tight
negative tracking. Georgia is retired. Controls use 10px corners and cards
use 16px. Section labels are 12px uppercase kickers with wide tracking.
Borrow the design language only. Never use Dutchie's name, logo, wordmark,
font files, or copy.

**Ask Mellow.** Today opens with a greeting, one input, and six quick action
cards: What needs me, Today's recap, Gaps, Disagreements, Compare files, and
Shift handoff. People type in their own words, such as "anything wrong with
443?", "what's on my plate", or "I got a new manifest". `src/ask.ts` matches
that language against the sample workspace and returns one answer card with
a title, a plain sentence, any listed packages, and next actions. A package
ID wins over a topic. An unknown ID says so and never invents a record.
Answers that concern gaps, differences, or matches focus that series in the
chart. No model is called. The note under the input says answers come from
sample records and live AI is off. Live answers replace the matcher only
after the activation steps in [Mellow Core](MELLOW_CORE.md) are approved.

**Chart.** The head leads with the day's total packages compared and the
flagged count. The legend is a row of toggle buttons that show each result's
day total and focus that series. The columns rise in a 28ms stagger on
arrival, lift 2px on hover, and mark the latest check with a yellow dot and
a bold time.

## Version 1.29 Field Ledger

Founder decision: Field Ledger is Mellow's visual identity. It supersedes the
Evergreen look and the palette menu. The rationale, audit and board read are
in the Mellow Brand Point of View doc.

**Look.** Paper #F7F3EA, ink #1C1B19, graphite #5A5650 for secondary text,
rules #DDD5C4, pencil #BDB4A2 for settled data, and vermilion #C73E22 only for
what needs a person and its action. Newsreader is for headings and, in italic,
for Mellow's own voice. Instrument Sans is for the interface. IBM Plex Mono
is for facts from the record: IDs, lots, files and times. All three are
self-hosted. Use 1px rules, 4px corners and no shadows. The masthead has no
divider and marks the current tab with a 2px ink underline.

**Today.** The left column briefs the person. A kicker gives the time of the
last check, then a greeting with the number of open packages, then Mellow's
message. `brief()` in `src/ask.ts` writes that message from live data: what
to start with and why, what else is open, what waits on a manager, and what
matched. The current record follows, then reply chips that continue the
conversation, then a reply box. The reply box has a toolbar for files,
photos, the camera, bold, italic, lists and package references. Attachments
answer honestly that live AI is off and offer to add the file as evidence.
The right column shows the day's total aligned to the last baseline of its
label, the chart, and a grouped queue: Needs you, With a manager, and Done
today. Disagreements come first. In the chart, differences are solid
vermilion and gaps are outlined vermilion, so the two never rely on hue
alone.

**Motion.** Mellow's message settles in over 200ms. The record reveals over
200ms. Chart columns grow in a 28ms stagger on arrival. Hover and press take
120ms. Send darkens to black and its arrow moves 3px. Queue rows show an ink
rule on hover. Reduced motion removes all timed movement.

## Version 1.30 conversation, Activity and Learn

These come from the design review on the Mellow Brand Concepts canvas, which the
director approved for build.

**Conversation.** Questions and answers appear in their own CONVERSATION
section, with space between it and the record. Each turn sits on the 72px
margin: YOU in graphite and MELLOW in ink. An answer has a serif title, a line
in Mellow's italic voice, and then a ruled list. Each row in the list has a
mark, the package ID, the issue, a mono detail line, and Open. Each answer
offers its own Next chips from `followUps()`, and the briefing chips are hidden
while a conversation is open. The log keeps the last six turns and folds the
older ones behind "Earlier". Clear empties the log.

**Activity.** The page opens with a headline built from the day's decisions and
a note from Mellow. Below that are filter chips with counts, then one ruled
ledger grouped by day. Each row shows the time, a mark, the package, the
decision, the evidence and an action. The evidence expands inline. Reopen and
Open follow the existing decision rules. The right column shows the day in
numbers and the shift handoff, with a copy action.

**Learn.** The headline is "The words behind today's checks." Mellow's note
names the terms that came up in the queue. An underline lookup field filters
both the glossary and the references. The glossary has eight terms with plain
definitions and makes no regulatory claims. A SEEN TODAY tag marks the terms
behind open records. References list their jurisdiction, issuing authority and
a NOT YET VERIFIED status, with the verification caveat as a margin note above
them. The ask-about-a-term chips open Today with that question already
answered.

**Status messages** clear when you change tabs, so a message from Today no
longer shows on Activity or Learn.

## Rule: button dropdowns overlay

A menu opened from a button, such as More options, floats over the content
below it and never pushes content down. It opens 6px below its button, with an
ink border, a 4px radius and the one permitted shadow, for floating layers
only. It closes on an outside click, on Escape (which returns focus to the
button), and after an action is chosen. Inline disclosures that reveal
reading material, such as What I checked or Evidence reviewed, still expand
in place.

## Version 1.31 contextual, collapsible panel

The right side of Today follows the conversation. `panelFor()` in
`src/panel.ts` maps each answer to a view:

- A package question shows that package's trail: status, both source
  records, when it was flagged, and its decisions.
- A question about gaps, differences or matches shows the chart focused on
  that result, plus the packages behind it.
- A question about the day or the receiving source shows the day's checks.
- A handoff question shows the shift handoff, ready to copy.
- A walk-through or a "what's next" question shows the queue.
- A question that points nowhere leaves the panel as it is.

The panel changes only when the person sends a question, taps a chip or
follows a Learn question. It never changes on a timer. Its header always
reads "Showing · …" and offers Back to queue. Clearing the conversation
returns it to the queue.

The panel can be collapsed. On desktop it becomes a 112px strip that keeps
the "need you" count and the time of the last check, and the conversation
column widens to 860px. The choice is remembered. Below 900px the panel is a
bottom sheet over the page. It starts minimized as a "3 need you" bar and
opens to 78% of the viewport height. Views change with a 200ms fade, and
reduced motion removes all timed movement.

## Version 1.32 organic motion and the app shell

**Motion v2** replaces the earlier timing values (`src/motion.css`):

| Token | Value | Used for |
| --- | --- | --- |
| `--ease` | cubic-bezier(.22, 1, .36, 1) | Soft ease-out for most motion |
| `--spring` | a gentle linear() spring with slight overshoot | Presses, chart growth, chevrons, tab underline |
| `--motion-press` | 160ms | Hover and press |
| `--motion-arrive` | 260ms | Page arrival |
| `--motion-change` | 340ms | Reveals and disclosure |
| `--motion-layout` | 420ms | Panel and layout morphs |
| `--motion-travel` | 8px | Reveal distance |
| `--motion-stagger` | 45ms | Rows arriving one after another |

- **Reveals:** content fades up from 8px with a 2px blur clearing, like ink settling. Mellow's voice settles over 480ms.
- **Conversation order:** your words land first, Mellow's reply 90ms later, then its rows one by one, and the Next chips last.
- **Staggered arrivals:** queue rows, decision rows, glossary terms and references arrive in sequence.
- **Chart:** columns grow on the spring.
- **Presses:** buttons press to 98% scale.

The browser's view transitions handle state changes:
- **Panel changes and collapse:** only the side panel morphs. The reading column stays still and only resizes.
- **Tab switches:** both columns cross-fade.

Browsers without view transitions fall back to the inline fades, and reduced motion removes all timed movement.

**App shell.** The app bar is pinned. At 900px and wider the app fills the viewport, and the left and right columns scroll independently, with contained overscroll and thin scrollbars. The panel's "Showing" bar stays pinned at the top of its column. Below 900px the page scrolls normally under the pinned bar, and the panel stays a bottom sheet. Underlined fields show focus by darkening their rule to 3px black, not with a box.

## Version 1.33 Ask Mellow from anywhere

- App bar: "Ask Mellow" outline control at the right end (ink fill while its drawer is open), speech-mark icon, `/` key hint on pointer devices. Below 600px it shortens to "Ask" and sits on the wordmark row.
- Today: the control scrolls the conversation into view and focuses the reply field. No second copy of the conversation.
- Activity and Learn: a paper drawer, 460px wide, 1px ink border, 4px corners, a floating-layer shadow, pinned under the app bar on the right. It scrolls internally and opens with the spring. Below 900px it's a bottom sheet at up to 82% of the viewport height. It closes with Escape, the close button or the control, and focus returns to the control.
- One thread shared by both surfaces (keeps the latest six turns).

## Version 1.34 review and conversation

On Today, give the active review and the conversation distinct surfaces.
Use a warm paper record area with a vermilion edge and a visible Record
review label. Keep case actions with their evidence. Use the existing
ink treatment for conversational actions.

Place the inline conversation below the review in a softly tinted surface
with a speech mark and Ask Mellow heading. Round the suggestions and
outline the composer to make it clear they belong to the conversation.
Retain the single shared thread, sample-data disclosure, and existing
drawer for Activity and Learn.
