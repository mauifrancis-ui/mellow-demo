# Decision Log

## 2026-11-24 · Architecture and Release 01

| ID | Decision | Basis and follow-up |
| --- | --- | --- |
| 001 | Establish Mellow as a shared intelligence layer with a versioned repository core. | Founder direction. Transfer the original GPT materials explicitly and obtain founder approval before treating the core as complete. |
| 002 | Keep decision writes in the application and AI assistance read-only. | Engineering and compliance review identified the need for separate permissions, evidence validation, decision history, and manual operation when AI is unavailable. |
| 003 | Keep one guided task and a compact queue. Preserve visible unresolved manager reviews. | Design and accessibility review led to multiline row centering, named actions, keyboard focus, narrow-screen wrapping, and persistent review visibility. Validate on the recovered application. |
| 004 | Require reviewed source scope and provenance for regulatory claims. | Compliance review led to explicit handling of missing, stale, and conflicting evidence. Validate with jurisdiction-specific evaluation examples before activation. |
| 005 | Prepare the architecture on the local Mellow branch. | The available GitHub branches contain a README only. The supplied myOS project is outside scope. Port this architecture into the full Mellow app when its source is available. |
| 006 | Require founder approval of the working preview before production. | Founder direction. Release approval and Vercel access remain pending. |

Future entries should include date, owner, rationale, affected areas, validation evidence, and any superseding decision.

## Frontend recovered

The pasted React component contains Today, Activity, Learn, and browser-side CSV
intake. It supersedes the frontend source blocker in decision 005. The local
Vite scaffold builds with TypeScript and Tailwind. Original server infrastructure,
project tests, deployment configuration, and GPT materials remain unverified.

## Release 01 demo review

- **Design pass.** Replaced score and bulk controls with the guided record and compact queues. The Vignelli and Ive lenses informed the measured row padding and centered alignment. The Rams, Eames, Kare, and Maeda lenses informed action hierarchy and recognizable labels.
- **Engineering pass.** The Norman and Zhuo lenses informed evidence snapshots, recoverable decisions, and retaining manager status on reopen. Added regression tests for the evidence gate, manager recovery, and CSV parsing.
- **Accessibility pass.** The Wroblewski, Clark, and Morris lenses informed wrapping, named actions, visible focus, and clear control of decisions. Browser reflow, keyboard, and screen-reader verification remain open because the managed preview relay timed out.
- **Compliance pass.** Removed synthetic fixes, unverified thresholds, and readiness figures. Scoped approvals and manager flags to local demonstration. Reviewed AI architecture stays disabled pending explicit knowledge transfer.

## Visual system version 1.1

Adopted a warm paper and evergreen palette, pill actions, an intrinsic layout,
and short motion tied to pressing, opening a note, or switching records.
Moved evidence context and approval eligibility into the visible workflow after
the simulated board review. Publish revisions on the Preview branch for founder
feedback.

## Version 1.2 review feedback

Reduced the height of the review header and moved optional notes beneath the
decision controls. Aligned the evidence fields and limited teal to action and
state cues after feedback about scrolling, field alignment, and the green
palette. Scoped the first assisted review to one verified evidence source and
record type. Live activation still depends on approved GPT materials and
server-side identity and evidence storage.

## Version 1.3 workflow review

Product design and engineering traced the reported scroll loop to the queue
placement and decision focus. The team reviewed continuation, manager state,
and failure behavior before the simulated board pass. The revision puts the
queue beside the record at desktop widths, places continuation in the decision
area, and advances after a successful save. The source observation and evidence
gap establish the in-context surfaces for later cited findings and agent actions.

## Version 1.22 design audit

The previous spec mixed current requirements with superseded iterations of
card shape, palette, navigation, and comparison summaries. Replaced the
append-only guidance with a current specification and linked the prior
version in Git. The review and comparison now share one outer card style.
Their queues and source tables use flat rows and dividers. The app now
derives the comparison disclosure directly from the selected result group
and keeps existing comparison data if a replacement import fails.

Source inspection covers Today, Activity, Learn, and the stylesheet. Build,
lint, and workflow regression results are tracked with the preview revision.
Browser geometry, keyboard and assistive technology, and ten-second
comprehension still require direct verification. Live source and AI
integration, authenticated decisions, and production approval remain open.

The static Today markup audit confirmed two shared card surfaces, review-first
reading order, a visible skim, a collapsed detail section, and no record
selection controls. Build, lint, and 12 regression tests passed. The managed
preview relay timed out on port 4173 during interactive verification.

## Version 1.23 unified review queue

