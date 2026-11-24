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