Removed the second comparison workflow. Existing sample exceptions use the
same queue as imported records, and comparisons of two files add only
packages with differences or gaps. The active task shows both source
values on arrival. Keep decisions scoped to one evidence snapshot, so an
identical retry preserves prior decisions and changed evidence can be
reviewed independently. Source files remain read-only. Verified the
single card and visible sample values in rendered markup and ran the
14 automated tests, including retry identity and conflict evidence.

## Version 1.24 compare files dialog

Separated file setup from task navigation. Compare files opens a dialog with
the two sources and a read-only result table. A separate Add to queue action
stages the exceptions. The one-file check is available in the same dialog.
The queue keeps outstanding cases and shows manager follow-up when present.

## Version 1.25 sample ambient posture

Today shows the finding, the scope and time of the last completed sample
check, and a simulated delayed-source state. Delay preserves the earlier
successful-run snapshot, and restoration runs the sample comparison again.
The preview uses existing tasks and retains human verification. No live
monitor, scheduled server job, or regulatory prompt was enabled.

## Repository organization · 2026-11-24

All Release 01 work lives on `mellow-release-01`, which is 28 commits
ahead of `main` with linear history. `main` holds only the April README,
and Vercel production deploys from `main`. Keep `main` unchanged until
the founder approves the preview from this branch, then fast-forward
`main` to release. `Mellow-mobile-prototype` matches `main` and holds no
work. Delete it with founder approval and branch fresh from `main` when
mobile work starts. Replaced the mixed April and Release 01 README with
one current README covering setup, layout and the branch and deploy flow.
Renamed the npm package from `auditready-demo` to `mellow-demo`. The
Vercel project and production URL keep the `auditready-demo` name, since
renaming them would change the live address. Build, lint and 16 tests
passed after the change.

## Version 1.27 monitoring chart and motion system · 2026-11-24

Founder feedback said the source map did not say anything. Replaced it with
a stacked column chart of packages compared per sample check, which shows
volume, outcome mix, and a delayed source at a glance. Monitoring posture now
keeps the last eight runs with their difference and gap counts. The live
sample comparison is the latest run, and seven fictional earlier runs give
the chart a history. Those runs are labeled as sample data in the chart and
in the table. Consolidated the motion rules from the spec into tokens and one
reduced-motion section, replacing scattered hard-coded timings. Added the
sliding navigation pill, smooth disclosure chevrons, queue selection
transitions, a count tick, the monitor message change, and chart growth for
new checks. Verification: lint, type check, build, and 17 tests passed. A
browser render at 1440px and 375px covered the default, hover, keyboard,
delayed, and restored states, with no console errors. Computed styles
confirmed the 120, 180, and 200ms timings. Reduced motion ran no
animations. Founder preview approval is pending before merge to `main`.

## Version 1.28 Evergreen look and Ask Mellow · 2026-11-24

The founder asked for a look and UX in the spirit of dutchie.com/business
and for natural-language input. Adopted Evergreen as the default palette,
with sans headings, 10px controls, a dark masthead, and signal yellow
accents. The design language is borrowed, with no Dutchie brand assets or
copy. Today now starts with Ask Mellow, an input and six quick actions
answered by a deterministic local matcher over the sample workspace. Live AI
stays disabled per decisions 002 and 004, and the interface says so.
Answers can open a record, open the compare dialog, switch to Activity or
Learn, focus a chart series, or simulate and restore a source delay. The
chart gained a day total, a focus legend, an arrival stagger, a hover lift,
and a latest marker. Verification: lint, type check, build, and 22 tests
passed, 5 of them new matcher tests. A browser render at 1440px and 390px
covered the quick actions, a package answer, a gaps answer with chart
focus, and the compare dialog opening from an answer. Reduced motion ran no
animations. Tab order runs from navigation to compare, input, Ask, and the
quick actions. Open item: the matcher covers receiving vocabulary only, and
unmatched phrasing gets an honest fallback. Founder preview approval is
pending before merge to `main`.

## Version 1.29 Field Ledger · 2026-11-24

The founder chose Field Ledger after an audit of 9 competitor sites, a team
consult, and a board read of three concepts. The board backed it for honesty
and for keeping Mellow's advice visibly separate from record evidence.
Retired the Evergreen look, the palette menu, and the Forest, Solar, Indigo
and Ochre palettes. Saved palette preferences no longer apply, which
supersedes the 1.28 rule. Replaced the "What do you need?" opener with a
data-driven briefing after founder feedback that the open question made
people pause. Added a grouped queue and a composer toolbar. Swapped Google
Sans for self-hosted Newsreader, Instrument Sans and IBM Plex Mono.
Verification: lint, type check, build, and 25 tests passed, 3 of them new
briefing tests. A browser run at 1440px and 390px covered the briefing,
reply chips, leaving a record for a manager, Not an issue, bold formatting,
an attachment answer opening the evidence form, and the grouped queue
updating. There were no console errors, and reduced motion ran no
animations. Open item: attachments are not stored or read until live AI and
evidence storage are approved. Founder approved and deployed to production on 2026-11-24 (main at 86efad0).

## Version 1.30 conversation, Activity and Learn · 2026-11-24

The director reviewed the designer's findings and proposals on the canvas
and approved building all three. Activity groups decisions by day. The Learn
glossary is fixed, non-regulatory copy until the approved knowledge materials
arrive. Answer items now carry structured IDs, issues and short details, and
`followUps()` suggests the next questions. Tab changes clear status messages,
which fixes the banner leak. Verification: lint, type check, build, and 26
tests passed, 1 of them new for structured answers and follow-ups. A browser
run at 1440px and 390px covered a two-turn conversation with earlier turns
folded, opening a record from an answer row by click and by keyboard,
leaving a record for a manager, marking one not an issue, the Activity
ledger with evidence expanded, Learn lookup filtering, and a Learn chip
answering on Today. There were no console errors and reduced motion ran no
animations. Founder preview approval is pending.

## Dropdowns overlay content · 2026-11-24

Founder rule: button dropdowns overlap content instead of pushing it.
More options is now a floating menu that closes on an outside click, on
Escape and after an action. Verified in the browser: the content below
moved 0px when it opened, Escape closed it and returned focus, an outside
click closed it, and choosing Not an issue applied the decision. Lint,
build and 26 tests passed.

## Version 1.31 contextual, collapsible panel · 2026-11-24

The founder asked whether the right column needs to show all the time. The
decision: it follows the conversation and it can be collapsed, while the
"need you" count stays visible even when collapsed. The panel changes only
on an explicit action, is always labeled, and has Back to queue one tap
away. That keeps it predictable for people who want a steady queue.
Verification: lint, type check, build, and 29 tests passed, 3 of them new
panel-mapping tests. A browser run covered the package, gaps (with chart
focus), summary and handoff views, a fallback leaving the view unchanged,
Back to queue, collapse to the strip at 112px with the main column at
860px, collapse remembered after a reload, a Learn chip setting the view,
and the phone sheet starting minimized. There were no console errors and
reduced motion ran no animations. Founder preview approval is pending.

## Version 1.32 organic motion and app shell · 2026-11-24

The founder asked for smoother, more organic motion, a sticky app bar, and
left and right columns that scroll independently. Replaced the motion tokens
with soft ease-out, spring and longer layout timings. Added blur-settle
reveals, staggered rows, and view transitions scoped so panel changes never
dim the reading column. Built a fixed app shell for desktop, and kept normal
page scrolling with a pinned bar on phones. Fixed a heavy focus box on the
reply field. Verification: lint, type check, build, and 29 tests passed. A
browser run confirmed the document no longer scrolls on desktop, each column
scrolls without moving the other, the masthead stays at the top, opening a
record scrolls it into view inside its column, the dropdown still shows
inside the scroll area, and phones scroll under the pinned bar. View
transitions ran for panel, collapse and tab changes, with the panel kind
leaving the reading column still. Reduced motion ran no animations.
Founder preview approval is pending.

## Version 1.33 Ask Mellow from anywhere · 2026-11-24

- Decision: add an "Ask Mellow" control to the sticky app bar, with `/` as a keyboard shortcut. On Today it scrolls to the conversation and focuses the reply field. On Activity and Learn it opens a floating drawer (a bottom sheet on phones) that overlays the page instead of pushing it.
- The conversation thread now lives in the app, not the component, so the same turns follow you between Today and the drawer. A vermilion dot on the control means there's a thread waiting.
- Actions in the drawer that need Today's tools (open a record, compare, add evidence) take you to Today with the thread intact.
- Founder approval: approved and deployed to production on 2026-11-24 (main at 86efad0). Verified live: sticky app bar, Ask Mellow control, drawer open and close, focus in the reply field.

## Version 1.34 Task and chat are two places · 2026-11-24

The founder said the task and the chat ran together: reply chips looked like more record actions. Gave the Today conversation its own tinted panel under an ink rule, with an "Ask Mellow" heading until a thread starts, and paper chips inside. CSS only, scoped to Today. Verification: build and lint passed; screenshots checked at 1440px with and without a thread, and at 390px. Founder approved and deployed to production on 2026-11-24.

## Mellow voice and behavior rules · 2026-11-25

The founder reviewed four Ask Mellow brand directions and decided: (1) the product only ever says "Mellow"; it must be honest about its capabilities and explain how it knows what it says; (2) whether Mellow or the person speaks first depends on the situation, proactive vs. reactive; (3) Mellow never promises anything it can't be deterministic about, especially compliance and risk. The team turned (2) into a rule: Mellow goes first only with a deterministic fact needed now, shown as a quiet signal; interpretation waits to be asked. Rules recorded in MELLOW_DESIGN_SPEC.md. No product change yet; the brand direction itself is still open.

## Sprint review cadence made mandatory · 2026-11-25

The founder asked that every change run the full sprint cadence: team review, then board pass, then founder decision, then build, preview and release. Recorded in AGENTS.md. The Ask Mellow brand build that had started was paused and stashed. The 1.35 team review and board pass are recorded in DESIGN_BOARD.md and await the founder's decision.

## Product team charter drafted · 2026-11-25

The founder pointed out that "the team" had no written roles, remits or missions. Drafted PRODUCT_TEAM.md with the team mission, ten roles (the founder, the Design Director, the Product Lead, the Product Designer, the Content and Voice Designer, Research and Insights, the AI UX Designer/Engineer, the Engineer, the Accessibility Specialist, and the Compliance and Risk Lead), the questions each role always asks, a RACI for each cadence step, required outputs, severity levels and working agreements. Added sprint planning (step 0) and a retro (step 7) to the cadence in AGENTS.md. Status: draft, awaiting founder approval. The 1.35 review recorded today predates the charter: it had no Product Lead or Research pass and named findings by pass, not by role.

The founder added an AI UX Designer/Engineer role as key to product outcomes. It owns how Mellow's intelligence behaves in the product: intent routing, answer structure, provenance and explainability, how confidence and limits are shown, proactive triggers, fallbacks, human override, and the evaluation set. Two new working agreements: every Mellow behavior bug becomes a permanent evaluation case before it is fixed, and failing the evaluation set is a blocker.

The founder asked that the Product Designer be a strong systems thinker with deep information architecture skills. The role now owns the product's objects, states and shared patterns, the information architecture (navigation, structure, naming, grouping, wayfinding) and a current map of the product's structure. Every proposal review now includes the designer's note on where the change sits in the system.

## Charter approved; Ask Mellow review rerun · 2026-11-25

The founder approved PRODUCT_TEAM.md (v0.1, with the AI UX Designer/Engineer and the systems and IA Product Designer) by asking for the problem to be rerun under it. The rerun is recorded in DESIGN_BOARD.md (v1.35 rerun) and supersedes the morning's pass. New evidence: a production probe against the proposed evaluation set (MELLOW_EVALS.md) scored 1 pass, 4 partial and 11 fail, including live compliance-bait, command and self-explanation failures. A research pass found that AI-interaction disclosure laws may apply once live AI is on (EU AI Act Article 50, Utah, and Colorado's replacement law from 2027); counsel to confirm. Awaiting founder decision on the board's six recommendations.

## Universal Experiences adopted · 2026-11-25

The founder directed the team to use IBM's Universal Experiences journey (Discover, Learn, Try, Buy, Get started/Onboard, Use, Get help, Expand, End use) to focus on product excellence. Added it to PRODUCT_TEAM.md with each stage's mindset, its meaning for Mellow, a target outcome and a lead role, and made a journey line required in every sprint brief and proposal review. Applied it to the pending Ask Mellow review: the hotfix now also protects Try and the Try-to-Buy handoff, and it replaces dead-end fallbacks (Get help). Flagged that Buy, Expand and End use have no product surface yet. The "under 10 minutes" time-to-value target is a hypothesis borrowed from IBM's own goal, to be measured.

## Version 1.36 honest answers and provenance · 2026-11-25

The founder approved the board's six recommendations and the release. This was built through the full cadence (sprint brief, review by role, board pass, founder decision, implementation review, preview review). Mellow now answers questions about itself, explains how it knows (from the previous answer's basis), refuses decision commands and compliance verdicts, and shows a "Compared · files · check time" stamp on factual answers. The evaluation set (MELLOW_EVALS.md) runs as `tests/evals.test.mjs` and gates release: 51 of 51 tests pass. Open items: the evidence-question over-match (AI UX), user sessions (Research), counsel on AI disclosure before live AI (Compliance), the system map (Product Designer), and the sprint 2 proactive margin note.
Released to production 2026-11-25 (main at 528655d). Verified live: the violation, package, "how do you know", approve, "are you an AI" and off-topic questions all answered as specified, with the Compared stamp on factual answers only.
